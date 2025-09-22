import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';
import dbConnect from '@/lib/dbConnect';
import JournalEntry from '@/models/JournalEntry';
import ChartOfAccounts from '@/models/ChartOfAccounts';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session || !['admin', 'accountant', 'manager', 'auditor'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    const query: Record<string, any> = {};

    if (search) {
      query.$or = [
        { journalNumber: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const [journalEntries, total] = await Promise.all([
      JournalEntry.find(query)
        .populate('entries.account', 'accountCode accountName')
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      JournalEntry.countDocuments(query)
    ]);

    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      journalEntries,
      pagination: {
        current: page,
        pages,
        total,
        limit
      }
    });

  } catch (error) {
    console.error('Error fetching journal entries:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session || !['admin', 'accountant'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const { description, entryDate, entries } = body;

    // Validate required fields
    if (!description || !entryDate || !entries || entries.length < 2) {
      return NextResponse.json(
        { error: 'Description, entry date, and at least 2 entries are required' },
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
    const totalDebit = entries.reduce((sum: number, entry: any) => sum + (entry.debit || 0), 0);
    const totalCredit = entries.reduce((sum: number, entry: any) => sum + (entry.credit || 0), 0);

    // Validate double-entry bookkeeping
    if (Math.abs(totalDebit - totalCredit) >= 0.01) {
      return NextResponse.json(
        { error: 'Debits and credits must be equal' },
        { status: 400 }
      );
    }

    // Generate journal number
    const lastJournal = await JournalEntry.findOne().sort({ journalNumber: -1 });
    const nextNumber = lastJournal 
      ? parseInt(lastJournal.journalNumber.replace('JE', '')) + 1 
      : 1;
    const journalNumber = `JE${nextNumber.toString().padStart(6, '0')}`;

    const newJournalEntry = new JournalEntry({
      journalNumber,
      description,
      entryDate: new Date(entryDate),
      entries,
      totalDebit,
      totalCredit,
      status: 'draft',
      createdBy: session.user.id
    });

    await newJournalEntry.save();

    const populatedEntry = await JournalEntry.findById(newJournalEntry._id)
      .populate('entries.account', 'accountCode accountName')
      .populate('createdBy', 'name');

    return NextResponse.json({
      success: true,
      journalEntry: populatedEntry,
      message: 'Journal entry created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating journal entry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}