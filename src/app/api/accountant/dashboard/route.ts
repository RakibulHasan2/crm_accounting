import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';
import dbConnect from '@/lib/dbConnect';
import ChartOfAccounts from '@/models/ChartOfAccounts';
import JournalEntry from '@/models/JournalEntry';

export async function GET() {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session || !['admin', 'accountant'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Get current month start
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalAccounts,
      totalJournalEntries,
      pendingEntries,
      monthlyTransactions,
      recentEntries,
      accountBreakdown
    ] = await Promise.all([
      // Total accounts
      ChartOfAccounts.countDocuments({ isActive: true }),
      
      // Total journal entries
      JournalEntry.countDocuments(),
      
      // Pending entries
      JournalEntry.countDocuments({ status: 'draft' }),
      
      // Monthly transactions
      JournalEntry.countDocuments({ 
        dateCreated: { $gte: startOfMonth } 
      }),
      
      // Recent entries
      JournalEntry.find()
        .sort({ dateCreated: -1 })
        .limit(5)
        .lean(),
      
      // Account breakdown by type
      ChartOfAccounts.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$accountType', count: { $sum: 1 } } }
      ])
    ]);

    // Format account breakdown
    const breakdown = {
      assets: 0,
      liabilities: 0,
      equity: 0,
      revenue: 0,
      expenses: 0
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    accountBreakdown.forEach((item: any) => {
      if (item._id in breakdown) {
        breakdown[item._id as keyof typeof breakdown] = item.count;
      }
    });

    const stats = {
      totalAccounts,
      totalJournalEntries,
      pendingEntries,
      monthlyTransactions,
      recentEntries,
      accountBreakdown: breakdown
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching accountant dashboard data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}