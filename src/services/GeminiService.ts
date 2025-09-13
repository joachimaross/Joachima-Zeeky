import { singleton } from "tsyringe";
import { Logger } from "../utils/Logger";
import { ConfigService } from "./ConfigService";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

@singleton()
export class GeminiService {
  private generativeModel: GenerativeModel;

  constructor(
    private logger: Logger,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>("gemini.apiKey");
    if (!apiKey) {
      throw new Error("Gemini API key not found in configuration.");
    }
    const googleAI = new GoogleGenerativeAI(apiKey);
    this.generativeModel = googleAI.getGenerativeModel({ model: "gemini-pro" });
  }

  public async generateText(prompt: string): Promise<string> {
    this.logger.info(`Generating text with Gemini for prompt: ${prompt}`);
    try {
      const result = await this.generativeModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return text;
    } catch (error) {
      this.logger.error("Error generating text with Gemini:", error);
      throw error;
    }
  }
}
