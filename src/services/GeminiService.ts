import { singleton } from "tsyringe";
import { Logger } from "@/utils";

@singleton()
export class GeminiService {
  constructor(private logger: Logger) {}

  public async generateText(prompt: string): Promise<string> {
    this.logger.info(`Generating text with Gemini for prompt: ${prompt}`);
    // API call to Gemini will be implemented here
    return `This is a placeholder response for the prompt: ${prompt}`;
  }
}
