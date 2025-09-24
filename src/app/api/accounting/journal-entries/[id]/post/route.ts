import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';
import dbConnect from '@/lib/dbConnect';
import JournalEntry, { IJournalEntryLine } from '@/models/JournalEntry';
import ChartOfAccounts from '@/models/ChartOfAccounts';
import mongoose from 'mongoose';

 export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session || !['admin', 'accountant'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { id } = await params;
    const journalEntry = await JournalEntry.findById(id);

    if (!journalEntry) {
      return NextResponse.json({ error: 'Journal entry not found' }, { status: 404 });
    }

    // Can only post draft entries
    if (journalEntry.status !== 'draft') {
      return NextResponse.json({ 
        error: 'Only draft journal entries can be posted' 
      }, { status: 400 });
    }

    // Validate that debits equal credits
    const totalDebit = parseFloat(journalEntry.totalDebit);
    const totalCredit = parseFloat(journalEntry.totalCredit);
    if (Math.abs(totalDebit - totalCredit) >= 0.01) {
      return NextResponse.json(
        { error: 'Journal entry is not balanced' },
        { status: 400 }
      );
    }

    // Use a transaction to ensure data consistency
    const session_db = await mongoose.startSession();
    session_db.startTransaction();

    try {
      // Update account balances
      for (const line of journalEntry.lines) {
        const account = await ChartOfAccounts.findById(line.accountId).session(session_db);
        if (!account) {
          throw new Error(`Account ${line.accountId} not found`);
        }

        const debitAmount = parseFloat(line.debitAmount);
        const creditAmount = parseFloat(line.creditAmount);

        // Calculate balance change based on account type and normal balance
        let balanceChange = 0;
        
        if (debitAmount > 0) {
          // Debit increases: Assets, Expenses
          // Debit decreases: Liabilities, Equity, Income
          if (['asset', 'expense'].includes(account.type)) {
            balanceChange = debitAmount;
          } else {
            balanceChange = -debitAmount;
          }
        } else if (creditAmount > 0) {
          // Credit increases: Liabilities, Equity, Income
          // Credit decreases: Assets, Expenses
          if (['liability', 'equity', 'income'].includes(account.type)) {
            balanceChange = creditAmount;
          } else {
            balanceChange = -creditAmount;
          }
        }

        const currentBalance = parseFloat(account.balance);
        const newBalance = currentBalance + balanceChange;
        account.balance = newBalance.toString();
        await account.save({ session: session_db });
      }

      // Update journal entry status
      journalEntry.status = 'posted';
      journalEntry.postedAt = new Date();
      journalEntry.postedBy = session.user.id;
      await journalEntry.save({ session: session_db });

      await session_db.commitTransaction();

      const populatedEntry = await JournalEntry.findById(id)
        .populate('createdBy', 'name')
        .populate('postedBy', 'name');

      // Format response for frontend
      const formattedEntry = {
        ...populatedEntry.toObject(),
        description: populatedEntry.narration,
        entryDate: populatedEntry.date,
        entries: populatedEntry.lines.map((line: IJournalEntryLine) => ({
          account: line.accountId,
          accountCode: line.accountCode,
          accountName: line.accountName,
          description: line.description,
          debit: parseFloat(line.debitAmount) || null,
          credit: parseFloat(line.creditAmount) || null
        }))
      };

      return NextResponse.json({
        success: true,
        journalEntry: formattedEntry,
        message: 'Journal entry posted successfully'
      });

    } catch (error) {
      await session_db.abortTransaction();
      throw error;
    } finally {
      session_db.endSession();
    }

  } catch (error) {
    console.error('Error posting journal entry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}