import { Request, Response } from 'express';
import { MoodService } from '../services/mood.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { AsyncHandler } from '../decorators/async-handler.decoder';

const moodService = new MoodService();

export class MoodController {
  @AsyncHandler()
  async getMoods(req: AuthRequest, res: Response) {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const moods = await moodService.getMoods(req.user.userId);
    res.status(200).json({
      success: true,
      data: moods,
    });
  }

  @AsyncHandler()
  async createMood(req: AuthRequest, res: Response) {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const { mood, note, date } = req.body;
    const newMood = await moodService.createMood(req.user.userId, mood, note, date ? new Date(date) : undefined);
    
    res.status(201).json({
      success: true,
      data: newMood,
    });
  }

  @AsyncHandler()
  async deleteMood(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const moodId = Array.isArray(id) ? id[0] : id;
    await moodService.deleteMood(moodId);
    
    res.status(200).json({
      success: true,
      message: 'Mood deleted successfully',
    });
  }

  @AsyncHandler()
  async updateMood(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const moodId = Array.isArray(id) ? id[0] : id;
    const { mood, note, date } = req.body;
    
    const updatedMood = await moodService.updateMood(moodId, mood, note, date ? new Date(date) : undefined);
    
    res.status(200).json({
      success: true,
      data: updatedMood,
    });
  }
}
