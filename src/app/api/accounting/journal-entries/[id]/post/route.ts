import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';
import dbConnect from '@/lib/dbConnect';
import JournalEntry from '@/models/JournalEntry';
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
    if (Math.abs(journalEntry.totalDebit - journalEntry.totalCredit) >= 0.01) {
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
      for (const entry of journalEntry.entries) {
        const account = await ChartOfAccounts.findById(entry.account).session(session_db);
        if (!account) {
          throw new Error(`Account ${entry.account} not found`);
        }

        // Calculate balance change based on account type and normal balance
        let balanceChange = 0;
        
        if (entry.debit > 0) {
          // Debit increases: Assets, Expenses
          // Debit decreases: Liabilities, Equity, Revenue
          if (['assets', 'expenses'].includes(account.accountType)) {
            balanceChange = entry.debit;
          } else {
            balanceChange = -entry.debit;
          }
        } else if (entry.credit > 0) {
          // Credit increases: Liabilities, Equity, Revenue
          // Credit decreases: Assets, Expenses
          if (['liabilities', 'equity', 'revenue'].includes(account.accountType)) {
            balanceChange = entry.credit;
          } else {
            balanceChange = -entry.credit;
          }
        }

        account.balance += balanceChange;
        await account.save({ session: session_db });
      }

      // Update journal entry status
      journalEntry.status = 'posted';
      journalEntry.postedAt = new Date();
      journalEntry.postedBy = session.user.id;
      await journalEntry.save({ session: session_db });

      await session_db.commitTransaction();

      const populatedEntry = await JournalEntry.findById(id)
        .populate('entries.account', 'accountCode accountName')
        .populate('createdBy', 'name')
        .populate('postedBy', 'name');

      return NextResponse.json({
        success: true,
        journalEntry: populatedEntry,
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