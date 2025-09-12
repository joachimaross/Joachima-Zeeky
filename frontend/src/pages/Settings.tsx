import React, { useState } from 'react'
import { 
  UserIcon, 
  KeyIcon, 
  BellIcon, 
  ShieldCheckIcon,
  Cog6ToothIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

const Settings: React.FC = () => {
  const [theme, setTheme] = useState('light')
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false
  })

  const [security, setSecurity] = useState({
    twoFactor: false,
    autoLogout: true,
    sessionTimeout: 30
  })

  const settingsSections = [
    {
      id: 'profile',
      title: 'Profile',
      icon: UserIcon,
      description: 'Manage your personal information'
    },
    {
      id: 'security',
      title: 'Security',
      icon: ShieldCheckIcon,
      description: 'Security and privacy settings'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: BellIcon,
      description: 'Configure notification preferences'
    },
    {
      id: 'system',
      title: 'System',
      icon: Cog6ToothIcon,
      description: 'System configuration and preferences'
    }
  ]

  const [activeSection, setActiveSection] = useState('profile')

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-secondary-700">Full Name</label>
        <input
          type="text"
          className="input"
          defaultValue="John Doe"
          placeholder="Enter your full name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-secondary-700">Email</label>
        <input
          type="email"
          className="input"
          defaultValue="john.doe@example.com"
          placeholder="Enter your email"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-secondary-700">Bio</label>
        <textarea
          className="input"
          rows={3}
          defaultValue="AI enthusiast and productivity expert"
          placeholder="Tell us about yourself"
        />
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-secondary-900">Two-Factor Authentication</h4>
          <p className="text-sm text-secondary-600">Add an extra layer of security</p>
        </div>
        <label className="toggle">
          <input
            type="checkbox"
            checked={security.twoFactor}
            onChange={(e) => setSecurity({...security, twoFactor: e.target.checked})}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-secondary-900">Auto Logout</h4>
          <p className="text-sm text-secondary-600">Automatically log out after inactivity</p>
        </div>
        <label className="toggle">
          <input
            type="checkbox"
            checked={security.autoLogout}
            onChange={(e) => setSecurity({...security, autoLogout: e.target.checked})}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-secondary-700">Session Timeout (minutes)</label>
        <input
          type="number"
          className="input"
          value={security.sessionTimeout}
          onChange={(e) => setSecurity({...security, sessionTimeout: parseInt(e.target.value)})}
          min="5"
          max="120"
        />
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-secondary-900">Email Notifications</h4>
          <p className="text-sm text-secondary-600">Receive notifications via email</p>
        </div>
        <label className="toggle">
          <input
            type="checkbox"
            checked={notifications.email}
            onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-secondary-900">Push Notifications</h4>
          <p className="text-sm text-secondary-600">Receive push notifications</p>
        </div>
        <label className="toggle">
          <input
            type="checkbox"
            checked={notifications.push}
            onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-secondary-900">SMS Notifications</h4>
          <p className="text-sm text-secondary-600">Receive SMS notifications</p>
        </div>
        <label className="toggle">
          <input
            type="checkbox"
            checked={notifications.sms}
            onChange={(e) => setNotifications({...notifications, sms: e.target.checked})}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>
    </div>
  )

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-3">Theme</label>
        <div className="flex space-x-3">
          <button
            onClick={() => setTheme('light')}
            className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <SunIcon className="h-4 w-4 mr-2" />
            Light
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <MoonIcon className="h-4 w-4 mr-2" />
            Dark
          </button>
          <button
            onClick={() => setTheme('system')}
            className={`btn ${theme === 'system' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <ComputerDesktopIcon className="h-4 w-4 mr-2" />
            System
          </button>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-secondary-700">API Rate Limit</label>
        <select className="input">
          <option>100 requests/hour</option>
          <option>500 requests/hour</option>
          <option>1000 requests/hour</option>
          <option>Unlimited</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-secondary-700">Default Language</label>
        <select className="input">
          <option>English</option>
          <option>Spanish</option>
          <option>French</option>
          <option>German</option>
        </select>
      </div>
    </div>
  )

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSettings()
      case 'security':
        return renderSecuritySettings()
      case 'notifications':
        return renderNotificationSettings()
      case 'system':
        return renderSystemSettings()
      default:
        return renderProfileSettings()
    }
  }

  return (
    <div className="flex h-full">
      {/* Settings Navigation */}
      <div className="w-64 bg-white rounded-lg shadow-sm border border-secondary-200 p-4 mr-6">
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">Settings</h2>
        <nav className="space-y-2">
          {settingsSections.map((section) => {
            const Icon = section.icon
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                  activeSection === section.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-secondary-600 hover:bg-secondary-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <div>
                  <div className="text-sm font-medium">{section.title}</div>
                  <div className="text-xs text-secondary-500">{section.description}</div>
                </div>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="flex-1">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="text-xl font-semibold text-secondary-900">
              {settingsSections.find(s => s.id === activeSection)?.title}
            </h3>
            <p className="text-secondary-600">
              {settingsSections.find(s => s.id === activeSection)?.description}
            </p>
          </div>
          <div className="card-content">
            {renderActiveSection()}
          </div>
          <div className="card-footer">
            <button className="btn btn-primary">Save Changes</button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Settings