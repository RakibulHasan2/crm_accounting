import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';
import dbConnect from '@/lib/dbConnect';
import JournalEntry, { IJournalEntryLine } from '@/models/JournalEntry';
import ChartOfAccounts from '@/models/ChartOfAccounts';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session || !['admin', 'accountant', 'manager', 'auditor'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { id } = await params;
    const journalEntry = await JournalEntry.findById(id)
      .populate('createdBy', 'name');

    if (!journalEntry) {
      return NextResponse.json({ error: 'Journal entry not found' }, { status: 404 });
    }

    // Map model fields to frontend expected fields
    const formattedEntry = {
      ...journalEntry.toObject(),
      description: journalEntry.narration, // Map narration to description
      entryDate: journalEntry.date, // Map date to entryDate
      entries: journalEntry.lines.map((line: IJournalEntryLine) => ({ // Map lines to entries
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
      journalEntry: formattedEntry
    });

  } catch (error) {
    console.error('Error fetching journal entry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const body = await request.json();
    const { description, entryDate, entries } = body;

    const journalEntry = await JournalEntry.findById(id);
    if (!journalEntry) {
      return NextResponse.json({ error: 'Journal entry not found' }, { status: 404 });
    }

    // Can only edit draft entries
    if (journalEntry.status !== 'draft') {
      return NextResponse.json({ 
        error: 'Only draft journal entries can be edited' 
      }, { status: 400 });
    }

    // Validate entries if provided
    if (entries) {
      if (entries.length < 2) {
        return NextResponse.json(
          { error: 'At least 2 entries are required' },
          { status: 400 }
        );
      }

      // Validate each entry
      for (const entry of entries) {
        if (!entry.account || (!entry.debit && !entry.credit) || (entry.debit && entry.credit)) {
          return NextResponse.json(
            { error: 'Each entry must have an account and either debit or credit (not both)' },
            { status: 400 }
          );
        }

        // Verify account exists
        const account = await ChartOfAccounts.findById(entry.account);
        if (!account) {
          return NextResponse.json(
            { error: 'Invalid account in journal entry' },
            { status: 400 }
          );
        }
      }

      // Calculate totals
      const totalDebit = entries.reduce((sum: number, entry: { debit?: number }) => sum + (entry.debit || 0), 0);
      const totalCredit = entries.reduce((sum: number, entry: { credit?: number }) => sum + (entry.credit || 0), 0);

      // Validate double-entry bookkeeping
      if (Math.abs(totalDebit - totalCredit) >= 0.01) {
        return NextResponse.json(
          { error: 'Debits and credits must be equal' },
          { status: 400 }
        );
      }

      // Transform entries to lines format for the model
      const lines = await Promise.all(entries.map(async (entry: any) => {
        const account = await ChartOfAccounts.findById(entry.account);
        return {
          accountId: entry.account,
          accountCode: account.code,
          accountName: account.name,
          description: entry.description || '',
          debitAmount: (entry.debit || 0).toString(),
          creditAmount: (entry.credit || 0).toString()
        };
      }));

      // Update journal entry with model fields
      journalEntry.lines = lines;
      journalEntry.totalDebit = totalDebit.toString();
      journalEntry.totalCredit = totalCredit.toString();
    }

    if (description) journalEntry.narration = description; // Map description to narration
    if (entryDate) journalEntry.date = new Date(entryDate); // Map entryDate to date
    
    journalEntry.updatedBy = session.user.id;

    await journalEntry.save();

    const populatedEntry = await JournalEntry.findById(id)
      .populate('createdBy', 'name');

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
      message: 'Journal entry updated successfully'
    });

  } catch (error) {
    console.error('Error updating journal entry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Can only delete draft entries
    if (journalEntry.status !== 'draft') {
      return NextResponse.json({ 
        error: 'Only draft journal entries can be deleted' 
      }, { status: 400 });
    }

    await JournalEntry.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Journal entry deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting journal entry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}