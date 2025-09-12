/**
 * Calendar Plugin - Advanced calendar management and scheduling
 * Handles events, meetings, reminders, and calendar integrations
 */

import { ZeekyPlugin, PluginContext, Intent, Response } from '../../types/ZeekyTypes';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  attendees?: string[];
  isAllDay: boolean;
  recurrence?: RecurrenceRule;
  reminders?: Reminder[];
  status: 'confirmed' | 'tentative' | 'cancelled';
  visibility: 'public' | 'private' | 'confidential';
  calendarId: string;
  created: Date;
  updated: Date;
}

export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: Date;
  count?: number;
  byDay?: string[];
  byMonth?: number[];
  byMonthDay?: number[];
  byYearDay?: number[];
  byWeekNo?: number[];
  bySetPos?: number[];
  weekStart?: string;
}

export interface Reminder {
  id: string;
  minutes: number;
  method: 'popup' | 'email' | 'sms';
  enabled: boolean;
}

export interface CalendarIntegration {
  id: string;
  name: string;
  type: 'google' | 'outlook' | 'apple' | 'exchange' | 'caldav';
  credentials: any;
  syncEnabled: boolean;
  lastSync: Date;
}

export class CalendarPlugin implements ZeekyPlugin {
  private context!: PluginContext;
  private events: Map<string, CalendarEvent> = new Map();
  private integrations: Map<string, CalendarIntegration> = new Map();
  private reminders: Map<string, Reminder[]> = new Map();

  async initialize(context: PluginContext): Promise<void> {
    this.context = context;
    this.context.logger.info('Calendar Plugin initialized');
    
    // Load existing events and integrations
    await this.loadEvents();
    await this.loadIntegrations();
    
    // Set up periodic sync
    this.setupPeriodicSync();
  }

  async start(): Promise<void> {
    this.context.logger.info('Calendar Plugin started');
  }

  async stop(): Promise<void> {
    this.context.logger.info('Calendar Plugin stopped');
  }

  async handleIntent(intent: Intent, context: any): Promise<Response> {
    try {
      switch (intent.action) {
        case 'create_event':
          return await this.createEvent(intent, context);
        case 'update_event':
          return await this.updateEvent(intent, context);
        case 'delete_event':
          return await this.deleteEvent(intent, context);
        case 'get_events':
          return await this.getEvents(intent, context);
        case 'get_upcoming_events':
          return await this.getUpcomingEvents(intent, context);
        case 'search_events':
          return await this.searchEvents(intent, context);
        case 'set_reminder':
          return await this.setReminder(intent, context);
        case 'add_integration':
          return await this.addIntegration(intent, context);
        case 'sync_calendars':
          return await this.syncCalendars(intent, context);
        case 'find_free_time':
          return await this.findFreeTime(intent, context);
        case 'schedule_meeting':
          return await this.scheduleMeeting(intent, context);
        default:
          throw new Error(`Unsupported intent: ${intent.action}`);
      }
    } catch (error) {
      this.context.logger.error('Calendar Plugin error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        data: null
      };
    }
  }

  async updateConfiguration(config: any): Promise<void> {
    this.context.logger.info('Calendar Plugin configuration updated');
  }

  getCapabilities(): string[] {
    return [
      'create_event',
      'update_event',
      'delete_event',
      'get_events',
      'get_upcoming_events',
      'search_events',
      'set_reminder',
      'add_integration',
      'sync_calendars',
      'find_free_time',
      'schedule_meeting'
    ];
  }

  getMetadata() {
    return {
      id: 'calendar',
      name: 'Calendar Manager',
      version: '1.0.0',
      description: 'Advanced calendar management and scheduling',
      author: 'Zeeky Team',
      category: 'productivity',
      priority: 10,
      dependencies: [],
      capabilities: this.getCapabilities(),
      permissions: [
        { category: 'calendar', level: 'read', scope: 'all' },
        { category: 'calendar', level: 'write', scope: 'all' },
        { category: 'notifications', level: 'read', scope: 'all' },
        { category: 'notifications', level: 'write', scope: 'all' }
      ]
    };
  }

