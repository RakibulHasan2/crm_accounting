/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';
import dbConnect from '@/lib/dbConnect';
import ChartOfAccounts from '@/models/ChartOfAccounts';
import JournalEntry from '@/models/JournalEntry';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session || !['admin', 'accountant', 'manager'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Get current month start for monthly statistics
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalAccounts,
      pendingJournalEntries,
      monthlyTransactions,
      accountBalancesByType,
      recentJournalEntries,
      topAccountBalances
    ] = await Promise.all([
      // Total active accounts
      ChartOfAccounts.countDocuments({ isActive: true }),
      
      // Pending journal entries
      JournalEntry.countDocuments({ status: 'draft' }),
      
      // Monthly transactions
      JournalEntry.countDocuments({ 
        status: 'posted',
        entryDate: { $gte: startOfMonth } 
      }),
      
      // Account balances by type
      ChartOfAccounts.aggregate([
        { $match: { isActive: true } },
        { 
          $group: { 
            _id: '$accountType', 
            totalBalance: { $sum: '$balance' } 
          } 
        }
      ]),
      
      // Recent journal entries
      JournalEntry.find({ status: { $in: ['draft', 'posted'] } })
        .populate('entries.account', 'accountCode accountName')
        .sort({ createdAt: -1 })
        .limit(5)
        .select('journalNumber description totalDebit status entryDate'),
      
      // Top account balances (by absolute value)
      ChartOfAccounts.find({ isActive: true })
        .sort({ balance: -1 })
        .limit(15)
        .select('accountCode accountName accountType balance')
    ]);

    // Format account balances by type
    const totalBalance = {
      assets: 0,
      liabilities: 0,
      equity: 0,
      revenue: 0,
      expenses: 0
    };

    accountBalancesByType.forEach((item: any) => {
      if (item._id in totalBalance) {
        totalBalance[item._id as keyof typeof totalBalance] = item.totalBalance;
      }
    });

    // Calculate net worth and other key metrics
    const netWorth = totalBalance.assets - totalBalance.liabilities;
    const netIncome = totalBalance.revenue - totalBalance.expenses;

    const dashboardStats = {
      totalAccounts,
      pendingJournalEntries,
      monthlyTransactions,
      totalBalance,
      netWorth,
      netIncome,
      recentJournalEntries,
      accountBalances: topAccountBalances
    };

    return NextResponse.json(dashboardStats);

  } catch (error) {
    console.error('Error fetching accounting dashboard stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}