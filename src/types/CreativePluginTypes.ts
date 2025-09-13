/**
 * Type Definitions for the Creative Plugin
 */

export interface MusicComposition {
  id: string;
  title: string;
  genre: string;
  mood: string;
  durationSeconds: number;
  url: string;
  createdAt: Date;
}

export interface VisualArtwork {
  id: string;
  title: string;
  style: string;
  medium: string;
  url: string;
  createdAt: Date;
}

export type GeneratedContent = MusicComposition | VisualArtwork;

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  capabilities: string[];
}
