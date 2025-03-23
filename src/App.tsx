import React from 'react';
import { Desktop } from './components/Desktop';
import { Dock } from './components/Dock';
import { MenuBar } from './components/MenuBar';
import { WindowManager } from './components/WindowManager';
import { useState } from 'react';
import { ControlCenter } from './components/ControlCenter';
import { NotificationCenter } from './components/NotificationCenter';
import { Spotlight } from './components/Spotlight';
import { LockScreen } from './components/LockScreen';
import { AnimatePresence } from 'framer-motion';
import { useStore } from './store';

function App() {
  const [showControlCenter, setShowControlCenter] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [showSpotlight, setShowSpotlight] = useState(false);
  const { systemSettings } = useStore();

  return (
    <div className="h-screen w-screen overflow-hidden">
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url('https://4kwallpapers.com/images/wallpapers/macos-monterey-stock-dark-mode-5k-5120x2880-5585.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(1.1) contrast(1.1) saturate(1.2)',
          imageRendering: 'crisp-edges'
        }}
      />
      
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-blue-900/30 backdrop-blur-[2px] z-0" />
      
      <div className="relative z-10 h-full text-white">
        <MenuBar
          onControlCenterClick={() => setShowControlCenter(!showControlCenter)}
          onNotificationCenterClick={() => setShowNotificationCenter(!showNotificationCenter)}
        />
        
        <Desktop>
          <WindowManager />
        </Desktop>

        <Dock />

        <AnimatePresence>
          {showControlCenter && (
            <ControlCenter onClose={() => setShowControlCenter(false)} />
          )}
          {showNotificationCenter && (
            <NotificationCenter onClose={() => setShowNotificationCenter(false)} />
          )}
          {showSpotlight && (
            <Spotlight onClose={() => setShowSpotlight(false)} />
          )}
          {systemSettings.isLocked && <LockScreen />}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;