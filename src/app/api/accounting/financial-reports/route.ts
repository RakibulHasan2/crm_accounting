import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';
import dbConnect from '@/lib/dbConnect';
import JournalEntry from '@/models/JournalEntry';
import ChartOfAccounts from '@/models/ChartOfAccounts';

interface AccountBalances {
  [accountName: string]: number;
}

interface QueryFilter {
  status: string;
  date?: {
    $gte?: Date;
    $lte?: Date;
  };
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session || !['admin', 'accountant', 'manager', 'auditor'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get('dateFrom') || new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
    const dateTo = searchParams.get('dateTo') || new Date().toISOString().split('T')[0];
    const reportType = searchParams.get('reportType') || 'pl';

    // Build query for journal entries
    const query: QueryFilter = {
      status: 'posted'
    };

    if (reportType === 'pl') {
      // For P&L, filter by date range
      query.date = {
        $gte: new Date(dateFrom),
        $lte: new Date(dateTo + 'T23:59:59.999Z')
      };
    } else {
      // For Balance Sheet, get all entries up to the end date
      query.date = {
        $lte: new Date(dateTo + 'T23:59:59.999Z')
      };
    }

    // Fetch journal entries
    const journalEntries = await JournalEntry.find(query)
      .sort({ date: 1, journalNumber: 1 });

    // Initialize account balances
    const revenue: AccountBalances = {};
    const expenses: AccountBalances = {};
    const assets: AccountBalances = {};
    const liabilities: AccountBalances = {};
    const equity: AccountBalances = {};

    // Process journal entries
    for (const entry of journalEntries) {
      for (const entryLine of entry.lines) {
        // We need to fetch account details for each line
        const account = await ChartOfAccounts.findById(entryLine.accountId);
        if (!account) continue;
        
        const accountName = `${account.code} - ${account.name}`;
        const debitAmount = parseFloat(entryLine.debitAmount);
        const creditAmount = parseFloat(entryLine.creditAmount);
        const netAmount = debitAmount - creditAmount;

        switch (account.type) {
          case 'income':
            if (!revenue[accountName]) revenue[accountName] = 0;
            revenue[accountName] += Math.abs(netAmount); // Revenue is shown as positive
            break;
          case 'expense':
            if (!expenses[accountName]) expenses[accountName] = 0;
            expenses[accountName] += Math.abs(netAmount); // Expenses are shown as positive
            break;
          case 'asset':
            if (!assets[accountName]) assets[accountName] = 0;
            assets[accountName] += netAmount; // Assets increase with debits
            break;
          case 'liability':
            if (!liabilities[accountName]) liabilities[accountName] = 0;
            liabilities[accountName] += -netAmount; // Liabilities increase with credits
            break;
          case 'equity':
            if (!equity[accountName]) equity[accountName] = 0;
            equity[accountName] += -netAmount; // Equity increases with credits
            break;
        }
      }
    }

    // Calculate totals
    const totalRevenue = Object.values(revenue).reduce((sum, amount) => sum + amount, 0);
    const totalExpenses = Object.values(expenses).reduce((sum, amount) => sum + amount, 0);
    const totalAssets = Object.values(assets).reduce((sum, amount) => sum + amount, 0);
    const totalLiabilities = Object.values(liabilities).reduce((sum, amount) => sum + amount, 0);
    const totalEquity = Object.values(equity).reduce((sum, amount) => sum + amount, 0);
    const netIncome = totalRevenue - totalExpenses;

    // Filter out zero balances and format
    const formatBalances = (balances: AccountBalances) => {
      const formatted: AccountBalances = {};
      for (const [account, amount] of Object.entries(balances)) {
        if (Math.abs(amount) > 0.01) {
          formatted[account] = Math.round(amount * 100) / 100;
        }
      }
      return formatted;
    };

    return NextResponse.json({
      success: true,
      revenue: formatBalances(revenue),
      expenses: formatBalances(expenses),
      assets: formatBalances(assets),
      liabilities: formatBalances(liabilities),
      equity: formatBalances(equity),
      netIncome: Math.round(netIncome * 100) / 100,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalExpenses: Math.round(totalExpenses * 100) / 100,
      totalAssets: Math.round(totalAssets * 100) / 100,
      totalLiabilities: Math.round(totalLiabilities * 100) / 100,
      totalEquity: Math.round(totalEquity * 100) / 100,
      dateFrom,
      dateTo,
      reportType,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating financial report:', error);
    return NextResponse.json(
      { error: 'Failed to generate financial report' },
      { status: 500 }
    );
  }
}