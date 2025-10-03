'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sprout, 
  CloudRain, 
  Bug, 
  TrendingUp, 
  MapPin, 
  BarChart3,
  Phone,
  MessageCircle,
  LogOut,
  User,
  Crown
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { userData, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const features = [
    {
      icon: <Sprout className="w-8 h-8" />,
      title: 'Crop Advisory',
      description: 'Crop selection advice based on soil and weather',
      href: '/crop-advisory',
      color: 'bg-green-500'
    },
    {
      icon: <CloudRain className="w-8 h-8" />,
      title: 'Weather Alerts',
      description: 'Real-time weather forecasts and warnings',
      href: '/weather',
      color: 'bg-blue-500'
    },
    {
      icon: <Bug className="w-8 h-8" />,
      title: 'Pest Detection',
      description: 'Identify pests and diseases through photos',
      href: '/pest-detection',
      color: 'bg-red-500'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Market Prices',
      description: 'Current market prices for crops',
      href: '/market-prices',
      color: 'bg-yellow-500'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Soil Health',
      description: 'Soil testing and fertilizer recommendations',
      href: '/soil-health',
      color: 'bg-amber-600'
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Satellite Analysis',
      description: 'Land use and crop monitoring',
      href: '/satellite-analysis',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Sprout className="w-10 h-10 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  AgriSmart
                </h1>
                <p className="text-sm text-gray-600">
                  Smart Agricultural Solutions
                </p>
              </div>
            </motion.div>

            {/* User Info & Logout */}
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${userData?.role === 'admin' ? 'bg-blue-100' : 'bg-green-100'}`}>
                  {userData?.role === 'admin' ? (
                    <Crown className="w-5 h-5 text-blue-600" />
                  ) : (
                    <User className="w-5 h-5 text-green-600" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{userData?.displayName}</p>
                  <p className="text-sm text-gray-500 capitalize">{userData?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Welcome back, {userData?.displayName}! 👋
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {userData?.role === 'admin' 
                ? 'Manage your platform and oversee all agricultural operations from your admin dashboard.'
                : 'Ready to optimize your farming with AI-powered insights and weather intelligence?'
              }
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Active Crops', value: '12', icon: Sprout, color: 'text-green-600' },
              { label: 'Weather Alerts', value: '3', icon: CloudRain, color: 'text-blue-600' },
              { label: 'Recommendations', value: '24', icon: TrendingUp, color: 'text-yellow-600' },
              { label: 'Health Score', value: '92%', icon: BarChart3, color: 'text-purple-600' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Smart Agricultural Advice<br />
              <span className="text-green-600">for Modern Farmers</span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Increase your crop yield with AI-based personalized advice, weather forecasts, and scientific techniques.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/crop-advisory" className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                <Sprout className="w-5 h-5" />
                <span>Get Crop Advice</span>
              </Link>
              
              <Link href="/weather" className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center justify-center space-x-2">
                <CloudRain className="w-5 h-5" />
                <span>Check Weather</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Our Services
            </h3>
            <p className="text-lg text-gray-600">
              Comprehensive solutions for {userData?.role === 'admin' ? 'platform management' : 'modern farmers'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <Link href={feature.href}>
                  <div className="p-8">
                    <div className={`${feature.color} w-16 h-16 rounded-lg flex items-center justify-center text-white mb-6`}>
                      {feature.icon}
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-green-100">Happy Farmers</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="text-4xl font-bold mb-2">25%</div>
              <div className="text-green-100">Average Yield Increase</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-4xl font-bold mb-2">15+</div>
              <div className="text-green-100">Crop Types</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-green-100">Support Available</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Chat Support Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors"
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Sprout className="w-8 h-8 text-green-400" />
                <span className="text-xl font-bold">
                  AgriSmart
                </span>
              </div>
              <p className="text-gray-400">
                Smart agricultural solutions for modern farmers
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Services</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/crop-advisory" className="hover:text-white">Crop Advisory</Link></li>
                <li><Link href="/weather" className="hover:text-white">Weather Alerts</Link></li>
                <li><Link href="/pest-detection" className="hover:text-white">Pest Detection</Link></li>
                <li><Link href="/market-prices" className="hover:text-white">Market Prices</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Contact</h5>
              <div className="space-y-2 text-gray-400">
                <p>📞 1800-XXX-XXXX</p>
                <p>📧 support@agrismart.in</p>
                <p>🌐 www.agrismart.in</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 AgriSmart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;