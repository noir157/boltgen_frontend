import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, XCircle, Users } from 'lucide-react';
import { useStore } from '../store';

export const LockScreen: React.FC = () => {
  const { systemSettings, unlockSystem } = useStore();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError('Please enter your password');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    
    
    unlockSystem();
    setPassword('');
    setError('');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] backdrop-blur-xl"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-sm text-center"
          >
            <motion.div
              animate={isShaking ? {
                x: [-10, 10, -10, 10, 0],
                transition: { duration: 0.4 }
              } : {}}
              className="space-y-6"
            >
              {/* User Avatar */}
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl border-2 border-white/20 flex items-center justify-center">
                  <User size={48} className="text-white/80" />
                </div>
              </div>

              {/* User Name */}
              <h2 className="text-2xl font-medium text-white">
                {systemSettings.username || 'User'}
              </h2>

              {/* Password Form */}
              <form onSubmit={handleUnlock} className="space-y-4">
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter Password"
                    className={`w-full px-4 py-3 bg-white/10 backdrop-blur-xl border ${
                      error ? 'border-red-400' : 'border-white/20'
                    } rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30`}
                  />
                  <Lock size={18} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50" />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2 text-red-400"
                  >
                    <XCircle size={16} />
                    <span className="text-sm">{error}</span>
                  </motion.div>
                )}

                <button
                  type="submit"
                  className="px-8 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-lg text-white transition-colors duration-200"
                >
                  Unlock
                </button>
              </form>

              {/* Switch User Button */}
              <button className="flex items-center justify-center gap-2 text-white/70 hover:text-white transition-colors duration-200 mx-auto">
                <Users size={16} />
                <span>Switch User</span>
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Time and Date */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center text-white">
          <div className="text-6xl font-light mb-2">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-xl font-light">
            {new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};