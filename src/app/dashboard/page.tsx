'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // Redirect admin users to admin panel
    if (session.user.role === 'admin') {
      router.push('/admin');
      return;
    }

    // Redirect accountants to accountant dashboard
    if (session.user.role === 'accountant') {
      router.push('/accountant');
      return;
    }

    // Redirect accountant users to accountant dashboard
    if (session.user.role === 'accountant') {
      router.push('/accountant');
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

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Basic Accounts & CRM
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {session.user.name}
              </span>
              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                session.user.role === 'admin' ? 'bg-red-100 text-red-800' :
                session.user.role === 'accountant' ? 'bg-green-100 text-green-800' :
                session.user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                session.user.role === 'sales' ? 'bg-purple-100 text-purple-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {session.user.role.charAt(0).toUpperCase() + session.user.role.slice(1)}
              </span>
              <Link 
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Dashboard Coming Soon
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Your role-specific dashboard is currently under development.
            </p>
            
            <div className="bg-white shadow rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Available for {session.user.role}:
              </h3>
              
              <div className="space-y-3">
                {session.user.role === 'accountant' && (
                  <>
                    <div className="text-sm text-gray-500">• Chart of Accounts (Coming Soon)</div>
                    <div className="text-sm text-gray-500">• Journal Entries (Coming Soon)</div>
                    <div className="text-sm text-gray-500">• Financial Reports (Coming Soon)</div>
                  </>
                )}
                
                {session.user.role === 'sales' && (
                  <>
                    <div className="text-sm text-gray-500">• Lead Management (Coming Soon)</div>
                    <div className="text-sm text-gray-500">• Opportunity Pipeline (Coming Soon)</div>
                    <div className="text-sm text-gray-500">• Contact Management (Coming Soon)</div>
                  </>
                )}
                
                {session.user.role === 'manager' && (
                  <>
                    <div className="text-sm text-gray-500">• Team Overview (Coming Soon)</div>
                    <div className="text-sm text-gray-500">• Reports & Analytics (Coming Soon)</div>
                    <div className="text-sm text-gray-500">• Performance Metrics (Coming Soon)</div>
                  </>
                )}
                
                {session.user.role === 'auditor' && (
                  <>
                    <div className="text-sm text-gray-500">• Audit Trails (Coming Soon)</div>
                    <div className="text-sm text-gray-500">• Compliance Reports (Coming Soon)</div>
                    <div className="text-sm text-gray-500">• System Logs (Coming Soon)</div>
                  </>
                )}
              </div>
              
              <div className="mt-6">
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}