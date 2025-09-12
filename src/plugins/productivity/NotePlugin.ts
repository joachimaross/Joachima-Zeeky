/**
 * Note Plugin - Advanced note-taking and knowledge management
 * Handles notes, notebooks, tags, search, and collaboration
 */

import { ZeekyPlugin, PluginContext, Intent, Response } from '../../types/ZeekyTypes';

export interface Note {
  id: string;
  title: string;
  content: string;
  notebookId: string;
  tags: string[];
  created: Date;
  updated: Date;
  author: string;
  isPublic: boolean;
  attachments: NoteAttachment[];
  collaborators: string[];
  version: number;
  previousVersions: NoteVersion[];
}

export interface Notebook {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  isDefault: boolean;
  created: Date;
  updated: Date;
  owner: string;
  collaborators: string[];
  notes: string[];
  tags: string[];
}

export interface NoteAttachment {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  url: string;
  uploaded: Date;
}

export interface NoteVersion {
  id: string;
  content: string;
  timestamp: Date;
  author: string;
  changeDescription?: string;
}

export interface NoteTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
  variables: string[];
  created: Date;
  updated: Date;
}

export class NotePlugin implements ZeekyPlugin {
  private context!: PluginContext;
  private notes: Map<string, Note> = new Map();
  private notebooks: Map<string, Notebook> = new Map();
  private templates: Map<string, NoteTemplate> = new Map();

  async initialize(context: PluginContext): Promise<void> {
    this.context = context;
    this.context.logger.info('Note Plugin initialized');
    await this.loadData();
    await this.createDefaultNotebook();
  }

  async start(): Promise<void> {
    this.context.logger.info('Note Plugin started');
  }

  async stop(): Promise<void> {
    this.context.logger.info('Note Plugin stopped');
  }

  async handleIntent(intent: Intent, context: any): Promise<Response> {
    try {
      switch (intent.action) {
        case 'create_note':
          return await this.createNote(intent, context);
        case 'update_note':
          return await this.updateNote(intent, context);
        case 'delete_note':
          return await this.deleteNote(intent, context);
        case 'get_note':
          return await this.getNote(intent, context);
        case 'search_notes':
          return await this.searchNotes(intent, context);
        case 'create_notebook':
          return await this.createNotebook(intent, context);
        case 'get_notebooks':
          return await this.getNotebooks(intent, context);
        case 'add_tag':
          return await this.addTag(intent, context);
        case 'remove_tag':
          return await this.removeTag(intent, context);
        case 'share_note':
          return await this.shareNote(intent, context);
        case 'create_template':
          return await this.createTemplate(intent, context);
        case 'use_template':
          return await this.useTemplate(intent, context);
        case 'get_note_history':
          return await this.getNoteHistory(intent, context);
        case 'restore_version':
          return await this.restoreVersion(intent, context);
        default:
          throw new Error(`Unsupported intent: ${intent.action}`);
      }
    } catch (error) {
      this.context.logger.error('Note Plugin error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        data: null
      };
    }
  }

  async updateConfiguration(config: any): Promise<void> {
    this.context.logger.info('Note Plugin configuration updated');
  }

  getCapabilities(): string[] {
    return [
      'create_note', 'update_note', 'delete_note', 'get_note',
      'search_notes', 'create_notebook', 'get_notebooks',
      'add_tag', 'remove_tag', 'share_note', 'create_template',
      'use_template', 'get_note_history', 'restore_version'
    ];
  }

  getMetadata() {
    return {
      id: 'notes',
      name: 'Note Manager',
      version: '1.0.0',
      description: 'Advanced note-taking and knowledge management',
      author: 'Zeeky Team',
      category: 'productivity',
      priority: 7,
      dependencies: [],
      capabilities: this.getCapabilities(),
      permissions: [
        { category: 'notes', level: 'read', scope: 'all' },
        { category: 'notes', level: 'write', scope: 'all' }
      ]
    };
  }

