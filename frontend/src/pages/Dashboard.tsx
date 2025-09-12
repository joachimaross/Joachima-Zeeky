import React, { useState, useEffect } from 'react'
import { 
  ChatBubbleLeftRightIcon, 
  CpuChipIcon, 
  PuzzlePieceIcon,
  ChartBarIcon,
  BoltIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

const Dashboard: React.FC = () => {
  const [systemStats, setSystemStats] = useState({
    activePlugins: 12,
    totalRequests: 1247,
    responseTime: 89,
    uptime: '99.9%'
  })

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'success', message: 'Plugin "Calendar" executed successfully', time: '2 min ago' },
    { id: 2, type: 'info', message: 'New plugin "Weather" registered', time: '5 min ago' },
    { id: 3, type: 'success', message: 'User query processed in 45ms', time: '8 min ago' },
    { id: 4, type: 'warning', message: 'Plugin "Music" response slow', time: '12 min ago' },
  ])

  const [quickActions] = useState([
    { name: 'Test Voice Command', icon: ChatBubbleLeftRightIcon, color: 'bg-primary-500' },
    { name: 'View Plugins', icon: PuzzlePieceIcon, color: 'bg-accent-500' },
    { name: 'Check Analytics', icon: ChartBarIcon, color: 'bg-success-500' },
    { name: 'System Status', icon: CpuChipIcon, color: 'bg-warning-500' },
  ])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-success-500" />
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-warning-500" />
      case 'info':
        return <InformationCircleIcon className="h-5 w-5 text-accent-500" />
      default:
        return <InformationCircleIcon className="h-5 w-5 text-secondary-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Dashboard</h1>
          <p className="text-secondary-600">Welcome back! Here's what's happening with Zeeky.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-success-500 animate-pulse"></div>
            <span className="text-sm text-secondary-600">All systems operational</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { name: 'Active Plugins', value: systemStats.activePlugins, icon: PuzzlePieceIcon, color: 'text-primary-600', bg: 'bg-primary-50' },
          { name: 'Total Requests', value: systemStats.totalRequests.toLocaleString(), icon: ChartBarIcon, color: 'text-accent-600', bg: 'bg-accent-50' },
          { name: 'Avg Response Time', value: `${systemStats.responseTime}ms`, icon: BoltIcon, color: 'text-success-600', bg: 'bg-success-50' },
          { name: 'Uptime', value: systemStats.uptime, icon: CpuChipIcon, color: 'text-warning-600', bg: 'bg-warning-50' },
        ].map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card"
          >
            <div className="card-content">
              <div className="flex items-center">
                <div className={`rounded-lg p-3 ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
            <p className="card-description">Common tasks and shortcuts</p>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center space-y-3 rounded-lg border border-secondary-200 p-4 text-center transition-colors hover:bg-secondary-50"
                >
                  <div className={`rounded-lg p-3 ${action.color}`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-secondary-700">{action.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
            <p className="card-description">Latest system events and updates</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-secondary-900">{activity.message}</p>
                    <p className="text-xs text-secondary-500">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="card"
      >
        <div className="card-header">
          <h3 className="card-title">System Status</h3>
          <p className="card-description">Real-time monitoring of Zeeky services</p>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'Core Engine', status: 'operational', color: 'text-success-600' },
              { name: 'Plugin Manager', status: 'operational', color: 'text-success-600' },
              { name: 'AI Services', status: 'operational', color: 'text-success-600' },
              { name: 'Voice Processing', status: 'maintenance', color: 'text-warning-600' },
            ].map((service, index) => (
              <div key={service.name} className="flex items-center justify-between">
                <span className="text-sm font-medium text-secondary-700">{service.name}</span>
                <div className="flex items-center space-x-2">
                  <div className={`h-2 w-2 rounded-full ${
                    service.status === 'operational' ? 'bg-success-500' : 'bg-warning-500'
                  }`}></div>
                  <span className={`text-sm font-medium ${service.color}`}>
                    {service.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard