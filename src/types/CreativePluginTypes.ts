export type Metadata = {
  [key: string]: string | number | boolean | string[] | Record<string, unknown>;
};

export interface GeneratedContent {
  id: string;
  type: "music" | "image" | "text";
  content: unknown;
  metadata: Metadata;
  createdAt: Date;
  expiresAt: Date;
}

export interface AIModel {
  id: string;
  name: string;
  type: string;
  version: string;
  capabilities: string[];
  status: string;
  lastUsed: Date;
}

export interface MusicGenerationParams {
  genre: string;
  mood?: string;
  duration: number;
  instruments?: string[];
  style?: string;
}

export interface ImageGenerationParams {
  description: string;
  style?: string;
  size: string;
  quality: string;
}

export interface ContentGenerationParams {
  type: string;
  topic: string;
  length: string;
  style?: string;
  tone?: string;
}

export interface StyleTransferParams {
  sourceImage: string;
  style: string;
  intensity: string;
}

export interface GeneratedMusic {
  id: string;
  audioData: string;
  duration: number;
  format: string;
  metadata: Metadata;
}

export interface GeneratedImage {
  id: string;
  imageData: string;
  format: string;
  size: string;
  metadata: Metadata;
}

export interface GeneratedText {
  id: string;
  text: string;
  wordCount: number;
  metadata: Metadata;
}
