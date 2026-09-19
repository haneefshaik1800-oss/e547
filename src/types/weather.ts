export type WeatherCondition = 
  | 'clear' 
  | 'clouds' 
  | 'rain' 
  | 'drizzle' 
  | 'thunderstorm' 
  | 'snow' 
  | 'mist' 
  | 'windy';

export interface WeatherData {
  city: string;
  country: string;
  region?: string;
  temperature: number; // in Celsius
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  condition: WeatherCondition;
  description: string;
  humidity: number; // percentage
  windSpeed: number; // km/h
  windDirection: string;
  windDeg: number;
  pressure: number; // hPa
  uvIndex: number; // 0 - 12
  visibility: number; // km
  precipitationProb: number; // 0 - 100%
  sunrise: string;
  sunset: string;
  airQuality: {
    aqi: number; // 1 to 5 index or 0-300 US AQI
    status: 'Good' | 'Moderate' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
    pm25: number;
    pm10: number;
    o3: number;
    no2: number;
  };
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  alerts: WeatherAlert[];
  updatedAt: string;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  condition: WeatherCondition;
  precipitation: number;
  windSpeed: number;
}

export interface DailyForecast {
  day: string;
  date: string;
  tempMin: number;
  tempMax: number;
  condition: WeatherCondition;
  description: string;
  precipitation: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
}

export interface WeatherAlert {
  id: string;
  title: string;
  severity: 'advisory' | 'watch' | 'warning' | 'info';
  time: string;
  description: string;
  source: string;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface FlutterCodeFile {
  path: string;
  name: string;
  language: string;
  description: string;
  code: string;
}