  private async createNote(intent: Intent, context: any): Promise<Response> {
    const title = this.extractEntity(intent, 'title');
    const content = this.extractEntity(intent, 'content') || '';
    const notebookId = this.extractEntity(intent, 'notebook_id') || 'default';
    const tags = this.extractEntity(intent, 'tags') || [];
    const author = this.extractEntity(intent, 'author') || 'system';
    const isPublic = this.extractEntity(intent, 'is_public') || false;

    if (!title) {
      return {
        success: false,
        error: 'Note title is required',
        data: null
      };
    }

    const notebook = this.notebooks.get(notebookId);
    if (!notebook) {
      return {
        success: false,
        error: 'Notebook not found',
        data: null
      };
    }

    const note: Note = {
      id: this.generateId(),
      title,
      content,
      notebookId,
      tags,
      created: new Date(),
      updated: new Date(),
      author,
      isPublic,
      attachments: [],
      collaborators: [author],
      version: 1,
      previousVersions: []
    };

    this.notes.set(note.id, note);
    notebook.notes.push(note.id);
    this.notebooks.set(notebookId, notebook);

    return {
      success: true,
      data: { note },
      message: `Created note: ${title}`
    };
  }

  private async updateNote(intent: Intent, context: any): Promise<Response> {
    const noteId = this.extractEntity(intent, 'note_id');
    if (!noteId) {
      return {
        success: false,
        error: 'Note ID is required',
        data: null
      };
    }

    const note = this.notes.get(noteId);
    if (!note) {
      return {
        success: false,
        error: 'Note not found',
        data: null
      };
    }

    // Save current version before updating
    const version: NoteVersion = {
      id: this.generateId(),
      content: note.content,
      timestamp: new Date(note.updated),
      author: note.author,
      changeDescription: 'Auto-saved version'
    };
    note.previousVersions.push(version);

    // Update fields
    const title = this.extractEntity(intent, 'title');
    if (title) note.title = title;

    const content = this.extractEntity(intent, 'content');
    if (content !== undefined) note.content = content;

    const tags = this.extractEntity(intent, 'tags');
    if (tags) note.tags = tags;

    note.version++;
    note.updated = new Date();
    this.notes.set(noteId, note);

    return {
      success: true,
      data: { note },
      message: `Updated note: ${note.title}`
    };
  }

  private async deleteNote(intent: Intent, context: any): Promise<Response> {
    const noteId = this.extractEntity(intent, 'note_id');
    if (!noteId) {
      return {
        success: false,
        error: 'Note ID is required',
        data: null
      };
    }

    const note = this.notes.get(noteId);
    if (!note) {
      return {
        success: false,
        error: 'Note not found',
        data: null
      };
    }

    // Remove from notebook
    const notebook = this.notebooks.get(note.notebookId);
    if (notebook) {
      notebook.notes = notebook.notes.filter(id => id !== noteId);
      this.notebooks.set(note.notebookId, notebook);
    }

    this.notes.delete(noteId);

    return {
      success: true,
      data: { deletedNoteId: noteId },
      message: `Deleted note: ${note.title}`
    };
  }

  private async getNote(intent: Intent, context: any): Promise<Response> {
    const noteId = this.extractEntity(intent, 'note_id');
    if (!noteId) {
      return {
        success: false,
        error: 'Note ID is required',
        data: null
      };
    }

    const note = this.notes.get(noteId);
    if (!note) {
      return {
        success: false,
        error: 'Note not found',
        data: null
      };
    }

    return {
      success: true,
      data: { note },
      message: `Retrieved note: ${note.title}`
    };
  }

  private async searchNotes(intent: Intent, context: any): Promise<Response> {
    const query = this.extractEntity(intent, 'query');
    const notebookId = this.extractEntity(intent, 'notebook_id');
    const tags = this.extractEntity(intent, 'tags');
    const author = this.extractEntity(intent, 'author');
    const limit = parseInt(this.extractEntity(intent, 'limit') || '50');

    if (!query && !tags && !author) {
      return {
        success: false,
        error: 'Search query, tags, or author is required',
        data: null
      };
    }

    let notes = Array.from(this.notes.values());

    if (notebookId) {
      notes = notes.filter(note => note.notebookId === notebookId);
    }

    if (query) {
      const searchQuery = query.toLowerCase();
      notes = notes.filter(note => 
        note.title.toLowerCase().includes(searchQuery) ||
        note.content.toLowerCase().includes(searchQuery)
      );
    }

    if (tags && tags.length > 0) {
      notes = notes.filter(note => 
        tags.some((tag: string) => note.tags.includes(tag))
      );
    }

    if (author) {
      notes = notes.filter(note => note.author === author);
    }

    notes = notes
      .sort((a, b) => b.updated.getTime() - a.updated.getTime())
      .slice(0, limit);

    return {
      success: true,
      data: { notes, count: notes.length, query },
      message: `Found ${notes.length} notes`
    };
  }

