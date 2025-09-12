/**
 * Task Plugin - Advanced task and project management
 * Handles todos, projects, deadlines, and team collaboration
 */

import { ZeekyPlugin, PluginContext, Intent, Response } from '../../types/ZeekyTypes';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
  created: Date;
  updated: Date;
  assignee?: string;
  projectId?: string;
  tags: string[];
  subtasks: string[];
  dependencies: string[];
  estimatedHours?: number;
  actualHours?: number;
  attachments: string[];
  comments: TaskComment[];
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  team: string[];
  tasks: string[];
  milestones: ProjectMilestone[];
  created: Date;
  updated: Date;
}

export interface TaskComment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  type: 'comment' | 'status_change' | 'assignment';
}

export interface ProjectMilestone {
  id: string;
  name: string;
  description?: string;
  dueDate: Date;
  completed: boolean;
  completedDate?: Date;
  tasks: string[];
}

export class TaskPlugin implements ZeekyPlugin {
  private context!: PluginContext;
  private tasks: Map<string, Task> = new Map();
  private projects: Map<string, Project> = new Map();

  async initialize(context: PluginContext): Promise<void> {
    this.context = context;
    this.context.logger.info('Task Plugin initialized');
    await this.loadData();
  }

  async start(): Promise<void> {
    this.context.logger.info('Task Plugin started');
  }

  async stop(): Promise<void> {
    this.context.logger.info('Task Plugin stopped');
  }

  async handleIntent(intent: Intent, context: any): Promise<Response> {
    try {
      switch (intent.action) {
        case 'create_task':
          return await this.createTask(intent, context);
        case 'update_task':
          return await this.updateTask(intent, context);
        case 'complete_task':
          return await this.completeTask(intent, context);
        case 'get_tasks':
          return await this.getTasks(intent, context);
        case 'get_overdue_tasks':
          return await this.getOverdueTasks(intent, context);
        case 'create_project':
          return await this.createProject(intent, context);
        case 'get_projects':
          return await this.getProjects(intent, context);
        case 'add_comment':
          return await this.addComment(intent, context);
        case 'assign_task':
          return await this.assignTask(intent, context);
        case 'set_priority':
          return await this.setPriority(intent, context);
        default:
          throw new Error(`Unsupported intent: ${intent.action}`);
      }
    } catch (error) {
      this.context.logger.error('Task Plugin error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        data: null
      };
    }
  }

  async updateConfiguration(config: any): Promise<void> {
    this.context.logger.info('Task Plugin configuration updated');
  }

  getCapabilities(): string[] {
    return [
      'create_task', 'update_task', 'complete_task', 'get_tasks',
      'get_overdue_tasks', 'create_project', 'get_projects',
      'add_comment', 'assign_task', 'set_priority'
    ];
  }

  getMetadata() {
    return {
      id: 'tasks',
      name: 'Task Manager',
      version: '1.0.0',
      description: 'Advanced task and project management',
      author: 'Zeeky Team',
      category: 'productivity',
      priority: 8,
      dependencies: [],
      capabilities: this.getCapabilities(),
      permissions: [
        { category: 'tasks', level: 'read', scope: 'all' },
        { category: 'tasks', level: 'write', scope: 'all' }
      ]
    };
  }

  private async createTask(intent: Intent, context: any): Promise<Response> {
    const title = this.extractEntity(intent, 'title');
    const description = this.extractEntity(intent, 'description');
    const priority = this.extractEntity(intent, 'priority') || 'medium';
    const dueDate = this.extractEntity(intent, 'due_date');
    const projectId = this.extractEntity(intent, 'project_id');
    const assignee = this.extractEntity(intent, 'assignee');
    const tags = this.extractEntity(intent, 'tags') || [];

    if (!title) {
      return {
        success: false,
        error: 'Task title is required',
        data: null
      };
    }

    const task: Task = {
      id: this.generateId(),
      title,
      description,
      status: 'pending',
      priority: priority as any,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      created: new Date(),
      updated: new Date(),
      assignee,
      projectId,
      tags,
      subtasks: [],
      dependencies: [],
      attachments: [],
      comments: []
    };

    this.tasks.set(task.id, task);

    if (projectId) {
      const project = this.projects.get(projectId);
      if (project) {
        project.tasks.push(task.id);
        this.projects.set(projectId, project);
      }
    }

    return {
      success: true,
      data: { task },
      message: `Created task: ${title}`
    };
  }

  private async updateTask(intent: Intent, context: any): Promise<Response> {
    const taskId = this.extractEntity(intent, 'task_id');
    if (!taskId) {
      return {
        success: false,
        error: 'Task ID is required',
        data: null
      };
    }

    const task = this.tasks.get(taskId);
    if (!task) {
      return {
        success: false,
        error: 'Task not found',
        data: null
      };
    }

    // Update fields
    const title = this.extractEntity(intent, 'title');
    if (title) task.title = title;

    const description = this.extractEntity(intent, 'description');
    if (description) task.description = description;

    const status = this.extractEntity(intent, 'status');
    if (status) task.status = status as any;

    const priority = this.extractEntity(intent, 'priority');
    if (priority) task.priority = priority as any;

    const dueDate = this.extractEntity(intent, 'due_date');
    if (dueDate) task.dueDate = new Date(dueDate);

    task.updated = new Date();
    this.tasks.set(taskId, task);

    return {
      success: true,
      data: { task },
      message: `Updated task: ${task.title}`
    };
  }

  private async completeTask(intent: Intent, context: any): Promise<Response> {
    const taskId = this.extractEntity(intent, 'task_id');
    if (!taskId) {
      return {
        success: false,
        error: 'Task ID is required',
        data: null
      };
    }

    const task = this.tasks.get(taskId);
    if (!task) {
      return {
        success: false,
        error: 'Task not found',
        data: null
      };
    }

    task.status = 'completed';
    task.updated = new Date();
    this.tasks.set(taskId, task);

    return {
      success: true,
      data: { task },
      message: `Completed task: ${task.title}`
    };
  }

  private async getTasks(intent: Intent, context: any): Promise<Response> {
    const status = this.extractEntity(intent, 'status');
    const projectId = this.extractEntity(intent, 'project_id');
    const assignee = this.extractEntity(intent, 'assignee');
    const priority = this.extractEntity(intent, 'priority');

    let tasks = Array.from(this.tasks.values());

    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }

    if (projectId) {
      tasks = tasks.filter(task => task.projectId === projectId);
    }

    if (assignee) {
      tasks = tasks.filter(task => task.assignee === assignee);
    }

    if (priority) {
      tasks = tasks.filter(task => task.priority === priority);
    }

