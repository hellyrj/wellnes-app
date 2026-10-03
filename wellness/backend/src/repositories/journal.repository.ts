import prisma from '../utils/prisma';

export class JournalRepository {
  async findByUserId(userId: string) {
    return await prisma.journal.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  async create(data: {
    userId: string;
    title: string;
    content: string;
    date?: Date;
  }) {
    return await prisma.journal.create({
      data,
    });
  }

  async findById(id: string) {
    return await prisma.journal.findUnique({
      where: { id },
    });
  }

  async delete(id: string) {
    return await prisma.journal.delete({
      where: { id },
    });
  }

  async update(id: string, data: {
    title?: string;
    content?: string;
    date?: Date;
  }) {
    return await prisma.journal.update({
      where: { id },
      data,
    });
  }
}
