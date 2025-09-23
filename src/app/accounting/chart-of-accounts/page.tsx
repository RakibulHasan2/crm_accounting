'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Account {
  _id: string;
  accountCode: string;
  accountName: string;
  accountType: 'asset' | 'liability' | 'equity' | 'income' | 'expense';
  accountSubType: string;
  parentAccount?: string;
  level: number;
  isActive: boolean;
  balance: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ChartOfAccounts() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const fetchAccounts = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        ...(searchTerm && { search: searchTerm }),
        ...(typeFilter && { type: typeFilter })
      });

      const response = await fetch(`/api/accounting/chart-of-accounts?${params}`);
      if (response.ok) {
        const data = await response.json();
        setAccounts(data.accounts || []);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, typeFilter]);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || !['admin', 'accountant', 'manager'].includes(session.user.role)) {
      router.push('/auth/signin');
      return;
    }

    fetchAccounts();
  }, [session, status, router, fetchAccounts]);

  const handleCreateAccount = async (accountData: Partial<Account>) => {
    console.log(accountData)
    try {
      const response = await fetch('/api/accounting/chart-of-accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountData)
      });

      if (response.ok) {
        setShowCreateModal(false);
        fetchAccounts();
        alert('Account created successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error creating account:', error);
      alert('Error creating account');
    }
  };

  const handleUpdateAccount = async (accountId: string, updates: Partial<Account>) => {
    try {
      const response = await fetch(`/api/accounting/chart-of-accounts/${accountId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        setEditingAccount(null);
        fetchAccounts();
        alert('Account updated successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating account:', error);
      alert('Error updating account');
    }
  };

  const getAccountTypeColor = (type: string) => {
    const colors = {
      assets: 'bg-green-100 text-green-800',
      liabilities: 'bg-red-100 text-red-800',
      equity: 'bg-blue-100 text-blue-800',
      revenue: 'bg-purple-100 text-purple-800',
      expenses: 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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
              <h1 className="text-xl font-semibold text-gray-900">Chart of Accounts</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {session?.user.name}</span>
              <button
                onClick={() => router.push('/')}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header Actions */}
          <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-2xl font-bold text-gray-900">Accounts Management</h2>
              <p className="text-gray-600">Manage your chart of accounts and account structure</p>
            </div>
            {session?.user.role !== 'auditor' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
              >
                Create Account
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <input
                type="text"
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Account Types</option>
                <option value="asset">Assets</option>
                <option value="liability">Liabilities</option>
                <option value="equity">Equity</option>
                <option value="income">Income</option>
                <option value="expense">Expenses</option>
              </select>
            </div>
            <div>
              <button
                onClick={fetchAccounts}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Account Summary Cards */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
            {['assets', 'liabilities', 'equity', 'revenue', 'expenses'].map(type => {
              const typeAccounts = accounts.filter(acc => acc.accountType === type);
              const totalBalance = typeAccounts.reduce((sum, acc) => sum + acc.balance, 0);
              
              return (
                <div key={type} className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 capitalize">{type}</p>
                      <p className="text-lg font-semibold text-gray-900">{formatCurrency(totalBalance)}</p>
                      <p className="text-xs text-gray-500">{typeAccounts.length} accounts</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Accounts Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {accounts.map((account) => (
                    <tr key={account._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {account.accountCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div style={{ paddingLeft: `${account.level * 20}px` }}>
                          <span className="text-sm text-gray-900">{account.accountName}</span>
                          {account.description && (
                            <p className="text-xs text-gray-500">{account.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getAccountTypeColor(account.accountType)}`}>
                          {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(account.balance)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          account.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {account.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingAccount(account)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            className="text-green-600 hover:text-green-900"
                          >
                            Ledger
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Create Account Modal */}
      {showCreateModal && (
        <AccountModal
          account={null}
          onSave={handleCreateAccount}
          onClose={() => setShowCreateModal(false)}
          accounts={accounts}
        />
      )}

      {/* Edit Account Modal */}
      {editingAccount && (
        <AccountModal
          account={editingAccount}
          onSave={(data) => handleUpdateAccount(editingAccount._id, data)}
          onClose={() => setEditingAccount(null)}
          accounts={accounts}
        />
      )}
    </div>
  );
}

// Account Modal Component
function AccountModal({ 
  account, 
  onSave, 
  onClose, 
  accounts 
}: { 
  account: Account | null; 
  onSave: (data: Partial<Account>) => void; 
  onClose: () => void;
  accounts: Account[];
}) {
  const [formData, setFormData] = useState({
    accountCode: account?.accountCode || '',
    accountName: account?.accountName || '',
    accountType: account?.accountType || 'asset',
    accountSubType: account?.accountSubType || '',
    parentAccount: account?.parentAccount || '',
    description: account?.description || '',
    isActive: account?.isActive ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {account ? 'Edit Account' : 'Create New Account'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Code</label>
              <input
                type="text"
                required
                value={formData.accountCode}
                onChange={(e) => setFormData({ ...formData, accountCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 1000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
              <input
                type="text"
                required
                value={formData.accountName}
                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Cash in Bank"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
              <select
                value={formData.accountType}
                onChange={(e) => setFormData({ ...formData, accountType: e.target.value as Account['accountType'], accountSubType: '' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="asset">Asset</option>
                <option value="liability">Liability</option>
                <option value="equity">Equity</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Sub-Type</label>
              <select
                value={formData.accountSubType}
                onChange={(e) => setFormData({ ...formData, accountSubType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Sub-Type</option>
                {formData.accountType === 'asset' && (
                  <>
                    <option value="current_asset">Current Asset</option>
                    <option value="fixed_asset">Fixed Asset</option>
                    <option value="other_asset">Other Asset</option>
                  </>
                )}
                {formData.accountType === 'liability' && (
                  <>
                    <option value="current_liability">Current Liability</option>
                    <option value="long_term_liability">Long-term Liability</option>
                    <option value="other_liability">Other Liability</option>
                  </>
                )}
                {formData.accountType === 'equity' && (
                  <>
                    <option value="owner_equity">Owner&apos;s Equity</option>
                    <option value="retained_earnings">Retained Earnings</option>
                  </>
                )}
                {formData.accountType === 'income' && (
                  <>
                    <option value="revenue">Revenue</option>
                    <option value="other_income">Other Income</option>
                  </>
                )}
                {formData.accountType === 'expense' && (
                  <>
                    <option value="cost_of_goods_sold">Cost of Goods Sold</option>
                    <option value="operating_expense">Operating Expense</option>
                    <option value="other_expense">Other Expense</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent Account (Optional)</label>
              <select
                value={formData.parentAccount}
                onChange={(e) => setFormData({ ...formData, parentAccount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">None (Top Level)</option>
                {accounts
                  .filter(acc => acc.accountType === formData.accountType && acc._id !== account?._id)
                  .map(acc => (
                    <option key={acc._id} value={acc._id}>
                      {acc.accountCode} - {acc.accountName}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Account description..."
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Active Account
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {account ? 'Update' : 'Create'} Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}