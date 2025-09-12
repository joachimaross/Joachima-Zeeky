/**
 * Zeeky Sample Plugin
 * 
 * A comprehensive sample plugin demonstrating productivity, creative, and enterprise capabilities.
 * This plugin serves as a template and reference implementation for building Zeeky plugins.
 */

import { Plugin, PluginContext, PluginResponse, ZeekyRequest } from '@zeeky/core';
import { ProductivityModule } from './modules/ProductivityModule';
import { CreativeModule } from './modules/CreativeModule';
import { EnterpriseModule } from './modules/EnterpriseModule';

export interface SamplePluginConfig {
  productivity: {
    calendarProvider: 'google' | 'outlook' | 'apple';
    taskManager: 'todoist' | 'asana' | 'trello';
    noteTaking: 'notion' | 'evernote' | 'onenote';
  };
  creative: {
    musicProvider: 'spotify' | 'apple-music' | 'youtube-music';
    imageProvider: 'dalle' | 'midjourney' | 'stable-diffusion';
    contentProvider: 'openai' | 'anthropic' | 'cohere';
  };
  enterprise: {
    crmProvider: 'salesforce' | 'hubspot' | 'pipedrive';
    analyticsProvider: 'google-analytics' | 'mixpanel' | 'amplitude';
    communicationProvider: 'slack' | 'teams' | 'discord';
  };
}

export class SamplePlugin implements Plugin {
  public readonly id = 'sample-plugin';
  public readonly name = 'Sample Plugin';
  public readonly version = '1.0.0';
  public readonly description = 'Comprehensive sample plugin with productivity, creative, and enterprise capabilities';
  public readonly author = 'Zeeky Team';
  public readonly category = 'sample';
  
  private context!: PluginContext;
  private config: SamplePluginConfig;
  private productivityModule: ProductivityModule;
  private creativeModule: CreativeModule;
  private enterpriseModule: EnterpriseModule;

  constructor(config: SamplePluginConfig) {
    this.config = config;
    this.productivityModule = new ProductivityModule(config.productivity);
    this.creativeModule = new CreativeModule(config.creative);
    this.enterpriseModule = new EnterpriseModule(config.enterprise);
  }

  async initialize(context: PluginContext): Promise<void> {
    this.context = context;
    
    // Initialize modules
    await this.productivityModule.initialize(context);
    await this.creativeModule.initialize(context);
    await this.enterpriseModule.initialize(context);
    
    this.context.logger.info('Sample plugin initialized successfully');
  }

  async handleRequest(request: ZeekyRequest): Promise<PluginResponse> {
    try {
      const intent = request.intent;
      
      // Route to appropriate module based on intent
      switch (intent.category) {
        case 'productivity':
          return await this.productivityModule.handleRequest(request);
        case 'creative':
          return await this.creativeModule.handleRequest(request);
        case 'enterprise':
          return await this.enterpriseModule.handleRequest(request);
        default:
          return this.createErrorResponse('Unsupported intent category');
      }
    } catch (error) {
      this.context.logger.error('Error handling request:', error);
      return this.createErrorResponse('Internal plugin error');
    }
  }

  async getCapabilities(): Promise<string[]> {
    return [
      // Productivity capabilities
      'calendar.manage',
      'tasks.create',
      'tasks.update',
      'tasks.delete',
      'notes.create',
      'notes.search',
      'reminders.set',
      'schedule.optimize',
      
      // Creative capabilities
      'music.generate',
      'music.recommend',
      'image.generate',
      'image.edit',
      'content.write',
      'content.translate',
      'story.create',
      'poem.write',
      
      // Enterprise capabilities
      'crm.contacts',
      'crm.leads',
      'analytics.report',
      'analytics.dashboard',
      'communication.send',
      'meetings.schedule',
      'documents.analyze',
      'workflows.automate'
    ];
  }

  async getIntents(): Promise<any[]> {
    return [
      // Productivity intents
      {
        id: 'create-task',
        name: 'Create Task',
        description: 'Create a new task or todo item',
        category: 'productivity',
        entities: ['task_name', 'due_date', 'priority'],
        confidence: 0.9
      },
      {
        id: 'schedule-meeting',
        name: 'Schedule Meeting',
        description: 'Schedule a meeting or appointment',
        category: 'productivity',
        entities: ['meeting_title', 'participants', 'date_time', 'duration'],
        confidence: 0.9
      },
      {
        id: 'create-note',
        name: 'Create Note',
        description: 'Create a new note or document',
        category: 'productivity',
        entities: ['note_title', 'note_content', 'tags'],
        confidence: 0.9
      },
      
      // Creative intents
      {
        id: 'generate-music',
        name: 'Generate Music',
        description: 'Generate or create music',
        category: 'creative',
        entities: ['genre', 'mood', 'duration', 'instruments'],
        confidence: 0.9
      },
      {
        id: 'generate-image',
        name: 'Generate Image',
        description: 'Generate or create images',
        category: 'creative',
        entities: ['description', 'style', 'size', 'format'],
        confidence: 0.9
      },
      {
        id: 'write-content',
        name: 'Write Content',
        description: 'Write or generate content',
        category: 'creative',
        entities: ['content_type', 'topic', 'tone', 'length'],
        confidence: 0.9
      },
      
      // Enterprise intents
      {
        id: 'crm-lookup',
        name: 'CRM Lookup',
        description: 'Look up customer or lead information',
        category: 'enterprise',
        entities: ['contact_name', 'company', 'search_criteria'],
        confidence: 0.9
      },
      {
        id: 'analytics-report',
        name: 'Analytics Report',
        description: 'Generate analytics or performance reports',
        category: 'enterprise',
        entities: ['report_type', 'date_range', 'metrics'],
        confidence: 0.9
      },
      {
        id: 'send-message',
        name: 'Send Message',
        description: 'Send messages via communication platforms',
        category: 'enterprise',
        entities: ['recipient', 'message_content', 'platform'],
        confidence: 0.9
      }
    ];
  }

  async getPermissions(): Promise<any[]> {
    return [
      {
        category: 'calendar',
        level: 'read-write',
        description: 'Access to calendar for scheduling and management'
      },
      {
        category: 'tasks',
        level: 'read-write',
        description: 'Access to task management systems'
      },
      {
        category: 'notes',
        level: 'read-write',
        description: 'Access to note-taking applications'
      },
      {
        category: 'music',
        level: 'read',
        description: 'Access to music streaming services'
      },
      {
        category: 'images',
        level: 'generate',
        description: 'Generate and edit images'
      },
      {
        category: 'content',
        level: 'generate',
        description: 'Generate and create content'
      },
      {
        category: 'crm',
        level: 'read',
        description: 'Access to CRM systems'
      },
      {
        category: 'analytics',
        level: 'read',
        description: 'Access to analytics platforms'
      },
      {
        category: 'communication',
        level: 'write',
        description: 'Send messages via communication platforms'
      }
    ];
  }

  async shutdown(): Promise<void> {
    this.context.logger.info('Sample plugin shutting down');
    
    // Cleanup modules
    await this.productivityModule.shutdown();
    await this.creativeModule.shutdown();
    await this.enterpriseModule.shutdown();
  }

  private createErrorResponse(message: string): PluginResponse {
    return {
      success: false,
      error: message,
      message: message
    };
  }
}

// Export the plugin class and types
export { SamplePlugin };
export type { SamplePluginConfig };
export * from './modules/ProductivityModule';
export * from './modules/CreativeModule';
export * from './modules/EnterpriseModule';