'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  MapPin,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  description: string;
  pressure: number;
  visibility: number;
  uvIndex: number;
  precipitation: number;
}

interface ForecastDay {
  date: string;
  high: number;
  low: number;
  condition: string;
  precipitation: number;
}

const Weather: React.FC = () => {
  const [location, setLocation] = useState('New Delhi, India');
  const [currentWeather, setCurrentWeather] = useState<WeatherData>({
    temperature: 28,
    humidity: 65,
    windSpeed: 12,
    condition: 'Partly Cloudy',
    description: 'Partly cloudy with light winds',
    pressure: 1013,
    visibility: 10,
    uvIndex: 6,
    precipitation: 20
  });

  const [forecast, setForecast] = useState<ForecastDay[]>([
    { date: 'Today', high: 32, low: 24, condition: 'Sunny', precipitation: 10 },
    { date: 'Tomorrow', high: 30, low: 22, condition: 'Partly Cloudy', precipitation: 30 },
    { date: 'Day 3', high: 28, low: 20, condition: 'Rainy', precipitation: 80 },
    { date: 'Day 4', high: 26, low: 18, condition: 'Cloudy', precipitation: 60 },
    { date: 'Day 5', high: 29, low: 21, condition: 'Sunny', precipitation: 15 }
  ]);

  const [alerts, setAlerts] = useState([
    {
      type: 'warning',
      title: 'Heat Wave Warning',
      message: 'High temperatures expected. Avoid outdoor activities during peak hours.',
      severity: 'moderate'
    },
    {
      type: 'info',
      title: 'Rain Forecast',
      message: 'Light to moderate rainfall expected in the next 3 days.',
      severity: 'low'
    }
  ]);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'partly cloudy': return <Cloud className="w-8 h-8 text-gray-500" />;
      case 'cloudy': return <Cloud className="w-8 h-8 text-gray-600" />;
      case 'rainy': return <CloudRain className="w-8 h-8 text-blue-500" />;
      default: return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  const getUVLevel = (uvIndex: number) => {
    if (uvIndex <= 2) return { level: 'Low', color: 'text-green-600' };
    if (uvIndex <= 5) return { level: 'Moderate', color: 'text-yellow-600' };
    if (uvIndex <= 7) return { level: 'High', color: 'text-orange-600' };
    if (uvIndex <= 10) return { level: 'Very High', color: 'text-red-600' };
    return { level: 'Extreme', color: 'text-purple-600' };
  };

  const uvLevel = getUVLevel(currentWeather.uvIndex);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <header className="bg-white shadow-sm border-b border-blue-200">
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
                <Cloud className="w-10 h-10 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Weather Forecast</h1>
                  <p className="text-sm text-gray-600">Agricultural weather insights</p>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-gray-500" />
              <select 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="New Delhi, India">New Delhi, India</option>
                <option value="Mumbai, India">Mumbai, India</option>
                <option value="Bangalore, India">Bangalore, India</option>
                <option value="Ludhiana, Punjab">Ludhiana, Punjab</option>
                <option value="Pune, Maharashtra">Pune, Maharashtra</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Weather Alerts */}
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  alert.type === 'warning' 
                    ? 'bg-yellow-50 border-yellow-200' 
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className={`w-6 h-6 ${
                      alert.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                    }`} />
                    <div>
                      <h3 className={`font-semibold ${
                        alert.type === 'warning' ? 'text-yellow-800' : 'text-blue-800'
                      }`}>
                        {alert.title}
                      </h3>
                      <p className={`text-sm ${
                        alert.type === 'warning' ? 'text-yellow-700' : 'text-blue-700'
                      }`}>
                        {alert.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Weather */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Current Weather</h2>
              <div className="flex items-center space-x-2 text-gray-500">
                <Calendar className="w-5 h-5" />
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  {getWeatherIcon(currentWeather.condition)}
                  <span className="text-6xl font-bold text-gray-900 ml-4">
                    {currentWeather.temperature}°C
                  </span>
                </div>
                <p className="text-xl text-gray-700 mb-2">{currentWeather.condition}</p>
                <p className="text-gray-500">{currentWeather.description}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Droplets className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700">Humidity</span>
                  </div>
                  <span className="font-semibold">{currentWeather.humidity}%</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Wind className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">Wind Speed</span>
                  </div>
                  <span className="font-semibold">{currentWeather.windSpeed} km/h</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Thermometer className="w-5 h-5 text-red-500" />
                    <span className="text-gray-700">Pressure</span>
                  </div>
                  <span className="font-semibold">{currentWeather.pressure} hPa</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">Visibility</span>
                  </div>
                  <span className="font-semibold">{currentWeather.visibility} km</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* UV Index & Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">UV Index</h3>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{currentWeather.uvIndex}</div>
                <div className={`text-lg font-medium ${uvLevel.color}`}>{uvLevel.level}</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div 
                    className="bg-gradient-to-r from-green-500 via-yellow-500 via-orange-500 to-red-500 h-2 rounded-full"
                    style={{ width: `${Math.min(currentWeather.uvIndex * 10, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Precipitation</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {currentWeather.precipitation}%
                </div>
                <p className="text-gray-600">Chance of rain</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${currentWeather.precipitation}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 5-Day Forecast */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 bg-white rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">5-Day Forecast</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {forecast.map((day, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <p className="font-semibold text-gray-900 mb-2">{day.date}</p>
                <div className="flex justify-center mb-2">
                  {getWeatherIcon(day.condition)}
                </div>
                <p className="text-sm text-gray-600 mb-2">{day.condition}</p>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="flex items-center space-x-1">
                    <ArrowUp className="w-4 h-4 text-red-500" />
                    <span className="font-semibold">{day.high}°</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ArrowDown className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-600">{day.low}°</span>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">{day.precipitation}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Agricultural Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 bg-white rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Agricultural Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-semibold text-green-800 mb-3">Irrigation Advisory</h3>
              <p className="text-green-700">
                With {currentWeather.precipitation}% chance of rain and {currentWeather.humidity}% humidity, 
                consider reducing irrigation for the next 2 days.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-800 mb-3">Pest Management</h3>
              <p className="text-blue-700">
                Current weather conditions (temp: {currentWeather.temperature}°C, humidity: {currentWeather.humidity}%) 
                are favorable for fungal diseases. Apply preventive measures.
              </p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="font-semibold text-yellow-800 mb-3">Field Activities</h3>
              <p className="text-yellow-700">
                UV Index is {currentWeather.uvIndex} ({uvLevel.level}). Schedule outdoor activities 
                before 10 AM or after 4 PM to avoid heat stress.
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="font-semibold text-purple-800 mb-3">Harvest Planning</h3>
              <p className="text-purple-700">
                Weather is suitable for harvesting. Wind speed of {currentWeather.windSpeed} km/h 
                is ideal for grain drying activities.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Weather;
