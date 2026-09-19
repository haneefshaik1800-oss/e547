import { WeatherData, WeatherCondition } from '../types/weather';
import { GLOBAL_CITIES, generateFallbackWeatherForCity } from '../data/mockWeather';

const API_KEY_STORAGE = 'skycast_owm_api_key';

export function getStoredApiKey(): string {
  return localStorage.getItem(API_KEY_STORAGE) || '';
}

export function saveApiKey(key: string): void {
  if (key.trim()) {
    localStorage.setItem(API_KEY_STORAGE, key.trim());
  } else {
    localStorage.removeItem(API_KEY_STORAGE);
  }
}

function mapOwmCondition(main: string, icon: string): WeatherCondition {
  const code = main.toLowerCase();
  if (code.includes('thunder')) return 'thunderstorm';
  if (code.includes('drizzle')) return 'drizzle';
  if (code.includes('rain')) return 'rain';
  if (code.includes('snow')) return 'snow';
  if (code.includes('clear')) return 'clear';
  if (code.includes('cloud')) return 'clouds';
  if (code.includes('mist') || code.includes('fog') || code.includes('haze')) return 'mist';
  if (code.includes('wind') || code.includes('squall')) return 'windy';
  return 'clouds';
}

function getDegreesToDirection(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index] || 'N';
}

export async function fetchWeather(city: string, userApiKey?: string): Promise<{ data: WeatherData; source: 'api' | 'simulation' }> {
  const apiKey = (userApiKey ?? getStoredApiKey()).trim();

  // If user provided an OpenWeatherMap API Key, attempt live API call
  if (apiKey) {
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
      const res = await fetch(weatherUrl);
      
      if (!res.ok) {
        throw new Error(`OpenWeatherMap error: ${res.statusText} (${res.status})`);
      }

      const raw = await res.json();

      // Also attempt forecast
      let forecastList: any[] = [];
      try {
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
        const fRes = await fetch(forecastUrl);
        if (fRes.ok) {
          const fData = await fRes.json();
          forecastList = fData.list || [];
        }
      } catch (e) {
        console.warn('Could not fetch 5-day forecast, building interpolated data', e);
      }

      const condition = mapOwmCondition(raw.weather?.[0]?.main || 'Clear', raw.weather?.[0]?.icon || '01d');
      const temp = Math.round(raw.main.temp);
      const windSpeed = Math.round(raw.wind.speed * 3.6); // m/s to km/h

      // Build hourly from forecastList if available, or generate plausible hourly
      const hourly = forecastList.slice(0, 10).map((item: any, idx: number) => {
        const date = new Date(item.dt * 1000);
        const timeStr = idx === 0 ? 'Now' : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return {
          time: timeStr,
          temp: Math.round(item.main.temp),
          condition: mapOwmCondition(item.weather?.[0]?.main || 'Clear', item.weather?.[0]?.icon || '01d'),
          precipitation: Math.round((item.pop || 0) * 100),
          windSpeed: Math.round(item.wind.speed * 3.6),
        };
      });

      // Build 5/7 daily forecast
      const dailyMap = new Map<string, any>();
      for (const item of forecastList) {
        const date = new Date(item.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        if (!dailyMap.has(dayName)) {
          dailyMap.set(dayName, {
            day: dayName,
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            tempMin: Math.round(item.main.temp_min),
            tempMax: Math.round(item.main.temp_max),
            condition: mapOwmCondition(item.weather?.[0]?.main || 'Clear', item.weather?.[0]?.icon || '01d'),
            description: item.weather?.[0]?.description || 'Clear skies',
            precipitation: Math.round((item.pop || 0) * 100),
            humidity: item.main.humidity,
            windSpeed: Math.round(item.wind.speed * 3.6),
            uvIndex: 6,
          });
        } else {
          const current = dailyMap.get(dayName);
          current.tempMin = Math.min(current.tempMin, Math.round(item.main.temp_min));
          current.tempMax = Math.max(current.tempMax, Math.round(item.main.temp_max));
        }
      }

      const daily = Array.from(dailyMap.values()).slice(0, 7);

      const sunriseDate = new Date(raw.sys.sunrise * 1000);
      const sunsetDate = new Date(raw.sys.sunset * 1000);

      const parsedData: WeatherData = {
        city: raw.name || city,
        country: raw.sys.country || '',
        temperature: temp,
        feelsLike: Math.round(raw.main.feels_like),
        tempMin: Math.round(raw.main.temp_min),
        tempMax: Math.round(raw.main.temp_max),
        condition,
        description: raw.weather?.[0]?.description ? (raw.weather[0].description.charAt(0).toUpperCase() + raw.weather[0].description.slice(1)) : 'Clear sky',
        humidity: raw.main.humidity,
        windSpeed,
        windDirection: getDegreesToDirection(raw.wind.deg || 0),
        windDeg: raw.wind.deg || 0,
        pressure: raw.main.pressure,
        uvIndex: 7, // OpenWeather free tier doesn't include UV in 2.5/weather
        visibility: Math.round((raw.visibility || 10000) / 1000),
        precipitationProb: hourly[0]?.precipitation || 10,
        sunrise: sunriseDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sunset: sunsetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        airQuality: {
          aqi: 45,
          status: 'Good',
          pm25: 12.0,
          pm10: 22.5,
          o3: 28.4,
          no2: 15.0,
        },
        hourly: hourly.length > 0 ? hourly : GLOBAL_CITIES['Hyderabad'].hourly,
        daily: daily.length > 0 ? daily : GLOBAL_CITIES['Hyderabad'].daily,
        alerts: [
          {
            id: 'owm-live-1',
            title: 'Live OpenWeatherMap Stream',
            severity: 'info',
            time: 'Live',
            description: `Connected to OpenWeatherMap API v2.5 for ${raw.name}.`,
            source: 'OpenWeatherMap API',
          }
        ],
        updatedAt: 'Live from OpenWeatherMap',
      };

      return { data: parsedData, source: 'api' };
    } catch (err) {
      console.warn('OpenWeatherMap API fetch failed, falling back to simulated data', err);
    }
  }

  // Fallback / Instant mode
  const normalizedKey = Object.keys(GLOBAL_CITIES).find(
    k => k.toLowerCase() === city.toLowerCase()
  );

  if (normalizedKey && GLOBAL_CITIES[normalizedKey]) {
    return { data: GLOBAL_CITIES[normalizedKey], source: 'simulation' };
  }

  return { data: generateFallbackWeatherForCity(city), source: 'simulation' };
}

export const POPULAR_CITIES = [
  'Hyderabad',
  'London',
  'New York',
  'Tokyo',
  'Paris',
  'Sydney',
  'Dubai',
  'Singapore',
  'San Francisco',
  'Berlin',
  'Mumbai',
  'Toronto',
];
