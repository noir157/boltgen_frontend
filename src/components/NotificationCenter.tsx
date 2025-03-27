import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Calendar, X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useStore } from '../store';
import { format } from 'date-fns';

interface NotificationCenterProps {
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  onClose,
}) => {
  const { notifications, removeNotification, clearNotifications } = useStore();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={18} className="text-green-500" />;
      case 'error':
        return <AlertCircle size={18} className="text-red-500" />;
      case 'warning':
        return <AlertTriangle size={18} className="text-yellow-500" />;
      default:
        return <Info size={18} className="text-blue-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="fixed top-8 right-2 w-80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden z-50"
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Bell size={20} className="text-gray-500 dark:text-gray-400" />
          <span className="text-lg font-medium text-gray-800 dark:text-white">Notifications</span>
        </div>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <button
              onClick={clearNotifications}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Clear all
            </button>
          )}
          <button onClick={onClose}>
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        <AnimatePresence>
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <Bell size={24} className="mx-auto mb-2 opacity-50" />
              <p>No new notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 hover:bg-black/5 dark:hover:bg-white/5 relative group"
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {format(notification.timestamp, 'HH:mm')}
                      </p>
                    </div>
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm font-medium mb-2 text-gray-800 dark:text-white">Today</div>
        <div className="bg-black/5 dark:bg-white/5 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar size={16} className="text-blue-500" />
            <span className="text-sm font-medium text-gray-800 dark:text-white">
              {format(new Date(), 'EEEE, MMMM d')}
            </span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">No events today</div>
        </div>
      </div>
    </motion.div>
  );
};