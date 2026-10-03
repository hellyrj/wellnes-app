import { Request, Response } from 'express';
import { JournalService } from '../services/journal.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { AsyncHandler } from '../decorators/async-handler.decoder';

const journalService = new JournalService();

export class JournalController {
  @AsyncHandler()
  async getJournals(req: AuthRequest, res: Response) {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const journals = await journalService.getJournals(req.user.userId);
    res.status(200).json({
      success: true,
      data: journals,
    });
  }

  @AsyncHandler()
  async createJournal(req: AuthRequest, res: Response) {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const { title, content, date } = req.body;
    const newJournal = await journalService.createJournal(req.user.userId, title, content, date ? new Date(date) : undefined);
    
    res.status(201).json({
      success: true,
      data: newJournal,
    });
  }

  @AsyncHandler()
  async deleteJournal(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const journalId = Array.isArray(id) ? id[0] : id;
    await journalService.deleteJournal(journalId);
    
    res.status(200).json({
      success: true,
      message: 'Journal deleted successfully',
    });
  }

  @AsyncHandler()
  async updateJournal(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const journalId = Array.isArray(id) ? id[0] : id;
    const { title, content, date } = req.body;
    
    const updatedJournal = await journalService.updateJournal(journalId, title, content, date ? new Date(date) : undefined);
    
    res.status(200).json({
      success: true,
      data: updatedJournal,
    });
  }
}
