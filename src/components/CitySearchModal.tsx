import React, { useState } from 'react';
import { Search, MapPin, X, Globe, Sparkles } from 'lucide-react';
import { POPULAR_CITIES } from '../services/weatherService';

interface CitySearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCity: (city: string) => void;
  currentCity: string;
}

export const CitySearchModal: React.FC<CitySearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCity,
  currentCity,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSelectCity(query.trim());
      onClose();
      setQuery('');
    }
  };

  const filteredCities = POPULAR_CITIES.filter(c =>
    c.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe size={20} className="text-sky-400" />
            <h3 className="text-base font-bold text-white">Select City & Forecast</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type any city (e.g. Hyderabad, London, Tokyo)..."
            autoFocus
            className="w-full pl-10 pr-20 py-3 rounded-2xl bg-slate-950 border border-slate-700/80 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-sky-500 transition-colors shadow-inner"
          />
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-400" />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-xs font-bold text-white transition-colors"
          >
            Search
          </button>
        </form>

        {/* Popular Cities Grid */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Sparkles size={13} className="text-sky-400" />
            <span>Popular Global Locations</span>
          </p>
          <div className="grid grid-cols-3 gap-2">
            {filteredCities.map((city) => {
              const isSelected = city.toLowerCase() === currentCity.toLowerCase();
              return (
                <button
                  key={city}
                  onClick={() => {
                    onSelectCity(city);
                    onClose();
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500 text-white font-bold shadow-md shadow-sky-500/20'
                      : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-sky-500/40 hover:text-white'
                  }`}
                >
                  <MapPin size={11} className={isSelected ? 'text-white' : 'text-sky-400'} />
                  <span className="truncate">{city}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-2 text-[11px] text-slate-400 text-center border-t border-slate-800">
          Powered by OpenWeatherMap API & Live Meteorological Simulation
        </div>
      </div>
    </div>
  );
};
