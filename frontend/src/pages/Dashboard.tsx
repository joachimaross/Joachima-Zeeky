/**
 * Dashboard Page - Main overview of system status and recent activity
 */

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ChartBarIcon,
  CpuChipIcon,
  ServerIcon,
  PuzzlePieceIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  MicrophoneIcon
} from '@heroicons/react/24/outline';

// Components
import StatCard from '../components/StatCard';
import ActivityFeed from '../components/ActivityFeed';
import SystemHealthChart from '../components/SystemHealthChart';
import RecentPlugins from '../components/RecentPlugins';
import QuickActions from '../components/QuickActions';

// Types
import { SystemStatus, ActivityItem, Plugin } from '../types';

// API functions
const fetchSystemStatus = async (): Promise<SystemStatus> => {
  const response = await fetch('/api/system/status');
  if (!response.ok) throw new Error('Failed to fetch system status');
  return response.json();
};

const fetchRecentActivity = async (): Promise<ActivityItem[]> => {
  const response = await fetch('/api/activity/recent');
  if (!response.ok) throw new Error('Failed to fetch recent activity');
  return response.json();
};

const fetchPlugins = async (): Promise<Plugin[]> => {
  const response = await fetch('/api/plugins');
  if (!response.ok) throw new Error('Failed to fetch plugins');
  return response.json();
};

const Dashboard: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

  // Queries
  const { data: systemStatus, isLoading: statusLoading } = useQuery({
    queryKey: ['systemStatus'],
    queryFn: fetchSystemStatus,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: recentActivity, isLoading: activityLoading } = useQuery({
    queryKey: ['recentActivity'],
    queryFn: fetchRecentActivity,
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  const { data: plugins, isLoading: pluginsLoading } = useQuery({
    queryKey: ['plugins'],
    queryFn: fetchPlugins,
    refetchInterval: 60000, // Refetch every minute
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <div className="h-5 w-5 rounded-full bg-gray-400" />;
    }
  };

  if (statusLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            System overview and performance metrics
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="System Health"
          value={systemStatus?.overall?.status || 'unknown'}
          icon={ServerIcon}
          color={getStatusColor(systemStatus?.overall?.status || 'unknown')}
          subtitle={`Uptime: ${systemStatus?.overall?.uptime || '0h'}`}
        />
        
        <StatCard
          title="Active Plugins"
          value={systemStatus?.plugins?.active || 0}
          icon={PuzzlePieceIcon}
          color="text-blue-500"
          subtitle={`Total: ${systemStatus?.plugins?.total || 0}`}
        />
        
        <StatCard
          title="AI Models"
          value={systemStatus?.ai?.activeModels || 0}
          icon={CpuChipIcon}
          color="text-purple-500"
          subtitle={`Requests: ${systemStatus?.ai?.totalRequests || 0}`}
        />
        
        <StatCard
          title="Response Time"
          value={`${systemStatus?.performance?.averageResponseTime || 0}ms`}
          icon={ClockIcon}
          color="text-green-500"
          subtitle={`Peak: ${systemStatus?.performance?.peakResponseTime || 0}ms`}
        />
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              System Health
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getStatusIcon(systemStatus?.core?.status || 'unknown')}
                  <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Core System
                  </span>
                </div>
                <span className={`text-sm font-medium ${getStatusColor(systemStatus?.core?.status || 'unknown')}`}>
                  {systemStatus?.core?.status || 'unknown'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getStatusIcon(systemStatus?.ai?.status || 'unknown')}
                  <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    AI Services
                  </span>
                </div>
                <span className={`text-sm font-medium ${getStatusColor(systemStatus?.ai?.status || 'unknown')}`}>
                  {systemStatus?.ai?.status || 'unknown'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getStatusIcon(systemStatus?.plugins?.status || 'unknown')}
                  <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Plugin System
                  </span>
                </div>
                <span className={`text-sm font-medium ${getStatusColor(systemStatus?.plugins?.status || 'unknown')}`}>
                  {systemStatus?.plugins?.status || 'unknown'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getStatusIcon(systemStatus?.integrations?.status || 'unknown')}
                  <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Integrations
                  </span>
                </div>
                <span className={`text-sm font-medium ${getStatusColor(systemStatus?.integrations?.status || 'unknown')}`}>
                  {systemStatus?.integrations?.status || 'unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Performance Metrics
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>CPU Usage</span>
                  <span>{systemStatus?.performance?.cpuUsage || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${systemStatus?.performance?.cpuUsage || 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>Memory Usage</span>
                  <span>{systemStatus?.performance?.memoryUsage || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${systemStatus?.performance?.memoryUsage || 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>Disk Usage</span>
                  <span>{systemStatus?.performance?.diskUsage || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-yellow-600 h-2 rounded-full" 
                    style={{ width: `${systemStatus?.performance?.diskUsage || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            System Performance
          </h2>
          <SystemHealthChart timeRange={selectedTimeRange} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <ActivityFeed activities={recentActivity || []} isLoading={activityLoading} />
        </div>
      </div>

      {/* Quick Actions and Recent Plugins */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActions />
        <RecentPlugins plugins={plugins || []} isLoading={pluginsLoading} />
      </div>
    </div>
  );
};

export default Dashboard;