  private async createEvent(intent: Intent, context: any): Promise<Response> {
    const title = this.extractEntity(intent, 'title') || 'New Event';
    const startTime = this.extractEntity(intent, 'start_time');
    const endTime = this.extractEntity(intent, 'end_time');
    const location = this.extractEntity(intent, 'location');
    const description = this.extractEntity(intent, 'description');
    const attendees = this.extractEntity(intent, 'attendees') || [];

    if (!startTime || !endTime) {
      return {
        success: false,
        error: 'Start time and end time are required',
        data: null
      };
    }

    const event: CalendarEvent = {
      id: this.generateId(),
      title,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      location,
      attendees,
      isAllDay: false,
      status: 'confirmed',
      visibility: 'private',
      calendarId: 'default',
      created: new Date(),
      updated: new Date()
    };

    this.events.set(event.id, event);
    await this.saveEvents();

    return {
      success: true,
      data: { event },
      message: `Created event "${title}" for ${event.startTime.toLocaleString()}`
    };
  }

  private async updateEvent(intent: Intent, context: any): Promise<Response> {
    const eventId = this.extractEntity(intent, 'event_id');
    if (!eventId) {
      return {
        success: false,
        error: 'Event ID is required',
        data: null
      };
    }

    const event = this.events.get(eventId);
    if (!event) {
      return {
        success: false,
        error: 'Event not found',
        data: null
      };
    }

    // Update fields
    const title = this.extractEntity(intent, 'title');
    if (title) event.title = title;

    const startTime = this.extractEntity(intent, 'start_time');
    if (startTime) event.startTime = new Date(startTime);

    const endTime = this.extractEntity(intent, 'end_time');
    if (endTime) event.endTime = new Date(endTime);

    const location = this.extractEntity(intent, 'location');
    if (location) event.location = location;

    const description = this.extractEntity(intent, 'description');
    if (description) event.description = description;

    event.updated = new Date();
    this.events.set(eventId, event);
    await this.saveEvents();

    return {
      success: true,
      data: { event },
      message: `Updated event "${event.title}"`
    };
  }

  private async deleteEvent(intent: Intent, context: any): Promise<Response> {
    const eventId = this.extractEntity(intent, 'event_id');
    if (!eventId) {
      return {
        success: false,
        error: 'Event ID is required',
        data: null
      };
    }

    const event = this.events.get(eventId);
    if (!event) {
      return {
        success: false,
        error: 'Event not found',
        data: null
      };
    }

    this.events.delete(eventId);
    await this.saveEvents();

    return {
      success: true,
      data: { deletedEventId: eventId },
      message: `Deleted event "${event.title}"`
    };
  }

  private async getEvents(intent: Intent, context: any): Promise<Response> {
    const startDate = this.extractEntity(intent, 'start_date');
    const endDate = this.extractEntity(intent, 'end_date');
    const calendarId = this.extractEntity(intent, 'calendar_id') || 'default';

    let events = Array.from(this.events.values())
      .filter(event => event.calendarId === calendarId);

    if (startDate) {
      events = events.filter(event => event.startTime >= new Date(startDate));
    }

    if (endDate) {
      events = events.filter(event => event.startTime <= new Date(endDate));
    }

    // Sort by start time
    events.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    return {
      success: true,
      data: { events },
      message: `Found ${events.length} events`
    };
  }

  private async getUpcomingEvents(intent: Intent, context: any): Promise<Response> {
    const hours = parseInt(this.extractEntity(intent, 'hours') || '24');
    const now = new Date();
    const future = new Date(now.getTime() + hours * 60 * 60 * 1000);

    const events = Array.from(this.events.values())
      .filter(event => event.startTime >= now && event.startTime <= future)
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    return {
      success: true,
      data: { events, timeRange: { start: now, end: future } },
      message: `Found ${events.length} upcoming events in the next ${hours} hours`
    };
  }

