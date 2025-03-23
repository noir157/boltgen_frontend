import React from 'react';
import { motion } from 'framer-motion';
import {
  Wifi,
  Bluetooth,
  Volume2,
  Sun,
  Moon,
  Monitor,
  Cast,
  Music,
} from 'lucide-react';

interface ControlCenterProps {
  onClose: () => void;
}

export const ControlCenter: React.FC<ControlCenterProps> = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="fixed top-8 right-2 w-80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden z-50"
    >
      <div className="p-4 grid grid-cols-2 gap-3">
        <button className="bg-black/5 dark:bg-white/5 rounded-xl p-4 flex flex-col items-center space-y-2">
          <Wifi size={24} className="text-blue-500" />
          <span className="text-sm text-gray-800 dark:text-white">Wi-Fi</span>
        </button>
        <button className="bg-black/5 dark:bg-white/5 rounded-xl p-4 flex flex-col items-center space-y-2">
          <Bluetooth size={24} className="text-blue-500" />
          <span className="text-sm text-gray-800 dark:text-white">Bluetooth</span>
        </button>
        <button className="bg-black/5 dark:bg-white/5 rounded-xl p-4 flex flex-col items-center space-y-2">
          <Volume2 size={24} className="text-blue-500" />
          <span className="text-sm text-gray-800 dark:text-white">Sound</span>
        </button>
        <button className="bg-black/5 dark:bg-white/5 rounded-xl p-4 flex flex-col items-center space-y-2">
          <Sun size={24} className="text-yellow-500" />
          <span className="text-sm text-gray-800 dark:text-white">Display</span>
        </button>
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-800 dark:text-white">Display</span>
          <Monitor size={16} className="text-gray-500 dark:text-gray-400" />
        </div>
        <input
          type="range"
          className="w-full accent-blue-500"
          min="0"
          max="100"
          defaultValue="80"
        />
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-800 dark:text-white">Sound</span>
          <Volume2 size={16} className="text-gray-500 dark:text-gray-400" />
        </div>
        <input
          type="range"
          className="w-full accent-blue-500"
          min="0"
          max="100"
          defaultValue="60"
        />
      </div>
    </motion.div>
  );
};