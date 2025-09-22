'use client';

import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ReportsOverview() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const reportCategories = [
    {
      title: 'Financial Reports',
      description: 'Comprehensive financial statements and analysis',
      href: '/accounting/financial-reports',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'bg-green-600 hover:bg-green-700',
      available: ['admin', 'accountant', 'manager', 'auditor'].includes(session?.user.role || ''),
      reports: ['Profit & Loss Statement', 'Balance Sheet', 'Trial Balance']
    },
    {
      title: 'Accounting Reports',
      description: 'Detailed accounting and ledger reports',
      href: '/accounting/trial-balance',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'bg-blue-600 hover:bg-blue-700',
      available: ['admin', 'accountant', 'manager', 'auditor'].includes(session?.user.role || ''),
      reports: ['Trial Balance', 'General Ledger', 'Chart of Accounts']
    },
    {
      title: 'Admin Reports',
      description: 'System administration and user management reports',
      href: '/admin/reports',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'bg-red-600 hover:bg-red-700',
      available: session?.user.role === 'admin',
      reports: ['User Activity', 'System Health', 'Audit Trail']
    },
    {
      title: 'Sales Reports',
      description: 'Sales performance and pipeline analysis',
      href: '#',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: 'bg-purple-600 hover:bg-purple-700',
      available: ['admin', 'sales', 'manager'].includes(session?.user.role || ''),
      reports: ['Sales Pipeline', 'Revenue Analysis', 'Commission Reports'],
      comingSoon: true
    },
    {
      title: 'CRM Reports',
      description: 'Customer relationship and contact management reports',
      href: '#',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'bg-indigo-600 hover:bg-indigo-700',
      available: ['admin', 'sales', 'manager'].includes(session?.user.role || ''),
      reports: ['Customer Analysis', 'Contact Reports', 'Activity Summary'],
      comingSoon: true
    }
  ];

  const quickReports = [
    {
      name: 'Current Month P&L',
      href: '/accounting/financial-reports?reportType=pl',
      description: 'Profit & Loss for current month'
    },
    {
      name: 'Balance Sheet',
      href: '/accounting/financial-reports?reportType=balance',
      description: 'Current financial position'
    },
    {
      name: 'Trial Balance',
      href: '/accounting/trial-balance',
      description: 'Verify account balances'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back to Home
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                Reports Center
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {session?.user.name}
              </span>
              <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {session?.user.role}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-sm text-red-600 hover:text-red-900 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports Dashboard</h1>
            <p className="text-lg text-gray-600">
              Access comprehensive reports and analytics for your business
            </p>
          </div>

          {/* Quick Reports */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickReports.map((report, index) => (
                <Link
                  key={index}
                  href={report.href}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{report.name}</p>
                    <p className="text-sm text-gray-500">{report.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Report Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportCategories.map((category, index) => {
              if (!category.available) return null;
              
              return (
                <div key={index} className="relative">
                  {category.comingSoon ? (
                    <div className={`${category.color.replace('hover:', '')} opacity-60 text-white p-6 rounded-lg shadow-md flex flex-col items-center text-center cursor-not-allowed`}>
                      <div className="mb-4">
                        {category.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                      <p className="text-sm opacity-90 mb-4">{category.description}</p>
                      <div className="absolute top-2 right-2">
                        <span className="bg-yellow-500 text-yellow-900 text-xs font-semibold px-2 py-1 rounded">
                          Coming Soon
                        </span>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={category.href}
                      className={`${category.color} text-white p-6 rounded-lg transition-colors shadow-md flex flex-col items-center text-center group`}
                    >
                      <div className="mb-4 group-hover:scale-110 transition-transform">
                        {category.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                      <p className="text-sm opacity-90 mb-4">{category.description}</p>
                      <div className="mt-auto">
                        <ul className="text-xs opacity-80">
                          {category.reports.map((report, reportIndex) => (
                            <li key={reportIndex}>• {report}</li>
                          ))}
                        </ul>
                      </div>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          {/* Information Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-medium text-blue-900 mb-2">Report Access by Role</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-blue-800 mb-1">Admin</h4>
                <p className="text-blue-700">Full access to all reports</p>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-1">Accountant</h4>
                <p className="text-blue-700">Financial & accounting reports</p>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-1">Manager</h4>
                <p className="text-blue-700">Financial, sales & CRM reports</p>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-1">Sales</h4>
                <p className="text-blue-700">Sales & CRM reports only</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}