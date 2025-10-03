'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LandingPage from '@/components/LandingPage';
import AuthForms from '@/components/AuthForms';
import ProtectedRoute from '@/components/ProtectedRoute';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { currentUser, userData, loading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin' | null>(null);

  // Show loading while authentication state is being determined
  if (loading) {
    return null; // ProtectedRoute will show the loading screen
  }

  // If user is authenticated, show the protected content
  if (currentUser && userData) {
    return (
      <ProtectedRoute>
        {children}
      </ProtectedRoute>
    );
  }

  // If user is not authenticated, show landing page or auth forms
  if (selectedRole) {
    return (
      <AuthForms 
        role={selectedRole} 
        onBack={() => setSelectedRole(null)} 
      />
    );
  }

  return <LandingPage onSelectRole={setSelectedRole} />;
};

export default AuthWrapper;