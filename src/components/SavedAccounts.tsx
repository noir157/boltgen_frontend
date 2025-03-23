import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Trash2, Save } from 'lucide-react';

interface SavedAccount {
  id: string;
  email: string;
  username: string;
  password: string;
  created_at: string;
}

export const SavedAccounts: React.FC = () => {
  const [savedAccounts, setSavedAccounts] = React.useState<SavedAccount[]>([]);
  const [copied, setCopied] = React.useState<string | null>(null);

  React.useEffect(() => {
    loadSavedAccounts();
  }, []);

  const loadSavedAccounts = () => {
    const accounts = localStorage.getItem('savedAccounts');
    if (accounts) {
      setSavedAccounts(JSON.parse(accounts));
    }
  };

  const deleteAccount = (id: string) => {
    const updatedAccounts = savedAccounts.filter(account => account.id !== id);
    localStorage.setItem('savedAccounts', JSON.stringify(updatedAccounts));
    setSavedAccounts(updatedAccounts);
  };

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
      <h2 className="text-xl font-semibold mb-6">Saved Accounts</h2>
      
      {savedAccounts.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Save size={48} className="mx-auto mb-4 text-gray-400 dark:text-gray-500" />
          <p>No saved accounts yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {savedAccounts.map((account) => (
            <div key={account.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900 dark:text-gray-100">{account.username}</span>
                <button
                  onClick={() => deleteAccount(account.id)}
                  className="text-red-500 hover:text-red-600 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Email:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900 dark:text-gray-100">{account.email}</span>
                    <button
                      onClick={() => copyToClipboard(account.email, `saved-email-${account.id}`)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                      <Copy size={14} className={copied === `saved-email-${account.id}` ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Password:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900 dark:text-gray-100">{account.password}</span>
                    <button
                      onClick={() => copyToClipboard(account.password, `saved-password-${account.id}`)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                      <Copy size={14} className={copied === `saved-password-${account.id}` ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Created: {new Date(account.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};