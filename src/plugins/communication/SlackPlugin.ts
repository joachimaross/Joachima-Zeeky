/**
 * Slack Plugin - Slack workspace integration
 * Handles messages, channels, users, and automation
 */

import { ZeekyPlugin, PluginContext, Intent, Response } from '../../types/ZeekyTypes';

export interface SlackWorkspace {
  id: string;
  name: string;
  domain: string;
  token: string;
  botUserId: string;
  channels: SlackChannel[];
  users: SlackUser[];
  lastSync: Date;
}

export interface SlackChannel {
  id: string;
  name: string;
  type: 'public' | 'private' | 'direct' | 'group';
  topic?: string;
  purpose?: string;
  members: string[];
  isArchived: boolean;
  isMember: boolean;
}

export interface SlackUser {
  id: string;
  name: string;
  realName: string;
  email?: string;
  isBot: boolean;
  isAdmin: boolean;
  timezone?: string;
  status?: string;
  profile: {
    title?: string;
    phone?: string;
    skype?: string;
    image24?: string;
    image32?: string;
    image48?: string;
    image72?: string;
    image192?: string;
  };
}

export interface SlackMessage {
  id: string;
  channelId: string;
  userId: string;
  text: string;
  timestamp: Date;
  threadTs?: string;
  replyCount?: number;
  attachments: SlackAttachment[];
  reactions: SlackReaction[];
  isEdited: boolean;
  editedAt?: Date;
}

export interface SlackAttachment {
  id: string;
  title?: string;
  text?: string;
  color?: string;
  authorName?: string;
  authorLink?: string;
  authorIcon?: string;
  imageUrl?: string;
  thumbUrl?: string;
  footer?: string;
  footerIcon?: string;
  fields: SlackField[];
}

export interface SlackField {
  title: string;
  value: string;
  short: boolean;
}

export interface SlackReaction {
  name: string;
  count: number;
  users: string[];
}

export class SlackPlugin implements ZeekyPlugin {
  private context!: PluginContext;
  private workspaces: Map<string, SlackWorkspace> = new Map();
  private messages: Map<string, SlackMessage> = new Map();

  async initialize(context: PluginContext): Promise<void> {
    this.context = context;
    this.context.logger.info('Slack Plugin initialized');
    await this.loadWorkspaces();
  }

  async start(): Promise<void> {
    this.context.logger.info('Slack Plugin started');
  }

  async stop(): Promise<void> {
    this.context.logger.info('Slack Plugin stopped');
  }

  async handleIntent(intent: Intent, context: any): Promise<Response> {
    try {
      switch (intent.action) {
        case 'send_message':
          return await this.sendMessage(intent, context);
        case 'get_messages':
          return await this.getMessages(intent, context);
        case 'get_channels':
          return await this.getChannels(intent, context);
        case 'get_users':
          return await this.getUsers(intent, context);
        case 'add_workspace':
          return await this.addWorkspace(intent, context);
        case 'create_channel':
          return await this.createChannel(intent, context);
        case 'join_channel':
          return await this.joinChannel(intent, context);
        case 'leave_channel':
          return await this.leaveChannel(intent, context);
        case 'add_reaction':
          return await this.addReaction(intent, context);
        case 'remove_reaction':
          return await this.removeReaction(intent, context);
        case 'search_messages':
          return await this.searchMessages(intent, context);
        case 'get_user_info':
          return await this.getUserInfo(intent, context);
        case 'set_status':
          return await this.setStatus(intent, context);
        case 'schedule_message':
          return await this.scheduleMessage(intent, context);
        default:
          throw new Error(`Unsupported intent: ${intent.action}`);
      }
    } catch (error) {
      this.context.logger.error('Slack Plugin error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        data: null
      };
    }
  }

  async updateConfiguration(config: any): Promise<void> {
    this.context.logger.info('Slack Plugin configuration updated');
  }

  getCapabilities(): string[] {
    return [
      'send_message', 'get_messages', 'get_channels', 'get_users',
      'add_workspace', 'create_channel', 'join_channel', 'leave_channel',
      'add_reaction', 'remove_reaction', 'search_messages', 'get_user_info',
      'set_status', 'schedule_message'
    ];
  }

  getMetadata() {
    return {
      id: 'slack',
      name: 'Slack Integration',
      version: '1.0.0',
      description: 'Slack workspace integration and automation',
      author: 'Zeeky Team',
      category: 'communication',
      priority: 8,
      dependencies: [],
      capabilities: this.getCapabilities(),
      permissions: [
        { category: 'slack', level: 'read', scope: 'all' },
        { category: 'slack', level: 'write', scope: 'all' }
      ]
    };
  }

