import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Window {
  id: string;
  title: string;
  content: React.ReactNode;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  isMaximized: boolean;
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
}

// Function to update CSS variables based on settings
const updateCSSVariables = (settings: SystemSettings) => {
  const root = document.documentElement;
  root.style.setProperty('--brightness', `${settings.brightness}%`);
  root.style.setProperty('--accent-color', settings.accentColor);
  root.classList.add('dark');
};

// Function to play sound
const playSound = (volume: number) => {
  const audio = new Audio('/assets/click.mp3');
  audio.volume = volume / 100;
  audio.play().catch(() => {}); // Ignore errors if audio fails to play
};

export const useStore = create<Store>()(
  persist(
    (set) => ({
      windows: [],
      activeWindow: null,
      systemSettings: {
        accentColor: '#3B82F6',
        soundEnabled: true,
        soundVolume: 80,
        brightness: 100,
        notifications: true,
        language: 'en',
        autoSave: true,
        username: 'User',
        isLocked: false,
      },
      addWindow: (window) =>
        set((state) => {
          const id = Math.random().toString();
          const newWindow = { ...window, id };
          if (state.systemSettings.soundEnabled) {
            playSound(state.systemSettings.soundVolume);
          }
          return {
            windows: [...state.windows, newWindow],
            activeWindow: id,
          };
        }),
      removeWindow: (id) =>
        set((state) => {
          if (state.systemSettings.soundEnabled) {
            playSound(state.systemSettings.soundVolume);
          }
          return {
            windows: state.windows.filter((w) => w.id !== id),
            activeWindow: state.activeWindow === id ? null : state.activeWindow,
          };
        }),
      minimizeWindow: (id) =>
        set((state) => {
          if (state.systemSettings.soundEnabled) {
            playSound(state.systemSettings.soundVolume);
          }
          return {
            windows: state.windows.map((w) =>
              w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
            ),
          };
        }),
      maximizeWindow: (id) =>
        set((state) => {
          if (state.systemSettings.soundEnabled) {
            playSound(state.systemSettings.soundVolume);
          }
          return {
            windows: state.windows.map((w) =>
              w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
            ),
          };
        }),
      setActiveWindow: (id) =>
        set((state) => {
          if (state.systemSettings.soundEnabled) {
            playSound(state.systemSettings.soundVolume);
          }
          return {
            activeWindow: id,
          };
        }),
      updateWindowPosition: (id, position) =>
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id ? { ...w, position } : w
          ),
        })),
      updateWindowSize: (id, size) =>
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id ? { ...w, size } : w
          ),
        })),
      updateSystemSettings: (settings) =>
        set((state) => {
          const newSettings = { ...state.systemSettings, ...settings };
          updateCSSVariables(newSettings);
          
          // Show notification if enabled
          if (newSettings.notifications && 'Notification' in window) {
            if (Notification.permission === 'granted') {
              new Notification('Settings Updated', {
                body: 'Your system settings have been updated successfully.',
                icon: '/vite.svg'
              });
            } else if (Notification.permission !== 'denied') {
              Notification.requestPermission();
            }
          }
          
          // Play sound if enabled
          if (state.systemSettings.soundEnabled) {
            playSound(state.systemSettings.soundVolume);
          }
          
          return { systemSettings: newSettings };
        }),
      lockSystem: () =>
        set((state) => ({
          systemSettings: { ...state.systemSettings, isLocked: true }
        })),
      unlockSystem: () =>
        set((state) => ({
          systemSettings: { ...state.systemSettings, isLocked: false }
        })),
    }),
    {
      name: 'bolt-storage',
      partialize: (state) => ({ systemSettings: state.systemSettings }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          updateCSSVariables(state.systemSettings);
        }
      },
    }
  )
);

// Initialize dark theme on load
if (typeof window !== 'undefined') {
  document.documentElement.classList.add('dark');
}