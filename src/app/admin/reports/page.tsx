'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface ReportData {
  name: string;
  description: string;
  type: string;
  lastGenerated?: string;
  size?: string;
}

export default function AdminReports() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('month');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user.role !== 'admin') {
      router.push('/auth/signin');
      return;
    }

    // Set default date range
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    setFromDate(firstDayOfMonth.toISOString().split('T')[0]);
    setToDate(today.toISOString().split('T')[0]);
  }, [session, status, router]);

  const reports: ReportData[] = [
    {
      name: 'User Activity Report',
      description: 'Detailed report of user login activity, sessions, and system usage',
      type: 'user',
      lastGenerated: '2025-09-22 10:30',
      size: '2.1 MB'
    },
    {
      name: 'System Performance Report',
      description: 'Server performance, response times, and system health metrics',
      type: 'system',
      lastGenerated: '2025-09-22 09:15',
      size: '1.8 MB'
    },
    {
      name: 'Security Audit Report',
      description: 'Login attempts, failed authentications, and security events',
      type: 'security',
      lastGenerated: '2025-09-21 18:45',
      size: '950 KB'
    },
    {
      name: 'Data Usage Report',
      description: 'Database growth, storage usage, and data distribution analytics',
      type: 'data',
      lastGenerated: '2025-09-21 12:00',
      size: '3.2 MB'
    },
    {
      name: 'Financial Summary Report',
      description: 'Overall financial data summary, journal entries, and account balances',
      type: 'financial',
      lastGenerated: '2025-09-20 16:30',
      size: '4.5 MB'
    },
    {
      name: 'CRM Analytics Report',
      description: 'Contact management, opportunities, and sales pipeline analytics',
      type: 'crm',
      lastGenerated: '2025-09-20 14:20',
      size: '2.8 MB'
    }
  ];

  const handleGenerateReport = async (reportType: string) => {
    setLoading(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`${reportType} report generated successfully!`);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async (reportName: string) => {
    try {
      // Simulate report download
      alert(`Downloading ${reportName}...`);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Error downloading report');
    }
  };

  const handleDateRangeChange = (range: string) => {
    setSelectedDateRange(range);
    const today = new Date();
    let startDate: Date;

    switch (range) {
      case 'week':
        startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'quarter':
        const quarterStart = Math.floor(today.getMonth() / 3) * 3;
        startDate = new Date(today.getFullYear(), quarterStart, 1);
        break;
      case 'year':
        startDate = new Date(today.getFullYear(), 0, 1);
        break;
      default:
        return;
    }

    setFromDate(startDate.toISOString().split('T')[0]);
    setToDate(today.toISOString().split('T')[0]);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Reports</h1>
          <p className="mt-2 text-gray-600">Generate and download system reports and analytics</p>
        </div>

        {/* Date Range Selector */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Report Parameters</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quick Select</label>
                <select
                  value={selectedDateRange}
                  onChange={(e) => handleDateRangeChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="week">Last 7 Days</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => alert('Applied date range: ' + fromDate + ' to ' + toDate)}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Apply Range
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report, index) => (
            <div key={index} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    report.type === 'user' ? 'bg-blue-100' :
                    report.type === 'system' ? 'bg-green-100' :
                    report.type === 'security' ? 'bg-red-100' :
                    report.type === 'data' ? 'bg-purple-100' :
                    report.type === 'financial' ? 'bg-yellow-100' :
                    'bg-gray-100'
                  }`}>
                    <svg className={`w-6 h-6 ${
                      report.type === 'user' ? 'text-blue-600' :
                      report.type === 'system' ? 'text-green-600' :
                      report.type === 'security' ? 'text-red-600' :
                      report.type === 'data' ? 'text-purple-600' :
                      report.type === 'financial' ? 'text-yellow-600' :
                      'text-gray-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {report.type === 'user' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      )}
                      {report.type === 'system' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      )}
                      {report.type === 'security' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      )}
                      {(report.type === 'data' || report.type === 'financial' || report.type === 'crm') && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      )}
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{report.name}</h3>
                    <p className="text-sm text-gray-500">{report.type}</p>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{report.description}</p>
                
                {report.lastGenerated && (
                  <div className="text-xs text-gray-500 mb-4">
                    <p>Last generated: {report.lastGenerated}</p>
                    <p>Size: {report.size}</p>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleGenerateReport(report.name)}
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Generating...' : 'Generate'}
                  </button>
                  {report.lastGenerated && (
                    <button
                      onClick={() => handleDownloadReport(report.name)}
                      className="bg-gray-600 text-white px-3 py-2 rounded-md text-sm hover:bg-gray-700"
                    >
                      Download
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bulk Actions */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Bulk Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                Generate All Reports
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Download All Reports
              </button>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
                Schedule Reports
              </button>
              <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
                Export Configuration
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}