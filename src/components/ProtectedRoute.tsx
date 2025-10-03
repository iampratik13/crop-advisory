'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader, Sprout } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin';
}

const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 flex items-center justify-center">
    <motion.div
      className="text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-3xl shadow-2xl mb-6 mx-auto w-fit"
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <Sprout className="w-12 h-12 text-white" />
      </motion.div>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="mb-4"
      >
        <Loader className="w-8 h-8 text-green-600 mx-auto" />
      </motion.div>
      <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
        AgriSmart
      </h2>
      <p className="text-gray-600">Loading your farming dashboard...</p>
    </motion.div>
  </div>
);

const UnauthorizedScreen: React.FC<{ userRole: string, requiredRole: string }> = ({ userRole, requiredRole }) => (
  <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
    <motion.div
      className="text-center bg-white rounded-3xl shadow-2xl p-12 max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-red-100 p-6 rounded-full w-fit mx-auto mb-6">
        <div className="text-4xl">🚫</div>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
      <p className="text-gray-600 mb-6">
        You need <span className="font-semibold text-red-600">{requiredRole}</span> permissions to access this page.
        Your current role is <span className="font-semibold">{userRole}</span>.
      </p>
      <button
        onClick={() => window.location.href = '/'}
        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
      >
        Go Back
      </button>
    </motion.div>
  </div>
);

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { currentUser, userData, loading } = useAuth();

  // Show loading screen while authentication is being checked
  if (loading) {
    return <LoadingScreen />;
  }

  // If no user is authenticated, the AuthProvider will handle showing the landing page
  if (!currentUser || !userData) {
    return null;
  }

  // Check if user has required role
  if (requiredRole && userData.role !== requiredRole) {
    return <UnauthorizedScreen userRole={userData.role} requiredRole={requiredRole} />;
  }

  // User is authenticated and has correct role, show the protected content
  return <>{children}</>;
};

export default ProtectedRoute;