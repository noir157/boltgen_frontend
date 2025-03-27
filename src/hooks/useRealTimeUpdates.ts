import { useEffect } from 'react';
import { useStore } from '../store';

export const useRealTimeUpdates = () => {
  const store = useStore();

  useEffect(() => {
    const handleStoreUpdate = (event: CustomEvent) => {
      const { type, data } = event.detail;

      switch (type) {
        case 'window-added':
        case 'window-removed':
        case 'window-minimized':
        case 'window-maximized':
        case 'window-position-updated':
        case 'window-size-updated':
          // Window updates are handled automatically by Zustand
          break;

        case 'settings-updated':
          // Update system settings in real-time
          document.documentElement.style.setProperty('--brightness', `${data.brightness}%`);
          document.documentElement.style.setProperty('--accent-color', data.accentColor);
          break;

        case 'notification-added':
        case 'notification-removed':
        case 'notifications-cleared':
          // Notifications are handled automatically by Zustand
          break;

        case 'toast-shown':
        case 'toast-cleared':
          // Toast updates are handled automatically by Zustand
          break;

        case 'store-state':
          // Full store state update
          break;
      }
    };

    window.addEventListener('store-update', handleStoreUpdate as EventListener);

    return () => {
      window.removeEventListener('store-update', handleStoreUpdate as EventListener);
    };
  }, []);

  return null;
};