import { Router } from 'express';
import { JournalController } from '../controllers/journal.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const journalController = new JournalController();

// All journal routes require authentication
router.get('/', authenticate as any, journalController.getJournals as any);
router.post('/', authenticate as any, journalController.createJournal as any);
router.delete('/:id', authenticate as any, journalController.deleteJournal as any);
router.put('/:id', authenticate as any, journalController.updateJournal as any);

export default router;
