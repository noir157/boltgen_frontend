import React, { useState } from 'react';
import { Wifi, Battery, Volume2 } from 'lucide-react';
import { format } from 'date-fns';
import { MenuOptions } from './MenuOptions';

const AppleLogo = () => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 170 170" 
    fill="currentColor"
    className="opacity-80"
  >
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.197-2.12-9.973-3.17-14.34-3.17-4.58 0-9.492 1.05-14.746 3.17-5.262 2.13-9.501 3.24-12.742 3.35-4.929 0.21-9.842-1.96-14.746-6.52-3.13-2.73-7.045-7.41-11.735-14.04-5.032-7.08-9.169-15.29-12.41-24.65-3.471-10.11-5.211-19.9-5.211-29.378 0-10.857 2.346-20.221 7.045-28.068 3.693-6.303 8.606-11.275 14.755-14.925s12.793-5.51 19.948-5.629c3.915 0 9.049 1.211 15.429 3.591 6.362 2.388 10.447 3.599 12.238 3.599 1.339 0 5.877-1.416 13.57-4.239 7.275-2.618 13.415-3.702 18.445-3.275 13.63 1.1 23.87 6.473 30.68 16.153-12.19 7.386-18.22 17.731-18.1 31.002 0.11 10.337 3.86 18.939 11.23 25.769 3.34 3.17 7.07 5.62 11.22 7.36-0.9 2.61-1.85 5.11-2.86 7.51zM119.11 7.24c0 8.102-2.96 15.667-8.86 22.669-7.12 8.324-15.732 13.134-25.071 12.375a25.222 25.222 0 0 1-.188-3.07c0-7.778 3.386-16.102 9.399-22.908 3.002-3.446 6.82-6.311 11.45-8.597 4.62-2.252 8.99-3.497 13.1-3.71 0.12 1.083 0.17 2.166 0.17 3.241z"/>
  </svg>
);

interface MenuBarProps {
  onControlCenterClick: () => void;
  onNotificationCenterClick: () => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({
  onControlCenterClick,
  onNotificationCenterClick,
}) => {
  const [time, setTime] = React.useState(new Date());
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 28 });

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMenuClick = (menuName: string, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setMenuPosition({ x: rect.left, y: rect.bottom });
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-8 bg-white/10 dark:bg-black/20 backdrop-blur-xl px-2 flex items-center justify-between text-gray-800 dark:text-white text-sm z-50 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <button className="hover:bg-white/10 dark:hover:bg-white/5 px-2 py-0.5 rounded">
            <AppleLogo />
          </button>
          <button 
            className="hover:bg-white/10 dark:hover:bg-white/5 px-2 py-0.5 rounded"
            onClick={(e) => handleMenuClick('Account', e)}
          >
            Account
          </button>
          <button 
            className="hover:bg-white/10 dark:hover:bg-white/5 px-2 py-0.5 rounded"
            onClick={(e) => handleMenuClick('Tools', e)}
          >
            Tools
          </button>
          <button 
            className="hover:bg-white/10 dark:hover:bg-white/5 px-2 py-0.5 rounded"
            onClick={(e) => handleMenuClick('Settings', e)}
          >
            Settings
          </button>
          <button 
            className="hover:bg-white/10 dark:hover:bg-white/5 px-2 py-0.5 rounded"
            onClick={(e) => handleMenuClick('Help', e)}
          >
            Help
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onControlCenterClick}
            className="hover:bg-white/10 dark:hover:bg-white/5 px-2 py-0.5 rounded flex items-center space-x-1"
          >
            <Wifi size={16} />
            <Battery size={16} />
            <Volume2 size={16} />
          </button>
          <button
            onClick={onNotificationCenterClick}
            className="hover:bg-white/10 dark:hover:bg-white/5 px-2 py-0.5 rounded"
          >
            {format(time, 'EEE MMM d h:mm a')}
          </button>
        </div>
      </div>

      <MenuOptions
        isOpen={activeMenu !== null}
        onClose={() => setActiveMenu(null)}
        position={menuPosition}
        title={activeMenu || ''}
      />
    </>
  );
};