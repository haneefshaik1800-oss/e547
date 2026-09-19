import React from 'react';
import { Menu, Calendar, CheckCircle2, Wind, Plus, Activity, Sun, Home, Bike } from 'lucide-react';
import { WeatherData } from '../../types/weather';

interface AirQualityScreenProps {
  weather: WeatherData;
  onMenuClick?: () => void;
  onAddStation?: () => void;
}

export const AirQualityScreen: React.FC<AirQualityScreenProps> = ({
  weather,
  onMenuClick,
  onAddStation,
}) => {
  const aq = weather.airQuality;

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 overflow-y-auto select-none custom-scrollbar pb-6">
      {/* App Bar */}
      <div className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-md px-5 pt-3 pb-3 flex items-center justify-between border-b border-slate-800/40">
        <button 
          id="airquality-menu-btn"
          onClick={onMenuClick} 
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
        >
          <Menu size={18} />
        </button>
        <h2 className="text-base font-bold text-white">Air Quality & Conditions</h2>
        <button 
          id="airquality-calendar-btn"
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
        >
          <Calendar size={18} />
        </button>
      </div>

      <div className="px-5 pt-4 space-y-5">
        {/* Main AQI Hero Badge */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Air Quality Index (AQI)
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-extrabold text-amber-400">{aq.aqi}</span>
              <span className="text-sm font-bold text-slate-200">/ 500 US AQI</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Standard: EPA Clean Air Level
            </p>
          </div>
          <div className="px-3.5 py-1.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold text-xs">
            {aq.status}
          </div>
        </div>

        {/* 4 Categorized Pollutants List (Matching the 4 Meals in wireframe: Breakfast, Lunch, Snack, Dinner) */}
        <div>
          <h3 className="text-sm font-bold text-white mb-3">Pollutant Breakdown</h3>
          <div className="space-y-3">
            {/* 1. PM2.5 (Like Breakfast) */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center shrink-0 text-sky-400 font-bold text-xs">
                PM2.5
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white">Fine Particulate</h4>
                <p className="text-xs text-slate-400">{aq.pm25} µg/m³ • Normal Range</p>
              </div>
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 size={18} />
              </div>
            </div>

            {/* 2. PM10 (Like Lunch) */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center shrink-0 text-blue-400 font-bold text-xs">
                PM10
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white">Inhalable Dust</h4>
                <p className="text-xs text-slate-400">{aq.pm10} µg/m³ • Moderate</p>
              </div>
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 size={18} />
              </div>
            </div>

            {/* 3. Ozone (Like Snack) */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center shrink-0 text-indigo-400 font-bold text-xs">
                O₃
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white">Ground-Level Ozone</h4>
                <p className="text-xs text-slate-400">{aq.o3} ppb • Safe Exposure</p>
              </div>
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 size={18} />
              </div>
            </div>

            {/* 4. Nitrogen Dioxide (Like Dinner) */}
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-400/20 flex items-center justify-center shrink-0 text-purple-400 font-bold text-xs">
                NO₂
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white">Nitrogen Dioxide</h4>
                <p className="text-xs text-slate-400">{aq.no2} ppb • Low Traffic</p>
              </div>
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* Outdoor Health Suggestions */}
        <div>
          <h3 className="text-sm font-bold text-white mb-2.5">Health Guidance</h3>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <Bike size={18} className="text-sky-400 mb-1.5" />
              <p className="text-xs font-bold text-white">Outdoor Cycling</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Favorable conditions before 11 AM</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <Home size={18} className="text-emerald-400 mb-1.5" />
              <p className="text-xs font-bold text-white">Open Windows</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Fresh ventilation recommended</p>
            </div>
          </div>
        </div>

        {/* Bottom Add Action (Matching "+ Add Meal" in wireframe) */}
        <button
          id="add-air-station-btn"
          onClick={onAddStation}
          className="w-full h-12 rounded-2xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-400 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Plus size={16} />
          <span>+ Add Weather Station Sensor</span>
        </button>
      </div>
    </div>
  );
};
