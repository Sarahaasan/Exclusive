// components/PublicRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { UseAuth } from './UseAuth ';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = UseAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Redirect to home if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;