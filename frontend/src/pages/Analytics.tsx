import React, { useState } from 'react'
import { 
  ChartBarIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  EyeIcon,
  ClockIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d')

  const metrics = [
    {
      title: 'Total Requests',
      value: '12,847',
      change: '+12.5%',
      trend: 'up',
      icon: ChartBarIcon
    },
    {
      title: 'Response Time',
      value: '89ms',
      change: '-5.2%',
      trend: 'down',
      icon: ClockIcon
    },
    {
      title: 'Active Plugins',
      value: '15',
      change: '+2',
      trend: 'up',
      icon: CpuChipIcon
    },
    {
      title: 'Success Rate',
      value: '99.2%',
      change: '+0.8%',
      trend: 'up',
      icon: EyeIcon
    }
  ]

  const pluginUsage = [
    { name: 'Productivity Plugin', requests: 3420, percentage: 35 },
    { name: 'Creative Plugin', requests: 2100, percentage: 22 },
    { name: 'Smart Home Plugin', requests: 1800, percentage: 18 },
    { name: 'Weather Plugin', requests: 1200, percentage: 12 },
    { name: 'Other Plugins', requests: 1300, percentage: 13 }
  ]

  const recentActivity = [
    { time: '10:30 AM', event: 'Plugin "Calendar" executed successfully', type: 'success' },
    { time: '10:28 AM', event: 'New plugin "Weather" registered', type: 'info' },
    { time: '10:25 AM', event: 'User query processed in 45ms', type: 'success' },
    { time: '10:22 AM', event: 'Plugin "Music" response slow', type: 'warning' },
    { time: '10:20 AM', event: 'System health check passed', type: 'success' }
  ]

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') {
      return <ArrowUpIcon className="h-4 w-4 text-success-600" />
    }
    return <ArrowDownIcon className="h-4 w-4 text-error-600" />
  }

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-success-600' : 'text-error-600'
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-success-600'
      case 'warning':
        return 'text-warning-600'
      case 'error':
        return 'text-error-600'
      default:
        return 'text-info-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Analytics</h1>
          <p className="text-secondary-600">Monitor system performance and usage</p>
        </div>
        <select 
          className="input w-auto"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card"
            >
              <div className="card-content">
                <div className="flex items-center justify-between">
                  <div className="rounded-lg bg-primary-100 p-2">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className={`flex items-center space-x-1 ${getTrendColor(metric.trend)}`}>
                    {getTrendIcon(metric.trend)}
                    <span className="text-sm font-medium">{metric.change}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-secondary-900">{metric.value}</p>
                  <p className="text-sm text-secondary-600">{metric.title}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Plugin Usage Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-secondary-900">Plugin Usage</h3>
            <p className="text-secondary-600">Request distribution across plugins</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {pluginUsage.map((plugin, index) => (
                <div key={plugin.name} className="flex items-center space-x-4">
                  <div className="w-24 text-sm text-secondary-600 truncate">{plugin.name}</div>
                  <div className="flex-1 bg-secondary-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${plugin.percentage}%` }}
                    />
                  </div>
                  <div className="w-16 text-sm text-secondary-600 text-right">{plugin.requests}</div>
                  <div className="w-12 text-sm text-secondary-600 text-right">{plugin.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-secondary-900">Recent Activity</h3>
            <p className="text-secondary-600">Latest system events</p>
          </div>
          <div className="card-content">
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'success' ? 'bg-success-600' :
                    activity.type === 'warning' ? 'bg-warning-600' :
                    activity.type === 'error' ? 'bg-error-600' :
                    'bg-info-600'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${getActivityColor(activity.type)}`}>
                      {activity.event}
                    </p>
                    <p className="text-xs text-secondary-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Performance Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="card"
      >
        <div className="card-header">
          <h3 className="text-lg font-semibold text-secondary-900">Performance Trends</h3>
          <p className="text-secondary-600">Response time and throughput over time</p>
        </div>
        <div className="card-content">
          <div className="h-64 flex items-center justify-center bg-secondary-50 rounded-lg">
            <div className="text-center">
              <ChartBarIcon className="h-12 w-12 text-secondary-400 mx-auto mb-2" />
              <p className="text-secondary-600">Performance chart will be implemented</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Analytics