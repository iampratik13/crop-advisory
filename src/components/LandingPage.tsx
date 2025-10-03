'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sprout, 
  Users, 
  Shield, 
  ArrowRight, 
  Leaf, 
  Sun, 
  CloudRain,
  TrendingUp,
  Globe,
  Award,
  CheckCircle
} from 'lucide-react';

interface LandingPageProps {
  onSelectRole: (role: 'user' | 'admin') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSelectRole }) => {
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin' | null>(null);

  const features = [
    {
      icon: Sprout,
      title: 'Smart Crop Advisory',
      description: 'AI-powered recommendations for optimal crop management'
    },
    {
      icon: CloudRain,
      title: 'Weather Insights',
      description: 'Real-time weather data with agricultural recommendations'
    },
    {
      icon: Globe,
      title: 'Satellite Analysis',
      description: 'Advanced satellite imagery for crop monitoring'
    },
    {
      icon: TrendingUp,
      title: 'Yield Optimization',
      description: 'Data-driven insights to maximize your harvest'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Farmers', icon: Users },
    { number: '95%', label: 'Success Rate', icon: Award },
    { number: '50+', label: 'Crop Types', icon: Leaf },
    { number: '24/7', label: 'Support', icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-emerald-200 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-yellow-200 rounded-full opacity-25 animate-bounce"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.header 
          className="px-6 py-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg">
                <Sprout className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  AgriSmart
                </h1>
                <p className="text-sm text-gray-600">Smart Farming Solutions</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-green-600">
                <Sun className="w-5 h-5" />
                <span className="text-sm font-medium">Weather-Smart</span>
              </div>
              <div className="flex items-center space-x-1 text-blue-600">
                <Globe className="w-5 h-5" />
                <span className="text-sm font-medium">AI-Powered</span>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <motion.section 
          className="px-6 py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Revolutionary
                </span>
                <br />
                <span className="text-gray-800">Agriculture Platform</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
                Harness the power of AI, weather intelligence, and satellite technology to transform your farming experience. 
                Join thousands of farmers who have already revolutionized their agricultural practices.
              </p>
            </motion.div>

            {/* Stats Section */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <stat.icon className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-gray-800 mb-1">{stat.number}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Role Selection Section */}
        <motion.section 
          className="px-6 py-16"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Choose Your Journey</h2>
              <p className="text-xl text-gray-600">Select your role to access tailored features and experiences</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* User Card */}
              <motion.div
                className={`relative bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl p-8 cursor-pointer transform transition-all duration-300 ${
                  selectedRole === 'user' ? 'scale-105 shadow-2xl' : 'hover:scale-102 shadow-xl'
                }`}
                onClick={() => setSelectedRole('user')}
                whileHover={{ y: -10 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-white">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 w-fit mb-6">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Farmer / User</h3>
                  <p className="text-green-100 mb-6 text-lg leading-relaxed">
                    Access personalized crop recommendations, weather insights, and satellite analysis 
                    to optimize your farming operations and increase yields.
                  </p>
                  <ul className="space-y-3 mb-8">
                    {[
                      'Personalized crop advisory',
                      'Real-time weather alerts',
                      'Satellite field monitoring',
                      'Yield prediction tools',
                      'Expert farming tips'
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-200 flex-shrink-0" />
                        <span className="text-green-50">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center space-x-2 w-full hover:bg-green-50 transition-colors"
                    onClick={() => onSelectRole('user')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Continue as Farmer</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
                {selectedRole === 'user' && (
                  <motion.div
                    className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    Selected!
                  </motion.div>
                )}
              </motion.div>

              {/* Admin Card */}
              <motion.div
                className={`relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 cursor-pointer transform transition-all duration-300 ${
                  selectedRole === 'admin' ? 'scale-105 shadow-2xl' : 'hover:scale-102 shadow-xl'
                }`}
                onClick={() => setSelectedRole('admin')}
                whileHover={{ y: -10 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-white">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 w-fit mb-6">
                    <Shield className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Administrator</h3>
                  <p className="text-blue-100 mb-6 text-lg leading-relaxed">
                    Manage the platform, oversee user activities, configure system settings, 
                    and access comprehensive analytics and reporting tools.
                  </p>
                  <ul className="space-y-3 mb-8">
                    {[
                      'User management dashboard',
                      'System configuration',
                      'Analytics & reporting',
                      'Content management',
                      'Platform monitoring'
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-blue-200 flex-shrink-0" />
                        <span className="text-blue-50">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center space-x-2 w-full hover:bg-blue-50 transition-colors"
                    onClick={() => onSelectRole('admin')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Continue as Admin</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
                {selectedRole === 'admin' && (
                  <motion.div
                    className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    Selected!
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          className="px-6 py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Platform Features</h2>
              <p className="text-xl text-gray-600">Discover what makes our platform unique</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 text-center"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-2xl w-fit mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer 
          className="px-6 py-12 border-t border-gray-200 bg-white/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-lg">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">AgriSmart</span>
            </div>
            <p className="text-gray-600 mb-4">Empowering farmers with intelligent technology</p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <span>© 2025 AgriSmart. All rights reserved.</span>
              <span>•</span>
              <span>Smart Farming Solutions</span>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default LandingPage;