    tasks.sort((a, b) => {
      // Sort by priority first, then by due date
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder];
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      if (a.dueDate && b.dueDate) {
        return a.dueDate.getTime() - b.dueDate.getTime();
      }
      
      return b.created.getTime() - a.created.getTime();
    });

    return {
      success: true,
      data: { tasks, count: tasks.length },
      message: `Found ${tasks.length} tasks`
    };
  }

  private async getOverdueTasks(intent: Intent, context: any): Promise<Response> {
    const now = new Date();
    const overdueTasks = Array.from(this.tasks.values())
      .filter(task => 
        task.dueDate && 
        task.dueDate < now && 
        task.status !== 'completed' && 
        task.status !== 'cancelled'
      )
      .sort((a, b) => a.dueDate!.getTime() - b.dueDate!.getTime());

    return {
      success: true,
      data: { tasks: overdueTasks, count: overdueTasks.length },
      message: `Found ${overdueTasks.length} overdue tasks`
    };
  }

  private async createProject(intent: Intent, context: any): Promise<Response> {
    const name = this.extractEntity(intent, 'name');
    const description = this.extractEntity(intent, 'description');
    const startDate = this.extractEntity(intent, 'start_date');
    const endDate = this.extractEntity(intent, 'end_date');
    const team = this.extractEntity(intent, 'team') || [];

    if (!name) {
      return {
        success: false,
        error: 'Project name is required',
        data: null
      };
    }

    const project: Project = {
      id: this.generateId(),
      name,
      description,
      status: 'planning',
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      team,
      tasks: [],
      milestones: [],
      created: new Date(),
      updated: new Date()
    };

    this.projects.set(project.id, project);

    return {
      success: true,
      data: { project },
      message: `Created project: ${name}`
    };
  }

  private async getProjects(intent: Intent, context: any): Promise<Response> {
    const status = this.extractEntity(intent, 'status');
    const teamMember = this.extractEntity(intent, 'team_member');

    let projects = Array.from(this.projects.values());

    if (status) {
      projects = projects.filter(project => project.status === status);
    }

    if (teamMember) {
      projects = projects.filter(project => project.team.includes(teamMember));
    }

    projects.sort((a, b) => b.created.getTime() - a.created.getTime());

    return {
      success: true,
      data: { projects, count: projects.length },
      message: `Found ${projects.length} projects`
    };
  }

  private async addComment(intent: Intent, context: any): Promise<Response> {
    const taskId = this.extractEntity(intent, 'task_id');
    const content = this.extractEntity(intent, 'content');
    const author = this.extractEntity(intent, 'author') || 'system';

    if (!taskId || !content) {
      return {
        success: false,
        error: 'Task ID and content are required',
        data: null
      };
    }

    const task = this.tasks.get(taskId);
    if (!task) {
      return {
        success: false,
        error: 'Task not found',
        data: null
      };
    }

    const comment: TaskComment = {
      id: this.generateId(),
      author,
      content,
      timestamp: new Date(),
      type: 'comment'
    };

    task.comments.push(comment);
    task.updated = new Date();
    this.tasks.set(taskId, task);

    return {
      success: true,
      data: { comment, taskId },
      message: 'Comment added to task'
    };
  }

  private async assignTask(intent: Intent, context: any): Promise<Response> {
    const taskId = this.extractEntity(intent, 'task_id');
    const assignee = this.extractEntity(intent, 'assignee');

    if (!taskId || !assignee) {
      return {
        success: false,
        error: 'Task ID and assignee are required',
        data: null
      };
    }

    const task = this.tasks.get(taskId);
    if (!task) {
      return {
        success: false,
        error: 'Task not found',
        data: null
      };
    }

    task.assignee = assignee;
    task.updated = new Date();
    this.tasks.set(taskId, task);

    // Add assignment comment
    const comment: TaskComment = {
      id: this.generateId(),
      author: 'system',
      content: `Task assigned to ${assignee}`,
      timestamp: new Date(),
      type: 'assignment'
    };
    task.comments.push(comment);

    return {
      success: true,
      data: { task },
      message: `Task assigned to ${assignee}`
    };
  }

  private async setPriority(intent: Intent, context: any): Promise<Response> {
    const taskId = this.extractEntity(intent, 'task_id');
    const priority = this.extractEntity(intent, 'priority');

    if (!taskId || !priority) {
      return {
        success: false,
        error: 'Task ID and priority are required',
        data: null
      };
    }

    const task = this.tasks.get(taskId);
    if (!task) {
      return {
        success: false,
        error: 'Task not found',
        data: null
      };
    }

    task.priority = priority as any;
    task.updated = new Date();
    this.tasks.set(taskId, task);

    return {
      success: true,
      data: { task },
      message: `Task priority set to ${priority}`
    };
  }

  private extractEntity(intent: Intent, name: string): any {
    const entity = intent.entities?.find((e: any) => e.name === name);
    return entity?.value;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private async loadData(): Promise<void> {
    // Load from storage (placeholder)
    this.context.logger.debug('Loading task data');
  }
}