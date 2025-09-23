import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';
import dbConnect from '@/lib/dbConnect';
import JournalEntry from '@/models/JournalEntry';
import ChartOfAccounts from '@/models/ChartOfAccounts';

interface LedgerEntry {
  date: Date;
  journalNumber: string;
  description: string;
  reference?: string;
  debit: number;
  credit: number;
  balance: number;
}

interface QueryFilter {
  status: string;
  date?: {
    $gte?: Date;
    $lte?: Date;
    $lt?: Date;
  };
  description?: {
    $regex: string;
    $options: string;
  };
  narration?: {
    $regex: string;
    $options: string;
  };
  $or: Array<{ 'lines.accountId': string }>;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session || !['admin', 'accountant', 'manager', 'auditor'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const search = searchParams.get('search');

    if (!accountId) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }

    // Verify account exists
    const account = await ChartOfAccounts.findById(accountId);
    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    // Build query for journal entries
    const query: Partial<QueryFilter> = {
      status: 'posted',
      $or: [
        { 'lines.accountId': accountId },
      ]
    };

    // Add date filters
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) {
        query.date.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        query.date.$lte = new Date(dateTo + 'T23:59:59.999Z');
      }
    }

    // Add search filter
    if (search) {
      query.narration = { $regex: search, $options: 'i' };
    }

    // Fetch journal entries
    const journalEntries = await JournalEntry.find(query)
      .sort({ date: 1, journalNumber: 1 });

    // Process entries to create ledger view
    const ledgerEntries: LedgerEntry[] = [];
    let runningBalance = 0;

    // Get opening balance (sum of all transactions before dateFrom if specified)
    if (dateFrom) {
      const openingQuery = {
        status: 'posted',
        date: { $lt: new Date(dateFrom) },
        $or: [{ 'lines.accountId': accountId }]
      };

      const openingEntries = await JournalEntry.find(openingQuery);
      
      for (const entry of openingEntries) {
        for (const entryLine of entry.lines) {
          if (entryLine.accountId === accountId) {
            const debitAmount = parseFloat(entryLine.debitAmount);
            const creditAmount = parseFloat(entryLine.creditAmount);
            
            if (['asset', 'expense'].includes(account.type)) {
              runningBalance += debitAmount - creditAmount;
            } else {
              runningBalance += creditAmount - debitAmount;
            }
          }
        }
      }
    }

    // Process filtered entries
    for (const entry of journalEntries) {
      for (const entryLine of entry.lines) {
        if (entryLine.accountId === accountId) {
          const debitAmount = parseFloat(entryLine.debitAmount);
          const creditAmount = parseFloat(entryLine.creditAmount);

          // Calculate running balance based on account type
          if (['asset', 'expense'].includes(account.type)) {
            runningBalance += debitAmount - creditAmount;
          } else {
            runningBalance += creditAmount - debitAmount;
          }

          ledgerEntries.push({
            date: entry.date,
            journalNumber: entry.journalNumber,
            description: entry.narration,
            reference: entry.reference,
            debit: debitAmount,
            credit: creditAmount,
            balance: runningBalance
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      entries: ledgerEntries,
      account: {
        id: account._id,
        code: account.code,
        name: account.name,
        type: account.type,
        currentBalance: runningBalance
      }
    });

  } catch (error) {
    console.error('Error fetching ledger:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ledger entries' },
      { status: 500 }
    );
  }
}