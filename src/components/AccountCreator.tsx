import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, RefreshCcw, CheckCircle2, XCircle, Copy, Save } from 'lucide-react';
import Typewriter from 'typewriter-effect';
import { AccountManager } from '../services/AccountManager';
import { useStore } from '../store';
import { useTranslation } from 'react-i18next';

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
  const [copied, setCopied] = React.useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const { addNotification, systemSettings } = useStore();
  const { t } = useTranslation();

  const successSound = new Audio('/success.mp3');
  successSound.volume = systemSettings.soundVolume / 100;

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
      addNotification({
        title: t('notifications.copied'),
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} ${t('notifications.copied').toLowerCase()}`,
        type: 'success'
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      addNotification({
        title: t('error.copyFailed'),
        message: t('error.copyFailedMessage'),
        type: 'error'
      });
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
    
    addNotification({
      title: t('notifications.accountSaved'),
      message: t('notifications.accountSavedMessage'),
      type: 'success'
    });
  };

  useEffect(() => {
    if (result && systemSettings.autoSave) {
      saveAccount();
    }
  }, [result, systemSettings.autoSave]);

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
        throw new Error(t('error.serverOffline'));
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
        
        try {
          // Play success sound for account creation
          if (systemSettings.soundEnabled) {
            await successSound.play();
          }
        } catch (err) {
          console.error('Failed to play success sound:', err);
        }
        
        addNotification({
          title: t('notifications.accountCreated'),
          message: t('notifications.accountCreatedMessage'),
          type: 'success',
          skipSound: true // Skip notification sound for account creation since we play success sound
        });
      } else {
        throw new Error(response.error || t('error.accountCreationFailed'));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('error.unknown');
      setError(errorMessage);
      setProgress(0);
      addNotification({
        title: t('error.accountCreationFailed'),
        message: errorMessage,
        type: 'error'
      });
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
                  t('creator.ready'),
                  t('creator.operational'),
                  t('creator.waiting')
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
            {t('actions.create')}
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
                    t('creator.initializing'),
                    t('creator.configuring'),
                    t('creator.connecting'),
                    t('creator.processing')
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
              <h3 className="text-lg font-semibold text-red-500">{t('error.detected')}</h3>
            </div>
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={handleCreateAccount}
              className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors"
            >
              <RefreshCcw size={18} />
              {t('common.retry')}
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 size={24} className="text-green-500" />
            <h3 className="text-lg font-semibold text-green-500">{t('success.accountCreated')}</h3>
          </div>

          <div className="space-y-4">
            {[
              { label: t('common.email'), value: result.email },
              { label: t('common.username'), value: result.username },
              { label: t('common.password'), value: result.password }
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
              {t('actions.createAnother')}
            </button>
            {!systemSettings.autoSave && (
              <button
                onClick={saveAccount}
                className="px-6 py-3 bg-green-500 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
              >
                <Save size={18} />
                {t('actions.save')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};