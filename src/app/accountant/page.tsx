'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DashboardStats {
  totalAccounts: number;
  pendingJournalEntries: number;
  monthlyTransactions: number;
  totalBalance: {
    assets: number;
    liabilities: number;
    equity: number;
    revenue: number;
    expenses: number;
  };
  recentJournalEntries: Array<{
    _id: string;
    journalNumber: string;
    description: string;
    totalDebit: number;
    status: string;
    entryDate: string;
  }>;
  accountBalances: Array<{
    _id: string;
    accountCode: string;
    accountName: string;
    accountType: string;
    balance: number;
  }>;
}

export default function AccountantDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user.role !== 'accountant') {
      router.push('/dashboard');
      return;
    }

    fetchDashboardStats();
  }, [session, status, router]);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/accounting/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getAccountTypeColor = (type: string) => {
    const colors = {
      assets: 'text-green-600',
      liabilities: 'text-red-600',
      equity: 'text-blue-600',
      revenue: 'text-purple-600',
      expenses: 'text-orange-600'
    };
    return colors[type as keyof typeof colors] || 'text-gray-600';
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Accountant Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {session?.user.name}</span>
              <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Accountant
              </span>
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Link
                href="/accounting/journal-entries"
                className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md flex flex-col items-center"
              >
                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="text-center">Journal Entries</span>
              </Link>
              
              <Link
                href="/accounting/chart-of-accounts"
                className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors shadow-md flex flex-col items-center"
              >
                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-center">Chart of Accounts</span>
              </Link>
              
              <Link
                href="/accounting/ledger"
                className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors shadow-md flex flex-col items-center"
              >
                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="text-center">General Ledger</span>
              </Link>
              
              <Link
                href="/accounting/trial-balance"
                className="bg-orange-600 text-white p-4 rounded-lg hover:bg-orange-700 transition-colors shadow-md flex flex-col items-center"
              >
                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-center">Trial Balance</span>
              </Link>

              <Link
                href="/accounting/financial-reports"
                className="bg-red-600 text-white p-4 rounded-lg hover:bg-red-700 transition-colors shadow-md flex flex-col items-center"
              >
                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-center">Financial Reports</span>
              </Link>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Key Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Total Accounts</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalAccounts || 0}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Pending Journal Entries</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.pendingJournalEntries || 0}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">Monthly Transactions</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.monthlyTransactions || 0}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Balances Summary */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Account Type Balances</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {stats?.totalBalance && Object.entries(stats.totalBalance).map(([type, balance]) => (
                <div key={type} className="bg-white rounded-lg shadow p-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600 capitalize">{type}</p>
                    <p className={`text-lg font-bold ${getAccountTypeColor(type)}`}>
                      {formatCurrency(balance)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Journal Entries */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Journal Entries</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {stats?.recentJournalEntries?.map((entry) => (
                    <div key={entry._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{entry.journalNumber}</p>
                        <p className="text-xs text-gray-500">{entry.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(entry.entryDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(entry.totalDebit)}
                        </p>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          entry.status === 'posted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {entry.status}
                        </span>
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-center py-4">No recent journal entries</p>
                  )}
                </div>
                <div className="mt-4">
                  <Link
                    href="/accounting/journal-entries"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View all entries →
                  </Link>
                </div>
              </div>
            </div>

            {/* Top Account Balances */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Account Balances (Top 10)</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {stats?.accountBalances?.slice(0, 10).map((account) => (
                    <div key={account._id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {account.accountCode} - {account.accountName}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">{account.accountType}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${getAccountTypeColor(account.accountType)}`}>
                          {formatCurrency(account.balance)}
                        </p>
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-center py-4">No account balances available</p>
                  )}
                </div>
                <div className="mt-4">
                  <Link
                    href="/accounting/chart-of-accounts"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View all accounts →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}