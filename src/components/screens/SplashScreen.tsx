import React from 'react';
import { Cloud, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface SplashScreenProps {
  onGetStarted: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onGetStarted }) => {
  return (
    <div className="relative flex flex-col h-full w-full justify-between p-7 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-white select-none">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {/* Animated App Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative w-28 h-28 rounded-3xl bg-sky-500/10 border-2 border-sky-400/30 flex items-center justify-center shadow-[0_0_40px_rgba(56,189,248,0.25)] mb-8"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-sky-500/20 to-transparent blur-md"></div>
          <Cloud size={58} className="text-sky-400 relative z-10 animate-pulse" />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-3xl font-extrabold tracking-widest text-white mb-2">
            SKYCAST
          </h1>
          <p className="text-xs font-semibold tracking-widest text-sky-400 uppercase mb-4">
            REAL-TIME WEATHER & FORECASTS
          </p>
          <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
            Welcome to SkyCast Flutter Weather. Real-time atmospheric forecasts powered by the OpenWeatherMap API with precision climate analytics.
          </p>
        </motion.div>
      </div>

      {/* Footer controls */}
      <div className="w-full flex flex-col items-center pb-4">
        {/* Pagination indicator dots */}
        <div className="flex items-center gap-2 mb-6">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
          <span className="w-2 h-2 rounded-full bg-slate-700"></span>
          <span className="w-2 h-2 rounded-full bg-slate-700"></span>
        </div>

        {/* Get Started Button */}
        <button
          id="splash-get-started-btn"
          onClick={onGetStarted}
          className="w-full h-13 rounded-2xl bg-sky-500 hover:bg-sky-400 active:scale-[0.98] transition-all font-bold text-white shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Get Started</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
