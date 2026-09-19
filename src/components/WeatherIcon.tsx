import React from 'react';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudDrizzle, 
  CloudLightning, 
  CloudSnow, 
  CloudFog, 
  Wind, 
  Moon,
  CloudSun
} from 'lucide-react';
import { WeatherCondition } from '../types/weather';

interface WeatherIconProps {
  condition: WeatherCondition;
  className?: string;
  size?: number;
  animate?: boolean;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  condition, 
  className = '', 
  size = 28,
  animate = true 
}) => {
  switch (condition) {
    case 'clear':
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <Sun 
            size={size} 
            className={`text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.5)] ${animate ? 'animate-spin-slow' : ''}`} 
          />
        </div>
      );
    case 'clouds':
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <CloudSun 
            size={size} 
            className="text-sky-300 drop-shadow-[0_0_10px_rgba(56,189,248,0.3)]" 
          />
        </div>
      );
    case 'rain':
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <CloudRain 
            size={size} 
            className="text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.4)]" 
          />
        </div>
      );
    case 'drizzle':
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <CloudDrizzle 
            size={size} 
            className="text-cyan-300 drop-shadow-[0_0_8px_rgba(103,232,249,0.3)]" 
          />
        </div>
      );
    case 'thunderstorm':
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <CloudLightning 
            size={size} 
            className="text-amber-300 drop-shadow-[0_0_14px_rgba(252,211,77,0.6)]" 
          />
        </div>
      );
    case 'snow':
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <CloudSnow 
            size={size} 
            className="text-indigo-200 drop-shadow-[0_0_10px_rgba(199,210,254,0.4)]" 
          />
        </div>
      );
    case 'mist':
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <CloudFog 
            size={size} 
            className="text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.3)]" 
          />
        </div>
      );
    case 'windy':
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <Wind 
            size={size} 
            className="text-teal-300 drop-shadow-[0_0_8px_rgba(94,234,212,0.3)]" 
          />
        </div>
      );
    default:
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <Sun size={size} className="text-amber-400" />
        </div>
      );
  }
};
