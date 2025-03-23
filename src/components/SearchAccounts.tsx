import React, { useState, useMemo } from 'react';
import { Search, Copy } from 'lucide-react';

interface Account {
  id: string;
  email: string;
  username: string;
  password: string;
  created_at: string;
}

export const SearchAccounts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const savedAccounts = localStorage.getItem('savedAccounts');
    return savedAccounts ? JSON.parse(savedAccounts) : [];
  });

  const filteredAccounts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return accounts.filter(account => 
      account.email.toLowerCase().includes(term) ||
      account.username.toLowerCase().includes(term)
    );
  }, [accounts, searchTerm]);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="p-6 h-full bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg text-gray-900 dark:text-gray-100">
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by email or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredAccounts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Search size={48} className="mx-auto mb-4" />
            <p>{searchTerm ? 'No accounts found' : 'Enter a search term to find accounts'}</p>
          </div>
        ) : (
          filteredAccounts.map(account => (
            <div key={account.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{account.username}</span>
                <span className="text-xs text-gray-500">
                  {new Date(account.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Email:</span>
                  <div className="flex items-center gap-2">
                    <span>{account.email}</span>
                    <button
                      onClick={() => copyToClipboard(account.email, `email-${account.id}`)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                      <Copy size={14} className={copied === `email-${account.id}` ? 'text-green-500' : 'text-gray-400'} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Password:</span>
                  <div className="flex items-center gap-2">
                    <span>{account.password}</span>
                    <button
                      onClick={() => copyToClipboard(account.password, `password-${account.id}`)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                      <Copy size={14} className={copied === `password-${account.id}` ? 'text-green-500' : 'text-gray-400'} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};