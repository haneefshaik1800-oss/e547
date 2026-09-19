import React, { useState } from 'react';
import { 
  Menu, 
  Settings as SettingsIcon, 
  User, 
  ChevronRight, 
  MapPin, 
  Thermometer, 
  Key, 
  Code2, 
  Sliders, 
  BellRing, 
  RotateCcw,
  Check,
  ExternalLink
} from 'lucide-react';
import { WeatherData, TemperatureUnit } from '../../types/weather';
import { getStoredApiKey, saveApiKey } from '../../services/weatherService';

interface SettingsScreenProps {
  weather: WeatherData;
  unit: TemperatureUnit;
  onToggleUnit: () => void;
  onOpenCodeViewer: () => void;
  onOpenCitiesModal: () => void;
  onMenuClick?: () => void;
  onApiKeyUpdated: (key: string) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  weather,
  unit,
  onToggleUnit,
  onOpenCodeViewer,
  onOpenCitiesModal,
  onMenuClick,
  onApiKeyUpdated,
}) => {
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [isEditingKey, setIsEditingKey] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveKey = () => {
    saveApiKey(apiKey);
    onApiKeyUpdated(apiKey);
    setIsEditingKey(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 overflow-y-auto select-none custom-scrollbar pb-8">
      {/* App Bar */}
      <div className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-md px-5 pt-3 pb-3 flex items-center justify-between border-b border-slate-800/40">
        <button 
          id="settings-menu-btn"
          onClick={onMenuClick} 
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
        >
          <Menu size={18} />
        </button>
        <h2 className="text-base font-bold text-white">Profile & Settings</h2>
        <button 
          id="settings-gear-btn"
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
        >
          <SettingsIcon size={18} />
        </button>
      </div>

      <div className="px-5 pt-4 space-y-5">
        {/* User Card (Matching John Doe profile card on Screen 8 in wireframe) */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-full bg-sky-500/20 border-2 border-sky-400/40 flex items-center justify-center text-sky-400">
              <User size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Flutter Weather Explorer</h3>
              <p className="text-xs text-slate-400">haneefshaik1800@gmail.com</p>
              <p className="text-[11px] text-sky-400 flex items-center gap-1 mt-0.5">
                <MapPin size={11} />
                <span>{weather.city}, {weather.country}</span>
              </p>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-500" />
        </div>

        {/* Menu Items List (Exact visual hierarchy as wireframe Screen 8) */}
        <div className="space-y-2">
          {/* 1. Saved Locations */}
          <button
            id="settings-saved-locations-btn"
            onClick={onOpenCitiesModal}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/40 hover:bg-slate-850 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <MapPin size={16} />
              </div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-white">
                Saved Locations
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-medium">Hyderabad + 5</span>
              <ChevronRight size={16} className="text-slate-500" />
            </div>
          </button>

          {/* 2. Temperature Unit Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Thermometer size={16} />
              </div>
              <span className="text-xs font-bold text-slate-200">Temperature Unit</span>
            </div>
            <button
              id="settings-unit-toggle-btn"
              onClick={onToggleUnit}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-sky-400 transition-colors"
            >
              {unit === 'celsius' ? 'Celsius (°C)' : 'Fahrenheit (°F)'}
            </button>
          </div>

          {/* 3. OpenWeatherMap API Key */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Key size={16} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200 block">OpenWeatherMap API</span>
                  <span className="text-[10px] text-slate-400">
                    {apiKey ? 'Custom Key Active' : 'Preconfigured Live Engine'}
                  </span>
                </div>
              </div>
              <button
                id="toggle-api-key-edit-btn"
                onClick={() => setIsEditingKey(!isEditingKey)}
                className="text-xs font-bold text-sky-400 hover:underline"
              >
                {isEditingKey ? 'Cancel' : (apiKey ? 'Edit Key' : 'Add Key')}
              </button>
            </div>

            {isEditingKey && (
              <div className="pt-2 space-y-2">
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Paste OpenWeatherMap API Key..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
                />
                <div className="flex items-center justify-between">
                  <a
                    href="https://openweathermap.org/api"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-sky-400 hover:underline flex items-center gap-1"
                  >
                    <span>Get free API key</span>
                    <ExternalLink size={10} />
                  </a>
                  <button
                    id="save-api-key-btn"
                    onClick={handleSaveKey}
                    className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-xs font-bold text-white transition-colors"
                  >
                    Save Key
                  </button>
                </div>
              </div>
            )}

            {saveSuccess && (
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <Check size={12} /> Key updated & reloaded!
              </p>
            )}
          </div>

          {/* 4. Flutter Dart Code Viewer & Exporter */}
          <button
            id="settings-export-flutter-btn"
            onClick={onOpenCodeViewer}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/30 hover:bg-sky-500/15 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <Code2 size={16} />
              </div>
              <div>
                <span className="text-xs font-bold text-white group-hover:text-sky-300 block">
                  Flutter Project Source Code
                </span>
                <span className="text-[10px] text-slate-400">
                  Inspect & Download Dart Code & pubspec.yaml
                </span>
              </div>
            </div>
            <ChevronRight size={16} className="text-sky-400" />
          </button>

          {/* 5. Severe Alert Push Settings */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <BellRing size={16} />
              </div>
              <span className="text-xs font-bold text-slate-200">Severe Weather Alerts</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-400">Enabled</span>
          </div>

          {/* 6. Reset Defaults */}
          <button
            id="settings-reset-cache-btn"
            onClick={() => {
              saveApiKey('');
              setApiKey('');
              onApiKeyUpdated('');
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <RotateCcw size={16} />
              </div>
              <span className="text-xs font-bold text-slate-300">Reset Local Cache</span>
            </div>
            <span className="text-[10px] text-slate-500">Defaults</span>
          </button>
        </div>
      </div>
    </div>
  );
};
