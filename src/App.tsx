import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  LayoutGrid, 
  Code2, 
  Download, 
  MapPin, 
  RefreshCw, 
  Sparkles,
  Cloud,
  CheckCircle,
  Key
} from 'lucide-react';
import { WeatherData, TemperatureUnit } from './types/weather';
import { fetchWeather, getStoredApiKey } from './services/weatherService';
import { GLOBAL_CITIES } from './data/mockWeather';
import { PhoneSimulator } from './components/PhoneSimulator';
import { ArchitectureBoard } from './components/ArchitectureBoard';
import { FlutterCodeViewer } from './components/FlutterCodeViewer';
import { CitySearchModal } from './components/CitySearchModal';

export default function App() {
  // Navigation & View Mode
  const [viewMode, setViewMode] = useState<'phone' | 'board' | 'code'>('phone');
  const [currentScreen, setCurrentScreen] = useState<number>(2); // Default to Home screen (2)
  const [city, setCity] = useState<string>('Hyderabad'); // Location from user's image!
  const [unit, setUnit] = useState<TemperatureUnit>('celsius');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Weather state
  const [weather, setWeather] = useState<WeatherData>(GLOBAL_CITIES['Hyderabad']);
  const [dataSource, setDataSource] = useState<'api' | 'simulation'>('simulation');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(getStoredApiKey());

  const loadWeatherData = async (targetCity: string, customKey?: string) => {
    setIsLoading(true);
    try {
      const res = await fetchWeather(targetCity, customKey);
      setWeather(res.data);
      setDataSource(res.source);
      setCity(res.data.city);
    } catch (err) {
      console.error('Error loading weather data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWeatherData(city, apiKey);
  }, [city]);

  const handleToggleUnit = () => {
    setUnit(prev => prev === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  const handleApiKeyUpdated = (newKey: string) => {
    setApiKey(newKey);
    loadWeatherData(city, newKey);
  };

  const screens = [
    { num: 1, label: '1. Splash' },
    { num: 2, label: '2. Home' },
    { num: 3, label: '3. Forecast' },
    { num: 4, label: '4. Details' },
    { num: 5, label: '5. Trends' },
    { num: 6, label: '6. Air Quality' },
    { num: 7, label: '7. Alerts' },
    { num: 8, label: '8. Settings' },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-sky-500 selection:text-white font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand & Project Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-400 p-0.5 shadow-lg shadow-sky-500/20 flex items-center justify-center">
            <Cloud size={22} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-white tracking-wide">
                SkyCast
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-400 text-[10px] font-bold">
                Flutter 3.x
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              OpenWeatherMap API • Real-Time Forecasts
            </p>
          </div>
        </div>

        {/* View Mode Switcher (Interactive Phone | 8-Screen Wireframe | Flutter Code) */}
        <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            id="view-phone-mode-btn"
            onClick={() => setViewMode('phone')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'phone'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone size={15} />
            <span className="hidden md:inline">Mobile Simulator</span>
          </button>

          <button
            id="view-board-mode-btn"
            onClick={() => setViewMode('board')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'board'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid size={15} />
            <span className="hidden md:inline">8-Screen Architecture</span>
          </button>

          <button
            id="view-code-mode-btn"
            onClick={() => setViewMode('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'code'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 size={15} />
            <span className="hidden md:inline">Flutter Code</span>
          </button>
        </div>

        {/* Global Controls: City selector, Unit toggle, Code download */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active City Pill */}
          <button
            id="top-city-search-btn"
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-sky-400 transition-colors"
          >
            <MapPin size={13} />
            <span className="truncate max-w-[100px]">{city}</span>
          </button>

          {/* Unit Switcher */}
          <button
            id="top-unit-toggle-btn"
            onClick={handleToggleUnit}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-bold text-slate-200 transition-colors"
          >
            {unit === 'celsius' ? '°C' : '°F'}
          </button>

          {/* Code Download Button */}
          <button
            id="top-view-code-btn"
            onClick={() => setViewMode('code')}
            className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all cursor-pointer"
          >
            <Download size={14} />
            <span>Export Flutter Code</span>
          </button>
        </div>
      </header>

      {/* Main Content Area based on View Mode */}
      <main className="flex-1 flex flex-col">
        {viewMode === 'phone' && (
          <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
            {/* Screen Quick Selector Toolbar */}
            <div className="w-full max-w-2xl mb-6 overflow-x-auto pb-2 scrollbar-none flex items-center justify-start sm:justify-center gap-1.5">
              {screens.map((s) => {
                const isSelected = currentScreen === s.num;
                return (
                  <button
                    key={s.num}
                    id={`screen-pill-${s.num}`}
                    onClick={() => setCurrentScreen(s.num)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30 ring-2 ring-sky-400/40'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>

            {/* Interactive Smartphone Container */}
            <div className="flex items-center justify-center w-full">
              <PhoneSimulator
                currentScreen={currentScreen}
                onChangeScreen={setCurrentScreen}
                weather={weather}
                unit={unit}
                onToggleUnit={handleToggleUnit}
                onOpenSearch={() => setIsSearchOpen(true)}
                onOpenCodeViewer={() => setViewMode('code')}
                onOpenCitiesModal={() => setIsSearchOpen(true)}
                dataSource={dataSource}
                onApiKeyUpdated={handleApiKeyUpdated}
              />
            </div>
          </div>
        )}

        {viewMode === 'board' && (
          <ArchitectureBoard
            weather={weather}
            unit={unit}
            onSelectScreen={(screenNum) => {
              setCurrentScreen(screenNum);
              setViewMode('phone');
            }}
          />
        )}

        {viewMode === 'code' && (
          <div className="flex-1 w-full h-[calc(100vh-65px)]">
            <FlutterCodeViewer onClose={() => setViewMode('phone')} />
          </div>
        )}
      </main>

      {/* City Search & Select Modal */}
      <CitySearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectCity={(newCity) => loadWeatherData(newCity, apiKey)}
        currentCity={city}
      />
    </div>
  );
}
