import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppWindow as Windows, Search, Layout, BellRing, Wifi, Battery, Volume2, ChevronUp, Settings, Power, User, FolderOpen, Calendar, MonitorCheck, Maximize2, X, Minus, Pin, Mail, Chrome, Terminal, FileText, Music, Video, Image, Folder, Coffee } from 'lucide-react';
import { format } from 'date-fns';
import { useStore } from '../store';

interface TaskbarIconProps {
  icon: React.ReactNode;
  label: string;
  isPinned?: boolean;
  isActive?: boolean;
  onClick?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  showPreview?: boolean;
}

const TaskbarIcon: React.FC<TaskbarIconProps> = ({
  icon,
  label,
  isPinned = false,
  isActive = false,
  onClick,
  onContextMenu,
  showPreview = false,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div
      className="relative group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        onContextMenu={onContextMenu}
        className={`p-2 rounded-md transition-colors relative ${
          isActive 
            ? 'bg-white/20 hover:bg-white/30' 
            : 'hover:bg-white/10'
        }`}
      >
        <div className="text-white">
          {icon}
        </div>
        {isActive && (
          <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
        )}
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
      {showPreview && showTooltip && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-12 bg-gray-900 rounded-lg overflow-hidden shadow-xl z-50"
        >
          <div className="w-64 h-40 bg-gray-800 relative">
            <div className="absolute inset-0 flex items-center justify-center text-gray-600">
              {label} Preview
            </div>
            <div className="absolute bottom-0 inset-x-0 h-8 bg-gray-900 flex items-center px-2">
              <span className="text-xs text-gray-400">{label}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const StartMenu: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const pinnedApps = [
    { icon: <Chrome size={24} />, name: 'Chrome' },
    { icon: <Mail size={24} />, name: 'Mail' },
    { icon: <Terminal size={24} />, name: 'Terminal' },
    { icon: <FileText size={24} />, name: 'Notepad' },
    { icon: <Music size={24} />, name: 'Music' },
    { icon: <Video size={24} />, name: 'Videos' },
    { icon: <Image size={24} />, name: 'Photos' },
    { icon: <Folder size={24} />, name: 'File Explorer' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-12 left-0 w-96 bg-gray-900/95 backdrop-blur-xl rounded-tr-lg shadow-2xl z-50 text-white"
          >
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <User size={20} />
                </div>
                <span className="font-medium">User</span>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-6">
                {pinnedApps.map((app, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center p-2 rounded-lg hover:bg-white/10"
                  >
                    {app.icon}
                    <span className="text-xs mt-1">{app.name}</span>
                  </motion.button>
                ))}
              </div>

              <div className="space-y-2">
                <button className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10">
                  <Settings size={20} />
                  <span>Settings</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10">
                  <FolderOpen size={20} />
                  <span>Documents</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10">
                  <Power size={20} />
                  <span>Power</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const TaskView: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { windows } = useStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 p-8"
          onClick={onClose}
        >
          <div className="h-full flex items-center justify-center">
            <div className="grid grid-cols-3 gap-4 max-w-4xl">
              {windows.map((window) => (
                <motion.div
                  key={window.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-900/90 rounded-lg overflow-hidden shadow-xl cursor-pointer"
                >
                  <div className="h-32 bg-gray-800 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                      {window.title}
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-sm text-white truncate">{window.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const NotificationCenter: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="fixed top-0 right-0 bottom-12 w-96 bg-gray-900/95 backdrop-blur-xl shadow-2xl z-50 text-white"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Notifications</h2>
              <button onClick={onClose}>
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Coffee size={20} />
                  <div>
                    <p className="font-medium">Coffee Break</p>
                    <p className="text-sm text-gray-400">Time for a quick break!</p>
                    <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Mail size={20} />
                  <div>
                    <p className="font-medium">New Email</p>
                    <p className="text-sm text-gray-400">You have 3 unread messages</p>
                    <p className="text-xs text-gray-500 mt-1">15 minutes ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const Taskbar: React.FC = () => {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isTaskViewOpen, setIsTaskViewOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const { windows, activeWindow } = useStore();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pinnedApps = [
    { icon: <Chrome size={20} />, label: 'Chrome' },
    { icon: <Mail size={20} />, label: 'Mail' },
    { icon: <Terminal size={20} />, label: 'Terminal' },
    { icon: <FileText size={20} />, label: 'Notepad' },
  ];

  return (
    <>
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-0 left-0 right-0 h-12 bg-gray-900/95 backdrop-blur-xl shadow-2xl z-50 flex items-center px-2"
      >
        <div className="flex items-center space-x-2 flex-1">
          {/* Start Button */}
          <TaskbarIcon
            icon={<Windows size={20} />}
            label="Start"
            isActive={isStartMenuOpen}
            onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
          />

          {/* Search */}
          <div className="relative">
            <TaskbarIcon
              icon={<Search size={20} />}
              label="Search"
              isActive={isSearchFocused}
              onClick={() => setIsSearchFocused(true)}
            />
            {isSearchFocused && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-full left-0 mb-2 w-96 bg-gray-900/95 backdrop-blur-xl rounded-lg shadow-xl p-4"
              >
                <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2">
                  <Search size={16} className="text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type to search"
                    className="bg-transparent border-none outline-none text-white placeholder-gray-400 w-full"
                    autoFocus
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Task View */}
          <TaskbarIcon
            icon={<Layout size={20} />}
            label="Task View"
            isActive={isTaskViewOpen}
            onClick={() => setIsTaskViewOpen(!isTaskViewOpen)}
          />

          {/* Divider */}
          <div className="w-px h-6 bg-white/20" />

          {/* Pinned Apps */}
          {pinnedApps.map((app, index) => (
            <TaskbarIcon
              key={index}
              icon={app.icon}
              label={app.label}
              isPinned
              showPreview
            />
          ))}

          {/* Running Windows */}
          {windows.map((window) => (
            <TaskbarIcon
              key={window.id}
              icon={<Maximize2 size={20} />}
              label={window.title}
              isActive={window.id === activeWindow}
              showPreview
            />
          ))}
        </div>

        {/* System Tray */}
        <div className="flex items-center space-x-2">
          <TaskbarIcon
            icon={<ChevronUp size={20} />}
            label="Show hidden icons"
          />
          <TaskbarIcon
            icon={<Wifi size={20} />}
            label="Network: Connected"
          />
          <TaskbarIcon
            icon={<Volume2 size={20} />}
            label="Volume: 70%"
          />
          <TaskbarIcon
            icon={<Battery size={20} />}
            label="Battery: 85%"
          />
          <button
            onClick={() => setIsNotificationCenterOpen(!isNotificationCenterOpen)}
            className="px-3 py-1 hover:bg-white/10 rounded transition-colors"
          >
            <time className="text-sm text-white">
              {format(time, 'h:mm a')}
            </time>
          </button>
          <TaskbarIcon
            icon={<BellRing size={20} />}
            label="Notifications"
            isActive={isNotificationCenterOpen}
            onClick={() => setIsNotificationCenterOpen(!isNotificationCenterOpen)}
          />
          <div className="w-1 h-full hover:bg-white/10 cursor-pointer" />
        </div>
      </motion.div>

      {/* Start Menu */}
      <StartMenu 
        isOpen={isStartMenuOpen} 
        onClose={() => setIsStartMenuOpen(false)} 
      />

      {/* Task View */}
      <TaskView 
        isOpen={isTaskViewOpen} 
        onClose={() => setIsTaskViewOpen(false)} 
      />

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={isNotificationCenterOpen} 
        onClose={() => setIsNotificationCenterOpen(false)} 
      />

      {/* Click away listener */}
      {(isSearchFocused || isStartMenuOpen || isTaskViewOpen || isNotificationCenterOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsSearchFocused(false);
            setIsStartMenuOpen(false);
            setIsTaskViewOpen(false);
            setIsNotificationCenterOpen(false);
          }}
        />
      )}
    </>
  );
};