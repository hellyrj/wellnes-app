import { MoodRepository } from '../repositories/mood.repository';
import { toMoodResponse, type CreateMoodRequest, type UpdateMoodRequest, type GetMoodsQuery } from '../models/mood.model';

export class MoodService {
  private moodRepository: MoodRepository;

  constructor() {
    this.moodRepository = new MoodRepository();
  }

  // GET MOODS - with optional date range filtering and pagination
  async getMoods(userId: string, query?: GetMoodsQuery) {
    const moods = await this.moodRepository.findByUserId(userId, {
      startDate: query?.startDate,
      endDate: query?.endDate,
      limit: query?.limit,
      offset: query?.offset,
    });
    
    return moods.map(toMoodResponse);
  }

  // GET SINGLE MOOD - with ownership validation
  async getMoodById(userId: string, id: string) {
    const mood = await this.moodRepository.findByUserIdAndId(userId, id);
    
    if (!mood) {
      throw new Error('Mood not found or you do not have permission to access it');
    }
    
    return toMoodResponse(mood);
  }

  // CREATE MOOD - business logic for creating a mood entry
  async createMood(userId: string, data: CreateMoodRequest) {
    const mood = await this.moodRepository.create({
      userId,
      mood: data.mood,
      note: data.note,
      date: data.date || new Date(),
    });
    
    return toMoodResponse(mood);
  }

  // UPDATE MOOD - with ownership validation
  async updateMood(userId: string, id: string, data: UpdateMoodRequest) {
    // First check if mood exists and belongs to user
    const existingMood = await this.moodRepository.findByUserIdAndId(userId, id);
    
    if (!existingMood) {
      throw new Error('Mood not found or you do not have permission to modify it');
    }
    
    const updatedMood = await this.moodRepository.update(id, {
      mood: data.mood,
      note: data.note,
      date: data.date,
    });
    
    return toMoodResponse(updatedMood);
  }

  // DELETE MOOD - with ownership validation
  async deleteMood(userId: string, id: string) {
    // First check if mood exists and belongs to user
    const existingMood = await this.moodRepository.findByUserIdAndId(userId, id);
    
    if (!existingMood) {
      throw new Error('Mood not found or you do not have permission to delete it');
    }
    
    await this.moodRepository.delete(id);
    
    return { message: 'Mood deleted successfully' };
  }

  // GET MOOD STATS - for analytics (e.g., mood trends)
  async getMoodStats(userId: string) {
    const count = await this.moodRepository.countByUserId(userId);
    const moods = await this.moodRepository.findByUserId(userId, { limit: 30 });
    
    // Calculate mood distribution
    const moodCounts = moods.reduce((acc, mood) => {
      acc[mood.mood] = (acc[mood.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalMoods: count,
      recentMoods: moods.length,
      moodDistribution: moodCounts,
    };
  }
}
