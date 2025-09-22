import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Company from '@/models/Company';
import Contact from '@/models/Contact';
import JournalEntry from '@/models/JournalEntry';
import Opportunity from '@/models/Opportunity';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';


// GET /api/admin/dashboard - Get admin dashboard statistics
export async function GET() {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Get current month start for monthly statistics
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      activeUsers,
      pendingUsers,
      totalCompanies,
      totalContacts,
      totalJournalEntries,
      totalOpportunities,
      monthlyUsers,
      monthlyJournalEntries,
      usersByRole,
      usersByStatus
    ] = await Promise.all([
      // User statistics
      User.countDocuments(),
      User.countDocuments({ status: 'active' }),
      User.countDocuments({ status: 'pending' }),
      
      // General statistics
      Company.countDocuments(),
      Contact.countDocuments(),
      JournalEntry.countDocuments(),
      Opportunity.countDocuments(),
      
      // Monthly statistics
      User.countDocuments({ createdAt: { $gte: startOfMonth } }),
      JournalEntry.countDocuments({ createdAt: { $gte: startOfMonth } }),
      
      // Aggregated statistics
      User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]),
      User.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    // Recent activities (last 10 users)
    const recentUsers = await User.find()
      .select('name email role status createdAt')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const statistics = {
      users: {
        total: totalUsers,
        active: activeUsers,
        pending: pendingUsers,
        monthly: monthlyUsers,
        byRole: usersByRole.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {} as Record<string, number>),
        byStatus: usersByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {} as Record<string, number>)
      },
      general: {
        companies: totalCompanies,
        contacts: totalContacts,
        journalEntries: totalJournalEntries,
        opportunities: totalOpportunities,
        monthlyJournalEntries
      },
      recent: {
        users: recentUsers
      }
    };

    return NextResponse.json(statistics);

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}