  private async createNotebook(intent: Intent, context: any): Promise<Response> {
    const name = this.extractEntity(intent, 'name');
    const description = this.extractEntity(intent, 'description');
    const color = this.extractEntity(intent, 'color') || '#3498db';
    const icon = this.extractEntity(intent, 'icon') || '📝';
    const owner = this.extractEntity(intent, 'owner') || 'system';

    if (!name) {
      return {
        success: false,
        error: 'Notebook name is required',
        data: null
      };
    }

    const notebook: Notebook = {
      id: this.generateId(),
      name,
      description,
      color,
      icon,
      isDefault: false,
      created: new Date(),
      updated: new Date(),
      owner,
      collaborators: [owner],
      notes: [],
      tags: []
    };

    this.notebooks.set(notebook.id, notebook);

    return {
      success: true,
      data: { notebook },
      message: `Created notebook: ${name}`
    };
  }

  private async getNotebooks(intent: Intent, context: any): Promise<Response> {
    const owner = this.extractEntity(intent, 'owner');

    let notebooks = Array.from(this.notebooks.values());

    if (owner) {
      notebooks = notebooks.filter(notebook => 
        notebook.owner === owner || notebook.collaborators.includes(owner)
      );
    }

    notebooks.sort((a, b) => {
      // Default notebook first, then by name
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return a.name.localeCompare(b.name);
    });

    return {
      success: true,
      data: { notebooks, count: notebooks.length },
      message: `Found ${notebooks.length} notebooks`
    };
  }

  private async addTag(intent: Intent, context: any): Promise<Response> {
    const noteId = this.extractEntity(intent, 'note_id');
    const tag = this.extractEntity(intent, 'tag');

    if (!noteId || !tag) {
      return {
        success: false,
        error: 'Note ID and tag are required',
        data: null
      };
    }

    const note = this.notes.get(noteId);
    if (!note) {
      return {
        success: false,
        error: 'Note not found',
        data: null
      };
    }

    if (!note.tags.includes(tag)) {
      note.tags.push(tag);
      note.updated = new Date();
      this.notes.set(noteId, note);
    }

    return {
      success: true,
      data: { note, tag },
      message: `Added tag "${tag}" to note`
    };
  }

  private async removeTag(intent: Intent, context: any): Promise<Response> {
    const noteId = this.extractEntity(intent, 'note_id');
    const tag = this.extractEntity(intent, 'tag');

    if (!noteId || !tag) {
      return {
        success: false,
        error: 'Note ID and tag are required',
        data: null
      };
    }

    const note = this.notes.get(noteId);
    if (!note) {
      return {
        success: false,
        error: 'Note not found',
        data: null
      };
    }

    note.tags = note.tags.filter(t => t !== tag);
    note.updated = new Date();
    this.notes.set(noteId, note);

    return {
      success: true,
      data: { note, tag },
      message: `Removed tag "${tag}" from note`
    };
  }

  private async shareNote(intent: Intent, context: any): Promise<Response> {
    const noteId = this.extractEntity(intent, 'note_id');
    const collaborator = this.extractEntity(intent, 'collaborator');
    const isPublic = this.extractEntity(intent, 'is_public');

    if (!noteId) {
      return {
        success: false,
        error: 'Note ID is required',
        data: null
      };
    }

    const note = this.notes.get(noteId);
    if (!note) {
      return {
        success: false,
        error: 'Note not found',
        data: null
      };
    }

    if (collaborator && !note.collaborators.includes(collaborator)) {
      note.collaborators.push(collaborator);
    }

    if (isPublic !== undefined) {
      note.isPublic = isPublic;
    }

    note.updated = new Date();
    this.notes.set(noteId, note);

    return {
      success: true,
      data: { note },
      message: `Note sharing updated`
    };
  }

