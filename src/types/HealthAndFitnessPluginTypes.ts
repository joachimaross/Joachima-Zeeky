/**
 * Represents a single workout session.
 */
export interface Workout {
  id: string;
  type: "running" | "weightlifting" | "cycling" | "yoga";
  durationMinutes: number;
  caloriesBurned: number;
  date: Date;
}

/**
 * Represents a user's health metric, like heart rate or sleep quality.
 */
export interface HealthMetric {
  type: "heart_rate" | "sleep_quality" | "steps";
  value: number;
  unit: string;
  timestamp: Date;
}
