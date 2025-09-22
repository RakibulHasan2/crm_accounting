import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';
import dbConnect from '@/lib/dbConnect';
import JournalEntry from '@/models/JournalEntry';
import ChartOfAccounts from '@/models/ChartOfAccounts';

interface TrialBalanceEntry {
  accountCode: string;
  accountName: string;
  accountType: string;
  debitBalance: number;
  creditBalance: number;
}

interface AccountBalance {
  [accountId: string]: {
    account: {
      accountCode: string;
      accountName: string;
      accountType: string;
    };
    debitTotal: number;
    creditTotal: number;
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
    const asOfDate = searchParams.get('asOfDate') || new Date().toISOString().split('T')[0];
    const accountType = searchParams.get('accountType');

    // Build query for journal entries up to the specified date
    const query = {
      status: 'posted',
      date: { $lte: new Date(asOfDate + 'T23:59:59.999Z') }
    };

    // Fetch all journal entries up to the specified date
    const journalEntries = await JournalEntry.find(query)
      .populate('entries.account', 'accountCode accountName accountType')
      .sort({ date: 1, journalNumber: 1 });

    // Fetch all accounts
    const accountsQuery = accountType ? { accountType } : {};
    const accounts = await ChartOfAccounts.find(accountsQuery);

    // Calculate balances for each account
    const accountBalances: AccountBalance = {};

    // Initialize all accounts with zero balances
    for (const account of accounts) {
      accountBalances[account._id.toString()] = {
        account: {
          accountCode: account.accountCode,
          accountName: account.accountName,
          accountType: account.accountType
        },
        debitTotal: 0,
        creditTotal: 0
      };
    }

    // Process journal entries to calculate balances
    for (const entry of journalEntries) {
      for (const entryLine of entry.entries) {
        const accountId = entryLine.account._id.toString();
        
        if (accountBalances[accountId]) {
          accountBalances[accountId].debitTotal += entryLine.debit;
          accountBalances[accountId].creditTotal += entryLine.credit;
        }
      }
    }

    // Convert to trial balance format
    const trialBalanceEntries: TrialBalanceEntry[] = [];
    let totalDebits = 0;
    let totalCredits = 0;

    for (const balance of Object.values(accountBalances)) {
      const { account, debitTotal, creditTotal } = balance;
      const netBalance = debitTotal - creditTotal;

      let debitBalance = 0;
      let creditBalance = 0;

      // Determine natural balance side based on account type
      if (['Asset', 'Expense'].includes(account.accountType)) {
        // Assets and Expenses have debit normal balance
        if (netBalance > 0) {
          debitBalance = netBalance;
        } else if (netBalance < 0) {
          creditBalance = Math.abs(netBalance);
        }
      } else {
        // Liabilities, Equity, and Revenue have credit normal balance
        if (netBalance < 0) {
          creditBalance = Math.abs(netBalance);
        } else if (netBalance > 0) {
          debitBalance = netBalance;
        }
      }

      // Only include accounts with non-zero balances
      if (debitBalance > 0 || creditBalance > 0) {
        trialBalanceEntries.push({
          accountCode: account.accountCode,
          accountName: account.accountName,
          accountType: account.accountType,
          debitBalance,
          creditBalance
        });

        totalDebits += debitBalance;
        totalCredits += creditBalance;
      }
    }

    // Sort by account code
    trialBalanceEntries.sort((a, b) => a.accountCode.localeCompare(b.accountCode));

    const summary = {
      totalDebits: Math.round(totalDebits * 100) / 100,
      totalCredits: Math.round(totalCredits * 100) / 100,
      isBalanced: Math.abs(totalDebits - totalCredits) < 0.01
    };

    return NextResponse.json({
      success: true,
      entries: trialBalanceEntries,
      summary,
      asOfDate,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating trial balance:', error);
    return NextResponse.json(
      { error: 'Failed to generate trial balance' },
      { status: 500 }
    );
  }
}