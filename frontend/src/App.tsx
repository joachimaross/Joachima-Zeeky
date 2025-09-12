/**
 * Zeeky Frontend - Modern React Application with Tailwind CSS
 * Main application component with routing and layout
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Plugins from './pages/Plugins';
import Settings from './pages/Settings';
import VoiceInterface from './pages/VoiceInterface';
import Analytics from './pages/Analytics';
import LoadingSpinner from './components/LoadingSpinner';

// Hooks
import { useAuth } from './hooks/useAuth';
import { useWebSocket } from './hooks/useWebSocket';
import { useTheme } from './hooks/useTheme';

// Types
import { User, SystemStatus } from './types';

// Styles
import './App.css';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  
  const { user, isAuthenticated, login, logout } = useAuth();
  const { isConnected, lastMessage } = useWebSocket();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // Initialize application
    const initializeApp = async () => {
      try {
        // Check authentication status
        await checkAuthStatus();
        
        // Load system status
        await loadSystemStatus();
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const checkAuthStatus = async () => {
    // Check if user is already authenticated
    const token = localStorage.getItem('zeeky_token');
    if (token) {
      try {
        // Validate token with backend
        const response = await fetch('/api/auth/validate', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          // Set user context
        }
      } catch (error) {
        // Token is invalid, remove it
        localStorage.removeItem('zeeky_token');
      }
    }
  };

  const loadSystemStatus = async () => {
    try {
      const response = await fetch('/api/system/status');
      if (response.ok) {
        const status = await response.json();
        setSystemStatus(status);
      }
    } catch (error) {
      console.error('Failed to load system status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Router>
            {isAuthenticated ? (
              <div className="flex h-screen">
                {/* Sidebar */}
                <Sidebar 
                  user={user}
                  systemStatus={systemStatus}
                  isConnected={isConnected}
                />
                
                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Header */}
                  <Header 
                    user={user}
                    onLogout={logout}
                    onToggleTheme={toggleTheme}
                    theme={theme}
                    isConnected={isConnected}
                  />
                  
                  {/* Page Content */}
                  <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/plugins" element={<Plugins />} />
                      <Route path="/voice" element={<VoiceInterface />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </main>
                </div>
              </div>
            ) : (
              <LoginPage onLogin={login} />
            )}
          </Router>
          
          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: theme === 'dark' ? '#374151' : '#ffffff',
                color: theme === 'dark' ? '#ffffff' : '#000000',
              },
            }}
          />
          
          {/* React Query DevTools */}
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </div>
      </div>
    </QueryClientProvider>
  );
};

// Login Page Component
const LoginPage: React.FC<{ onLogin: (credentials: any) => Promise<void> }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await onLogin({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-600">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to Zeeky
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Your AI-powered productivity assistant
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900 p-4">
              <div className="text-sm text-red-700 dark:text-red-200">
                {error}
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <LoadingSpinner size="small" />
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className="text-center">
            <a
              href="#"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Forgot your password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;