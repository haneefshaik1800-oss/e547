import React, { useState } from 'react';
import { 
  Menu, 
  Bell, 
  Search, 
  Calendar, 
  Thermometer, 
  TrendingUp, 
  Wind, 
  Droplets, 
  Gauge, 
  Eye, 
  MapPin, 
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { WeatherData, TemperatureUnit } from '../../types/weather';
import { WeatherIcon } from '../WeatherIcon';

interface HomeScreenProps {
  weather: WeatherData;
  unit: TemperatureUnit;
  onNavigate: (screen: number) => void;
  onOpenSearch: () => void;
  onToggleUnit: () => void;
  dataSource: 'api' | 'simulation';
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  weather,
  unit,
  onNavigate,
  onOpenSearch,
  onToggleUnit,
  dataSource,
}) => {
  const formatTemp = (celsius: number) => {
    if (unit === 'fahrenheit') {
      return `${Math.round((celsius * 9) / 5 + 32)}°`;
    }
    return `${Math.round(celsius)}°`;
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 overflow-y-auto pb-6 select-none custom-scrollbar">
      {/* App Bar */}
      <div className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-md px-5 pt-3 pb-3 flex items-center justify-between border-b border-slate-800/40">
        <div className="flex items-center gap-3">
          <button 
            id="home-menu-btn"
            onClick={() => onNavigate(8)} 
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            <Menu size={20} />
          </button>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-1.5">
              <span>Hi, User!</span>
              {dataSource === 'api' ? (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Live OWM
                </span>
              ) : (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  Real-Time
                </span>
              )}
            </h2>
            <button 
              id="home-city-selector-btn"
              onClick={onOpenSearch} 
              className="text-xs text-sky-400 flex items-center gap-1 hover:underline text-left"
            >
              <MapPin size={11} />
              <span>{weather.city}, {weather.country}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Unit Switcher */}
          <button
            id="unit-toggle-btn"
            onClick={onToggleUnit}
            className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-sky-400 hover:bg-slate-800 transition-colors"
          >
            {unit === 'celsius' ? '°C' : '°F'}
          </button>
          {/* Notifications button */}
          <button
            id="home-alerts-btn"
            onClick={() => onNavigate(7)}
            className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            <Bell size={18} />
            {weather.alerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-slate-950"></span>
            )}
          </button>
        </div>
      </div>

      <div className="px-5 pt-4 space-y-5">
        {/* Search Bar */}
        <div 
          onClick={onOpenSearch}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800/80 text-slate-400 hover:border-sky-500/40 cursor-pointer transition-all shadow-sm group"
        >
          <Search size={18} className="text-sky-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs text-slate-400">Search forecasts, cities, radar...</span>
        </div>

        {/* Quick Actions (4 circular buttons matching wireframe) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white tracking-wide">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-4 gap-2.5">
            <button
              id="qa-forecast-btn"
              onClick={() => onNavigate(3)}
              className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-sky-500/40 active:scale-95 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-400 group-hover:bg-sky-500/25">
                <Calendar size={20} />
              </div>
              <span className="text-[11px] font-semibold text-slate-300">Forecast</span>
            </button>

            <button
              id="qa-details-btn"
              onClick={() => onNavigate(4)}
              className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-emerald-500/40 active:scale-95 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/25">
                <Thermometer size={20} />
              </div>
              <span className="text-[11px] font-semibold text-slate-300">Details</span>
            </button>

            <button
              id="qa-trends-btn"
              onClick={() => onNavigate(5)}
              className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-amber-500/40 active:scale-95 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/25">
                <TrendingUp size={20} />
              </div>
              <span className="text-[11px] font-semibold text-slate-300">Trends</span>
            </button>

            <button
              id="qa-airquality-btn"
              onClick={() => onNavigate(6)}
              className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-indigo-500/40 active:scale-95 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/25">
                <Wind size={20} />
              </div>
              <span className="text-[11px] font-semibold text-slate-300">Air Quality</span>
            </button>
          </div>
        </div>

        {/* Severe Alert Pill (if present) */}
        {weather.alerts.length > 0 && (
          <div 
            onClick={() => onNavigate(7)}
            className="flex items-center justify-between p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 cursor-pointer hover:bg-amber-500/20 transition-all"
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle size={18} className="text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-amber-300">{weather.alerts[0].title}</p>
                <p className="text-[10px] text-amber-200/80">{weather.alerts[0].time}</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-amber-400 underline">View</span>
          </div>
        )}

        {/* Today's Hero Summary Card */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-sm font-bold text-white tracking-wide">Today's Summary</h3>
            <button 
              id="home-view-all-forecast"
              onClick={() => onNavigate(3)} 
              className="text-xs font-semibold text-sky-400 hover:underline"
            >
              View All
            </button>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 via-sky-700 to-blue-900 p-5 text-white shadow-xl shadow-sky-900/30 border border-sky-400/20">
            {/* Ambient background glow */}
            <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-sky-400/20 blur-2xl"></div>

            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold tracking-tight">
                      {formatTemp(weather.temperature)}
                    </span>
                  </div>
                  <p className="text-base font-bold mt-1 text-white/95">
                    {weather.description}
                  </p>
                  <p className="text-xs text-sky-200/90 mt-0.5">
                    Feels like {formatTemp(weather.feelsLike)} • H: {formatTemp(weather.tempMax)} L: {formatTemp(weather.tempMin)}
                  </p>
                </div>
                <div className="p-2">
                  <WeatherIcon condition={weather.condition} size={54} />
                </div>
              </div>

              {/* 4 Metrics in Grid (Matching the 4 blocks on Screen 2 in image) */}
              <div className="grid grid-cols-4 gap-2 mt-5 pt-4 border-t border-white/15">
                <div className="flex flex-col items-center text-center">
                  <span className="text-xs font-bold">{weather.precipitationProb}%</span>
                  <span className="text-[10px] text-sky-200/80">Rain</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="text-xs font-bold">{weather.windSpeed} km/h</span>
                  <span className="text-[10px] text-sky-200/80">Wind</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="text-xs font-bold">{weather.humidity}%</span>
                  <span className="text-[10px] text-sky-200/80">Humidity</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className="text-xs font-bold">{weather.pressure}</span>
                  <span className="text-[10px] text-sky-200/80">hPa</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hourly Forecast Carousel */}
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide mb-2.5">Hourly Forecast</h3>
          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
            {weather.hourly.map((hour, idx) => (
              <div
                key={idx}
                className={`shrink-0 w-19 py-3 px-2 rounded-2xl flex flex-col items-center justify-between border transition-all ${
                  idx === 0 
                    ? 'bg-sky-500/20 border-sky-400/40 text-white' 
                    : 'bg-slate-900/90 border-slate-800/80 text-slate-300'
                }`}
              >
                <span className="text-[11px] font-medium">{hour.time}</span>
                <div className="my-2">
                  <WeatherIcon condition={hour.condition} size={22} />
                </div>
                <span className="text-xs font-bold">{formatTemp(hour.temp)}</span>
                <span className="text-[9px] text-sky-400 mt-0.5">{hour.precipitation}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
