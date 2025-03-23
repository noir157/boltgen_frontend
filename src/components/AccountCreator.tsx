import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, RefreshCcw, CheckCircle2, XCircle, Copy, Save } from 'lucide-react';
import Typewriter from 'typewriter-effect';
import { AccountManager } from '../services/AccountManager';

interface AccountInfo {
  email: string;
  username: string;
  password: string;
  confirmed: boolean;
}

export const AccountCreator: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState<AccountInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const saveAccount = () => {
    if (!result) return;

    const newAccount = {
      ...result,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    };

    const savedAccounts = JSON.parse(localStorage.getItem('savedAccounts') || '[]');
    const updatedAccounts = [newAccount, ...savedAccounts];
    localStorage.setItem('savedAccounts', JSON.stringify(updatedAccounts));
  };

  const handleCreateAccount = async () => {
    setIsCreating(true);
    setError(null);
    setResult(null);
    setProgress(0);

    let progressInterval: NodeJS.Timeout;

    try {
      const accountManager = new AccountManager();
      const serverOnline = await accountManager.checkServerStatus();
      
      if (!serverOnline) {
        throw new Error('Server is not responding. Please try again later.');
      }

      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return Math.min(prev + 2, 90);
        });
      }, 200);

      const response = await accountManager.createAndConfirmAccount();

      if (response.success && response.accountInfo) {
        setProgress(100);
        setResult(response.accountInfo);
      } else {
        throw new Error(response.error || 'Failed to create account');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setProgress(0);
    } finally {
      clearInterval(progressInterval!);
      setIsCreating(false);
    }
  };

  return (
    <div className="p-6 h-full bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg text-gray-900 dark:text-gray-100">
      {!isCreating && !result && !error && (
        <div className="text-center py-8">
          <Terminal size={48} className="mx-auto mb-6 text-blue-500 animate-bounce-subtle" />
          <div className="terminal-output mb-6 text-gray-600 dark:text-gray-400 min-h-[60px]">
            <Typewriter
              options={{
                strings: [
                  'System ready for account creation...',
                  'All services operational...',
                  'Awaiting your command...'
                ],
                autoStart: true,
                loop: true,
                delay: 50,
                deleteSpeed: 30
              }}
            />
          </div>

          <button
            onClick={handleCreateAccount}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors mx-auto"
          >
            <Terminal size={20} />
            Initialize Account Creation
          </button>
        </div>
      )}

      {isCreating && (
        <div className="text-center py-8">
          <RefreshCcw size={48} className="mx-auto mb-6 text-blue-500 animate-spin" />
          <div className="space-y-4">
            <div className="terminal-output text-gray-600 dark:text-gray-400 min-h-[60px]">
              <Typewriter
                options={{
                  strings: [
                    'Initializing creation sequence...',
                    'Configuring account parameters...',
                    'Establishing secure connection...',
                    'Processing request...'
                  ],
                  autoStart: true,
                  loop: true,
                  delay: 50,
                  deleteSpeed: 30
                }}
              />
            </div>
            <div className="max-w-md mx-auto">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-right text-sm text-gray-500 dark:text-gray-400 mt-2">{progress}%</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-md mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <XCircle size={24} className="text-red-500" />
              <h3 className="text-lg font-semibold text-red-500">Error Detected</h3>
            </div>
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={handleCreateAccount}
              className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors"
            >
              <RefreshCcw size={18} />
              Retry Operation
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 size={24} className="text-green-500" />
            <h3 className="text-lg font-semibold text-green-500">Account Created Successfully</h3>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Email', value: result.email },
              { label: 'Username', value: result.username },
              { label: 'Password', value: result.password }
            ].map(({ label, value }) => (
              <div key={label} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">{label}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={value}
                    className="flex-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
                  />
                  <button
                    onClick={() => copyToClipboard(value, label.toLowerCase())}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Copy size={18} className={copied === label.toLowerCase() ? 'text-green-500' : 'text-gray-400'} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleCreateAccount}
              className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
            >
              <Terminal size={18} />
              Create Another Account
            </button>
            <button
              onClick={saveAccount}
              className="px-6 py-3 bg-green-500 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
            >
              <Save size={18} />
              Save Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
};