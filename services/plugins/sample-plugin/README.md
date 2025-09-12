# Zeeky Sample Plugin

A comprehensive sample plugin demonstrating productivity, creative, and enterprise capabilities for the Zeeky AI Assistant platform.

## Features

### 🎯 Productivity Module
- **Task Management**: Create, update, and manage tasks with due dates and priorities
- **Calendar Integration**: Schedule meetings and appointments with participants
- **Note Taking**: Create, search, and organize notes with tags
- **Scheduling Optimization**: Smart scheduling and time management

### 🎨 Creative Module
- **Music Generation**: AI-powered music creation with genre and mood control
- **Image Generation**: Create images from text descriptions with various styles
- **Content Writing**: Generate articles, stories, poems, and scripts
- **Creative Tools**: Image editing, music recommendations, and artistic assistance

### 🏢 Enterprise Module
- **CRM Integration**: Contact and lead management with multiple CRM providers
- **Analytics Reporting**: Generate performance and business intelligence reports
- **Communication**: Send messages via Slack, Teams, Discord, and other platforms
- **Business Automation**: Meeting scheduling, workflow automation, and document analysis

## Installation

```bash
npm install zeeky-sample-plugin
```

## Usage

### Basic Setup

```typescript
import { SamplePlugin, SamplePluginConfig } from 'zeeky-sample-plugin';

const config: SamplePluginConfig = {
  productivity: {
    calendarProvider: 'google',
    taskManager: 'todoist',
    noteTaking: 'notion'
  },
  creative: {
    musicProvider: 'spotify',
    imageProvider: 'dalle',
    contentProvider: 'openai'
  },
  enterprise: {
    crmProvider: 'salesforce',
    analyticsProvider: 'google-analytics',
    communicationProvider: 'slack'
  }
};

const plugin = new SamplePlugin(config);
```

### Registering with Zeeky

```typescript
import { ZeekyCore } from '@zeeky/core';

const zeeky = new ZeekyCore();
await zeeky.registerPlugin(plugin);
```

## API Reference

### Productivity Intents

#### Create Task
```typescript
const request = {
  intent: {
    id: 'create-task',
    category: 'productivity'
  },
  entities: [
    { type: 'task_name', value: 'Complete project proposal' },
    { type: 'due_date', value: '2024-01-15' },
    { type: 'priority', value: 'high' }
  ]
};

const response = await plugin.handleRequest(request);
```

#### Schedule Meeting
```typescript
const request = {
  intent: {
    id: 'schedule-meeting',
    category: 'productivity'
  },
  entities: [
    { type: 'meeting_title', value: 'Project Kickoff' },
    { type: 'participants', value: ['john@example.com', 'jane@example.com'] },
    { type: 'date_time', value: '2024-01-15T14:00:00Z' },
    { type: 'duration', value: 60 }
  ]
};

const response = await plugin.handleRequest(request);
```

### Creative Intents

#### Generate Image
```typescript
const request = {
  intent: {
    id: 'generate-image',
    category: 'creative'
  },
  entities: [
    { type: 'description', value: 'A futuristic cityscape at sunset' },
    { type: 'style', value: 'cyberpunk' },
    { type: 'size', value: '1024x1024' }
  ]
};

const response = await plugin.handleRequest(request);
```

#### Write Content
```typescript
const request = {
  intent: {
    id: 'write-content',
    category: 'creative'
  },
  entities: [
    { type: 'content_type', value: 'article' },
    { type: 'topic', value: 'Artificial Intelligence in Healthcare' },
    { type: 'tone', value: 'professional' },
    { type: 'length', value: 'medium' }
  ]
};

const response = await plugin.handleRequest(request);
```

### Enterprise Intents

#### CRM Lookup
```typescript
const request = {
  intent: {
    id: 'crm-lookup',
    category: 'enterprise'
  },
  entities: [
    { type: 'contact_name', value: 'John Smith' },
    { type: 'company', value: 'Acme Corp' }
  ]
};

const response = await plugin.handleRequest(request);
```

#### Generate Analytics Report
```typescript
const request = {
  intent: {
    id: 'analytics-report',
    category: 'enterprise'
  },
  entities: [
    { type: 'report_type', value: 'performance' },
    { type: 'date_range', value: '30d' },
    { type: 'metrics', value: ['visitors', 'conversions', 'revenue'] }
  ]
};

const response = await plugin.handleRequest(request);
```

## Configuration

### Productivity Configuration
- **calendarProvider**: `'google' | 'outlook' | 'apple'` - Calendar service integration
- **taskManager**: `'todoist' | 'asana' | 'trello'` - Task management system
- **noteTaking**: `'notion' | 'evernote' | 'onenote'` - Note-taking application

### Creative Configuration
- **musicProvider**: `'spotify' | 'apple-music' | 'youtube-music'` - Music streaming service
- **imageProvider**: `'dalle' | 'midjourney' | 'stable-diffusion'` - AI image generation service
- **contentProvider**: `'openai' | 'anthropic' | 'cohere'` - AI content generation service

### Enterprise Configuration
- **crmProvider**: `'salesforce' | 'hubspot' | 'pipedrive'` - CRM system
- **analyticsProvider**: `'google-analytics' | 'mixpanel' | 'amplitude'` - Analytics platform
- **communicationProvider**: `'slack' | 'teams' | 'discord'` - Communication platform

## Response Format

All plugin responses follow the standard Zeeky response format:

```typescript
interface PluginResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}
```

### Success Response Example
```typescript
{
  success: true,
  message: "Task 'Complete project proposal' created successfully",
  data: {
    task: {
      id: "task_123",
      title: "Complete project proposal",
      dueDate: "2024-01-15T00:00:00.000Z",
      priority: "high",
      status: "pending"
    }
  }
}
```

### Error Response Example
```typescript
{
  success: false,
  error: "Task name is required",
  message: "Task name is required"
}
```

## Development

### Building the Plugin

```bash
# Install dependencies
npm install

# Build the plugin
npm run build

# Run tests
npm test

# Run linting
npm run lint
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

- 📖 [Documentation](https://docs.zeeky.ai/plugins)
- 🐛 [Issue Tracker](https://github.com/zeeky/zeeky-plugins/issues)
- 💬 [Community Discord](https://discord.gg/zeeky)
- 📧 [Email Support](mailto:support@zeeky.ai)