'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Wind, 
  Thermometer,
  Droplets,
  Eye,
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  Calendar,
  AlertTriangle,
  Loader,
  Search,
  Navigation,
  Sunrise,
  Sunset,
  Users
} from 'lucide-react';
import Link from 'next/link';

interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  description: string;
  pressure: number;
  visibility: number;
  cloudCover: number;
  sunrise: number;
  sunset: number;
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
}

interface ForecastDay {
  date: string;
  high: number;
  low: number;
  condition: string;
  description: string;
  precipitation: number;
  windSpeed: number;
  icon: string;
}

interface WeatherAlert {
  id: string;
  title: string;
  description: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  start: number;
  end: number;
  event: string;
}

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

const Weather: React.FC = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [weatherTheme, setWeatherTheme] = useState('default');

  const fetchWeatherByCoords = useCallback(async (lat: number, lon: number) => {
    if (!API_KEY) {
      setError('Weather API key not configured. Please add your OpenWeatherMap API key to .env.local');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      
      if (!currentResponse.ok) {
        throw new Error('Failed to fetch current weather');
      }

      const currentData = await currentResponse.json();
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      if (!forecastResponse.ok) {
        throw new Error('Failed to fetch weather forecast');
      }

      const forecastData = await forecastResponse.json();

      const weatherData: WeatherData = {
        temperature: Math.round(currentData.main.temp),
        feelsLike: Math.round(currentData.main.feels_like),
        humidity: currentData.main.humidity,
        windSpeed: Math.round(currentData.wind.speed * 3.6),
        condition: currentData.weather[0].main,
        description: currentData.weather[0].description,
        pressure: currentData.main.pressure,
        visibility: Math.round((currentData.visibility || 10000) / 1000),
        cloudCover: currentData.clouds.all,
        sunrise: currentData.sys.sunrise,
        sunset: currentData.sys.sunset,
        location: {
          name: currentData.name,
          country: currentData.sys.country,
          lat: currentData.coord.lat,
          lon: currentData.coord.lon
        }
      };

      setCurrentWeather(weatherData);

      const dailyForecasts: ForecastDay[] = [];
      const processedDates = new Set();

      forecastData.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const dateString = date.toLocaleDateString();
        
        if (!processedDates.has(dateString) && dailyForecasts.length < 5) {
          processedDates.add(dateString);
          
          dailyForecasts.push({
            date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            high: Math.round(item.main.temp_max),
            low: Math.round(item.main.temp_min),
            condition: item.weather[0].main,
            description: item.weather[0].description,
            precipitation: Math.round((item.pop || 0) * 100),
            windSpeed: Math.round(item.wind.speed * 3.6),
            icon: item.weather[0].icon
          });
        }
      });

      setForecast(dailyForecasts);

      const condition = currentData.weather[0].main.toLowerCase();
      if (condition.includes('clear') || condition.includes('sun')) {
        setWeatherTheme('sunny');
      } else if (condition.includes('rain')) {
        setWeatherTheme('rainy');
      } else if (condition.includes('cloud')) {
        setWeatherTheme('cloudy');
      } else {
        setWeatherTheme('default');
      }

      if (weatherData.temperature > 35) {
        setAlerts([{
          id: 'heat-warning',
          title: 'Heat Wave Warning',
          description: 'Extremely high temperatures expected. Avoid outdoor activities during peak hours.',
          severity: 'severe',
          start: Date.now() / 1000,
          end: (Date.now() + 24 * 60 * 60 * 1000) / 1000,
          event: 'Heat Wave'
        }]);
      } else if (dailyForecasts[0]?.precipitation > 70) {
        setAlerts([{
          id: 'rain-warning',
          title: 'Heavy Rain Expected',
          description: 'Heavy rainfall expected in the next 24 hours. Prepare for possible flooding.',
          severity: 'moderate',
          start: Date.now() / 1000,
          end: (Date.now() + 24 * 60 * 60 * 1000) / 1000,
          event: 'Heavy Rain'
        }]);
      } else {
        setAlerts([]);
      }

    } catch (err: any) {
      console.error('Weather fetch error:', err);
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchWeatherByCity = useCallback(async (cityName: string) => {
    if (!API_KEY) {
      setError('Weather API key not configured. Please add your OpenWeatherMap API key to .env.local');
      setIsLoading(false);
      return;
    }

    try {
      const geocodeResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${API_KEY}`
      );

      if (!geocodeResponse.ok) {
        throw new Error('City not found');
      }

      const geocodeData = await geocodeResponse.json();
      
      if (geocodeData.length === 0) {
        throw new Error('City not found');
      }

      const { lat, lon } = geocodeData[0];
      await fetchWeatherByCoords(lat, lon);
    } catch (err: any) {
      console.error('City search error:', err);
      setError(err.message || 'Failed to find city');
      setIsLoading(false);
    }
  }, [fetchWeatherByCoords]);

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          fetchWeatherByCity('New Delhi');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 }
      );
    } else {
      fetchWeatherByCity('New Delhi');
    }
  }, [fetchWeatherByCoords, fetchWeatherByCity]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchLocation.trim()) return;
    
    setIsSearching(true);
    await fetchWeatherByCity(searchLocation.trim());
    setIsSearching(false);
  };

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  const getWeatherIcon = (condition: string, size: string = 'w-8 h-8') => {
    const iconClass = `${size} text-blue-600`;
    
    switch (condition.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return <Sun className={iconClass} />;
      case 'clouds':
      case 'cloudy':
        return <Cloud className={iconClass} />;
      case 'rain':
        return <CloudRain className={iconClass} />;
      default:
        return <Sun className={iconClass} />;
    }
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'extreme': return 'bg-red-600 text-white border-red-700';
      case 'severe': return 'bg-orange-600 text-white border-orange-700';
      case 'moderate': return 'bg-yellow-500 text-white border-yellow-600';
      case 'minor': return 'bg-blue-500 text-white border-blue-600';
      default: return 'bg-gray-500 text-white border-gray-600';
    }
  };

  const getThemeClasses = () => {
    switch (weatherTheme) {
      case 'sunny':
        return {
          background: 'bg-gradient-to-br from-yellow-200 via-orange-200 to-red-200',
          cardBg: 'bg-white/90 backdrop-blur-sm',
          primary: 'text-orange-600'
        };
      case 'rainy':
        return {
          background: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600',
          cardBg: 'bg-white/90 backdrop-blur-md',
          primary: 'text-blue-700'
        };
      case 'cloudy':
        return {
          background: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500',
          cardBg: 'bg-white/95 backdrop-blur-sm',
          primary: 'text-gray-700'
        };
      default:
        return {
          background: 'bg-gradient-to-br from-blue-50 to-cyan-50',
          cardBg: 'bg-white shadow-lg',
          primary: 'text-blue-600'
        };
    }
  };

  const theme = getThemeClasses();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Weather Data Unavailable</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              getCurrentLocation();
            }}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!currentWeather) return null;

  return (
    <div className={`min-h-screen ${theme.background} relative`}>
      <header className={`${theme.cardBg} shadow-sm border-b relative z-10`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <motion.div 
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                {getWeatherIcon(currentWeather.condition, 'w-10 h-10')}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Weather Forecast</h1>
                  <p className="text-sm text-gray-600">
                    {currentWeather.location.name}, {currentWeather.location.country}
                  </p>
                </div>
              </motion.div>
            </div>

            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="Search city..."
                  className="border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 text-gray-900 placeholder-gray-500"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center"
              >
                {isSearching ? <Loader className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              </button>
              <button
                type="button"
                onClick={getCurrentLocation}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Use current location"
              >
                <Navigation className="w-5 h-5 text-gray-600" />
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <AnimatePresence>
          {alerts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 space-y-4"
            >
              {alerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  className={`p-4 rounded-lg border-2 ${getAlertSeverityColor(alert.severity)}`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-lg mb-1">{alert.title}</h3>
                      <p className="text-sm opacity-90 mb-2">{alert.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`lg:col-span-2 ${theme.cardBg} rounded-xl shadow-xl p-8 border`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Current Weather</h2>
              <div className="flex items-center space-x-2 text-gray-500">
                <Calendar className="w-5 h-5" />
                <span>{new Date().toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <motion.div 
                  className="flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {getWeatherIcon(currentWeather.condition, 'w-20 h-20')}
                  <div className="ml-6">
                    <span className="text-6xl font-bold text-gray-900">
                      {currentWeather.temperature}°C
                    </span>
                    <p className="text-lg text-gray-500">
                      Feels like {currentWeather.feelsLike}°C
                    </p>
                  </div>
                </motion.div>
                <p className="text-2xl text-gray-700 mb-2 capitalize">{currentWeather.description}</p>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Sunrise className="w-4 h-4" />
                    <span>{new Date(currentWeather.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Sunset className="w-4 h-4" />
                    <span>{new Date(currentWeather.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { icon: Droplets, label: 'Humidity', value: `${currentWeather.humidity}%`, color: 'text-blue-500' },
                  { icon: Wind, label: 'Wind Speed', value: `${currentWeather.windSpeed} km/h`, color: 'text-gray-500' },
                  { icon: Thermometer, label: 'Pressure', value: `${currentWeather.pressure} hPa`, color: 'text-red-500' },
                  { icon: Eye, label: 'Visibility', value: `${currentWeather.visibility} km`, color: 'text-gray-500' },
                  { icon: Cloud, label: 'Cloud Cover', value: `${currentWeather.cloudCover}%`, color: 'text-gray-600' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                      <span className="text-gray-700 font-medium">{item.label}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{item.value}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`${theme.cardBg} rounded-xl shadow-xl p-6 border`}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-green-500" />
                Air Quality
              </h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">Good</div>
                <p className="text-gray-600 text-sm">Air quality is satisfactory</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`${theme.cardBg} rounded-xl shadow-xl p-6 border`}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Thermometer className="w-5 h-5 mr-2 text-orange-500" />
                Comfort Level
              </h3>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-2">
                  {currentWeather.temperature > 30 ? 'Hot' : 
                   currentWeather.temperature < 10 ? 'Cold' : 
                   currentWeather.humidity > 80 ? 'Humid' : 'Comfortable'}
                </div>
                <p className="text-gray-600 text-sm">
                  {currentWeather.temperature}°C feels like {currentWeather.feelsLike}°C
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`mt-8 ${theme.cardBg} rounded-xl shadow-xl p-8 border`}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">5-Day Forecast</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {forecast.map((day, index) => (
              <motion.div
                key={index}
                className="text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 hover:shadow-lg cursor-pointer"
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="font-bold text-gray-900 mb-3 text-lg">{day.date}</p>
                <div className="flex justify-center mb-3">
                  {getWeatherIcon(day.condition, 'w-12 h-12')}
                </div>
                <p className="text-sm text-gray-600 mb-3 capitalize">{day.description}</p>
                <div className="flex items-center justify-center space-x-3 mb-3">
                  <div className="flex items-center space-x-1">
                    <ArrowUp className="w-4 h-4 text-red-500" />
                    <span className="font-bold text-lg">{day.high}°</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ArrowDown className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-600">{day.low}°</span>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex items-center justify-center space-x-1">
                    <Droplets className="w-3 h-3 text-blue-500" />
                    <span>{day.precipitation}%</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <Wind className="w-3 h-3 text-gray-500" />
                    <span>{day.windSpeed} km/h</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className={`mt-8 ${theme.cardBg} rounded-xl shadow-xl p-8 border border-green-200 bg-gradient-to-r from-green-50 to-blue-50`}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center border-b border-gray-200 pb-4">🌾 Agricultural Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Irrigation Advisory',
                content: `With ${currentWeather.humidity}% humidity and ${forecast[0]?.precipitation || 0}% rain chance today, ${
                  currentWeather.humidity > 70 ? 'reduce irrigation frequency' : 
                  currentWeather.humidity < 40 ? 'increase irrigation frequency' : 
                  'maintain normal irrigation schedule'
                }.`,
                color: 'green',
                icon: Droplets
              },
              {
                title: 'Pest Management',
                content: `Current conditions (${currentWeather.temperature}°C, ${currentWeather.humidity}% humidity) are ${
                  currentWeather.humidity > 75 && currentWeather.temperature > 25 ? 'favorable for fungal diseases. Apply preventive measures.' :
                  currentWeather.humidity < 50 && currentWeather.temperature > 30 ? 'suitable for pest activity. Monitor crops closely.' :
                  'moderate for pest and disease pressure. Continue regular monitoring.'
                }`,
                color: 'blue',
                icon: AlertTriangle
              },
              {
                title: 'Field Activities',
                content: `Wind speed is ${currentWeather.windSpeed} km/h. ${
                  currentWeather.windSpeed > 20 ? 'Not suitable for spraying operations.' :
                  currentWeather.windSpeed < 5 ? 'Good conditions for all field activities.' :
                  'Suitable for most field operations.'
                } Temperature: ${currentWeather.temperature}°C.`,
                color: 'yellow',
                icon: Wind
              },
              {
                title: 'Harvest Planning',
                content: `Weather conditions are ${
                  currentWeather.cloudCover < 30 && currentWeather.windSpeed > 5 ? 'excellent for harvesting and drying activities.' :
                  currentWeather.cloudCover > 70 || forecast[0]?.precipitation > 50 ? 'not suitable for harvesting. Wait for better conditions.' :
                  'moderately suitable for harvest operations.'
                }`,
                color: 'purple',
                icon: Sun
              }
            ].map((recommendation, index) => (
              <motion.div
                key={index}
                className={`bg-${recommendation.color}-50 border border-${recommendation.color}-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300`}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center mb-3">
                  <recommendation.icon className={`w-6 h-6 text-${recommendation.color}-600 mr-3`} />
                  <h3 className="font-bold text-gray-900 text-lg">
                    {recommendation.title}
                  </h3>
                </div>
                <p className="text-gray-800 leading-relaxed font-medium">
                  {recommendation.content}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Weather;