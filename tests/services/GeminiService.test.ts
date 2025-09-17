import "reflect-metadata";
import { GeminiService } from "@/services/GeminiService";
import { Logger } from "@/utils/Logger";
import { ConfigService } from "@/utils/ConfigService";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Mock the GoogleGenerativeAI and GenerativeModel
jest.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: jest.fn(() => ({
    getGenerativeModel: jest.fn(() => ({
      generateContent: jest.fn((prompt: string) => {
        if (prompt === "error") {
          throw new Error("API Error");
        }
        return {
          response: Promise.resolve({
            text: () => `Generated text for: ${prompt}`,
          }),
        };
      }),
    })),
  })),
}));

describe("GeminiService", () => {
  let geminiService: GeminiService;
  let mockLogger: jest.Mocked<Logger>;
  let mockConfigService: jest.Mocked<ConfigService>;
  let mockGetGenerativeModel: jest.Mock;
  let mockGenerateContent: jest.Mock;

  beforeEach(() => {
    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
    } as any;
    mockConfigService = {
      get: jest.fn(),
    } as any;

    // Reset mocks for GoogleGenerativeAI
    (GoogleGenerativeAI as jest.Mock).mockClear();

    // Mock generateContent first
    mockGenerateContent = jest.fn((prompt: string) => {
      if (prompt === "error") {
        throw new Error("API Error");
      }
      return {
        response: Promise.resolve({
          text: () => `Generated text for: ${prompt}`,
        }),
      };
    }) as jest.Mock;

    // Mock getGenerativeModel to return an object with the mocked generateContent
    mockGetGenerativeModel = jest.fn(() => ({
      generateContent: mockGenerateContent,
    })) as jest.Mock;

    // Mock the GoogleGenerativeAI constructor to return an object with the mocked getGenerativeModel
    (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
      getGenerativeModel: mockGetGenerativeModel,
    }));

    // Set a default API key for tests unless overridden
    mockConfigService.get.mockReturnValue("test-api-key");

    geminiService = new GeminiService(mockLogger, mockConfigService);
  });

  it("should be defined", () => {
    expect(geminiService).toBeDefined();
  });

  it("should throw an error if API key is not found", () => {
    mockConfigService.get.mockReturnValueOnce(undefined);
    expect(() => new GeminiService(mockLogger, mockConfigService)).toThrow("Gemini API key not found in configuration.");
  });

  it("should initialize GoogleGenerativeAI with the provided API key", () => {
    expect(mockConfigService.get).toHaveBeenCalledWith("ai.providers.google.apiKey");
    expect(GoogleGenerativeAI).toHaveBeenCalledWith("test-api-key");
    expect(mockGetGenerativeModel).toHaveBeenCalledWith({ model: "gemini-pro" });
  });

  describe("generateText", () => {
    it("should generate text successfully", async () => {
      const prompt = "Hello, Gemini!";
      const expectedText = `Generated text for: ${prompt}`;
      const result = await geminiService.generateText(prompt);

      expect(mockLogger.info).toHaveBeenCalledWith(`Generating text with Gemini for prompt: ${prompt}`);
      expect(mockGenerateContent).toHaveBeenCalledWith(prompt);
      expect(result).toBe(expectedText);
    });

    it("should handle errors during text generation", async () => {
      const prompt = "error";

      await expect(geminiService.generateText(prompt)).rejects.toThrow("API Error");
      expect(mockLogger.error).toHaveBeenCalledWith("Error generating text with Gemini:", expect.any(Error));
      expect(mockGenerateContent).toHaveBeenCalledWith(prompt);
    });
  });
});
