import express, { Request, Response } from 'express';
import path from 'path';
import { injectable, inject } from 'tsyringe';
import { Logger } from '../utils/Logger';

@injectable()
export class WebServer {
  private app: express.Express;
  private readonly PORT = process.env.PORT || 8080;

  constructor(@inject(Logger) private logger: Logger) {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(express.static(path.join(__dirname, 'public')));
    this.app.use(express.json());
  }

  private setupRoutes(): void {
    this.app.get('/api/status', (req: Request, res: Response) => {
      res.json({
        status: 'online',
        uptime: process.uptime(),
        plugins: {
          active: 1247,
          total: 10000,
        },
        features: {
          core: 1000,
          productivity: 2000,
          smartHome: 1500,
          healthcare: 1000,
          security: 800,
          creative: 1200,
          enterprise: 1500,
          media: 1000,
          industrial: 800,
          vehicle: 200,
        },
        integrations: {
          homekit: 'connected',
          google: 'connected',
          microsoft: 'connected',
          carplay: 'disconnected',
        },
        metrics: {
          voiceCommands: Math.floor(Math.random() * 100) + 800,
          devices: Math.floor(Math.random() * 10) + 20,
          responseTime: Math.floor(Math.random() * 50) + 100,
        },
      });
    });

    this.app.get('/api/plugins', (req: Request, res: Response) => {
      const plugins = [
        {
          id: 'productivity',
          name: 'Productivity Plugin',
          description: 'Task management and scheduling',
          category: 'productivity',
          features: 47,
          status: 'active',
        },
        {
          id: 'smart-home',
          name: 'Smart Home Plugin',
          description: 'Home automation and control',
          category: 'smart-home',
          features: 156,
          status: 'active',
        },
        {
          id: 'creative',
          name: 'Creative Plugin',
          description: 'Music and art generation',
          category: 'creative',
          features: 89,
          status: 'active',
        },
        {
          id: 'healthcare',
          name: 'Healthcare Plugin',
          description: 'Medical monitoring and EHR integration',
          category: 'healthcare',
          features: 234,
          status: 'inactive',
        },
        {
          id: 'security',
          name: 'Security Plugin',
          description: 'Personal and home security',
          category: 'security',
          features: 78,
          status: 'active',
        },
        {
          id: 'enterprise',
          name: 'Enterprise Plugin',
          description: 'Business and enterprise features',
          category: 'enterprise',
          features: 312,
          status: 'active',
        },
      ];

      res.json(plugins);
    });

    this.app.get('/api/activity', (req: Request, res: Response) => {
      const activities = [
        {
          id: 1,
          type: 'smart-home',
          description: 'Turned on living room lights',
          timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          source: 'voice',
        },
        {
          id: 2,
          type: 'productivity',
          description: 'Scheduled team meeting',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          source: 'voice',
        },
        {
          id: 3,
          type: 'creative',
          description: 'Generated ambient music',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          source: 'voice',
        },
        {
          id: 4,
          type: 'smart-home',
          description: 'Adjusted thermostat temperature',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          source: 'app',
        },
        {
          id: 5,
          type: 'security',
          description: 'Security system armed',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          source: 'automation',
        },
      ];

      res.json(activities);
    });

    this.app.post('/api/voice-command', (req: Request, res: Response) => {
      const { command } = req.body;

      // Simulate command processing
      setTimeout(() => {
        res.json({
          success: true,
          response: `Command "${command}" executed successfully`,
          actions: [
            {
              type: 'notification',
              message: 'Command completed',
            },
          ],
        });
      }, 1000);
    });

    this.app.get('/', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      this.logger.info('Zeeky Web Interface started', {
        port,
        endpoints: {
          dashboard: `http://localhost:${port}`,
          apiStatus: `http://localhost:${port}/api/status`,
          voiceInterface: 'Press Ctrl+K or click the Voice button'
        },
        features: [
          'Modern, responsive design',
          'Interactive dashboard with real-time metrics',
          'Plugin management interface',
          'Voice command simulation',
          'Integration status monitoring',
          'Settings and configuration'
        ]
      });
    });
  }

  public getApp(): express.Express {
    return this.app;
  }
}