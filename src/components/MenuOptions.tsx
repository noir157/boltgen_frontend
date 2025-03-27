import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  LogOut,
  Save,
  Copy,
  Terminal,
  RefreshCw,
  HelpCircle,
  User,
  Shield,
  Download,
  Upload,
  FileText,
  FolderOpen,
  Search,
  Info,
  ExternalLink,
  Github,
  Mail
} from 'lucide-react';
import { useStore } from '../store';
import { AccountCreator } from './AccountCreator';
import { SavedAccounts } from './SavedAccounts';
import { SearchAccounts } from './SearchAccounts';
import { SystemSettings } from './SystemSettings';
import { useTranslation } from 'react-i18next';

interface MenuOption {
  id: number;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  shortcut?: string;
  divider?: boolean;
}

interface MenuOptionsProps {
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number };
  title: string;
}

export const MenuOptions: React.FC<MenuOptionsProps> = ({ 
  isOpen, 
  onClose, 
  position,
  title
}) => {
  const [activeOption, setActiveOption] = useState<number | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { addWindow, systemSettings, lockSystem } = useStore();
  const { t } = useTranslation();

  const handleOptionClick = (option: MenuOption) => {
    setActiveOption(option.id);
    option.action();
    onClose();
  };

  const exportAccounts = () => {
    const accounts = JSON.parse(localStorage.getItem('savedAccounts') || '[]');
    const dataStr = JSON.stringify(accounts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bolt-accounts.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importAccounts = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedAccounts = JSON.parse(e.target?.result as string);
            const existingAccounts = JSON.parse(localStorage.getItem('savedAccounts') || '[]');
            
            const mergedAccounts = [...existingAccounts];
            importedAccounts.forEach((imported: any) => {
              if (!mergedAccounts.some(existing => existing.email === imported.email)) {
                mergedAccounts.push(imported);
              }
            });
            
            localStorage.setItem('savedAccounts', JSON.stringify(mergedAccounts));
            
            addWindow({
              title: t('windows.savedAccounts'),
              content: <SavedAccounts />,
              position: { x: 150, y: 150 },
              size: { width: 500, height: 600 },
              isMinimized: false,
              isMaximized: false
            });
          } catch (error) {
            console.error('Error importing accounts:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    
    input.click();
  };

  const getMenuOptions = (): { [key: string]: MenuOption[] } => ({
    [t('menu.account')]: [
      {
        id: 1,
        label: t('actions.create'),
        icon: <Terminal size={16} />,
        action: () => addWindow({
          title: t('windows.accountCreator'),
          content: <AccountCreator />,
          position: { x: 100, y: 100 },
          size: { width: 600, height: 500 },
          isMinimized: false,
          isMaximized: false
        }),
        shortcut: "⌘N"
      },
      {
        id: 2,
        label: t('actions.save'),
        icon: <Save size={16} />,
        action: () => addWindow({
          title: t('windows.savedAccounts'),
          content: <SavedAccounts />,
          position: { x: 150, y: 150 },
          size: { width: 500, height: 600 },
          isMinimized: false,
          isMaximized: false
        }),
        shortcut: "⌘S",
        divider: true
      },
      {
        id: 4,
        label: t('actions.signOut'),
        icon: <LogOut size={16} />,
        action: () => lockSystem(),
        shortcut: "⌘Q"
      }
    ],
    [t('menu.tools')]: [
      {
        id: 6,
        label: t('actions.import'),
        icon: <Upload size={16} />,
        action: importAccounts,
        shortcut: "⌘I"
      },
      {
        id: 7,
        label: t('actions.export'),
        icon: <Download size={16} />,
        action: exportAccounts,
        shortcut: "⌘E",
        divider: true
      },
      {
        id: 8,
        label: t('actions.search'),
        icon: <Search size={16} />,
        action: () => addWindow({
          title: t('windows.searchAccounts'),
          content: <SearchAccounts />,
          position: { x: 200, y: 200 },
          size: { width: 600, height: 500 },
          isMinimized: false,
          isMaximized: false
        }),
        shortcut: "⌘F"
      }
    ],
    [t('menu.settings')]: [
      {
        id: 9,
        label: t('actions.preferences'),
        icon: <Settings size={16} />,
        action: () => addWindow({
          title: t('windows.systemSettings'),
          content: <SystemSettings />,
          position: { x: 200, y: 200 },
          size: { width: 700, height: 500 },
          isMinimized: false,
          isMaximized: false
        }),
        shortcut: "⌘,"
      }
    ],
    [t('menu.help')]: [
      {
        id: 12,
        label: "GitHub Repository",
        icon: <Github size={16} />,
        action: () => window.open('https://github.com/noir157', '_blank'),
        divider: true
      },
      {
        id: 14,
        label: "About",
        icon: <Info size={16} />,
        action: () => addWindow({
          title: 'About',
          content: (
            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold mb-2">Bolt Account Creator</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Version 1.0.1</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                © 2025 Noir. All rights reserved.
              </p>
            </div>
          ),
          position: { x: 250, y: 250 },
          size: { width: 400, height: 300 },
          isMinimized: false,
          isMaximized: false
        })
      }
    ]
  });

  const menuOptions = getMenuOptions();
  const translatedTitle = Object.keys(menuOptions).find(key => key === title) || title;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            style={{
              position: 'fixed',
              left: position.x,
              top: position.y,
              zIndex: 51
            }}
            className="w-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-lg shadow-xl border border-white/20 dark:border-white/10 overflow-hidden"
          >
            <div className="px-3 py-2 bg-white/50 dark:bg-gray-900/50 border-b border-white/10 dark:border-white/5">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">{translatedTitle}</h3>
            </div>
            <div className="py-1">
              {menuOptions[translatedTitle]?.map((option) => (
                <React.Fragment key={option.id}>
                  <motion.button
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    onClick={() => handleOptionClick(option)}
                    className={`w-full px-3 py-1.5 flex items-center justify-between text-sm ${
                      activeOption === option.id
                        ? 'bg-blue-500/10 text-blue-500'
                        : 'text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {option.icon}
                      <span>{option.label}</span>
                    </div>
                    {option.shortcut && (
                      <span className="text-xs text-gray-400">{option.shortcut}</span>
                    )}
                  </motion.button>
                  {option.divider && (
                    <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};