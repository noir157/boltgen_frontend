import { create } from 'zustand';
import {persist} from 'zustand/middleware';
import { subscribeWithSelector } from 'zustand/middleware';

interface Window {
  id: string;
  title: string;
  content: React.ReactNode;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  isMaximized: boolean;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: number;
  skipSound?: boolean;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface SystemSettings {
  accentColor: string;
  soundEnabled: boolean;
  soundVolume: number;
  brightness: number;
  notifications: boolean;
  language: string;
  autoSave: boolean;
  username: string;
  isLocked: boolean;
}

interface Store {
  windows: Window[];
  activeWindow: string | null;
  notifications: Notification[];
  toast: Toast | null;
  systemSettings: SystemSettings;
  addWindow: (window: Omit<Window, 'id'>) => void;
  removeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  setActiveWindow: (id: string) => void;
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  updateWindowSize: (id: string, size: { width: number; height: number }) => void;
  updateSystemSettings: (settings: Partial<SystemSettings>) => void;
  lockSystem: () => void;
  unlockSystem: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  showToast: (toast: Omit<Toast, 'id'>) => void;
  clearToast: () => void;
}

const updateCSSVariables = (settings: SystemSettings) => {
  const root = document.documentElement;
  root.style.setProperty('--brightness', `${settings.brightness}%`);
  root.style.setProperty('--accent-color', settings.accentColor);
  root.classList.add('dark');
};

// Pre-load audio files
const notificationSound = new Audio('/notification.mp3');

const playNotificationSound = async (volume: number) => {
  try {
    notificationSound.volume = volume / 100;
    notificationSound.currentTime = 0;
    await notificationSound.play();
  } catch (error) {
    console.error('Failed to play notification sound:', error);
  }
};

const broadcastUpdate = (type: string, data: any) => {
  const event = new CustomEvent('store-update', { 
    detail: { type, data }
  });
  window.dispatchEvent(event);
};

export const useStore = create<Store>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        windows: [],
        activeWindow: null,
        notifications: [],
        toast: null,
        systemSettings: {
          accentColor: '#3B82F6',
          soundEnabled: true,
          soundVolume: 80,
          brightness: 100,
          notifications: true,
          language: 'en', // Default language set to English
          autoSave: true,
          username: 'User',
          isLocked: false,
        },
        addWindow: (window) =>
          set((state) => {
            const id = Math.random().toString();
            const newWindow = { ...window, id };
            broadcastUpdate('window-added', newWindow);
            return {
              windows: [...state.windows, newWindow],
              activeWindow: id,
            };
          }),
        removeWindow: (id) =>
          set((state) => {
            broadcastUpdate('window-removed', id);
            return {
              windows: state.windows.filter((w) => w.id !== id),
              activeWindow: state.activeWindow === id ? null : state.activeWindow,
            };
          }),
        minimizeWindow: (id) =>
          set((state) => {
            const windows = state.windows.map((w) =>
              w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
            );
            broadcastUpdate('window-minimized', { id, windows });
            return { windows };
          }),
        maximizeWindow: (id) =>
          set((state) => {
            const windows = state.windows.map((w) =>
              w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
            );
            broadcastUpdate('window-maximized', { id, windows });
            return { windows };
          }),
        setActiveWindow: (id) =>
          set(() => {
            broadcastUpdate('active-window-changed', id);
            return { activeWindow: id };
          }),
        updateWindowPosition: (id, position) =>
          set((state) => {
            const windows = state.windows.map((w) =>
              w.id === id ? { ...w, position } : w
            );
            broadcastUpdate('window-position-updated', { id, position, windows });
            return { windows };
          }),
        updateWindowSize: (id, size) =>
          set((state) => {
            const windows = state.windows.map((w) =>
              w.id === id ? { ...w, size } : w
            );
            broadcastUpdate('window-size-updated', { id, size, windows });
            return { windows };
          }),
        updateSystemSettings: (settings) =>
          set((state) => {
            const newSettings = { ...state.systemSettings, ...settings };
            // Force English language if trying to change to another language
            if (settings.language && settings.language !== 'en') {
              newSettings.language = 'en';
            }
            updateCSSVariables(newSettings);
            broadcastUpdate('settings-updated', newSettings);
            return { systemSettings: newSettings };
          }),
        lockSystem: () =>
          set((state) => {
            const newSettings = { ...state.systemSettings, isLocked: true };
            broadcastUpdate('system-locked', newSettings);
            return { systemSettings: newSettings };
          }),
        unlockSystem: () =>
          set((state) => {
            const newSettings = { ...state.systemSettings, isLocked: false };
            broadcastUpdate('system-unlocked', newSettings);
            return { systemSettings: newSettings };
          }),
        addNotification: (notification) =>
          set((state) => {
            const id = Math.random().toString();
            const newNotification = {
              ...notification,
              id,
              timestamp: Date.now(),
            };
            
            if (state.systemSettings.notifications && 
                state.systemSettings.soundEnabled && 
                !notification.skipSound) {
              playNotificationSound(state.systemSettings.soundVolume);
            }
            
            get().showToast({
              message: notification.message,
              type: notification.type
            });
            
            const notifications = [newNotification, ...state.notifications].slice(0, 50);
            broadcastUpdate('notification-added', { notification: newNotification, notifications });
            return { notifications };
          }),
        removeNotification: (id) =>
          set((state) => {
            const notifications = state.notifications.filter((n) => n.id !== id);
            broadcastUpdate('notification-removed', { id, notifications });
            return { notifications };
          }),
        clearNotifications: () =>
          set(() => {
            broadcastUpdate('notifications-cleared', []);
            return { notifications: [] };
          }),
        showToast: (toast) =>
          set((state) => {
            const newToast = state.systemSettings.notifications 
              ? { ...toast, id: Math.random().toString() } 
              : null;
            broadcastUpdate('toast-shown', newToast);
            return { toast: newToast };
          }),
        clearToast: () =>
          set(() => {
            broadcastUpdate('toast-cleared', null);
            return { toast: null };
          }),
      }),
      {
        name: 'bolt-storage',
        partialize: (state) => ({
          systemSettings: {
            ...state.systemSettings,
            language: 'en' // Always persist English as the language
          },
          notifications: state.notifications,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            updateCSSVariables(state.systemSettings);
          }
        },
      }
    )
  )
);

// Subscribe to all store changes
useStore.subscribe(
  (state) => state,
  (state) => {
    broadcastUpdate('store-state', state);
  }
);

if (typeof window !== 'undefined') {
  document.documentElement.classList.add('dark');
}