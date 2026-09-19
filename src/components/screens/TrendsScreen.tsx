import React, { useState } from 'react';
import { Menu, TrendingUp, Droplets, Wind, ShieldAlert, ChevronRight } from 'lucide-react';
import { WeatherData, TemperatureUnit } from '../../types/weather';

interface TrendsScreenProps {
  weather: WeatherData;
  unit: TemperatureUnit;
  onMenuClick?: () => void;
  onViewDetailed?: () => void;
}

export const TrendsScreen: React.FC<TrendsScreenProps> = ({
  weather,
  unit,
  onMenuClick,
  onViewDetailed,
}) => {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');

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
          id="trends-menu-btn"
          onClick={onMenuClick} 
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
        >
          <Menu size={18} />
        </button>
        <h2 className="text-base font-bold text-white">Climate Trends</h2>
        <div className="w-8"></div>
      </div>

      <div className="px-5 pt-4 space-y-5">
        {/* Period Selector (Matching Week, Month, Year tabs) */}
        <div className="flex p-1 rounded-2xl bg-slate-900 border border-slate-800">
          {(['week', 'month', 'year'] as const).map((p) => {
            const isSel = period === p;
            return (
              <button
                key={p}
                id={`trend-period-${p}`}
                onClick={() => setPeriod(p)}
                className={`flex-1 py-2 text-xs font-bold capitalize rounded-xl transition-all ${
                  isSel ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25' : 'text-slate-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* 4 Metric Progress Rows (Matching Steps, Calories, Active Minutes, Weight) */}
        <div className="space-y-3.5">
          {/* 1. Temp avg */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-white flex items-center gap-1.5">
                <TrendingUp size={14} className="text-sky-400" />
                Avg Temperature
              </span>
              <span className="text-slate-400 font-medium">Norm: 29°C</span>
            </div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xl font-extrabold text-white">
                {formatTemp(weather.temperature)} avg
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold">+1.4° seasonal</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-sky-400 rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>

          {/* 2. Rainfall */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Droplets size={14} className="text-blue-400" />
                Rainfall Accumulation
              </span>
              <span className="text-slate-400 font-medium">Target: 60 mm</span>
            </div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xl font-extrabold text-white">
                42.5 mm
              </span>
              <span className="text-[11px] text-blue-400 font-semibold">71% of norm</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '71%' }}></div>
            </div>
          </div>

          {/* 3. Wind Speed */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Wind size={14} className="text-teal-400" />
                Mean Wind Velocity
              </span>
              <span className="text-slate-400 font-medium">Peak: 32 km/h</span>
            </div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xl font-extrabold text-white">
                {weather.windSpeed} km/h
              </span>
              <span className="text-[11px] text-teal-400 font-semibold">Gentle to Moderate</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-teal-400 rounded-full" style={{ width: '55%' }}></div>
            </div>
          </div>

          {/* 4. Air Quality Index */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-white flex items-center gap-1.5">
                <ShieldAlert size={14} className="text-amber-400" />
                Air Quality Index (AQI)
              </span>
              <span className="text-slate-400 font-medium">Ideal: &lt; 50</span>
            </div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xl font-extrabold text-white">
                {weather.airQuality.aqi} AQI
              </span>
              <span className="text-[11px] text-amber-400 font-semibold">{weather.airQuality.status}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: '64%' }}></div>
            </div>
          </div>
        </div>

        {/* Weekly High / Low Range Bars Visualizer */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            7-Day Temperature Range Curves
          </h4>
          <div className="space-y-2">
            {weather.daily.slice(0, 5).map((d, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="w-10 font-bold text-slate-300">{d.day}</span>
                <span className="text-[11px] text-slate-400 w-8">{formatTemp(d.tempMin)}</span>
                <div className="flex-1 mx-3 h-2 rounded-full bg-slate-800 overflow-hidden relative">
                  <div 
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 to-amber-400"
                    style={{ left: `${(d.tempMin / 40) * 100}%`, right: `${100 - (d.tempMax / 40) * 100}%` }}
                  ></div>
                </div>
                <span className="text-[11px] font-bold text-white w-8 text-right">{formatTemp(d.tempMax)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* View Detailed Progress Link */}
        <button
          id="view-detailed-progress-btn"
          onClick={onViewDetailed}
          className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-sky-400 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
        >
          <span>View Historical Climate Archive</span>
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};