  private async sendMessage(intent: Intent, context: any): Promise<Response> {
    const workspaceId = this.extractEntity(intent, 'workspace_id') || 'default';
    const channelId = this.extractEntity(intent, 'channel_id');
    const text = this.extractEntity(intent, 'text');
    const threadTs = this.extractEntity(intent, 'thread_ts');
    const attachments = this.extractEntity(intent, 'attachments') || [];

    if (!channelId || !text) {
      return {
        success: false,
        error: 'Channel ID and text are required',
        data: null
      };
    }

    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) {
      return {
        success: false,
        error: 'Slack workspace not found',
        data: null
      };
    }

    const message: SlackMessage = {
      id: this.generateId(),
      channelId,
      userId: workspace.botUserId,
      text,
      timestamp: new Date(),
      threadTs,
      attachments,
      reactions: [],
      isEdited: false
    };

    // Send message via Slack API (placeholder)
    await this.sendSlackMessage(message, workspace);
    
    this.messages.set(message.id, message);

    return {
      success: true,
      data: { message },
      message: `Message sent to channel ${channelId}`
    };
  }

  private async getMessages(intent: Intent, context: any): Promise<Response> {
    const workspaceId = this.extractEntity(intent, 'workspace_id') || 'default';
    const channelId = this.extractEntity(intent, 'channel_id');
    const limit = parseInt(this.extractEntity(intent, 'limit') || '50');
    const oldest = this.extractEntity(intent, 'oldest');
    const latest = this.extractEntity(intent, 'latest');

    if (!channelId) {
      return {
        success: false,
        error: 'Channel ID is required',
        data: null
      };
    }

    let messages = Array.from(this.messages.values())
      .filter(msg => msg.channelId === channelId);

    if (oldest) {
      messages = messages.filter(msg => msg.timestamp >= new Date(oldest));
    }

    if (latest) {
      messages = messages.filter(msg => msg.timestamp <= new Date(latest));
    }

    messages = messages
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);

    return {
      success: true,
      data: { messages, count: messages.length },
      message: `Retrieved ${messages.length} messages from channel`
    };
  }

  private async getChannels(intent: Intent, context: any): Promise<Response> {
    const workspaceId = this.extractEntity(intent, 'workspace_id') || 'default';
    const types = this.extractEntity(intent, 'types') || ['public', 'private'];
    const excludeArchived = this.extractEntity(intent, 'exclude_archived') !== false;

    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) {
      return {
        success: false,
        error: 'Slack workspace not found',
        data: null
      };
    }

    let channels = workspace.channels;

    if (types && types.length > 0) {
      channels = channels.filter(channel => types.includes(channel.type));
    }

    if (excludeArchived) {
      channels = channels.filter(channel => !channel.isArchived);
    }

    return {
      success: true,
      data: { channels, count: channels.length },
      message: `Found ${channels.length} channels`
    };
  }

  private async getUsers(intent: Intent, context: any): Promise<Response> {
    const workspaceId = this.extractEntity(intent, 'workspace_id') || 'default';
    const includeBots = this.extractEntity(intent, 'include_bots') || false;

    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) {
      return {
        success: false,
        error: 'Slack workspace not found',
        data: null
      };
    }

    let users = workspace.users;

    if (!includeBots) {
      users = users.filter(user => !user.isBot);
    }

    return {
      success: true,
      data: { users, count: users.length },
      message: `Found ${users.length} users`
    };
  }

  private async addWorkspace(intent: Intent, context: any): Promise<Response> {
    const name = this.extractEntity(intent, 'name');
    const domain = this.extractEntity(intent, 'domain');
    const token = this.extractEntity(intent, 'token');
    const botUserId = this.extractEntity(intent, 'bot_user_id');

    if (!name || !domain || !token || !botUserId) {
      return {
        success: false,
        error: 'Name, domain, token, and bot user ID are required',
        data: null
      };
    }

    const workspace: SlackWorkspace = {
      id: this.generateId(),
      name,
      domain,
      token,
      botUserId,
      channels: [],
      users: [],
      lastSync: new Date()
    };

    this.workspaces.set(workspace.id, workspace);
    await this.saveWorkspaces();

    return {
      success: true,
      data: { workspace },
      message: `Added Slack workspace: ${name}`
    };
  }

  private async createChannel(intent: Intent, context: any): Promise<Response> {
    const workspaceId = this.extractEntity(intent, 'workspace_id') || 'default';
    const name = this.extractEntity(intent, 'name');
    const isPrivate = this.extractEntity(intent, 'is_private') || false;
    const topic = this.extractEntity(intent, 'topic');
    const purpose = this.extractEntity(intent, 'purpose');

    if (!name) {
      return {
        success: false,
        error: 'Channel name is required',
        data: null
      };
    }

    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) {
      return {
        success: false,
        error: 'Slack workspace not found',
        data: null
      };
    }

    const channel: SlackChannel = {
      id: this.generateId(),
      name,
      type: isPrivate ? 'private' : 'public',
      topic,
      purpose,
      members: [workspace.botUserId],
      isArchived: false,
      isMember: true
    };

    workspace.channels.push(channel);
    this.workspaces.set(workspaceId, workspace);

    return {
      success: true,
      data: { channel },
      message: `Created channel: ${name}`
    };
  }

  private async joinChannel(intent: Intent, context: any): Promise<Response> {
    const workspaceId = this.extractEntity(intent, 'workspace_id') || 'default';
    const channelId = this.extractEntity(intent, 'channel_id');

    if (!channelId) {
      return {
        success: false,
        error: 'Channel ID is required',
        data: null
      };
    }

    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) {
      return {
        success: false,
        error: 'Slack workspace not found',
        data: null
      };
    }

    const channel = workspace.channels.find(c => c.id === channelId);
    if (!channel) {
      return {
        success: false,
        error: 'Channel not found',
        data: null
      };
    }

    if (!channel.members.includes(workspace.botUserId)) {
      channel.members.push(workspace.botUserId);
      channel.isMember = true;
    }

    return {
      success: true,
      data: { channel },
      message: `Joined channel: ${channel.name}`
    };
  }

  private async leaveChannel(intent: Intent, context: any): Promise<Response> {
    const workspaceId = this.extractEntity(intent, 'workspace_id') || 'default';
    const channelId = this.extractEntity(intent, 'channel_id');

    if (!channelId) {
      return {
        success: false,
        error: 'Channel ID is required',
        data: null
      };
    }

    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) {
      return {
        success: false,
        error: 'Slack workspace not found',
        data: null
      };
    }

    const channel = workspace.channels.find(c => c.id === channelId);
    if (!channel) {
      return {
        success: false,
        error: 'Channel not found',
        data: null
      };
    }

    channel.members = channel.members.filter(id => id !== workspace.botUserId);
    channel.isMember = false;

    return {
      success: true,
      data: { channel },
      message: `Left channel: ${channel.name}`
    };
  }

  private async addReaction(intent: Intent, context: any): Promise<Response> {
    const workspaceId = this.extractEntity(intent, 'workspace_id') || 'default';
    const messageId = this.extractEntity(intent, 'message_id');
    const reaction = this.extractEntity(intent, 'reaction');

    if (!messageId || !reaction) {
      return {
        success: false,
        error: 'Message ID and reaction are required',
        data: null
      };
    }

    const message = this.messages.get(messageId);
    if (!message) {
      return {
        success: false,
        error: 'Message not found',
        data: null
      };
    }

    const existingReaction = message.reactions.find(r => r.name === reaction);
    if (existingReaction) {
      existingReaction.count++;
    } else {
      message.reactions.push({
        name: reaction,
        count: 1,
        users: []
      });
    }

    this.messages.set(messageId, message);

    return {
      success: true,
      data: { message, reaction },
      message: `Added reaction ${reaction} to message`
    };
  }

  private async removeReaction(intent: Intent, context: any): Promise<Response> {
    const workspaceId = this.extractEntity(intent, 'workspace_id') || 'default';
    const messageId = this.extractEntity(intent, 'message_id');
    const reaction = this.extractEntity(intent, 'reaction');

    if (!messageId || !reaction) {
      return {
        success: false,
        error: 'Message ID and reaction are required',
        data: null
      };
    }

    const message = this.messages.get(messageId);
    if (!message) {
      return {
        success: false,
        error: 'Message not found',
        data: null
      };
    }

    const existingReaction = message.reactions.find(r => r.name === reaction);
    if (existingReaction) {
      existingReaction.count--;
      if (existingReaction.count <= 0) {
        message.reactions = message.reactions.filter(r => r.name !== reaction);
      }
    }

    this.messages.set(messageId, message);

    return {
      success: true,
      data: { message, reaction },
      message: `Removed reaction ${reaction} from message`
    };
  }

  private async searchMessages(intent: Intent, context: any): Promise<Response> {
    const workspaceId = this.extractEntity(intent, 'workspace_id') || 'default';
    const query = this.extractEntity(intent, 'query');
    const channelId = this.extractEntity(intent, 'channel_id');
    const userId = this.extractEntity(intent, 'user_id');
    const limit = parseInt(this.extractEntity(intent, 'limit') || '50');

    if (!query) {
      return {
        success: false,
        error: 'Search query is required',
        data: null
      };
    }

    let messages = Array.from(this.messages.values());

    if (channelId) {
      messages = messages.filter(msg => msg.channelId === channelId);
    }

    if (userId) {
      messages = messages.filter(msg => msg.userId === userId);
    }

    // Search in message text
    const searchQuery = query.toLowerCase();
    messages = messages.filter(msg => 
      msg.text.toLowerCase().includes(searchQuery)
    );

    messages = messages
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);

    return {
      success: true,
      data: { messages, count: messages.length, query },
      message: `Found ${messages.length} messages matching "${query}"`
    };
  }

  private async getUserInfo(intent: Intent, context: any): Promise<Response> {
    const workspaceId = this.extractEntity(intent, 'workspace_id') || 'default';
    const userId = this.extractEntity(intent, 'user_id');

    if (!userId) {
      return {
        success: false,
        error: 'User ID is required',
        data: null
      };
    }

    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) {
      return {
        success: false,
        error: 'Slack workspace not found',
        data: null
      };
    }

    const user = workspace.users.find(u => u.id === userId);
    if (!user) {
      return {
        success: false,
        error: 'User not found',
        data: null
      };
    }

    return {
      success: true,
      data: { user },
      message: `Retrieved user info for ${user.realName}`
    };
  }

  private async setStatus(intent: Intent, context: any): Promise<Response> {
    const workspaceId = this.extractEntity(intent, 'workspace_id') || 'default';
    const status = this.extractEntity(intent, 'status');
    const emoji = this.extractEntity(intent, 'emoji');

    if (!status) {
      return {
        success: false,
        error: 'Status is required',
        data: null
      };
    }

    // Update bot user status (placeholder implementation)
    const workspace = this.workspaces.get(workspaceId);
    if (workspace) {
      const botUser = workspace.users.find(u => u.id === workspace.botUserId);
      if (botUser) {
        botUser.status = status;
      }
    }

    return {
      success: true,
      data: { status, emoji },
      message: `Status set to: ${status}`
    };
  }

  private async scheduleMessage(intent: Intent, context: any): Promise<Response> {
    const workspaceId = this.extractEntity(intent, 'workspace_id') || 'default';
    const channelId = this.extractEntity(intent, 'channel_id');
    const text = this.extractEntity(intent, 'text');
    const postAt = this.extractEntity(intent, 'post_at');

    if (!channelId || !text || !postAt) {
      return {
        success: false,
        error: 'Channel ID, text, and post time are required',
        data: null
      };
    }

    const postTime = new Date(postAt);
    const now = new Date();

    if (postTime <= now) {
      return {
        success: false,
        error: 'Post time must be in the future',
        data: null
      };
    }

    // Schedule the message (placeholder implementation)
    const delay = postTime.getTime() - now.getTime();
    setTimeout(async () => {
      await this.sendMessage({
        action: 'send_message',
        entities: [
          { name: 'workspace_id', value: workspaceId },
          { name: 'channel_id', value: channelId },
          { name: 'text', value: text }
        ]
      } as Intent, {});
    }, delay);

    return {
      success: true,
      data: { channelId, text, postAt: postTime },
      message: `Message scheduled for ${postTime.toLocaleString()}`
    };
  }

  private extractEntity(intent: Intent, name: string): any {
    const entity = intent.entities?.find((e: any) => e.name === name);
    return entity?.value;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private async sendSlackMessage(message: SlackMessage, workspace: SlackWorkspace): Promise<void> {
    // Placeholder implementation for sending Slack message
    this.context.logger.info(`Sending Slack message to ${workspace.name}: ${message.text}`);
    // In real implementation, this would use the Slack Web API
  }

  private async loadWorkspaces(): Promise<void> {
    // Load from storage (placeholder)
    this.context.logger.debug('Loading Slack workspaces');
  }

  private async saveWorkspaces(): Promise<void> {
    // Save to storage (placeholder)
    this.context.logger.debug('Saving Slack workspaces');
  }
}