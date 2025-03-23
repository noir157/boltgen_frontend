import React from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';

interface SpotlightProps {
  onClose: () => void;
}

export const Spotlight: React.FC<SpotlightProps> = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 flex items-center space-x-3">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Spotlight Search"
            className="flex-1 bg-transparent border-none outline-none text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            autoFocus
          />
          <button onClick={onClose}>
            <X size={20} className="text-gray-400" />
          </button>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="p-2 text-sm text-gray-500 dark:text-gray-400">
            No recent searches
          </div>
        </div>
      </div>
    </motion.div>
  );
};