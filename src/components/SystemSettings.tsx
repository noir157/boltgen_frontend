import React from 'react';
import { 
  Monitor, 
  Volume2,
  Globe,
  Bell,
  Save,
  LayoutGrid,
  Palette
} from 'lucide-react';
import { useStore } from '../store';
import { useTranslation } from 'react-i18next';

const accentColors = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Green', value: '#10B981' },
  { name: 'Orange', value: '#F97316' },
];

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'pt', name: 'Português' },
];

export const SystemSettings: React.FC = () => {
  const { systemSettings, updateSystemSettings } = useStore();
  const { t, i18n } = useTranslation();

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseInt(e.target.value);
    updateSystemSettings({ soundVolume: volume });
  };

  const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const brightness = parseInt(e.target.value);
    updateSystemSettings({ brightness });
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    i18n.changeLanguage(newLanguage);
    updateSystemSettings({ language: newLanguage });
  };

  return (
    <div className="p-6 space-y-8 bg-gray-900/50 text-gray-100">
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">{t('appearance.title')}</h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">{t('appearance.accentColor')}</label>
            <div className="flex gap-2">
              {accentColors.map(color => (
                <button
                  key={color.value}
                  onClick={() => updateSystemSettings({ accentColor: color.value })}
                  className={`w-8 h-8 rounded-full transition-transform ${
                    systemSettings.accentColor === color.value
                      ? 'ring-2 ring-offset-2 ring-gray-600 scale-110'
                      : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">{t('appearance.display')}</label>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">{t('appearance.brightness')}</span>
                  <Monitor size={16} className="text-gray-500" />
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={systemSettings.brightness}
                  onChange={handleBrightnessChange}
                  className="w-full accent-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-lg font-semibold">{t('sound.title')}</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">{t('sound.enable')}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={systemSettings.soundEnabled}
                onChange={(e) => updateSystemSettings({ soundEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">{t('sound.volume')}</span>
              <Volume2 size={16} className="text-gray-500" />
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={systemSettings.soundVolume}
              onChange={handleVolumeChange}
              disabled={!systemSettings.soundEnabled}
              className="w-full accent-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-lg font-semibold">{t('system.title')}</h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">{t('system.language')}</label>
            <select
              value={systemSettings.language}
              onChange={handleLanguageChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-300">{t('system.notifications.title')}</span>
              <p className="text-xs text-gray-400">{t('system.notifications.description')}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={systemSettings.notifications}
                onChange={(e) => updateSystemSettings({ notifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-300">{t('system.autoSave.title')}</span>
              <p className="text-xs text-gray-400">{t('system.autoSave.description')}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={systemSettings.autoSave}
                onChange={(e) => updateSystemSettings({ autoSave: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};