  private async searchEvents(intent: Intent, context: any): Promise<Response> {
    const query = this.extractEntity(intent, 'query');
    if (!query) {
      return {
        success: false,
        error: 'Search query is required',
        data: null
      };
    }

    const events = Array.from(this.events.values())
      .filter(event => 
        event.title.toLowerCase().includes(query.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(query.toLowerCase())) ||
        (event.location && event.location.toLowerCase().includes(query.toLowerCase()))
      )
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    return {
      success: true,
      data: { events, query },
      message: `Found ${events.length} events matching "${query}"`
    };
  }

  private async setReminder(intent: Intent, context: any): Promise<Response> {
    const eventId = this.extractEntity(intent, 'event_id');
    const minutes = parseInt(this.extractEntity(intent, 'minutes') || '15');
    const method = this.extractEntity(intent, 'method') || 'popup';

    if (!eventId) {
      return {
        success: false,
        error: 'Event ID is required',
        data: null
      };
    }

    const event = this.events.get(eventId);
    if (!event) {
      return {
        success: false,
        error: 'Event not found',
        data: null
      };
    }

    const reminder: Reminder = {
      id: this.generateId(),
      minutes,
      method: method as 'popup' | 'email' | 'sms',
      enabled: true
    };

    const eventReminders = this.reminders.get(eventId) || [];
    eventReminders.push(reminder);
    this.reminders.set(eventId, eventReminders);

    return {
      success: true,
      data: { reminder, eventId },
      message: `Set reminder for "${event.title}" ${minutes} minutes before`
    };
  }

  private async addIntegration(intent: Intent, context: any): Promise<Response> {
    const name = this.extractEntity(intent, 'name');
    const type = this.extractEntity(intent, 'type');
    const credentials = this.extractEntity(intent, 'credentials');

    if (!name || !type || !credentials) {
      return {
        success: false,
        error: 'Name, type, and credentials are required',
        data: null
      };
    }

    const integration: CalendarIntegration = {
      id: this.generateId(),
      name,
      type: type as any,
      credentials,
      syncEnabled: true,
      lastSync: new Date()
    };

    this.integrations.set(integration.id, integration);
    await this.saveIntegrations();

    return {
      success: true,
      data: { integration },
      message: `Added ${type} calendar integration: ${name}`
    };
  }

  private async syncCalendars(intent: Intent, context: any): Promise<Response> {
    const integrationId = this.extractEntity(intent, 'integration_id');
    
    if (integrationId) {
      const integration = this.integrations.get(integrationId);
      if (!integration) {
        return {
          success: false,
          error: 'Integration not found',
          data: null
        };
      }
      await this.syncIntegration(integration);
    } else {
      // Sync all integrations
      for (const integration of this.integrations.values()) {
        if (integration.syncEnabled) {
          await this.syncIntegration(integration);
        }
      }
    }

    return {
      success: true,
      data: { syncedAt: new Date() },
      message: 'Calendar sync completed'
    };
  }

