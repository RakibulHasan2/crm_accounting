'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface TrialBalanceEntry {
  accountCode: string;
  accountName: string;
  accountType: string;
  debitBalance: number;
  creditBalance: number;
}

interface TrialBalanceSummary {
  totalDebits: number;
  totalCredits: number;
  isBalanced: boolean;
}

export default function TrialBalance() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [trialBalance, setTrialBalance] = useState<TrialBalanceEntry[]>([]);
  const [summary, setSummary] = useState<TrialBalanceSummary>({
    totalDebits: 0,
    totalCredits: 0,
    isBalanced: false
  });
  const [loading, setLoading] = useState(true);
  const [asOfDate, setAsOfDate] = useState(new Date().toISOString().split('T')[0]);
  const [accountTypeFilter, setAccountTypeFilter] = useState('All');

  const fetchTrialBalance = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        asOfDate,
        ...(accountTypeFilter !== 'All' && { accountType: accountTypeFilter })
      });

      const response = await fetch(`/api/accounting/trial-balance?${params}`);
      if (response.ok) {
        const data = await response.json();
        setTrialBalance(data.entries || []);
        setSummary(data.summary || { totalDebits: 0, totalCredits: 0, isBalanced: false });
      }
    } catch (error) {
      console.error('Error fetching trial balance:', error);
    } finally {
      setLoading(false);
    }
  }, [asOfDate, accountTypeFilter]);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || !['admin', 'accountant', 'manager', 'auditor'].includes(session.user.role)) {
      router.push('/auth/signin');
      return;
    }

    fetchTrialBalance();
  }, [session, status, router, fetchTrialBalance]);

  const accountTypes = ['All', 'Asset', 'Liability', 'Equity', 'Revenue', 'Expense'];

  const filteredEntries = accountTypeFilter === 'All' 
    ? trialBalance 
    : trialBalance.filter(entry => entry.accountType === accountTypeFilter);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Trial Balance
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {session?.user.name}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Filters */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* As Of Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  As of Date
                </label>
                <input
                  type="date"
                  value={asOfDate}
                  onChange={(e) => setAsOfDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Account Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type
                </label>
                <select
                  value={accountTypeFilter}
                  onChange={(e) => setAccountTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {accountTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Refresh Button */}
              <div className="flex items-end">
                <button
                  onClick={fetchTrialBalance}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Refresh'}
                </button>
              </div>
            </div>
          </div>

          {/* Balance Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className={`p-6 rounded-lg ${summary.totalDebits > 0 ? 'bg-blue-50' : 'bg-gray-50'}`}>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Total Debits</h3>
              <p className="text-3xl font-bold text-blue-600">
                ${summary.totalDebits.toFixed(2)}
              </p>
            </div>
            
            <div className={`p-6 rounded-lg ${summary.totalCredits > 0 ? 'bg-green-50' : 'bg-gray-50'}`}>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Total Credits</h3>
              <p className="text-3xl font-bold text-green-600">
                ${summary.totalCredits.toFixed(2)}
              </p>
            </div>
            
            <div className={`p-6 rounded-lg ${summary.isBalanced ? 'bg-green-50' : 'bg-red-50'}`}>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Status</h3>
              <p className={`text-2xl font-bold ${summary.isBalanced ? 'text-green-600' : 'text-red-600'}`}>
                {summary.isBalanced ? '✓ Balanced' : '✗ Out of Balance'}
              </p>
              {!summary.isBalanced && (
                <p className="text-sm text-red-600 mt-1">
                  Difference: ${Math.abs(summary.totalDebits - summary.totalCredits).toFixed(2)}
                </p>
              )}
            </div>
          </div>

          {/* Trial Balance Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Trial Balance as of {new Date(asOfDate).toLocaleDateString()}
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Debit Balance
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Credit Balance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEntries.length > 0 ? (
                    <>
                      {filteredEntries.map((entry, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {entry.accountCode}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {entry.accountName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              entry.accountType === 'Asset' ? 'bg-blue-100 text-blue-800' :
                              entry.accountType === 'Liability' ? 'bg-red-100 text-red-800' :
                              entry.accountType === 'Equity' ? 'bg-purple-100 text-purple-800' :
                              entry.accountType === 'Revenue' ? 'bg-green-100 text-green-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {entry.accountType}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                            {entry.debitBalance > 0 ? `$${entry.debitBalance.toFixed(2)}` : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                            {entry.creditBalance > 0 ? `$${entry.creditBalance.toFixed(2)}` : '-'}
                          </td>
                        </tr>
                      ))}
                      
                      {/* Totals Row */}
                      <tr className="bg-gray-50 font-semibold">
                        <td colSpan={3} className="px-6 py-4 text-sm text-gray-900 text-right">
                          <strong>TOTALS:</strong>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          <strong>${summary.totalDebits.toFixed(2)}</strong>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          <strong>${summary.totalCredits.toFixed(2)}</strong>
                        </td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No Data Available</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          No account balances found for the selected criteria.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Export Options */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => window.print()}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Print Report
            </button>
            <button
              onClick={() => {
                // Export functionality can be added here
                console.log('Export functionality to be implemented');
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Export to Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}