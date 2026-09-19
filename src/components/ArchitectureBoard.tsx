import React from 'react';
import { 
  Play, 
  Search, 
  Menu, 
  Bell, 
  Calendar, 
  Thermometer, 
  TrendingUp, 
  Wind, 
  Droplets, 
  Bookmark, 
  ArrowRight, 
  CheckCircle2, 
  User, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { WeatherData, TemperatureUnit } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';

interface ArchitectureBoardProps {
  weather: WeatherData;
  unit: TemperatureUnit;
  onSelectScreen: (screenNum: number) => void;
}

export const ArchitectureBoard: React.FC<ArchitectureBoardProps> = ({
  weather,
  unit,
  onSelectScreen,
}) => {
  const formatTemp = (celsius: number) => {
    if (unit === 'fahrenheit') {
      return `${Math.round((celsius * 9) / 5 + 32)}°`;
    }
    return `${Math.round(celsius)}°`;
  };

  const screens = [
    { id: 1, title: '1. SPLASH SCREEN' },
    { id: 2, title: '2. HOME PAGE' },
    { id: 3, title: '3. FORECAST (CATEGORY)' },
    { id: 4, title: '4. WEATHER DETAILS PAGE' },
    { id: 5, title: '5. CLIMATE TRENDS' },
    { id: 6, title: '6. AIR QUALITY & OUTDOORS' },
    { id: 7, title: '7. NOTIFICATIONS & ALERTS' },
    { id: 8, title: '8. PROFILE & SETTINGS' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Overview Banner */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-sky-400 animate-pulse"></span>
            8-Screen Flutter Weather Application Architecture
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete production-ready mobile architecture matching your wireframe specifications, powered by the OpenWeatherMap API.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/30">
            Location: {weather.city}
          </span>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            Temp: {formatTemp(weather.temperature)}
          </span>
        </div>
      </div>

      {/* 8-Screen Grid (4 columns on desktop, exactly like the 2x4 layout in the uploaded image) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* SCREEN 1: SPLASH SCREEN */}
        <div className="flex flex-col bg-slate-900 rounded-3xl border border-slate-800 p-4 shadow-lg hover:border-sky-500/50 transition-all group">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-500 text-white font-bold text-xs flex items-center justify-center">
                1
              </span>
              <span className="text-xs font-extrabold text-slate-200 tracking-wider">
                1. SPLASH SCREEN
              </span>
            </div>
            <button
              onClick={() => onSelectScreen(1)}
              className="text-[11px] font-bold text-sky-400 hover:underline flex items-center gap-1"
            >
              <span>Test</span>
              <Play size={10} fill="currentColor" />
            </button>
          </div>

          <div className="h-[430px] rounded-2xl bg-slate-950 p-5 flex flex-col items-center justify-between text-center border border-slate-800/80">
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-18 h-18 rounded-2xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center mb-4 text-sky-400 shadow-md">
                <WeatherIcon condition="clear" size={36} />
              </div>
              <h4 className="text-base font-extrabold tracking-widest text-white">SKYCAST</h4>
              <p className="text-[9px] font-bold text-sky-400 tracking-widest uppercase mt-0.5">
                YOUR HEALTH & CLIMATE
              </p>
              <p className="text-[11px] text-slate-400 mt-3 max-w-[190px] leading-relaxed">
                Welcome to SkyCast – Live Weather & Atmospheric Forecasts
              </p>
            </div>
            <div className="w-full">
              <div className="flex justify-center gap-1.5 mb-4">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
              </div>
              <button
                onClick={() => onSelectScreen(1)}
                className="w-full py-2.5 rounded-xl bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-500/20 flex items-center justify-center gap-1"
              >
                <span>Get Started</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* SCREEN 2: HOME PAGE */}
        <div className="flex flex-col bg-slate-900 rounded-3xl border border-slate-800 p-4 shadow-lg hover:border-sky-500/50 transition-all group">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-500 text-white font-bold text-xs flex items-center justify-center">
                2
              </span>
              <span className="text-xs font-extrabold text-slate-200 tracking-wider">
                2. HOME PAGE
              </span>
            </div>
            <button
              onClick={() => onSelectScreen(2)}
              className="text-[11px] font-bold text-sky-400 hover:underline flex items-center gap-1"
            >
              <span>Test</span>
              <Play size={10} fill="currentColor" />
            </button>
          </div>

          <div className="h-[430px] rounded-2xl bg-slate-950 p-4 flex flex-col justify-between border border-slate-800/80 overflow-hidden text-xs">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Menu size={14} className="text-slate-400" />
                  <span className="font-bold text-white">Hi, User!</span>
                </div>
                <Bell size={14} className="text-slate-400" />
              </div>

              {/* Search Bar */}
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-slate-500 mb-3 text-[11px]">
                <Search size={13} className="text-sky-400" />
                <span>Search forecasts, cities...</span>
              </div>

              {/* Quick Actions (4 icon blocks) */}
              <p className="font-bold text-[11px] text-white mb-2">Quick Actions</p>
              <div className="grid grid-cols-4 gap-1.5 mb-3 text-center">
                <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 text-[9px] font-semibold flex flex-col items-center gap-1">
                  <Calendar size={14} />
                  <span>Forecast</span>
                </div>
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-[9px] font-semibold flex flex-col items-center gap-1">
                  <Thermometer size={14} />
                  <span>Details</span>
                </div>
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-[9px] font-semibold flex flex-col items-center gap-1">
                  <TrendingUp size={14} />
                  <span>Trends</span>
                </div>
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-[9px] font-semibold flex flex-col items-center gap-1">
                  <Wind size={14} />
                  <span>Air</span>
                </div>
              </div>

              {/* Today's Summary Card */}
              <p className="font-bold text-[11px] text-white mb-1.5">Today's Summary</p>
              <div className="p-3 rounded-xl bg-sky-600/30 border border-sky-500/30 text-white flex items-center justify-between">
                <div>
                  <span className="text-xl font-extrabold">{formatTemp(weather.temperature)}</span>
                  <p className="text-[10px] text-sky-200">{weather.condition}</p>
                </div>
                <WeatherIcon condition={weather.condition} size={28} />
              </div>
            </div>

            {/* 4 Metrics grid */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <p className="text-[9px] text-slate-400">Precipitation</p>
                <p className="text-xs font-bold text-white">{weather.precipitationProb}%</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <p className="text-[9px] text-slate-400">Wind</p>
                <p className="text-xs font-bold text-white">{weather.windSpeed} km/h</p>
              </div>
            </div>
          </div>
        </div>

        {/* SCREEN 3: FORECAST (CATEGORY) */}
        <div className="flex flex-col bg-slate-900 rounded-3xl border border-slate-800 p-4 shadow-lg hover:border-sky-500/50 transition-all group">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-500 text-white font-bold text-xs flex items-center justify-center">
                3
              </span>
              <span className="text-xs font-extrabold text-slate-200 tracking-wider">
                3. FORECAST (CATEGORY)
              </span>
            </div>
            <button
              onClick={() => onSelectScreen(3)}
              className="text-[11px] font-bold text-sky-400 hover:underline flex items-center gap-1"
            >
              <span>Test</span>
              <Play size={10} fill="currentColor" />
            </button>
          </div>

          <div className="h-[430px] rounded-2xl bg-slate-950 p-4 flex flex-col justify-between border border-slate-800/80 overflow-hidden text-xs">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="font-bold text-white">Forecast Categories</span>
                <Bookmark size={13} className="text-slate-400" />
              </div>

              {/* Category tabs */}
              <div className="flex gap-1.5 mb-3 text-[10px]">
                <span className="px-2 py-1 rounded bg-sky-500 text-white font-bold">All</span>
                <span className="px-2 py-1 rounded bg-slate-900 text-slate-400">7-Day</span>
                <span className="px-2 py-1 rounded bg-slate-900 text-slate-400">Rain %</span>
              </div>

              {/* List items */}
              <div className="space-y-2">
                {weather.daily.slice(0, 3).map((d, i) => (
                  <div key={i} className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <WeatherIcon condition={d.condition} size={18} />
                      <div>
                        <p className="font-bold text-[11px] text-white">{d.day}</p>
                        <p className="text-[9px] text-slate-400">{d.precipitation}% rain</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-sky-400">
                      {formatTemp(d.tempMax)} / {formatTemp(d.tempMin)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Sort / Filter row */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] text-slate-400">
              <span>Sort: Chronological</span>
              <span>Filter: All</span>
            </div>
          </div>
        </div>

        {/* SCREEN 4: WEATHER DETAILS PAGE */}
        <div className="flex flex-col bg-slate-900 rounded-3xl border border-slate-800 p-4 shadow-lg hover:border-sky-500/50 transition-all group">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-500 text-white font-bold text-xs flex items-center justify-center">
                4
              </span>
              <span className="text-xs font-extrabold text-slate-200 tracking-wider">
                4. DETAILS PAGE
              </span>
            </div>
            <button
              onClick={() => onSelectScreen(4)}
              className="text-[11px] font-bold text-sky-400 hover:underline flex items-center gap-1"
            >
              <span>Test</span>
              <Play size={10} fill="currentColor" />
            </button>
          </div>

          <div className="h-[430px] rounded-2xl bg-slate-950 p-4 flex flex-col justify-between border border-slate-800/80 overflow-hidden text-xs">
            <div>
              {/* Graphic Hero */}
              <div className="h-28 rounded-xl bg-gradient-to-r from-sky-900 to-indigo-950 p-3 flex items-center justify-between mb-3">
                <div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-sky-400/20 text-sky-300">
                    Active Condition
                  </span>
                  <h4 className="text-sm font-extrabold text-white mt-1">{weather.city}</h4>
                  <p className="text-xs font-bold text-sky-300">{formatTemp(weather.temperature)}</p>
                </div>
                <WeatherIcon condition={weather.condition} size={36} />
              </div>

              {/* About Synopsis */}
              <p className="font-bold text-[11px] text-white mb-1">Atmospheric Synopsis</p>
              <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-3 mb-3">
                {weather.description}. Barometer steady at {weather.pressure} hPa with wind gusts reaching {weather.windSpeed} km/h.
              </p>

              {/* Environmental sensors */}
              <p className="font-bold text-[11px] text-white mb-1.5">Sensor Readouts</p>
              <div className="flex flex-wrap gap-1.5 text-[9px]">
                <span className="px-2 py-1 rounded bg-slate-900 text-slate-300">UV {weather.uvIndex}</span>
                <span className="px-2 py-1 rounded bg-slate-900 text-slate-300">Humidity {weather.humidity}%</span>
                <span className="px-2 py-1 rounded bg-slate-900 text-slate-300">Visibility {weather.visibility}km</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => onSelectScreen(4)}
                className="py-2 rounded-lg bg-slate-900 text-slate-300 text-[10px] font-bold"
              >
                Save City
              </button>
              <button
                onClick={() => onSelectScreen(4)}
                className="py-2 rounded-lg bg-sky-500 text-white text-[10px] font-bold"
              >
                Live Radar
              </button>
            </div>
          </div>
        </div>

        {/* SCREEN 5: CLIMATE TRENDS */}
        <div className="flex flex-col bg-slate-900 rounded-3xl border border-slate-800 p-4 shadow-lg hover:border-sky-500/50 transition-all group">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-500 text-white font-bold text-xs flex items-center justify-center">
                5
              </span>
              <span className="text-xs font-extrabold text-slate-200 tracking-wider">
                5. MY PROGRESS (TRENDS)
              </span>
            </div>
            <button
              onClick={() => onSelectScreen(5)}
              className="text-[11px] font-bold text-sky-400 hover:underline flex items-center gap-1"
            >
              <span>Test</span>
              <Play size={10} fill="currentColor" />
            </button>
          </div>

          <div className="h-[430px] rounded-2xl bg-slate-950 p-4 flex flex-col justify-between border border-slate-800/80 overflow-hidden text-xs">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-white">Weather Trends</span>
                <TrendingUp size={14} className="text-sky-400" />
              </div>

              {/* Segment tab */}
              <div className="flex p-1 rounded-xl bg-slate-900 mb-3 text-[10px]">
                <span className="flex-1 py-1 text-center rounded bg-sky-500 text-white font-bold">Week</span>
                <span className="flex-1 py-1 text-center text-slate-400">Month</span>
                <span className="flex-1 py-1 text-center text-slate-400">Year</span>
              </div>

              {/* Progress rows */}
              <div className="space-y-2.5 text-[10px]">
                <div>
                  <div className="flex justify-between text-white font-bold mb-0.5">
                    <span>Avg Temperature</span>
                    <span>{formatTemp(weather.temperature)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-sky-400 rounded-full w-[75%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-white font-bold mb-0.5">
                    <span>Rainfall Total</span>
                    <span>42 mm</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full w-[65%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-white font-bold mb-0.5">
                    <span>Mean Wind Speed</span>
                    <span>{weather.windSpeed} km/h</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-teal-400 rounded-full w-[50%]"></div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectScreen(5)}
              className="w-full py-2 rounded-xl bg-slate-900 text-sky-400 font-bold text-[10px] text-center"
            >
              View Detailed Analytics
            </button>
          </div>
        </div>

        {/* SCREEN 6: AIR QUALITY & MEALS */}
        <div className="flex flex-col bg-slate-900 rounded-3xl border border-slate-800 p-4 shadow-lg hover:border-sky-500/50 transition-all group">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-500 text-white font-bold text-xs flex items-center justify-center">
                6
              </span>
              <span className="text-xs font-extrabold text-slate-200 tracking-wider">
                6. AIR QUALITY (CONDITIONS)
              </span>
            </div>
            <button
              onClick={() => onSelectScreen(6)}
              className="text-[11px] font-bold text-sky-400 hover:underline flex items-center gap-1"
            >
              <span>Test</span>
              <Play size={10} fill="currentColor" />
            </button>
          </div>

          <div className="h-[430px] rounded-2xl bg-slate-950 p-4 flex flex-col justify-between border border-slate-800/80 overflow-hidden text-xs">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-white">Today's Air Quality</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[9px]">
                  {weather.airQuality.status}
                </span>
              </div>

              {/* 4 Breakdown items with green checkmarks */}
              <div className="space-y-2 text-[10px]">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">PM2.5 Fine Particles</p>
                    <p className="text-slate-400">{weather.airQuality.pm25} µg/m³</p>
                  </div>
                  <CheckCircle2 size={15} className="text-emerald-400" />
                </div>

                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">PM10 Inhalable Dust</p>
                    <p className="text-slate-400">{weather.airQuality.pm10} µg/m³</p>
                  </div>
                  <CheckCircle2 size={15} className="text-emerald-400" />
                </div>

                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">Ozone (O₃)</p>
                    <p className="text-slate-400">{weather.airQuality.o3} ppb</p>
                  </div>
                  <CheckCircle2 size={15} className="text-emerald-400" />
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectScreen(6)}
              className="w-full py-2 rounded-xl bg-sky-500/20 text-sky-400 font-bold text-[10px] text-center"
            >
              + Add Weather Station Sensor
            </button>
          </div>
        </div>

        {/* SCREEN 7: NOTIFICATIONS */}
        <div className="flex flex-col bg-slate-900 rounded-3xl border border-slate-800 p-4 shadow-lg hover:border-sky-500/50 transition-all group">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-500 text-white font-bold text-xs flex items-center justify-center">
                7
              </span>
              <span className="text-xs font-extrabold text-slate-200 tracking-wider">
                7. NOTIFICATIONS & ALERTS
              </span>
            </div>
            <button
              onClick={() => onSelectScreen(7)}
              className="text-[11px] font-bold text-sky-400 hover:underline flex items-center gap-1"
            >
              <span>Test</span>
              <Play size={10} fill="currentColor" />
            </button>
          </div>

          <div className="h-[430px] rounded-2xl bg-slate-950 p-4 flex flex-col justify-between border border-slate-800/80 overflow-hidden text-xs">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-white">Notifications</span>
                <Bell size={14} className="text-sky-400" />
              </div>

              <div className="space-y-2 text-[10px]">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-amber-500/30">
                  <p className="font-bold text-amber-300">Thunderstorm Watch</p>
                  <p className="text-slate-300 text-[9px] mt-0.5">Isolated rain showers & lightning</p>
                  <span className="text-[8px] text-slate-500 mt-1 block">10:00 AM</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="font-bold text-white">Daily UV Rating: 8</p>
                  <p className="text-slate-300 text-[9px] mt-0.5">High midday exposure warning</p>
                  <span className="text-[8px] text-slate-500 mt-1 block">09:15 AM</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="font-bold text-white">Morning Forecast Digest</p>
                  <p className="text-slate-300 text-[9px] mt-0.5">Sunny start with high of 33°C</p>
                  <span className="text-[8px] text-slate-500 mt-1 block">Yesterday</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectScreen(7)}
              className="w-full py-2 rounded-xl bg-slate-900 text-sky-400 font-bold text-[10px] text-center"
            >
              View All Notifications
            </button>
          </div>
        </div>

        {/* SCREEN 8: PROFILE & SETTINGS */}
        <div className="flex flex-col bg-slate-900 rounded-3xl border border-slate-800 p-4 shadow-lg hover:border-sky-500/50 transition-all group">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-500 text-white font-bold text-xs flex items-center justify-center">
                8
              </span>
              <span className="text-xs font-extrabold text-slate-200 tracking-wider">
                8. PROFILE & SETTINGS
              </span>
            </div>
            <button
              onClick={() => onSelectScreen(8)}
              className="text-[11px] font-bold text-sky-400 hover:underline flex items-center gap-1"
            >
              <span>Test</span>
              <Play size={10} fill="currentColor" />
            </button>
          </div>

          <div className="h-[430px] rounded-2xl bg-slate-950 p-4 flex flex-col justify-between border border-slate-800/80 overflow-hidden text-xs">
            <div>
              {/* User Profile info */}
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800 mb-3">
                <div className="w-9 h-9 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                  <User size={16} />
                </div>
                <div>
                  <p className="font-bold text-white text-[11px]">Explorer</p>
                  <p className="text-[9px] text-slate-400">{weather.city}, {weather.country}</p>
                </div>
              </div>

              {/* Menu items */}
              <div className="space-y-1.5 text-[10px]">
                <div className="p-2 rounded-lg bg-slate-900 flex items-center justify-between text-slate-300">
                  <span>Saved Locations</span>
                  <ChevronRight size={13} className="text-slate-500" />
                </div>
                <div className="p-2 rounded-lg bg-slate-900 flex items-center justify-between text-slate-300">
                  <span>Temperature Unit</span>
                  <span className="font-bold text-sky-400">{unit === 'celsius' ? '°C' : '°F'}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 flex items-center justify-between text-slate-300">
                  <span>OpenWeatherMap API</span>
                  <span className="text-[9px] text-emerald-400">Connected</span>
                </div>
                <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-between text-sky-300 font-bold">
                  <span>Flutter Dart Code</span>
                  <ChevronRight size={13} />
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectScreen(8)}
              className="w-full py-2 rounded-xl bg-slate-900 text-rose-400 font-bold text-[10px] text-center"
            >
              Open Profile & Code Exporter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