  private async findFreeTime(intent: Intent, context: any): Promise<Response> {
    const startDate = this.extractEntity(intent, 'start_date');
    const endDate = this.extractEntity(intent, 'end_date');
    const duration = parseInt(this.extractEntity(intent, 'duration') || '60'); // minutes
    const workingHours = this.extractEntity(intent, 'working_hours') || '9-17';

    if (!startDate || !endDate) {
      return {
        success: false,
        error: 'Start date and end date are required',
        data: null
      };
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const freeSlots = this.calculateFreeTimeSlots(start, end, duration, workingHours);

    return {
      success: true,
      data: { freeSlots, duration, workingHours },
      message: `Found ${freeSlots.length} free time slots`
    };
  }

  private async scheduleMeeting(intent: Intent, context: any): Promise<Response> {
    const title = this.extractEntity(intent, 'title') || 'Meeting';
    const attendees = this.extractEntity(intent, 'attendees') || [];
    const duration = parseInt(this.extractEntity(intent, 'duration') || '60');
    const preferredTime = this.extractEntity(intent, 'preferred_time');
    const location = this.extractEntity(intent, 'location');

    // Find free time for all attendees
    const freeTimeResult = await this.findFreeTime({
      action: 'find_free_time',
      entities: [
        { name: 'start_date', value: new Date().toISOString() },
        { name: 'end_date', value: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() },
        { name: 'duration', value: duration.toString() }
      ]
    } as Intent, {});

    if (!freeTimeResult.success || !freeTimeResult.data?.freeSlots?.length) {
      return {
        success: false,
        error: 'No available time slots found',
        data: null
      };
    }

    // Use the first available slot
    const slot = freeTimeResult.data.freeSlots[0];
    
    const event: CalendarEvent = {
      id: this.generateId(),
      title,
      description: `Meeting with ${attendees.join(', ')}`,
      startTime: slot.start,
      endTime: slot.end,
      location,
      attendees,
      isAllDay: false,
      status: 'tentative',
      visibility: 'private',
      calendarId: 'default',
      created: new Date(),
      updated: new Date()
    };

    this.events.set(event.id, event);
    await this.saveEvents();

    return {
      success: true,
      data: { event, slot },
      message: `Scheduled meeting "${title}" for ${event.startTime.toLocaleString()}`
    };
  }

  private extractEntity(intent: Intent, name: string): any {
    const entity = intent.entities?.find((e: any) => e.name === name);
    return entity?.value;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private async loadEvents(): Promise<void> {
    // Load from storage (placeholder)
    this.context.logger.debug('Loading calendar events');
  }

  private async saveEvents(): Promise<void> {
    // Save to storage (placeholder)
    this.context.logger.debug('Saving calendar events');
  }

  private async loadIntegrations(): Promise<void> {
    // Load from storage (placeholder)
    this.context.logger.debug('Loading calendar integrations');
  }

  private async saveIntegrations(): Promise<void> {
    // Save to storage (placeholder)
    this.context.logger.debug('Saving calendar integrations');
  }

  private async syncIntegration(integration: CalendarIntegration): Promise<void> {
    this.context.logger.info(`Syncing ${integration.type} calendar: ${integration.name}`);
    // Implement actual sync logic based on integration type
    integration.lastSync = new Date();
  }

  private setupPeriodicSync(): void {
    // Set up periodic sync every 15 minutes
    setInterval(() => {
      for (const integration of this.integrations.values()) {
        if (integration.syncEnabled) {
          this.syncIntegration(integration);
        }
      }
    }, 15 * 60 * 1000);
  }

  private calculateFreeTimeSlots(
    start: Date, 
    end: Date, 
    duration: number, 
    workingHours: string
  ): Array<{ start: Date; end: Date }> {
    const slots: Array<{ start: Date; end: Date }> = [];
    const [startHour, endHour] = workingHours.split('-').map(h => parseInt(h));
    
    // Get all events in the time range
    const events = Array.from(this.events.values())
      .filter(event => event.startTime >= start && event.endTime <= end)
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    let current = new Date(start);
    
    while (current < end) {
      // Check if current time is within working hours
      const hour = current.getHours();
      if (hour >= startHour && hour < endHour) {
        // Find next event
        const nextEvent = events.find(event => event.startTime >= current);
        
        if (!nextEvent) {
          // No more events, check if we have enough time until end of day
          const endOfDay = new Date(current);
          endOfDay.setHours(endHour, 0, 0, 0);
          
          if (endOfDay.getTime() - current.getTime() >= duration * 60 * 1000) {
            slots.push({
              start: new Date(current),
              end: new Date(current.getTime() + duration * 60 * 1000)
            });
          }
          break;
        } else {
          // Check if we have enough time before next event
          const timeUntilNext = nextEvent.startTime.getTime() - current.getTime();
          
          if (timeUntilNext >= duration * 60 * 1000) {
            slots.push({
              start: new Date(current),
              end: new Date(current.getTime() + duration * 60 * 1000)
            });
          }
          
          // Move to after the next event
          current = new Date(nextEvent.endTime);
        }
      } else {
        // Move to next working hour
        current.setHours(startHour, 0, 0, 0);
        if (current <= new Date()) {
          current.setDate(current.getDate() + 1);
        }
      }
    }

    return slots;
  }
}