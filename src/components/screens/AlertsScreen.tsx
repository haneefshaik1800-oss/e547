import React from 'react';
import { Menu, Bell, AlertTriangle, Sun, Wind, CloudRain, CheckCircle, ChevronRight } from 'lucide-react';
import { WeatherData } from '../../types/weather';

interface AlertsScreenProps {
  weather: WeatherData;
  onMenuClick?: () => void;
  onViewAll?: () => void;
}

export const AlertsScreen: React.FC<AlertsScreenProps> = ({
  weather,
  onMenuClick,
  onViewAll,
}) => {
  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 overflow-y-auto select-none custom-scrollbar pb-6">
      {/* App Bar */}
      <div className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-md px-5 pt-3 pb-3 flex items-center justify-between border-b border-slate-800/40">
        <button 
          id="alerts-menu-btn"
          onClick={onMenuClick} 
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
        >
          <Menu size={18} />
        </button>
        <h2 className="text-base font-bold text-white">Weather Alerts</h2>
        <button 
          id="alerts-bell-btn"
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
        >
          <Bell size={18} />
        </button>
      </div>

      <div className="px-5 pt-4 space-y-4">
        {/* Notifications List (Matching Screen 7 in wireframe) */}
        <div className="space-y-3">
          {/* Notification 1 */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-500/50 transition-all">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
                <AlertTriangle size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">Afternoon Thunderstorm Advisory</h4>
                  <span className="text-[10px] text-slate-400">10:00 AM</span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Isolated convective thunderstorm clusters expected between 3:30 PM - 7:00 PM with gusty winds up to 35 km/h.
                </p>
              </div>
            </div>
          </div>

          {/* Notification 2 */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center shrink-0 text-sky-400">
                <Sun size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">High UV Exposure Notice</h4>
                  <span className="text-[10px] text-slate-400">09:15 AM</span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Solar ultraviolet index reaches peak level 8. SPF 30+ sunscreen and protective sunglasses recommended.
                </p>
              </div>
            </div>
          </div>

          {/* Notification 3 */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center shrink-0 text-teal-400">
                <Wind size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">Gentle Coastal Gust Advisory</h4>
                  <span className="text-[10px] text-slate-400">Yesterday</span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Breezy southwesterly flow settled with average speeds of 18 km/h. Clean airflow across the metropolitan zone.
                </p>
              </div>
            </div>
          </div>

          {/* Notification 4 */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-400">
                <CloudRain size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">Weekly Precipitation Report</h4>
                  <span className="text-[10px] text-slate-400">2 days ago</span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Total accumulated rainfall for the preceding 7-day period reached 42.5 mm, supporting agricultural reservoirs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* View All Notifications Link (Matching bottom link in wireframe) */}
        <div className="pt-2">
          <button
            id="view-all-notifications-btn"
            onClick={onViewAll}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-sky-400 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <span>View All Historical Bulletins</span>
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
