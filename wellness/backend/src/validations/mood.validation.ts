import { z } from 'zod';

// Valid mood values (can be customized based on your app's needs)
const VALID_MOODS = [
  'happy',
  'sad',
  'anxious',
  'calm',
  'energetic',
  'tired',
  'stressed',
  'excited',
  'angry',
  'neutral',
] as const;

export const createMoodSchema = z.object({
  mood: z.enum(VALID_MOODS, {
    message: 'Invalid mood value. Must be one of: happy, sad, anxious, calm, energetic, tired, stressed, excited, angry, neutral',
  }),
  note: z.string().max(500, 'Note must be less than 500 characters').optional(),
  date: z.coerce.date().optional(),
});

export const updateMoodSchema = z.object({
  mood: z.enum(VALID_MOODS, {
    message: 'Invalid mood value. Must be one of: happy, sad, anxious, calm, energetic, tired, stressed, excited, angry, neutral',
  }).optional(),
  note: z.string().max(500, 'Note must be less than 500 characters').optional(),
  date: z.coerce.date().optional(),
});

export const getMoodsQuerySchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  offset: z.coerce.number().min(0).optional(),
});

export const moodIdParamSchema = z.object({
  id: z.string().min(1, 'Mood ID is required'),
});
