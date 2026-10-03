import prisma from '../utils/prisma';

export class MoodRepository {
  async findByUserId(userId: string) {
    return await prisma.mood.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  async create(data: {
    userId: string;
    mood: string;
    note?: string;
    date?: Date;
  }) {
    return await prisma.mood.create({
      data,
    });
  }

  async findById(id: string) {
    return await prisma.mood.findUnique({
      where: { id },
    });
  }

  async delete(id: string) {
    return await prisma.mood.delete({
      where: { id },
    });
  }

  async update(id: string, data: {
    mood?: string;
    note?: string;
    date?: Date;
  }) {
    return await prisma.mood.update({
      where: { id },
      data,
    });
  }
}
