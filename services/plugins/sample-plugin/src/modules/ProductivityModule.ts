/**
 * Productivity Module
 * 
 * Handles productivity-related intents including calendar management,
 * task creation, note-taking, and scheduling optimization.
 */

import { PluginContext, PluginResponse, ZeekyRequest } from '@zeeky/core';
import { addDays, format, parseISO } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

export interface ProductivityConfig {
  calendarProvider: 'google' | 'outlook' | 'apple';
  taskManager: 'todoist' | 'asana' | 'trello';
  noteTaking: 'notion' | 'evernote' | 'onenote';
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Meeting {
  id: string;
  title: string;
  participants: string[];
  startTime: Date;
  endTime: Date;
  location?: string;
  description?: string;
}

export class ProductivityModule {
  private context!: PluginContext;
  private config: ProductivityConfig;
  private tasks: Map<string, Task> = new Map();
  private notes: Map<string, Note> = new Map();
  private meetings: Map<string, Meeting> = new Map();

  constructor(config: ProductivityConfig) {
    this.config = config;
  }

  async initialize(context: PluginContext): Promise<void> {
    this.context = context;
    this.context.logger.info('Productivity module initialized');
  }

  async handleRequest(request: ZeekyRequest): Promise<PluginResponse> {
    const intent = request.intent;
    
    try {
      switch (intent.id) {
        case 'create-task':
          return await this.createTask(request);
        case 'schedule-meeting':
          return await this.scheduleMeeting(request);
        case 'create-note':
          return await this.createNote(request);
        case 'list-tasks':
          return await this.listTasks(request);
        case 'update-task':
          return await this.updateTask(request);
        case 'search-notes':
          return await this.searchNotes(request);
        default:
          return this.createErrorResponse('Unsupported productivity intent');
      }
    } catch (error) {
      this.context.logger.error('Error in productivity module:', error);
      return this.createErrorResponse('Productivity module error');
    }
  }

