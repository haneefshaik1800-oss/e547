import React, { useState } from 'react';
import { ArrowLeft, SlidersHorizontal, Bookmark, ArrowUpDown, CloudRain } from 'lucide-react';
import { WeatherData, TemperatureUnit } from '../../types/weather';
import { WeatherIcon } from '../WeatherIcon';

interface ForecastScreenProps {
  weather: WeatherData;
  unit: TemperatureUnit;
  onBack: () => void;
  onSelectDay?: (index: number) => void;
}

export const ForecastScreen: React.FC<ForecastScreenProps> = ({
  weather,
  unit,
  onBack,
  onSelectDay,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | '7day' | 'rain' | 'wind'>('all');
  const [bookmarkedDays, setBookmarkedDays] = useState<number[]>([]);

  const formatTemp = (celsius: number) => {
    if (unit === 'fahrenheit') {
      return `${Math.round((celsius * 9) / 5 + 32)}°`;
    }
    return `${Math.round(celsius)}°`;
  };

  const toggleBookmark = (idx: number) => {
    setBookmarkedDays(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 overflow-y-auto select-none custom-scrollbar">
      {/* App Bar */}
      <div className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-md px-5 pt-3 pb-3 flex items-center justify-between border-b border-slate-800/40">
        <div className="flex items-center gap-3">
          <button 
            id="forecast-back-btn"
            onClick={onBack} 
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-base font-bold text-white">Forecast Categories</h2>
        </div>
        <button 
          id="forecast-filter-icon"
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
        >
          <SlidersHorizontal size={18} />
        </button>
      </div>

      <div className="px-5 pt-4 pb-20 space-y-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {(['all', '7day', 'rain', 'wind'] as const).map((tab) => {
            const labels = { all: 'All', '7day': '7-Day', rain: 'Precipitation', wind: 'Wind & UV' };
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                id={`forecast-tab-${tab}`}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>

        {/* Forecast List Items (Matching Workouts list cards) */}
        <div className="space-y-3">
          {weather.daily.map((day, idx) => {
            const isSaved = bookmarkedDays.includes(idx);
            return (
              <div
                key={idx}
                id={`forecast-card-${idx}`}
                onClick={() => onSelectDay && onSelectDay(idx)}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-sky-500/40 transition-all cursor-pointer group"
              >
                {/* Thumbnail Icon Box */}
                <div className="w-13 h-13 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <WeatherIcon condition={day.condition} size={28} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white truncate">{day.day}</h4>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-medium">
                      {day.date}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {day.description}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-300 font-medium">
                    <span className="text-sky-400 font-bold">
                      {formatTemp(day.tempMax)} / {formatTemp(day.tempMin)}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <CloudRain size={12} className="text-blue-400" />
                      {day.precipitation}%
                    </span>
                    <span className="text-slate-400">
                      Wind {day.windSpeed} km/h
                    </span>
                  </div>
                </div>

                {/* Bookmark Icon */}
                <button
                  id={`bookmark-day-${idx}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(idx);
                  }}
                  className={`p-2 rounded-xl transition-colors ${
                    isSaved ? 'text-sky-400 bg-sky-500/10' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Sticky Sort & Filter Bar (Matching wireframe bottom controls) */}
      <div className="sticky bottom-0 z-20 bg-slate-950/95 backdrop-blur-md px-5 py-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-300">
        <button id="forecast-sort-btn" className="flex items-center gap-1.5 hover:text-sky-400 transition-colors">
          <ArrowUpDown size={15} />
          <span>Sort: Day Order</span>
        </button>
        <button id="forecast-filter-btn" className="flex items-center gap-1.5 hover:text-sky-400 transition-colors">
          <SlidersHorizontal size={15} />
          <span>Filter: All Rain & Temp</span>
        </button>
      </div>
    </div>
  );
};
