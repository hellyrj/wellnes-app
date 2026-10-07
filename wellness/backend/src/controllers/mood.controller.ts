import { Request, Response } from 'express';
import { MoodService } from '../services/mood.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { AsyncHandler } from '../decorators/async-handler.decoder';
import { createMoodSchema, updateMoodSchema, getMoodsQuerySchema, moodIdParamSchema } from '../validations/mood.validation';

const moodService = new MoodService();

export class MoodController {
  // GET ALL MOODS - with optional query parameters for filtering
  @AsyncHandler()
  async getMoods(req: AuthRequest, res: Response) {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    // Validate query parameters
    const query = getMoodsQuerySchema.parse(req.query);

    const moods = await moodService.getMoods(req.user.userId, query);
    res.status(200).json({
      success: true,
      data: moods,
    });
  }

  // GET SINGLE MOOD - by ID
  @AsyncHandler()
  async getMoodById(req: AuthRequest, res: Response) {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    // Validate mood ID parameter
    const { id } = moodIdParamSchema.parse(req.params);
    const moodId = Array.isArray(id) ? id[0] : id;

    const mood = await moodService.getMoodById(req.user.userId, moodId);
    res.status(200).json({
      success: true,
      data: mood,
    });
  }

  // CREATE MOOD - with validation
  @AsyncHandler()
  async createMood(req: AuthRequest, res: Response) {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    // Validate request body
    const validatedData = createMoodSchema.parse(req.body);

    const newMood = await moodService.createMood(req.user.userId, validatedData);
    
    res.status(201).json({
      success: true,
      data: newMood,
    });
  }

  // UPDATE MOOD - with validation and ownership check
  @AsyncHandler()
  async updateMood(req: AuthRequest, res: Response) {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    // Validate mood ID parameter
    const { id } = moodIdParamSchema.parse(req.params);
    const moodId = Array.isArray(id) ? id[0] : id;

    // Validate request body
    const validatedData = updateMoodSchema.parse(req.body);
    
    const updatedMood = await moodService.updateMood(req.user.userId, moodId, validatedData);
    
    res.status(200).json({
      success: true,
      data: updatedMood,
    });
  }

  // DELETE MOOD - with ownership check
  @AsyncHandler()
  async deleteMood(req: AuthRequest, res: Response) {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    // Validate mood ID parameter
    const { id } = moodIdParamSchema.parse(req.params);
    const moodId = Array.isArray(id) ? id[0] : id;

    await moodService.deleteMood(req.user.userId, moodId);
    
    res.status(200).json({
      success: true,
      message: 'Mood deleted successfully',
    });
  }

  // GET MOOD STATS - for analytics
  @AsyncHandler()
  async getMoodStats(req: AuthRequest, res: Response) {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const stats = await moodService.getMoodStats(req.user.userId);
    res.status(200).json({
      success: true,
      data: stats,
    });
  }
}