  private async createTemplate(intent: Intent, context: any): Promise<Response> {
    const name = this.extractEntity(intent, 'name');
    const content = this.extractEntity(intent, 'content');
    const category = this.extractEntity(intent, 'category') || 'general';
    const variables = this.extractEntity(intent, 'variables') || [];

    if (!name || !content) {
      return {
        success: false,
        error: 'Name and content are required',
        data: null
      };
    }

    const template: NoteTemplate = {
      id: this.generateId(),
      name,
      content,
      category,
      variables,
      created: new Date(),
      updated: new Date()
    };

    this.templates.set(template.id, template);

    return {
      success: true,
      data: { template },
      message: `Created template: ${name}`
    };
  }

  private async useTemplate(intent: Intent, context: any): Promise<Response> {
    const templateId = this.extractEntity(intent, 'template_id');
    const variables = this.extractEntity(intent, 'variables') || {};
    const notebookId = this.extractEntity(intent, 'notebook_id') || 'default';
    const author = this.extractEntity(intent, 'author') || 'system';

    if (!templateId) {
      return {
        success: false,
        error: 'Template ID is required',
        data: null
      };
    }

    const template = this.templates.get(templateId);
    if (!template) {
      return {
        success: false,
        error: 'Template not found',
        data: null
      };
    }

    // Replace variables in content
    let content = template.content;
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      content = content.replace(new RegExp(placeholder, 'g'), String(value));
    }

    // Create note from template
    const createResult = await this.createNote({
      action: 'create_note',
      entities: [
        { name: 'title', value: template.name },
        { name: 'content', value: content },
        { name: 'notebook_id', value: notebookId },
        { name: 'author', value: author }
      ]
    } as Intent, {});

    return {
      success: createResult.success,
      data: { template, note: createResult.data?.note, variables },
      message: `Created note from template: ${template.name}`
    };
  }

  private async getNoteHistory(intent: Intent, context: any): Promise<Response> {
    const noteId = this.extractEntity(intent, 'note_id');
    if (!noteId) {
      return {
        success: false,
        error: 'Note ID is required',
        data: null
      };
    }

    const note = this.notes.get(noteId);
    if (!note) {
      return {
        success: false,
        error: 'Note not found',
        data: null
      };
    }

    return {
      success: true,
      data: { 
        note, 
        versions: note.previousVersions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      },
      message: `Retrieved history for note: ${note.title}`
    };
  }

  private async restoreVersion(intent: Intent, context: any): Promise<Response> {
    const noteId = this.extractEntity(intent, 'note_id');
    const versionId = this.extractEntity(intent, 'version_id');

    if (!noteId || !versionId) {
      return {
        success: false,
        error: 'Note ID and version ID are required',
        data: null
      };
    }

    const note = this.notes.get(noteId);
    if (!note) {
      return {
        success: false,
        error: 'Note not found',
        data: null
      };
    }

    const version = note.previousVersions.find(v => v.id === versionId);
    if (!version) {
      return {
        success: false,
        error: 'Version not found',
        data: null
      };
    }

    // Save current version before restoring
    const currentVersion: NoteVersion = {
      id: this.generateId(),
      content: note.content,
      timestamp: new Date(note.updated),
      author: note.author,
      changeDescription: 'Auto-saved before restore'
    };
    note.previousVersions.push(currentVersion);

    // Restore the version
    note.content = version.content;
    note.version++;
    note.updated = new Date();
    this.notes.set(noteId, note);

    return {
      success: true,
      data: { note, restoredVersion: version },
      message: `Restored version from ${version.timestamp.toLocaleString()}`
    };
  }

  private async createDefaultNotebook(): Promise<void> {
    const defaultNotebook: Notebook = {
      id: 'default',
      name: 'Default Notebook',
      description: 'Default notebook for notes',
      color: '#3498db',
      icon: '📝',
      isDefault: true,
      created: new Date(),
      updated: new Date(),
      owner: 'system',
      collaborators: ['system'],
      notes: [],
      tags: []
    };

    this.notebooks.set('default', defaultNotebook);
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
    this.context.logger.debug('Loading note data');
  }
}