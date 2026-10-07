// 1. Prisma mood type (for internal use only)
import { Mood as PrismaMood } from '@prisma/client';
// Re-export Prisma types for internal use
export type Mood = PrismaMood;

// 2. Request DTOs (what clients send)
export interface CreateMoodRequest {
  mood: string;
  note?: string;
  date?: Date;
}

export interface UpdateMoodRequest {
  mood?: string;
  note?: string;
  date?: Date;
}

export interface GetMoodsQuery {
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

// 3. Response DTOs (what server sends back to clients)
export interface MoodResponse {
  id: string;
  userId: string;
  mood: string;
  note?: string;
  date: Date;
  createdAt: Date;
}

// 4. Helper function to sanitize mood data
export function toMoodResponse(mood: PrismaMood): MoodResponse {
  return {
    id: mood.id,
    userId: mood.userId,
    mood: mood.mood,
    note: mood.note || undefined,
    date: mood.date,
    createdAt: mood.createdAt,
  };
}
