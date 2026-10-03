import { JournalRepository } from '../repositories/journal.repository';

export class JournalService {
  private journalRepository: JournalRepository;

  constructor() {
    this.journalRepository = new JournalRepository();
  }

  async getJournals(userId: string) {
    return await this.journalRepository.findByUserId(userId);
  }

  async createJournal(userId: string, title: string, content: string, date?: Date) {
    return await this.journalRepository.create({
      userId,
      title,
      content,
      date: date || new Date(),
    });
  }

  async deleteJournal(id: string) {
    return await this.journalRepository.delete(id);
  }

  async updateJournal(id: string, title?: string, content?: string, date?: Date) {
    return await this.journalRepository.update(id, { title, content, date });
  }
}
