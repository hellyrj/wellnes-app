import { MoodRepository } from '../repositories/mood.repository';

export class MoodService {
  private moodRepository: MoodRepository;

  constructor() {
    this.moodRepository = new MoodRepository();
  }

  async getMoods(userId: string) {
    return await this.moodRepository.findByUserId(userId);
  }

  async createMood(userId: string, mood: string, note?: string, date?: Date) {
    return await this.moodRepository.create({
      userId,
      mood,
      note,
      date: date || new Date(),
    });
  }

  async deleteMood(id: string) {
    return await this.moodRepository.delete(id);
  }

  async updateMood(id: string, mood?: string, note?: string, date?: Date) {
    return await this.moodRepository.update(id, { mood, note, date });
  }
}
