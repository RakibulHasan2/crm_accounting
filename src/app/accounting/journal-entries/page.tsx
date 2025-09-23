'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Account {
  _id: string;
  accountCode: string;
  accountName: string;
  accountType: string;
}

interface JournalEntry {
  _id: string;
  journalNumber: string;
  description: string;
  entryDate: string;
  status: 'draft' | 'posted' | 'reversed';
  entries: JournalEntryLine[];
  totalDebit: number | string;
  totalCredit: number | string;
  createdBy: string;
  createdAt: string;
  postedAt?: string;
  reversedAt?: string;
}

interface JournalEntryLine {
  _id?: string;
  account: string;
  accountCode?: string;
  accountName?: string;
  description: string;
  debit: number | null;
  credit: number | null;
}

export default function JournalEntries() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    limit: 10
  });

  const { current: currentPage, limit: pageLimit } = pagination;

  const fetchJournalEntries = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageLimit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter })
      });

      const response = await fetch(`/api/accounting/journal-entries?${params}`);
      if (response.ok) {
        const data = await response.json();
        setJournalEntries(data.journalEntries || []);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching journal entries:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageLimit, searchTerm, statusFilter]);

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/accounting/chart-of-accounts');
      if (response.ok) {
        const data = await response.json();
        setAccounts(data.accounts || []);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || !['admin', 'accountant', 'manager'].includes(session.user.role)) {
      router.push('/auth/signin');
      return;
    }

    fetchJournalEntries();
    fetchAccounts();
  }, [session, status, router, fetchJournalEntries]);

  const handleCreateEntry = async (entryData: Partial<JournalEntry>) => {
    try {
      const response = await fetch('/api/accounting/journal-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entryData)
      });

      if (response.ok) {
        setShowCreateModal(false);
        fetchJournalEntries();
        alert('Journal entry created successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error creating journal entry:', error);
      alert('Error creating journal entry');
    }
  };

  const handleUpdateEntry = async (entryId: string, updates: Partial<JournalEntry>) => {
    try {
      const response = await fetch(`/api/accounting/journal-entries/${entryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        setEditingEntry(null);
        fetchJournalEntries();
        alert('Journal entry updated successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating journal entry:', error);
      alert('Error updating journal entry');
    }
  };

  const handlePostEntry = async (entryId: string) => {
    if (!confirm('Are you sure you want to post this journal entry? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/accounting/journal-entries/${entryId}/post`, {
        method: 'POST'
      });

      if (response.ok) {
        fetchJournalEntries();
        alert('Journal entry posted successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error posting journal entry:', error);
      alert('Error posting journal entry');
    }
  };

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numAmount || 0);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-yellow-100 text-yellow-800',
      posted: 'bg-green-100 text-green-800',
      reversed: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
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
              <h1 className="text-xl font-semibold text-gray-900">Journal Entries</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {session?.user.name}</span>
              <button
                onClick={() => router.push('/accounting/chart-of-accounts')}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Chart of Accounts
              </button>
              <button
                onClick={() => router.push('/')}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Home
              </button>
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
          {/* Header Actions */}
          <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-2xl font-bold text-gray-900">Journal Entries</h2>
              <p className="text-gray-600">Create and manage journal entries with double-entry bookkeeping</p>
            </div>
            {session?.user.role !== 'auditor' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
              >
                New Journal Entry
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <input
                type="text"
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="posted">Posted</option>
                <option value="reversed">Reversed</option>
              </select>
            </div>
            <div>
              <button
                onClick={fetchJournalEntries}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Journal Entries Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Journal #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
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
                  {journalEntries.map((entry) => (
                    <tr key={entry._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {entry.journalNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(entry.entryDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-xs truncate">{entry.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(entry.totalDebit)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                          {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingEntry(entry)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View/Edit
                          </button>
                          {entry.status === 'draft' && session?.user.role !== 'auditor' && (
                            <button
                              onClick={() => handlePostEntry(entry._id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Post
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, current: Math.max(1, prev.current - 1) }))}
                  disabled={pagination.current === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, current: Math.min(prev.pages, prev.current + 1) }))}
                  disabled={pagination.current === pagination.pages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{((pagination.current - 1) * pagination.limit) + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(pagination.current * pagination.limit, pagination.total)}</span> of{' '}
                    <span className="font-medium">{pagination.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setPagination(prev => ({ ...prev, current: page }))}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === pagination.current
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Journal Entry Modal */}
      {showCreateModal && (
        <JournalEntryModal
          entry={null}
          accounts={accounts}
          onSave={handleCreateEntry}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {/* Edit Journal Entry Modal */}
      {editingEntry && (
        <JournalEntryModal
          entry={editingEntry}
          accounts={accounts}
          onSave={(data) => handleUpdateEntry(editingEntry._id, data)}
          onClose={() => setEditingEntry(null)}
        />
      )}
    </div>
  );
}

// Journal Entry Modal Component
function JournalEntryModal({ 
  entry, 
  accounts, 
  onSave, 
  onClose 
}: { 
  entry: JournalEntry | null; 
  accounts: Account[];
  onSave: (data: Partial<JournalEntry>) => void; 
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    description: entry?.description || '',
    entryDate: entry?.entryDate ? entry.entryDate.split('T')[0] : new Date().toISOString().split('T')[0],
    entries: entry?.entries || [
      { account: '', description: '', debit: null, credit: null },
      { account: '', description: '', debit: null, credit: null }
    ]
  });

  const addEntryLine = () => {
    setFormData(prev => ({
      ...prev,
      entries: [...prev.entries, { account: '', description: '', debit: null, credit: null }]
    }));
  };

  const removeEntryLine = (index: number) => {
    if (formData.entries.length > 2) {
      setFormData(prev => ({
        ...prev,
        entries: prev.entries.filter((_, i) => i !== index)
      }));
    }
  };

  const updateEntryLine = (index: number, field: string, value: string | number | null) => {
    setFormData(prev => ({
      ...prev,
      entries: prev.entries.map((line, i) => 
        i === index ? { ...line, [field]: value } : line
      )
    }));
  };

  const totalDebit = formData.entries.reduce((sum, line) => {
    const debitValue = line.debit ? parseFloat(line.debit.toString()) : 0;
    return sum + (debitValue || 0);
  }, 0);
  
  const totalCredit = formData.entries.reduce((sum, line) => {
    const creditValue = line.credit ? parseFloat(line.credit.toString()) : 0;
    return sum + (creditValue || 0);
  }, 0);
  
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isBalanced) {
      alert('Debits and credits must be equal');
      return;
    }

    if (formData.entries.some(line => !line.account || ((!line.debit || line.debit === 0) && (!line.credit || line.credit === 0)))) {
      alert('All lines must have an account and either a debit or credit amount');
      return;
    }

    // Transform the data for API - convert null to 0 for debit/credit
    const apiData = {
      ...formData,
      entries: formData.entries.map(line => ({
        ...line,
        debit: line.debit || 0,
        credit: line.credit || 0
      }))
    };

    onSave(apiData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 mx-auto p-5 border max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {entry ? 'Edit Journal Entry' : 'Create New Journal Entry'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Journal entry description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Entry Date</label>
                <input
                  type="date"
                  required
                  value={formData.entryDate}
                  onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Journal Entry Lines */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-md font-medium text-gray-900">Journal Entry Lines</h4>
                <button
                  type="button"
                  onClick={addEntryLine}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                >
                  Add Line
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Debit</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Credit</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.entries.map((line, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2">
                          <select
                            value={line.account}
                            onChange={(e) => updateEntryLine(index, 'account', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required
                          >
                            <option value="">Select Account</option>
                            {accounts.map(account => (
                              <option key={account._id} value={account._id}>
                                {account.accountCode} - {account.accountName}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={line.description}
                            onChange={(e) => updateEntryLine(index, 'description', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Line description"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={line.debit ? line.debit.toString() : ''}
                            onChange={(e) => {
                              const value = e.target.value === '' ? null : parseFloat(e.target.value);
                              updateEntryLine(index, 'debit', value);
                              if (value && value > 0) {
                                updateEntryLine(index, 'credit', null);
                              }
                            }}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={line.credit ? line.credit.toString() : ''}
                            onChange={(e) => {
                              const value = e.target.value === '' ? null : parseFloat(e.target.value);
                              updateEntryLine(index, 'credit', value);
                              if (value && value > 0) {
                                updateEntryLine(index, 'debit', null);
                              }
                            }}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </td>
                        <td className="px-3 py-2">
                          {formData.entries.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeEntryLine(index)}
                              className="text-red-600 hover:text-red-900 text-sm"
                            >
                              Remove
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={2} className="px-3 py-2 text-sm font-medium text-gray-900">Totals:</td>
                      <td className="px-3 py-2 text-sm font-medium text-gray-900">${totalDebit.toFixed(2)}</td>
                      <td className="px-3 py-2 text-sm font-medium text-gray-900">${totalCredit.toFixed(2)}</td>
                      <td className="px-3 py-2">
                        {isBalanced ? (
                          <span className="text-green-600 text-sm">✓ Balanced</span>
                        ) : (
                          <span className="text-red-600 text-sm">⚠ Unbalanced</span>
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
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
                disabled={!isBalanced}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {entry ? 'Update' : 'Create'} Entry
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}