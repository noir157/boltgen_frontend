import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Calendar, X } from 'lucide-react';

interface NotificationCenterProps {
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  onClose,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="fixed top-8 right-2 w-80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden z-50"
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <div className="text-lg font-medium text-gray-800 dark:text-white">Notifications</div>
        <button onClick={onClose}>
          <X size={20} className="text-gray-500 dark:text-gray-400" />
        </button>
      </div>
      <div className="p-4">
        <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
          No New Notifications
        </div>
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm font-medium mb-2 text-gray-800 dark:text-white">Calendar</div>
        <div className="bg-black/5 dark:bg-white/5 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar size={16} className="text-blue-500" />
            <span className="text-sm font-medium text-gray-800 dark:text-white">Today</span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">No events today</div>
        </div>
      </div>
    </motion.div>
  );
};