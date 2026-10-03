import { Router } from 'express';
import { MoodController } from '../controllers/mood.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const moodController = new MoodController();

// All mood routes require authentication
router.get('/', authenticate as any, moodController.getMoods as any);
router.post('/', authenticate as any, moodController.createMood as any);
router.delete('/:id', authenticate as any, moodController.deleteMood as any);
router.put('/:id', authenticate as any, moodController.updateMood as any);

export default router;
