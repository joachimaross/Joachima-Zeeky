import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { Logger } from '@/utils/Logger';

/**
 * Web Server for Zeeky
 * Handles HTTP API endpoints and web interface
 */
export class WebServer {
  private logger: Logger;
  private app: express.Application;
  private server: any;
  private isInitialized: boolean = false;

  constructor() {
    this.logger = new Logger('WebServer');
    this.app = express();
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      this.logger.warn('Web server already initialized');
      return;
    }

    try {
      this.logger.info('Initializing Web Server...');

      // Setup middleware
      this.setupMiddleware();

      // Setup routes
      this.setupRoutes();

      this.isInitialized = true;
      this.logger.info('Web Server initialized successfully');

    } catch (error) {
      this.logger.error('Failed to initialize Web Server:', error);
      throw error;
    }
  }

  async start(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Web server must be initialized before starting');
    }

    try {
      this.logger.info('Starting Web Server...');

      const port = process.env.PORT || 3000;
      this.server = this.app.listen(port, () => {
        this.logger.info(`Web Server started on port ${port}`);
      });

    } catch (error) {
      this.logger.error('Failed to start Web Server:', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (this.server) {
      this.logger.info('Stopping Web Server...');
      this.server.close();
      this.logger.info('Web Server stopped');
    }
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet());
    this.app.use(cors());

    // Compression middleware
    this.app.use(compression());

    // Logging middleware
    this.app.use(morgan('combined'));

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  }

  private setupRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date(),
        uptime: process.uptime()
      });
    });

    // Status endpoint
    this.app.get('/status', (req, res) => {
      res.json({
        status: 'running',
        version: '1.0.0',
        timestamp: new Date()
      });
    });

    // API routes
    this.app.use('/api', this.createAPIRoutes());

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`
      });
    });

    // Error handler
    this.app.use((error: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
      this.logger.error('Unhandled error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred'
      });
    });
  }

  private createAPIRoutes(): express.Router {
    const router = express.Router();

    // Intent processing endpoint
    router.post('/intent', (req, res) => {
      this.logger.info('Processing intent request:', { body: req.body });
      
      // Mock intent processing
      const response = {
        id: 'response_' + Date.now(),
        requestId: req.body.id || 'unknown',
        success: true,
        type: 'text',
        content: 'Intent processed successfully',
        timestamp: new Date(),
        latency: 100
      };

      res.json(response);
    });

    // Plugin management endpoints
    router.get('/plugins', (req, res) => {
      this.logger.info('Getting plugins list');
      
      // Mock plugins list
      const plugins = [
        {
          id: 'com.zeeky.productivity',
          name: 'Productivity Plugin',
          version: '1.0.0',
          status: 'active'
        },
        {
          id: 'com.zeeky.creative',
          name: 'Creative Plugin',
          version: '1.0.0',
          status: 'active'
        },
        {
          id: 'com.zeeky.smarthome',
          name: 'Smart Home Plugin',
          version: '1.0.0',
          status: 'active'
        }
      ];

      res.json(plugins);
    });

    router.post('/plugins', (req, res) => {
      this.logger.info('Registering new plugin:', { body: req.body });
      
      // Mock plugin registration
      const response = {
        success: true,
        pluginId: req.body.id || 'unknown',
        message: 'Plugin registered successfully',
        timestamp: new Date()
      };

      res.json(response);
    });

    return router;
  }
}