  private async createTask(request: ZeekyRequest): Promise<PluginResponse> {
    const taskName = request.entities?.find(e => e.type === 'task_name')?.value as string;
    const dueDateStr = request.entities?.find(e => e.type === 'due_date')?.value as string;
    const priority = request.entities?.find(e => e.type === 'priority')?.value as string || 'medium';

    if (!taskName) {
      return this.createErrorResponse('Task name is required');
    }

    const task: Task = {
      id: uuidv4(),
      title: taskName,
      dueDate: dueDateStr ? parseISO(dueDateStr) : addDays(new Date(), 7),
      priority: priority as 'low' | 'medium' | 'high',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.tasks.set(task.id, task);

    // Integrate with external task manager
    await this.integrateWithTaskManager(task);

    return {
      success: true,
      message: `Task "${task.title}" created successfully`,
      data: {
        task: {
          id: task.id,
          title: task.title,
          dueDate: task.dueDate?.toISOString(),
          priority: task.priority,
          status: task.status
        }
      }
    };
  }

  private async scheduleMeeting(request: ZeekyRequest): Promise<PluginResponse> {
    const meetingTitle = request.entities?.find(e => e.type === 'meeting_title')?.value as string;
    const participants = request.entities?.find(e => e.type === 'participants')?.value as string[];
    const dateTime = request.entities?.find(e => e.type === 'date_time')?.value as string;
    const duration = request.entities?.find(e => e.type === 'duration')?.value as number || 60;

    if (!meetingTitle || !dateTime) {
      return this.createErrorResponse('Meeting title and date/time are required');
    }

    const startTime = parseISO(dateTime);
    const endTime = new Date(startTime.getTime() + duration * 60000);

    const meeting: Meeting = {
      id: uuidv4(),
      title: meetingTitle,
      participants: participants || [],
      startTime,
      endTime,
      createdAt: new Date()
    };

    this.meetings.set(meeting.id, meeting);

    // Integrate with external calendar
    await this.integrateWithCalendar(meeting);

    return {
      success: true,
      message: `Meeting "${meeting.title}" scheduled for ${format(startTime, 'PPP p')}`,
      data: {
        meeting: {
          id: meeting.id,
          title: meeting.title,
          startTime: meeting.startTime.toISOString(),
          endTime: meeting.endTime.toISOString(),
          participants: meeting.participants
        }
      }
    };
  }

  private async createNote(request: ZeekyRequest): Promise<PluginResponse> {
    const noteTitle = request.entities?.find(e => e.type === 'note_title')?.value as string;
    const noteContent = request.entities?.find(e => e.type === 'note_content')?.value as string;
    const tags = request.entities?.find(e => e.type === 'tags')?.value as string[] || [];

    if (!noteTitle || !noteContent) {
      return this.createErrorResponse('Note title and content are required');
    }

    const note: Note = {
      id: uuidv4(),
      title: noteTitle,
      content: noteContent,
      tags,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.notes.set(note.id, note);

    // Integrate with external note-taking app
    await this.integrateWithNoteApp(note);

    return {
      success: true,
      message: `Note "${note.title}" created successfully`,
      data: {
        note: {
          id: note.id,
          title: note.title,
          content: note.content,
          tags: note.tags,
          createdAt: note.createdAt.toISOString()
        }
      }
    };
  }

  private async listTasks(request: ZeekyRequest): Promise<PluginResponse> {
    const status = request.entities?.find(e => e.type === 'status')?.value as string;
    const priority = request.entities?.find(e => e.type === 'priority')?.value as string;

    let filteredTasks = Array.from(this.tasks.values());

    if (status) {
      filteredTasks = filteredTasks.filter(task => task.status === status);
    }

    if (priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === priority);
    }

    // Sort by due date and priority
    filteredTasks.sort((a, b) => {
      if (a.dueDate && b.dueDate) {
        return a.dueDate.getTime() - b.dueDate.getTime();
      }
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    return {
      success: true,
      message: `Found ${filteredTasks.length} tasks`,
      data: {
        tasks: filteredTasks.map(task => ({
          id: task.id,
          title: task.title,
          dueDate: task.dueDate?.toISOString(),
          priority: task.priority,
          status: task.status
        }))
      }
    };
  }

  private async updateTask(request: ZeekyRequest): Promise<PluginResponse> {
    const taskId = request.entities?.find(e => e.type === 'task_id')?.value as string;
    const updates = request.entities?.find(e => e.type === 'updates')?.value as Partial<Task>;

    if (!taskId || !updates) {
      return this.createErrorResponse('Task ID and updates are required');
    }

    const task = this.tasks.get(taskId);
    if (!task) {
      return this.createErrorResponse('Task not found');
    }

    const updatedTask: Task = {
      ...task,
      ...updates,
      updatedAt: new Date()
    };

    this.tasks.set(taskId, updatedTask);

    return {
      success: true,
      message: `Task "${updatedTask.title}" updated successfully`,
      data: {
        task: {
          id: updatedTask.id,
          title: updatedTask.title,
          status: updatedTask.status,
          priority: updatedTask.priority,
          updatedAt: updatedTask.updatedAt.toISOString()
        }
      }
    };
  }

  private async searchNotes(request: ZeekyRequest): Promise<PluginResponse> {
    const query = request.entities?.find(e => e.type === 'search_query')?.value as string;
    const tags = request.entities?.find(e => e.type === 'tags')?.value as string[];

    if (!query) {
      return this.createErrorResponse('Search query is required');
    }

    let filteredNotes = Array.from(this.notes.values());

    // Filter by content
    filteredNotes = filteredNotes.filter(note => 
      note.title.toLowerCase().includes(query.toLowerCase()) ||
      note.content.toLowerCase().includes(query.toLowerCase())
    );

    // Filter by tags if provided
    if (tags && tags.length > 0) {
      filteredNotes = filteredNotes.filter(note =>
        tags.some(tag => note.tags.includes(tag))
      );
    }

    // Sort by relevance (title matches first, then content)
    filteredNotes.sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().includes(query.toLowerCase());
      const bTitleMatch = b.title.toLowerCase().includes(query.toLowerCase());
      
      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;
      
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    return {
      success: true,
      message: `Found ${filteredNotes.length} notes matching "${query}"`,
      data: {
        notes: filteredNotes.map(note => ({
          id: note.id,
          title: note.title,
          content: note.content.substring(0, 200) + (note.content.length > 200 ? '...' : ''),
          tags: note.tags,
          createdAt: note.createdAt.toISOString()
        }))
      }
    };
  }

  private async integrateWithTaskManager(task: Task): Promise<void> {
    // Simulate integration with external task manager
    this.context.logger.info(`Integrating task "${task.title}" with ${this.config.taskManager}`);
    
    // In a real implementation, this would make API calls to the configured task manager
    // For example:
    // - Todoist: POST /rest/v2/tasks
    // - Asana: POST /api/1.0/tasks
    // - Trello: POST /1/cards
  }

  private async integrateWithCalendar(meeting: Meeting): Promise<void> {
    // Simulate integration with external calendar
    this.context.logger.info(`Integrating meeting "${meeting.title}" with ${this.config.calendarProvider}`);
    
    // In a real implementation, this would make API calls to the configured calendar provider
    // For example:
    // - Google Calendar: POST /calendar/v3/calendars/primary/events
    // - Outlook: POST /me/events
    // - Apple Calendar: EventKit framework
  }

  private async integrateWithNoteApp(note: Note): Promise<void> {
    // Simulate integration with external note-taking app
    this.context.logger.info(`Integrating note "${note.title}" with ${this.config.noteTaking}`);
    
    // In a real implementation, this would make API calls to the configured note-taking app
    // For example:
    // - Notion: POST /v1/pages
    // - Evernote: POST /notes
    // - OneNote: POST /notes
  }

  private createErrorResponse(message: string): PluginResponse {
    return {
      success: false,
      error: message,
      message: message
    };
  }

  async shutdown(): Promise<void> {
    this.context.logger.info('Productivity module shutting down');
  }
}