import React, { useState } from 'react'
import { 
  PlusIcon, 
  Cog6ToothIcon, 
  PlayIcon, 
  PauseIcon,
  TrashIcon,
  PuzzlePieceIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

interface Plugin {
  id: string
  name: string
  description: string
  version: string
  status: 'active' | 'inactive' | 'error'
  category: string
  author: string
}

const Plugins: React.FC = () => {
  const [plugins] = useState<Plugin[]>([
    {
      id: '1',
      name: 'Productivity Plugin',
      description: 'Calendar, tasks, and note management',
      version: '1.2.0',
      status: 'active',
      category: 'Productivity',
      author: 'Zeeky Team'
    },
    {
      id: '2',
      name: 'Creative Plugin',
      description: 'AI-powered music and image generation',
      version: '1.0.0',
      status: 'active',
      category: 'Creative',
      author: 'Zeeky Team'
    },
    {
      id: '3',
      name: 'Smart Home Plugin',
      description: 'IoT device control and automation',
      version: '2.1.0',
      status: 'inactive',
      category: 'Smart Home',
      author: 'Zeeky Team'
    },
    {
      id: '4',
      name: 'Weather Plugin',
      description: 'Real-time weather information',
      version: '1.5.0',
      status: 'error',
      category: 'Information',
      author: 'Community'
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success-100 text-success-800'
      case 'inactive':
        return 'bg-secondary-100 text-secondary-800'
      case 'error':
        return 'bg-error-100 text-error-800'
      default:
        return 'bg-secondary-100 text-secondary-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <PlayIcon className="h-4 w-4" />
      case 'inactive':
        return <PauseIcon className="h-4 w-4" />
      case 'error':
        return <TrashIcon className="h-4 w-4" />
      default:
        return <PauseIcon className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Plugins</h1>
          <p className="text-secondary-600">Manage and configure Zeeky plugins</p>
        </div>
        <button className="btn btn-primary">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Plugin
        </button>
      </div>

      {/* Plugin Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plugins.map((plugin, index) => (
          <motion.div
            key={plugin.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card"
          >
            <div className="card-content">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="rounded-lg bg-primary-100 p-2">
                    <PuzzlePieceIcon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900">{plugin.name}</h3>
                    <p className="text-sm text-secondary-600">{plugin.category}</p>
                  </div>
                </div>
                <span className={`badge ${getStatusColor(plugin.status)} flex items-center space-x-1`}>
                  {getStatusIcon(plugin.status)}
                  <span className="capitalize">{plugin.status}</span>
                </span>
              </div>
              
              <p className="mt-4 text-sm text-secondary-700">{plugin.description}</p>
              
              <div className="mt-4 flex items-center justify-between text-sm text-secondary-500">
                <span>v{plugin.version}</span>
                <span>by {plugin.author}</span>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <button className="btn btn-secondary btn-sm flex-1">
                  <Cog6ToothIcon className="h-4 w-4 mr-1" />
                  Configure
                </button>
                <button className={`btn btn-sm ${
                  plugin.status === 'active' ? 'btn-secondary' : 'btn-primary'
                }`}>
                  {plugin.status === 'active' ? (
                    <>
                      <PauseIcon className="h-4 w-4 mr-1" />
                      Stop
                    </>
                  ) : (
                    <>
                      <PlayIcon className="h-4 w-4 mr-1" />
                      Start
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Plugins