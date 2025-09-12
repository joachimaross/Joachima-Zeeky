/**
 * Sidebar Component - Navigation sidebar with plugin status and system info
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  PuzzlePieceIcon, 
  MicrophoneIcon, 
  ChartBarIcon, 
  CogIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { User, SystemStatus } from '../types';

interface SidebarProps {
  user: User | null;
  systemStatus: SystemStatus | null;
  isConnected: boolean;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: string;
  children?: NavigationItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ user, systemStatus, isConnected }) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const navigation: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
    },
    {
      name: 'Plugins',
      href: '/plugins',
      icon: PuzzlePieceIcon,
      badge: systemStatus?.plugins?.active?.toString() || '0',
    },
    {
      name: 'Voice Interface',
      href: '/voice',
      icon: MicrophoneIcon,
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: ChartBarIcon,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: CogIcon,
    },
  ];

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircleIcon className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-400" />;
    }
  };

  return (
    <div className="flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
            Zeeky
          </span>
        </div>
      </div>

      {/* Connection Status */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            System Status
          </span>
          <div className="flex items-center">
            {isConnected ? (
              <CheckCircleIcon className="h-4 w-4 text-green-500" />
            ) : (
              <XCircleIcon className="h-4 w-4 text-red-500" />
            )}
          </div>
        </div>
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => (
          <div key={item.name}>
            <Link
              to={item.href}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive(item.href)
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 flex-shrink-0 ${
                  isActive(item.href)
                    ? 'text-blue-500 dark:text-blue-400'
                    : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                }`}
              />
              <span className="flex-1">{item.name}</span>
              {item.badge && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  {item.badge}
                </span>
              )}
            </Link>
          </div>
        ))}
      </nav>

      {/* System Status Details */}
      {systemStatus && (
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                System Health
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Core System</span>
                  {getStatusIcon(systemStatus.core?.status || 'unknown')}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">AI Services</span>
                  {getStatusIcon(systemStatus.ai?.status || 'unknown')}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Plugins</span>
                  {getStatusIcon(systemStatus.plugins?.status || 'unknown')}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Integrations</span>
                  {getStatusIcon(systemStatus.integrations?.status || 'unknown')}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Performance
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Response Time</span>
                  <span className="text-gray-900 dark:text-white">
                    {systemStatus.performance?.averageResponseTime || 0}ms
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Memory Usage</span>
                  <span className="text-gray-900 dark:text-white">
                    {systemStatus.performance?.memoryUsage || 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">CPU Usage</span>
                  <span className="text-gray-900 dark:text-white">
                    {systemStatus.performance?.cpuUsage || 0}%
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Active Features
              </h3>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Plugins</span>
                  <span className="text-gray-900 dark:text-white">
                    {systemStatus.plugins?.active || 0}/{systemStatus.plugins?.total || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Integrations</span>
                  <span className="text-gray-900 dark:text-white">
                    {systemStatus.integrations?.active || 0}/{systemStatus.integrations?.total || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">AI Models</span>
                  <span className="text-gray-900 dark:text-white">
                    {systemStatus.ai?.activeModels || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Info */}
      {user && (
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;