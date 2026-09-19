import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Bookmark, 
  Sun, 
  Sunrise, 
  Sunset, 
  Wind, 
  Compass, 
  Droplets, 
  Eye, 
  ShieldCheck, 
  Radio
} from 'lucide-react';
import { WeatherData, TemperatureUnit } from '../../types/weather';
import { WeatherIcon } from '../WeatherIcon';

interface DetailsScreenProps {
  weather: WeatherData;
  unit: TemperatureUnit;
  onBack: () => void;
  onSaveCity?: () => void;
  onOpenRadar?: () => void;
}

export const DetailsScreen: React.FC<DetailsScreenProps> = ({
  weather,
  unit,
  onBack,
  onSaveCity,
  onOpenRadar,
}) => {
  const [isSaved, setIsSaved] = useState(false);

  const formatTemp = (celsius: number) => {
    if (unit === 'fahrenheit') {
      return `${Math.round((celsius * 9) / 5 + 32)}°F`;
    }
    return `${Math.round(celsius)}°C`;
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 overflow-y-auto select-none custom-scrollbar pb-6">
      {/* App Bar */}
      <div className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-md px-5 pt-3 pb-3 flex items-center justify-between border-b border-slate-800/40">
        <button 
          id="details-back-btn"
          onClick={onBack} 
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-base font-bold text-white">Weather Details</h2>
        <button 
          id="details-bookmark-btn"
          onClick={() => setIsSaved(!isSaved)}
          className={`p-2 rounded-xl transition-colors ${
            isSaved ? 'text-sky-400 bg-sky-500/10' : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
          }`}
        >
          <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="px-5 pt-4 space-y-5">
        {/* Hero Graphic Card (matching the workout hero photo) */}
        <div className="relative w-full h-48 rounded-3xl overflow-hidden bg-gradient-to-tr from-sky-900 via-indigo-950 to-slate-900 border border-sky-500/20 p-6 flex flex-col justify-between shadow-lg">
          <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-sky-400/15 blur-2xl"></div>
          
          <div className="flex justify-between items-start relative z-10">
            <div>
              <span className="px-2.5 py-1 rounded-full bg-sky-400/20 border border-sky-400/30 text-[11px] font-bold text-sky-300">
                Live Conditions
              </span>
              <h3 className="text-2xl font-extrabold text-white mt-2">
                {weather.city}, {weather.country}
              </h3>
            </div>
            <div className="p-2 bg-white/5 rounded-2xl backdrop-blur-md border border-white/10">
              <WeatherIcon condition={weather.condition} size={42} />
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-4 text-xs font-semibold text-slate-300">
            <span className="text-sky-400 text-lg font-bold">
              {formatTemp(weather.temperature)}
            </span>
            <span>•</span>
            <span>Feels {formatTemp(weather.feelsLike)}</span>
            <span>•</span>
            <span>UV Index {weather.uvIndex}</span>
          </div>
        </div>

        {/* About Section */}
        <div>
          <h3 className="text-sm font-bold text-white mb-2">About Current Weather</h3>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
            Current atmospheric stability shows {weather.description.toLowerCase()} with {weather.humidity}% relative humidity. Barometric pressure is steady at {weather.pressure} hPa, with maximum gust speeds approaching {weather.windSpeed} km/h from the {weather.windDirection}.
          </p>
        </div>

        {/* Environmental Equipment / Sensors (Matching equipment chips in wireframe) */}
        <div>
          <h3 className="text-sm font-bold text-white mb-2">Atmospheric Sensors</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <Compass size={13} className="text-sky-400" />
              Wind: {weather.windDirection} ({weather.windDeg}°)
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <Droplets size={13} className="text-blue-400" />
              Dew Point: 20°C
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <Eye size={13} className="text-emerald-400" />
              Visibility: {weather.visibility} km
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-amber-400" />
              AQI: {weather.airQuality.aqi} ({weather.airQuality.status})
            </span>
          </div>
        </div>

        {/* Sun Cycle Card */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Sunrise size={20} />
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Sunrise</p>
                <p className="text-sm font-bold text-white">{weather.sunrise}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <Sunset size={20} />
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Sunset</p>
                <p className="text-sm font-bold text-white">{weather.sunset}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Dual Action Buttons (Matching Save Workout & Start Workout in wireframe) */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            id="details-save-city-btn"
            onClick={() => {
              setIsSaved(true);
              if (onSaveCity) onSaveCity();
            }}
            className="h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 font-bold text-xs text-white flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Bookmark size={15} />
            <span>{isSaved ? 'Saved in List' : 'Save Location'}</span>
          </button>

          <button
            id="details-open-radar-btn"
            onClick={onOpenRadar}
            className="h-12 rounded-2xl bg-sky-500 hover:bg-sky-400 font-bold text-xs text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-sky-500/25 transition-all"
          >
            <Radio size={15} />
            <span>Live Radar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
