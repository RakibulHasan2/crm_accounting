import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';
import dbConnect from '@/lib/dbConnect';
import JournalEntry from '@/models/JournalEntry';
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
      .populate('entries.account', 'accountCode accountName')
      .populate('createdBy', 'name');

    if (!journalEntry) {
      return NextResponse.json({ error: 'Journal entry not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      journalEntry
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

      // Update journal entry
      journalEntry.entries = entries;
      journalEntry.totalDebit = totalDebit;
      journalEntry.totalCredit = totalCredit;
    }

    if (description) journalEntry.description = description;
    if (entryDate) journalEntry.entryDate = new Date(entryDate);
    
    journalEntry.updatedBy = session.user.id;
    journalEntry.updatedAt = new Date();

    await journalEntry.save();

    const populatedEntry = await JournalEntry.findById(id)
      .populate('entries.account', 'accountCode accountName')
      .populate('createdBy', 'name');

    return NextResponse.json({
      success: true,
      journalEntry: populatedEntry,
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