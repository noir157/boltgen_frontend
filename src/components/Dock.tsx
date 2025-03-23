import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal,
  Settings,
  UserPlus,
  Users
} from 'lucide-react';
import { useStore } from '../store';
import { AccountCreator } from './AccountCreator';
import { SystemSettings } from './SystemSettings';
import { SavedAccounts } from './SavedAccounts';

const DockItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isPinned?: boolean;
  isActive?: boolean;
  onClick?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  showPreview?: boolean;
  window?: any;
}> = ({ icon, label, isPinned = false, isActive = false, onClick, onContextMenu, showPreview = false, window }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div
      className="relative group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <motion.button
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        onContextMenu={onContextMenu}
        className={`w-12 h-12 bg-white/20 dark:bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white hover:bg-white/30 dark:hover:bg-white/20 transition-colors duration-200 shadow-lg border border-white/20`}
      >
        {icon}
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-50"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Window Preview */}
      {showPreview && showTooltip && window && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-12 bg-gray-900/90 rounded-lg overflow-hidden shadow-xl z-50 backdrop-blur-xl border border-white/10"
        >
          <div className="w-64">
            {/* Window Title Bar */}
            <div className="px-3 py-2 bg-gray-800/50 border-b border-white/10 flex items-center space-x-2">
              <div className="flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              </div>
              <span className="text-xs text-gray-300 ml-2">{window.title}</span>
            </div>
            
            {/* Window Content Preview */}
            <div className="h-32 bg-gray-800/30 p-3">
              <div className="w-full h-full rounded border border-white/5 flex items-center justify-center text-gray-400 text-sm">
                {window.title} Content
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export const Dock: React.FC = () => {
  const { addWindow, windows, minimizeWindow, setActiveWindow } = useStore();

  
  const handleWindowClick = (window: any) => {
    if (window.isMinimized) {
      minimizeWindow(window.id);
    }
    setActiveWindow(window.id);
  };

  
  const pinnedApps = [
    { 
      icon: <UserPlus size={24} />, 
      label: "Account Creator", 
      onClick: () => addWindow({
        title: 'Account Creator',
        content: <AccountCreator />,
        position: { x: 150, y: 150 },
        size: { width: 600, height: 500 },
        isMinimized: false,
        isMaximized: false
      })
    },
    { 
      icon: <Users size={24} />, 
      label: "Saved Accounts", 
      onClick: () => addWindow({
        title: 'Saved Accounts',
        content: <SavedAccounts />,
        position: { x: 200, y: 200 },
        size: { width: 500, height: 600 },
        isMinimized: false,
        isMaximized: false
      })
    },
    { 
      icon: <Settings size={24} />, 
      label: "System Settings", 
      onClick: () => addWindow({
        title: 'System Settings',
        content: <SystemSettings />,
        position: { x: 300, y: 300 },
        size: { width: 700, height: 500 },
        isMinimized: false,
        isMaximized: false
      })
    }
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 flex justify-center pb-2">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="bg-black/20 backdrop-blur-xl p-3 rounded-2xl flex items-center space-x-3 border border-white/10 shadow-2xl"
      >
        {/* Pinned Apps */}
        {pinnedApps.map((app, index) => (
          <DockItem
            key={index}
            icon={app.icon}
            label={app.label}
            onClick={app.onClick}
            isPinned
          />
        ))}

        {/* Divider - Only show if there are open windows */}
        {windows.length > 0 && (
          <div className="h-8 w-px bg-white/20 mx-2" />
        )}

        {/* Open Windows */}
        {windows.map((window) => (
          <DockItem
            key={window.id}
            icon={window.title === 'Account Creator' ? <UserPlus size={20} /> :
                  window.title === 'Saved Accounts' ? <Users size={20} /> :
                  window.title === 'System Settings' ? <Settings size={20} /> :
                  <Terminal size={20} />}
            label={window.title}
            isActive={!window.isMinimized}
            onClick={() => handleWindowClick(window)}
            showPreview
            window={window}
          />
        ))}
      </motion.div>
    </div>
  );
};