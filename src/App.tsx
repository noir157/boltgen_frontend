import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Typewriter from 'typewriter-effect';
import {
  Terminal, Circle, CheckCircle2, XCircle, Copy, RefreshCcw, Info,
  AlertCircle, Shield, Key, Mail, User, Clock, ChevronRight, Server,
  Maximize2, Minus, X, FolderOpen, Settings, Trash2, Download, Search,
  Eye, EyeOff, Calendar, Hash, Zap, Menu, FileJson, FileText, FileSpreadsheet
} from 'lucide-react';
import { AccountManager } from './services/AccountManager';
import { log } from './utils/helpers';

interface AccountInfo {
  email: string;
  username: string;
  password: string;
  confirmed: boolean;
  createdAt?: string;
}

interface AccountStats {
  totalCreated: number;
  successRate: number;
  averageTime: number;
}

interface AccountDetailsModalProps {
  account: AccountInfo;
  onClose: () => void;
}

type ExportFormat = 'json' | 'csv' | 'txt';

const AccountDetailsModal: React.FC<AccountDetailsModalProps> = ({ account, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="glass-morphism rounded-xl p-6 max-w-lg w-full mx-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl md:text-2xl font-semibold">Account Details</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <User size={20} className="text-blue-400" />
              </div>
              <div>
                <h4 className="text-base md:text-lg font-semibold">{account.username}</h4>
                <p className="text-xs md:text-sm text-gray-400">Account Information</p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="card">
                <div className="flex items-center gap-2 mb-2">
                  <Mail size={16} className="text-blue-400" />
                  <label className="text-xs md:text-sm text-gray-400">Email Address</label>
                </div>
                <p className="font-mono text-xs md:text-sm break-all">{account.email}</p>
              </div>

              <div className="card">
                <div className="flex items-center gap-2 mb-2">
                  <Key size={16} className="text-yellow-400" />
                  <label className="text-xs md:text-sm text-gray-400">Password</label>
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-xs md:text-sm flex-1 break-all">
                    {showPassword ? account.password : '•'.repeat(account.password.length)}
                  </p>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-2 hover:bg-white/10 rounded-lg"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={16} className="text-purple-400" />
                  <label className="text-xs md:text-sm text-gray-400">Created At</label>
                </div>
                <p className="font-mono text-xs md:text-sm">
                  {new Date(account.createdAt || '').toLocaleString()}
                </p>
              </div>

              <div className="card">
                <div className="flex items-center gap-2 mb-2">
                  <Hash size={16} className="text-emerald-400" />
                  <label className="text-xs md:text-sm text-gray-400">Status</label>
                </div>
                <div className={`status-badge ${account.confirmed ? 'status-badge-success' : 'status-badge-warning'}`}>
                  {account.confirmed ? 'Confirmed' : 'Pending'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

function App() {
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState<AccountInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'create' | 'status' | 'settings' | 'accounts'>('create');
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState<AccountStats>({
    totalCreated: 0,
    successRate: 100,
    averageTime: 0
  });
  const [serverStatus, setServerStatus] = useState<boolean | null>(null);
  const [isCheckingServer, setIsCheckingServer] = useState(true);
  const [savedAccounts, setSavedAccounts] = useState<AccountInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedAccount, setSelectedAccount] = useState<AccountInfo | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('savedAccounts');
    if (saved) {
      setSavedAccounts(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const checkStatus = async () => {
      setIsCheckingServer(true);
      try {
        const accountManager = new AccountManager();
        const status = await accountManager.checkServerStatus();
        setServerStatus(status);
      } catch (error) {
        setServerStatus(false);
      } finally {
        setIsCheckingServer(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateAccount = async () => {
    setIsCreating(true);
    setError(null);
    setResult(null);
    setProgress(0);

    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 2, 90));
    }, 200);

    try {
      const accountManager = new AccountManager();
      const response = await accountManager.createAndConfirmAccount();

      if (response.success && response.accountInfo) {
        const newAccount = {
          ...response.accountInfo,
          createdAt: new Date().toISOString()
        };
        setResult(newAccount);
        setSavedAccounts(prev => {
          const updated = [newAccount, ...prev];
          localStorage.setItem('savedAccounts', JSON.stringify(updated));
          return updated;
        });
        setStats(prev => ({
          totalCreated: prev.totalCreated + 1,
          successRate: ((prev.totalCreated * prev.successRate + 100) / (prev.totalCreated + 1)),
          averageTime: ((prev.averageTime * prev.totalCreated + (Date.now() - startTime)) / (prev.totalCreated + 1))
        }));
        setProgress(100);
      } else {
        throw new Error(response.error || 'Failed to create account');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStats(prev => ({
        ...prev,
        successRate: ((prev.totalCreated * prev.successRate) / (prev.totalCreated + 1))
      }));
    } finally {
      clearInterval(progressInterval);
      setIsCreating(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const deleteAccount = (email: string) => {
    setSavedAccounts(prev => {
      const updated = prev.filter(account => account.email !== email);
      localStorage.setItem('savedAccounts', JSON.stringify(updated));
      return updated;
    });
  };

  const exportAccounts = (format: ExportFormat) => {
    let data: string;
    let mimeType: string;
    let extension: string;

    switch (format) {
      case 'json':
        data = JSON.stringify(savedAccounts, null, 2);
        mimeType = 'application/json';
        extension = 'json';
        break;
      case 'csv':
        const headers = ['email', 'username', 'password', 'confirmed', 'createdAt'];
        const csvContent = [
          headers.join(','),
          ...savedAccounts.map(account => 
            headers.map(header => 
              JSON.stringify(account[header as keyof AccountInfo] || '')
            ).join(',')
          )
        ].join('\n');
        data = csvContent;
        mimeType = 'text/csv';
        extension = 'csv';
        break;
      case 'txt':
        data = savedAccounts.map(account => 
          `Email: ${account.email}\nUsername: ${account.username}\nPassword: ${account.password}\nConfirmed: ${account.confirmed}\nCreated At: ${account.createdAt}\n\n`
        ).join('---\n\n');
        mimeType = 'text/plain';
        extension = 'txt';
        break;
      default:
        return;
    }

    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bolt-accounts.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredAccounts = savedAccounts.filter(account =>
    account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 glass-morphism z-50 flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden p-2 hover:bg-white/10 rounded-lg"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <Menu size={24} />
          </button>
          <div className="flex gap-2">
            <Zap size={20} className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer" />
          </div>
          <h1 className="text-lg font-semibold hidden md:block">Bolt Account Manager</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Server size={16} className={serverStatus ? 'text-green-400' : 'text-red-400'} />
            <span className="text-sm hidden md:inline">{serverStatus ? 'Connected' : 'Disconnected'}</span>
          </div>
          <div className="text-sm font-mono hidden md:block">{currentTime.toLocaleTimeString()}</div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="fixed top-16 left-0 bottom-0 w-64 glass-morphism z-40 md:hidden"
          >
            <div className="p-4 space-y-2">
              {[
                { id: 'create', icon: Terminal, label: 'Create Account' },
                { id: 'accounts', icon: FolderOpen, label: 'Saved Accounts' },
                { id: 'status', icon: Info, label: 'Status' },
                { id: 'settings', icon: Settings, label: 'Settings' }
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => {
                    setActiveTab(id as typeof activeTab);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-200 ${
                    activeTab === id 
                      ? 'bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/10' 
                      : 'hover:bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-6">
            {/* Sidebar - Desktop */}
            <nav className="w-64 glass-morphism rounded-xl p-4 h-[calc(100vh-8rem)] fixed hidden md:block">
              <div className="space-y-2">
                {[
                  { id: 'create', icon: Terminal, label: 'Create Account' },
                  { id: 'accounts', icon: FolderOpen, label: 'Saved Accounts' },
                  { id: 'status', icon: Info, label: 'Status' },
                  { id: 'settings', icon: Settings, label: 'Settings' }
                ].map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as typeof activeTab)}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-200 ${
                      activeTab === id 
                        ? 'bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/10' 
                        : 'hover:bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </nav>

            {/* Content Area */}
            <div className="md:ml-80 w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="glass-morphism rounded-xl p-4 md:p-6"
                >
                  {/* Tab Content */}
                  {activeTab === 'create' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl md:text-2xl font-semibold">Create New Account</h2>
                      </div>
                      
                      {!isCreating && !result && !error && (
                        <div className="text-center py-8 md:py-12">
                          <Terminal size={48} className="mx-auto mb-6 text-blue-400 animate-float" />
                          <div className="terminal-output mb-6">
                            <Typewriter
                              options={{
                                strings: [
                                  'System ready for account creation...',
                                  'All services operational...',
                                  'Awaiting your command...'
                                ],
                                autoStart: true,
                                loop: true,
                                delay: 50
                              }}
                            />
                          </div>

                          <button
                            onClick={handleCreateAccount}
                            disabled={!serverStatus}
                            className="btn btn-primary mx-auto"
                          >
                            <Terminal size={20} />
                            Initialize Account Creation
                          </button>
                        </div>
                      )}

                      {isCreating && (
                        <div className="text-center py-8 md:py-12">
                          <RefreshCcw size={48} className="mx-auto mb-6 text-blue-400 animate-spin" />
                          <div className="space-y-4">
                            <div className="terminal-output">
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
                                  delay: 50
                                }}
                              />
                            </div>
                            <div className="max-w-md mx-auto">
                              <div className="progress-bar">
                                <motion.div
                                  className="progress-bar-fill"
                                  animate={{ width: `${progress}%` }}
                                />
                              </div>
                              <p className="text-right text-sm text-gray-400 mt-2">{progress}%</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {error && (
                        <div className="max-w-md mx-auto">
                          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 md:p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <XCircle size={24} className="text-red-400" />
                              <h3 className="text-lg font-semibold text-red-400">Error Detected</h3>
                            </div>
                            <p className="text-red-400 mb-4">{error}</p>
                            <button
                              onClick={() => setError(null)}
                              className="btn btn-danger"
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
                            <CheckCircle2 size={24} className="text-green-400" />
                            <h3 className="text-lg font-semibold text-green-400">Account Created Successfully</h3>
                          </div>

                          <div className="space-y-4">
                            {[
                              { icon: Mail, label: 'Email', value: result.email, color: 'blue' },
                              { icon: User, label: 'Username', value: result.username, color: 'purple' },
                              { icon: Key, label: 'Password', value: result.password, color: 'yellow' }
                            ].map(({ icon: Icon, label, value, color }) => (
                              <div key={label} className="card">
                                <div className="flex items-center gap-2 mb-2">
                                  <Icon size={16} className={`text-${color}-400`} />
                                  <label className="text-sm text-gray-400">{label}</label>
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    readOnly
                                    value={value}
                                    className="input flex-1 text-xs md:text-sm"
                                  />
                                  <button
                                    onClick={() => copyToClipboard(value, label.toLowerCase())}
                                    className="btn btn-secondary p-2"
                                  >
                                    <Copy size={18} className={copied === label.toLowerCase() ? 'text-green-400' : 'text-gray-400'} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex flex-col md:flex-row gap-4 mt-6">
                            <button
                              onClick={handleCreateAccount}
                              className="btn btn-primary flex-1"
                            >
                              <Terminal size={18} />
                              Create Another
                            </button>
                            <button
                              onClick={() => setActiveTab('accounts')}
                              className="btn btn-secondary flex-1"
                            >
                              <FolderOpen size={18} />
                              View All Accounts
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'accounts' && (
                    <div>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <h2 className="text-xl md:text-2xl font-semibold">Saved Accounts</h2>
                        <div className="relative w-full md:w-auto">
                          <div className="search-icon-wrapper">
                            <Search size={18} />
                          </div>
                          <input
                            type="text"
                            placeholder="Search accounts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input search-input w-full md:w-64"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        {filteredAccounts.map((account) => (
                          <motion.div
                            key={account.email}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card"
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                                  <User size={20} className="text-blue-400" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-sm md:text-base">{account.username}</h3>
                                  <p className="text-xs md:text-sm text-gray-400 break-all">{account.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setSelectedAccount(account)}
                                  className="btn btn-secondary p-2"
                                >
                                  <Info size={18} />
                                </button>
                                <button
                                  onClick={() => copyToClipboard(account.password, `password-${account.email}`)}
                                  className="btn btn-secondary p-2"
                                >
                                  <Key size={18} className={copied === `password-${account.email}` ? 'text-green-400' : 'text-gray-400'} />
                                </button>
                                <button
                                  onClick={() => deleteAccount(account.email)}
                                  className="btn btn-danger p-2"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'status' && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl md:text-2xl font-semibold">System Status</h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                        {[
                          { icon: Shield, label: 'Total Created', value: stats.totalCreated, color: 'green' },
                          { icon: AlertCircle, label: 'Success Rate', value: `${stats.successRate.toFixed(1)}%`, color: 'yellow' },
                          { icon: Clock, label: 'Avg. Time', value: stats.averageTime > 0 ? `${(stats.averageTime / 1000).toFixed(1)}s` : 'N/A', color: 'blue' }
                        ].map(({ icon: Icon, label, value, color }) => (
                          <div key={label} className="card">
                            <div className="flex items-center gap-2 mb-2">
                              <Icon size={20} className={`text-${color}-400`} />
                              <h3 className="text-gray-400">{label}</h3>
                            </div>
                            <p className="text-xl md:text-2xl font-mono text-white">{value}</p>
                          </div>
                        ))}
                      </div>

                      <div className="card">
                        <div className="flex items-center gap-2 mb-2">
                          <Server size={20} className={serverStatus ? 'text-green-400' : 'text-red-400'} />
                          <h3 className="text-gray-400">Server Status</h3>
                        </div>
                        <div className={`status-badge ${serverStatus ? 'status-badge-success' : 'status-badge-error'}`}>
                          {serverStatus ? 'Online' : 'Offline'}
                        </div>
                        {!serverStatus && (
                          <p className="mt-4 text-red-400">
                            Server is currently unavailable. Please try again later.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'settings' && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl md:text-2xl font-semibold">Settings</h2>
                      </div>

                      <div className="space-y-6">
                        <div className="card">
                          <h3 className="text-lg font-semibold mb-4">Account Management</h3>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to clear all saved accounts?')) {
                                setSavedAccounts([]);
                                localStorage.removeItem('savedAccounts');
                              }
                            }}
                            className="btn btn-danger w-full md:w-auto"
                          >
                            <Trash2 size={18} />
                            Clear All Saved Accounts
                          </button>
                        </div>

                        <div className="card">
                          <h3 className="text-lg font-semibold mb-4">Export Accounts</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                              onClick={() => exportAccounts('json')}
                              className="btn btn-primary w-full"
                            >
                              <FileJson size={18} />
                              Export as JSON
                            </button>
                            <button
                              onClick={() => exportAccounts('csv')}
                              className="btn btn-primary w-full"
                            >
                              <FileSpreadsheet size={18} />
                              Export as CSV
                            </button>
                            <button
                              onClick={() => exportAccounts('txt')}
                              className="btn btn-primary w-full"
                            >
                              <FileText size={18} />
                              Export as TXT
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {selectedAccount && (
          <AccountDetailsModal
            account={selectedAccount}
            onClose={() => setSelectedAccount(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;