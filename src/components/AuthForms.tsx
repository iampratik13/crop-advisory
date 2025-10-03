'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Loader,
  Users,
  Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthFormsProps {
  role: 'user' | 'admin';
  onBack: () => void;
}

const AuthForms: React.FC<AuthFormsProps> = ({ role, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  const { login, signup } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return false;
    }

    if (!isLogin) {
      if (!formData.name) {
        setError('Please enter your full name');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        setSuccess('Login successful! Redirecting...');
      } else {
        await signup(formData.email, formData.password, formData.name, role);
        setSuccess('Account created successfully! Please verify your email.');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roleConfig = {
    user: {
      icon: Users,
      color: 'green',
      gradient: 'from-green-400 to-emerald-500',
      title: 'Farmer Portal',
      description: 'Access your personalized farming dashboard'
    },
    admin: {
      icon: Shield,
      color: 'blue',
      gradient: 'from-blue-500 to-indigo-600',
      title: 'Admin Portal',
      description: 'Manage platform settings and users'
    }
  };

  const config = roleConfig[role];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Back Button */}
        <motion.button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-8 group"
          whileHover={{ x: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <ArrowLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Back to selection</span>
        </motion.button>

        {/* Auth Card */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Header */}
          <div className={`bg-gradient-to-r ${config.gradient} p-8 text-white text-center`}>
            <motion.div
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 w-fit mx-auto mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, delay: 0.4 }}
            >
              <config.icon className="w-12 h-12 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold mb-2">{config.title}</h1>
            <p className="text-white/90">{config.description}</p>
          </div>

          {/* Form */}
          <div className="p-8">
            {/* Toggle */}
            <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                  setSuccess('');
                }}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                  isLogin
                    ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg`
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                  setSuccess('');
                }}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                  !isLogin
                    ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg`
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Error/Success Messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="flex items-center space-x-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-6"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-red-700 text-sm">{error}</span>
                </motion.div>
              )}
              {success && (
                <motion.div
                  className="flex items-center space-x-3 bg-green-50 border border-green-200 rounded-xl p-4 mb-6"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-green-700 text-sm">{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field (Signup only) */}
              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="block text-gray-700 font-semibold mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-gray-800"
                        placeholder="Enter your full name"
                        disabled={loading}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Field */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-gray-800"
                    placeholder="Enter your email"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-gray-800"
                    placeholder={isLogin ? "Enter your password" : "Create a password"}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field (Signup only) */}
              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="block text-gray-700 font-semibold mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-gray-800"
                        placeholder="Confirm your password"
                        disabled={loading}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r ${config.gradient} text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center space-x-2 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                )}
              </motion.button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center text-gray-600">
              <p className="text-sm">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setSuccess('');
                  }}
                  className={`text-${config.color}-600 font-semibold hover:underline`}
                  disabled={loading}
                >
                  {isLogin ? 'Sign up here' : 'Sign in here'}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthForms;