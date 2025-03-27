import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wifi,
  WifiOff,
  Bluetooth,
  BluetoothOff,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Monitor,
  Cast,
  Music,
} from 'lucide-react';
import { useStore } from '../store';

interface ControlCenterProps {
  onClose: () => void;
}

export const ControlCenter: React.FC<ControlCenterProps> = ({ onClose }) => {
  const { systemSettings, updateSystemSettings } = useStore();
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseInt(e.target.value);
    updateSystemSettings({ 
      soundVolume: volume,
      soundEnabled: volume > 0 
    });
  };

  const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const brightness = parseInt(e.target.value);
    updateSystemSettings({ brightness });
  };

  const toggleWifi = () => {
    setWifiEnabled(!wifiEnabled);
  };

  const toggleBluetooth = () => {
    setBluetoothEnabled(!bluetoothEnabled);
  };

  const toggleSound = () => {
    updateSystemSettings({ 
      soundEnabled: !systemSettings.soundEnabled,
      soundVolume: systemSettings.soundEnabled ? 0 : 50
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="fixed top-8 right-2 w-80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden z-50 border border-white/20"
    >
      <div className="p-4 grid grid-cols-2 gap-3">
        <button 
          onClick={toggleWifi}
          className={`${
            wifiEnabled 
              ? 'bg-blue-500/20 text-blue-500' 
              : 'bg-black/5 dark:bg-white/5 text-gray-400'
          } rounded-xl p-4 flex flex-col items-center space-y-2 transition-colors duration-200 hover:bg-blue-500/30`}
        >
          {wifiEnabled ? <Wifi size={24} /> : <WifiOff size={24} />}
          <span className="text-sm">Wi-Fi</span>
        </button>

        <button 
          onClick={toggleBluetooth}
          className={`${
            bluetoothEnabled 
              ? 'bg-blue-500/20 text-blue-500' 
              : 'bg-black/5 dark:bg-white/5 text-gray-400'
          } rounded-xl p-4 flex flex-col items-center space-y-2 transition-colors duration-200 hover:bg-blue-500/30`}
        >
          {bluetoothEnabled ? <Bluetooth size={24} /> : <BluetoothOff size={24} />}
          <span className="text-sm">Bluetooth</span>
        </button>

        <button 
          onClick={toggleSound}
          className={`${
            systemSettings.soundEnabled 
              ? 'bg-blue-500/20 text-blue-500' 
              : 'bg-black/5 dark:bg-white/5 text-gray-400'
          } rounded-xl p-4 flex flex-col items-center space-y-2 transition-colors duration-200 hover:bg-blue-500/30`}
        >
          {systemSettings.soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
          <span className="text-sm">Sound</span>
        </button>

        <button className="bg-black/5 dark:bg-white/5 rounded-xl p-4 flex flex-col items-center space-y-2 text-yellow-500 hover:bg-yellow-500/20 transition-colors duration-200">
          <Sun size={24} />
          <span className="text-sm">Display</span>
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
          min="50"
          max="100"
          value={systemSettings.brightness}
          onChange={handleBrightnessChange}
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
          value={systemSettings.soundVolume}
          onChange={handleVolumeChange}
          disabled={!systemSettings.soundEnabled}
        />
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Cast size={16} className="text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-800 dark:text-white">AirPlay</span>
          </div>
          <span className="text-xs text-gray-500">No Devices</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Music size={16} className="text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-800 dark:text-white">Now Playing</span>
          </div>
          <span className="text-xs text-gray-500">Not Playing</span>
        </div>
      </div>
    </motion.div>
  );
};