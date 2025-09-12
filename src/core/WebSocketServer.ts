import { WebSocketServer as WSWebSocketServer, WebSocket } from 'ws';
import { Logger } from '@/utils/Logger';

/**
 * WebSocket Server for Zeeky
 * Handles real-time communication and streaming
 */
export class WebSocketServer {
  private logger: Logger;
  private wss: WSWebSocketServer | null = null;
  private connections: Map<string, WebSocket> = new Map();
  private isInitialized: boolean = false;

  constructor() {
    this.logger = new Logger('WebSocketServer');
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      this.logger.warn('WebSocket server already initialized');
      return;
    }

    try {
      this.logger.info('Initializing WebSocket Server...');
      this.isInitialized = true;
      this.logger.info('WebSocket Server initialized successfully');

    } catch (error) {
      this.logger.error('Failed to initialize WebSocket Server:', error);
      throw error;
    }
  }

  async start(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('WebSocket server must be initialized before starting');
    }

    try {
      this.logger.info('Starting WebSocket Server...');

      const port = parseInt(process.env.WS_PORT || '3001', 10);
      this.wss = new WSWebSocketServer({ port });

      this.wss.on('connection', (ws: WebSocket, req) => {
        const connectionId = this.generateConnectionId();
        this.connections.set(connectionId, ws);
        
        this.logger.info('New WebSocket connection:', { connectionId, ip: req.socket.remoteAddress });

        // Send welcome message
        ws.send(JSON.stringify({
          type: 'welcome',
          connectionId,
          timestamp: new Date()
        }));

        // Handle messages
        ws.on('message', (data) => {
          this.handleMessage(connectionId, data);
        });

        // Handle disconnection
        ws.on('close', () => {
          this.logger.info('WebSocket connection closed:', { connectionId });
          this.connections.delete(connectionId);
        });

        // Handle errors
        ws.on('error', (error) => {
          this.logger.error('WebSocket error:', error, { connectionId });
          this.connections.delete(connectionId);
        });
      });

      this.logger.info(`WebSocket Server started on port ${port}`);

    } catch (error) {
      this.logger.error('Failed to start WebSocket Server:', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (this.wss) {
      this.logger.info('Stopping WebSocket Server...');
      
      // Close all connections
      for (const [connectionId, ws] of this.connections) {
        ws.close();
      }
      this.connections.clear();

      // Close server
      this.wss.close();
      this.wss = null;
      
      this.logger.info('WebSocket Server stopped');
    }
  }

  async getActiveConnections(): Promise<number> {
    return this.connections.size;
  }

  async broadcast(message: any): Promise<void> {
    try {
      const messageStr = JSON.stringify(message);
      
      for (const [connectionId, ws] of this.connections) {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(messageStr);
        }
      }

      this.logger.debug('Broadcasted message to all connections:', { 
        messageType: message.type,
        connectionCount: this.connections.size 
      });

    } catch (error) {
      this.logger.error('Failed to broadcast message:', error);
      throw error;
    }
  }

  async sendToConnection(connectionId: string, message: any): Promise<void> {
    try {
      const ws = this.connections.get(connectionId);
      if (!ws) {
        throw new Error(`Connection ${connectionId} not found`);
      }

      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
        this.logger.debug('Sent message to connection:', { connectionId, messageType: message.type });
      } else {
        throw new Error(`Connection ${connectionId} is not open`);
      }

    } catch (error) {
      this.logger.error('Failed to send message to connection:', error, { connectionId });
      throw error;
    }
  }

  private handleMessage(connectionId: string, data: any): void {
    try {
      const message = JSON.parse(data.toString());
      this.logger.debug('Received WebSocket message:', { connectionId, messageType: message.type });

      // Handle different message types
      switch (message.type) {
        case 'ping':
          this.sendToConnection(connectionId, { type: 'pong', timestamp: new Date() });
          break;
        
        case 'intent':
          this.handleIntentMessage(connectionId, message);
          break;
        
        case 'subscribe':
          this.handleSubscriptionMessage(connectionId, message);
          break;
        
        default:
          this.logger.warn('Unknown message type:', { connectionId, messageType: message.type });
      }

    } catch (error) {
      this.logger.error('Failed to handle WebSocket message:', error, { connectionId });
    }
  }

  private async handleIntentMessage(connectionId: string, message: any): Promise<void> {
    try {
      this.logger.info('Processing intent via WebSocket:', { connectionId, intent: message.intent });

      // Mock intent processing
      const response = {
        type: 'intent_response',
        requestId: message.requestId,
        success: true,
        content: 'Intent processed successfully via WebSocket',
        timestamp: new Date()
      };

      await this.sendToConnection(connectionId, response);

    } catch (error) {
      this.logger.error('Failed to handle intent message:', error, { connectionId });
      
      const errorResponse = {
        type: 'intent_response',
        requestId: message.requestId,
        success: false,
        error: 'Failed to process intent',
        timestamp: new Date()
      };

      await this.sendToConnection(connectionId, errorResponse);
    }
  }

  private async handleSubscriptionMessage(connectionId: string, message: any): Promise<void> {
    try {
      this.logger.info('Handling subscription:', { connectionId, subscription: message.subscription });

      // Mock subscription handling
      const response = {
        type: 'subscription_confirmed',
        subscription: message.subscription,
        timestamp: new Date()
      };

      await this.sendToConnection(connectionId, response);

    } catch (error) {
      this.logger.error('Failed to handle subscription message:', error, { connectionId });
    }
  }

  private generateConnectionId(): string {
    return 'conn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}