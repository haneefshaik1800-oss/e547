import React from 'react';
import { 
  Wifi, 
  Battery, 
  Home, 
  Calendar, 
  TrendingUp, 
  Wind, 
  Settings as SettingsIcon,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WeatherData, TemperatureUnit } from '../types/weather';
import { SplashScreen } from './screens/SplashScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ForecastScreen } from './screens/ForecastScreen';
import { DetailsScreen } from './screens/DetailsScreen';
import { TrendsScreen } from './screens/TrendsScreen';
import { AirQualityScreen } from './screens/AirQualityScreen';
import { AlertsScreen } from './screens/AlertsScreen';
import { SettingsScreen } from './screens/SettingsScreen';

interface PhoneSimulatorProps {
  currentScreen: number; // 1 to 8
  onChangeScreen: (screen: number) => void;
  weather: WeatherData;
  unit: TemperatureUnit;
  onToggleUnit: () => void;
  onOpenSearch: () => void;
  onOpenCodeViewer: () => void;
  onOpenCitiesModal: () => void;
  dataSource: 'api' | 'simulation';
  onApiKeyUpdated: (key: string) => void;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  currentScreen,
  onChangeScreen,
  weather,
  unit,
  onToggleUnit,
  onOpenSearch,
  onOpenCodeViewer,
  onOpenCitiesModal,
  dataSource,
  onApiKeyUpdated,
}) => {
  const currentTime = '09:41';

  return (
    <div className="relative w-full max-w-[390px] h-[780px] bg-slate-900 rounded-[50px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_0_12px_#1e293b,0_0_0_14px_#334155] border border-slate-700/50 flex flex-col select-none">
      {/* Device Top Speaker & Camera Notch */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-40 flex items-center justify-between w-32 h-5 bg-black rounded-full px-2.5 shadow-inner">
        <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-sky-950"></div>
        </div>
        <div className="w-12 h-1 rounded-full bg-slate-800"></div>
      </div>

      {/* Screen Container with rounded corners */}
      <div className="relative flex-1 w-full bg-slate-950 rounded-[40px] overflow-hidden flex flex-col">
        {/* Status Bar */}
        <div className="h-10 w-full px-6 flex items-center justify-between text-white text-xs font-semibold z-30 pt-1">
          <span>{currentTime}</span>
          <div className="flex items-center gap-1.5 text-white/80">
            <Wifi size={14} />
            <Battery size={15} />
          </div>
        </div>

        {/* Screen Content */}
        <div className="flex-1 w-full overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full"
            >
              {currentScreen === 1 && (
                <SplashScreen onGetStarted={() => onChangeScreen(2)} />
              )}
              {currentScreen === 2 && (
                <HomeScreen
                  weather={weather}
                  unit={unit}
                  onNavigate={onChangeScreen}
                  onOpenSearch={onOpenSearch}
                  onToggleUnit={onToggleUnit}
                  dataSource={dataSource}
                />
              )}
              {currentScreen === 3 && (
                <ForecastScreen
                  weather={weather}
                  unit={unit}
                  onBack={() => onChangeScreen(2)}
                  onSelectDay={() => onChangeScreen(4)}
                />
              )}
              {currentScreen === 4 && (
                <DetailsScreen
                  weather={weather}
                  unit={unit}
                  onBack={() => onChangeScreen(2)}
                  onSaveCity={onOpenCitiesModal}
                  onOpenRadar={() => onChangeScreen(3)}
                />
              )}
              {currentScreen === 5 && (
                <TrendsScreen
                  weather={weather}
                  unit={unit}
                  onMenuClick={() => onChangeScreen(8)}
                  onViewDetailed={() => onChangeScreen(4)}
                />
              )}
              {currentScreen === 6 && (
                <AirQualityScreen
                  weather={weather}
                  onMenuClick={() => onChangeScreen(8)}
                  onAddStation={() => onChangeScreen(8)}
                />
              )}
              {currentScreen === 7 && (
                <AlertsScreen
                  weather={weather}
                  onMenuClick={() => onChangeScreen(8)}
                  onViewAll={() => onChangeScreen(3)}
                />
              )}
              {currentScreen === 8 && (
                <SettingsScreen
                  weather={weather}
                  unit={unit}
                  onToggleUnit={onToggleUnit}
                  onOpenCodeViewer={onOpenCodeViewer}
                  onOpenCitiesModal={onOpenCitiesModal}
                  onMenuClick={() => onChangeScreen(2)}
                  onApiKeyUpdated={onApiKeyUpdated}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Navigation Bar (Shown on screens 2 through 8, like a full Flutter mobile app) */}
        {currentScreen !== 1 && (
          <div className="h-16 w-full bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 px-4 flex items-center justify-around z-30 pb-2">
            <button
              id="bottom-nav-home"
              onClick={() => onChangeScreen(2)}
              className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
                currentScreen === 2 ? 'text-sky-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Home size={19} />
              <span className="text-[10px] font-semibold">Home</span>
            </button>

            <button
              id="bottom-nav-forecast"
              onClick={() => onChangeScreen(3)}
              className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
                currentScreen === 3 || currentScreen === 4 ? 'text-sky-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Calendar size={19} />
              <span className="text-[10px] font-semibold">Forecast</span>
            </button>

            <button
              id="bottom-nav-trends"
              onClick={() => onChangeScreen(5)}
              className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
                currentScreen === 5 ? 'text-sky-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <TrendingUp size={19} />
              <span className="text-[10px] font-semibold">Trends</span>
            </button>

            <button
              id="bottom-nav-airquality"
              onClick={() => onChangeScreen(6)}
              className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
                currentScreen === 6 ? 'text-sky-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Wind size={19} />
              <span className="text-[10px] font-semibold">Air</span>
            </button>

            <button
              id="bottom-nav-settings"
              onClick={() => onChangeScreen(8)}
              className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
                currentScreen === 8 ? 'text-sky-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <SettingsIcon size={19} />
              <span className="text-[10px] font-semibold">Settings</span>
            </button>
          </div>
        )}

        {/* Home Swipe Indicator Bar */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-40 pointer-events-none"></div>
      </div>
    </div>
  );
};
