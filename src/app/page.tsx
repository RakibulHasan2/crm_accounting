'use client';

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Basic Accounts & CRM</h1>
          <p className="text-xl text-gray-600 mb-2">Hotchpotch Digital Ltd</p>
          <p className="text-lg text-gray-500">Complete business management solution</p>
        </div>

        {session ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-semibold text-gray-800 mb-2">
                Welcome back, {session.user.name}!
              </h2>
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                session.user.role === 'admin' ? 'bg-red-100 text-red-800' :
                session.user.role === 'accountant' ? 'bg-green-100 text-green-800' :
                session.user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                session.user.role === 'sales' ? 'bg-purple-100 text-purple-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {session.user.role.charAt(0).toUpperCase() + session.user.role.slice(1)}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {session.user.role === 'admin' && (
                <Link
                  href="/admin"
                  className="bg-red-600 text-white px-6 py-4 rounded-lg hover:bg-red-700 text-center font-medium transition-colors shadow-md flex flex-col items-center"
                >
                  <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Admin Panel
                </Link>
              )}
              
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 text-center font-medium transition-colors shadow-md flex flex-col items-center"
              >
                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
                Dashboard
              </Link>
              
              {(session.user.role === 'admin' || session.user.role === 'accountant') && (
                <Link
                  href="/accounting"
                  className="bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 text-center font-medium transition-colors shadow-md flex flex-col items-center"
                >
                  <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Accounting
                </Link>
              )}
              
              {(session.user.role === 'admin' || session.user.role === 'sales' || session.user.role === 'manager') && (
                <Link
                  href="/crm"
                  className="bg-purple-600 text-white px-6 py-4 rounded-lg hover:bg-purple-700 text-center font-medium transition-colors shadow-md flex flex-col items-center"
                >
                  <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  CRM
                </Link>
              )}
              
              <Link
                href="/reports"
                className="bg-gray-600 text-white px-6 py-4 rounded-lg hover:bg-gray-700 text-center font-medium transition-colors shadow-md flex flex-col items-center"
              >
                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Reports
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Get Started</h2>
            <p className="text-gray-600 mb-8">Please sign in to access the system</p>
            <div className="flex gap-4 justify-center flex-col sm:flex-row">
              <Link
                href="/auth/signin"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 font-medium transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>&copy; 2025 Hotchpotch Digital Ltd. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}