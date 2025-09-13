import { ZeekyPlugin } from "../../core/ZeekyPlugin";
import {
  ExecutionContext,
  Response,
  Intent,
  PluginCategory,
  PriorityLevel,
  ComplexityLevel,
  Permission,
  Capability,
  ResponseType,
  Entity,
  PluginConfiguration,
  HealthStatus,
  PluginMetrics,
} from "../../types/ZeekyTypes";
import { Logger } from "../../utils/Logger";
import { GeminiService } from "../../services/GeminiService";
import { singleton } from "tsyringe";

@singleton()
export class GeminiPlugin extends ZeekyPlugin {
  id = "com.zeeky.gemini";
  name = "Gemini Plugin";
  version = "1.0.0";
  description = "Integrates Google Gemini for advanced AI capabilities.";
  author = "Zeeky Team";
  license = "MIT";
  category = PluginCategory.CREATIVE;
  subcategory = "language_generation";
  tags = ["ai", "gemini", "language", "generation"];
  priority = PriorityLevel.HIGH;
  complexity = ComplexityLevel.SMALL;
  dependencies = [];
  peerDependencies = [];
  conflicts = [];

  capabilities: Capability[] = [{ name: "text_generation" }];

  permissions: Permission[] = [];

  intents: Intent[] = [
    {
      name: "generate_text",
      confidence: 0.8,
    },
  ];

  constructor(
    private logger: Logger,
    private geminiService: GeminiService,
  ) {
    super();
  }

  async initialize(): Promise<void> {
    this.logger.info("GeminiPlugin initialized");
  }

  async cleanup(): Promise<void> {
    this.logger.info("GeminiPlugin cleaned up");
  }

  getConfiguration(): PluginConfiguration {
    return {};
  }

  async updateConfiguration(): Promise<void> {
    this.logger.info("GeminiPlugin configuration updated");
  }

  getHealthStatus(): HealthStatus {
    return {
      status: "healthy",
      timestamp: new Date(),
      components: {
        core: "healthy",
        plugins: "healthy",
        integrations: "healthy",
        ai: "healthy",
        security: "healthy",
      },
      metrics: {
        responseTime: 0,
        errorRate: 0,
        activeConnections: 0,
      },
    };
  }

  getMetrics(): PluginMetrics {
    return {};
  }

  async handleIntent(
    intent: Intent,
    context: ExecutionContext,
  ): Promise<Response> {
    this.logger.info(`Handling intent: ${intent.name}`);

    if (intent.name === "generate_text") {
      const entities = (context["conversation"] as { entities: Entity[] })
        ?.entities;
      const prompt = entities?.find((e) => e.name === "prompt")?.value as
        | string
        | undefined;

      if (!prompt) {
        return {
          requestId: context["requestId"],
          success: false,
          type: ResponseType.ERROR,
          content: "Prompt is required to generate text.",
        } as Response;
      }

      const generatedText = await this.geminiService.generateText(prompt);

      return {
        requestId: context["requestId"],
        success: true,
        type: ResponseType.CONFIRMATION,
        content: generatedText,
      } as Response;
    }

    return {
      requestId: context["requestId"],
      success: false,
      type: ResponseType.ERROR,
      content: `Unknown intent handler: ${intent.name}`,
    } as Response;
  }
}
