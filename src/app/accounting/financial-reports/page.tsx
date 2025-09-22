'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface FinancialData {
  revenue: { [key: string]: number };
  expenses: { [key: string]: number };
  assets: { [key: string]: number };
  liabilities: { [key: string]: number };
  equity: { [key: string]: number };
  netIncome: number;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  totalRevenue: number;
  totalExpenses: number;
}

export default function FinancialReports() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeReport, setActiveReport] = useState<'pl' | 'balance' | 'cashflow'>('pl');
  const [financialData, setFinancialData] = useState<FinancialData>({
    revenue: {},
    expenses: {},
    assets: {},
    liabilities: {},
    equity: {},
    netIncome: 0,
    totalAssets: 0,
    totalLiabilities: 0,
    totalEquity: 0,
    totalRevenue: 0,
    totalExpenses: 0
  });
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState(new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]);
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || !['admin', 'accountant', 'manager', 'auditor'].includes(session.user.role)) {
      router.push('/auth/signin');
      return;
    }
  }, [session, status, router]);

  const fetchFinancialData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        dateFrom,
        dateTo,
        reportType: activeReport
      });

      const response = await fetch(`/api/accounting/financial-reports?${params}`);
      if (response.ok) {
        const data = await response.json();
        setFinancialData(data);
      }
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo, activeReport]);

  useEffect(() => {
    if (session) {
      fetchFinancialData();
    }
  }, [session, fetchFinancialData]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const renderProfitLoss = () => (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Profit & Loss Statement
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        For the period from {new Date(dateFrom).toLocaleDateString()} to {new Date(dateTo).toLocaleDateString()}
      </p>

      {/* Revenue Section */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">Revenue</h4>
        <div className="space-y-2">
          {Object.entries(financialData.revenue).map(([account, amount]) => (
            <div key={account} className="flex justify-between">
              <span className="text-gray-700">{account}</span>
              <span className="font-medium">${amount.toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
            <span>Total Revenue</span>
            <span className="text-green-600">${financialData.totalRevenue.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Expenses Section */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">Expenses</h4>
        <div className="space-y-2">
          {Object.entries(financialData.expenses).map(([account, amount]) => (
            <div key={account} className="flex justify-between">
              <span className="text-gray-700">{account}</span>
              <span className="font-medium">${amount.toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
            <span>Total Expenses</span>
            <span className="text-red-600">${financialData.totalExpenses.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Net Income */}
      <div className="border-t-2 border-gray-300 pt-4">
        <div className="flex justify-between text-xl font-bold">
          <span>Net Income</span>
          <span className={financialData.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}>
            ${financialData.netIncome.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );

  const renderBalanceSheet = () => (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Balance Sheet
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        As of {new Date(dateTo).toLocaleDateString()}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Assets */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">Assets</h4>
          <div className="space-y-2">
            {Object.entries(financialData.assets).map(([account, amount]) => (
              <div key={account} className="flex justify-between">
                <span className="text-gray-700">{account}</span>
                <span className="font-medium">${amount.toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
              <span>Total Assets</span>
              <span className="text-blue-600">${financialData.totalAssets.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Liabilities & Equity */}
        <div>
          {/* Liabilities */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">Liabilities</h4>
            <div className="space-y-2">
              {Object.entries(financialData.liabilities).map(([account, amount]) => (
                <div key={account} className="flex justify-between">
                  <span className="text-gray-700">{account}</span>
                  <span className="font-medium">${amount.toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-semibold border-t border-gray-200 pt-2">
                <span>Total Liabilities</span>
                <span className="text-red-600">${financialData.totalLiabilities.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Equity */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">Equity</h4>
            <div className="space-y-2">
              {Object.entries(financialData.equity).map(([account, amount]) => (
                <div key={account} className="flex justify-between">
                  <span className="text-gray-700">{account}</span>
                  <span className="font-medium">${amount.toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-semibold border-t border-gray-200 pt-2">
                <span>Total Equity</span>
                <span className="text-green-600">${financialData.totalEquity.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Total Liabilities & Equity */}
          <div className="border-t-2 border-gray-300 pt-4 mt-6">
            <div className="flex justify-between text-lg font-bold">
              <span>Total Liabilities & Equity</span>
              <span className="text-purple-600">
                ${(financialData.totalLiabilities + financialData.totalEquity).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCashFlow = () => (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Cash Flow Statement
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        For the period from {new Date(dateFrom).toLocaleDateString()} to {new Date(dateTo).toLocaleDateString()}
      </p>

      <div className="text-center py-12 text-gray-500">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Cash Flow Statement</h3>
        <p className="mt-1 text-sm text-gray-500">
          Cash flow statement will be implemented in the next phase.
        </p>
      </div>
    </div>
  );

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
                Financial Reports
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
          
          {/* Report Selection and Filters */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Report Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type
                </label>
                <select
                  value={activeReport}
                  onChange={(e) => setActiveReport(e.target.value as 'pl' | 'balance' | 'cashflow')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pl">Profit & Loss</option>
                  <option value="balance">Balance Sheet</option>
                  <option value="cashflow">Cash Flow</option>
                </select>
              </div>

              {/* Date From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Generate Button */}
              <div className="flex items-end">
                <button
                  onClick={fetchFinancialData}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Generate Report'}
                </button>
              </div>
            </div>
          </div>

          {/* Report Content */}
          {activeReport === 'pl' && renderProfitLoss()}
          {activeReport === 'balance' && renderBalanceSheet()}
          {activeReport === 'cashflow' && renderCashFlow()}

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
                console.log('Export functionality to be implemented');
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Export to PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}