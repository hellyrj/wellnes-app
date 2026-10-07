import prisma from '../utils/prisma';

export class MoodRepository {
  async findByUserId(userId: string, options?: {
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }) {
    const where: any = { userId };
    
    if (options?.startDate || options?.endDate) {
      where.date = {};
      if (options.startDate) {
        where.date.gte = options.startDate;
      }
      if (options.endDate) {
        where.date.lte = options.endDate;
      }
    }

    return await prisma.mood.findMany({
      where,
      orderBy: { date: 'desc' },
      take: options?.limit,
      skip: options?.offset,
    });
  }

  async findByUserIdAndId(userId: string, id: string) {
    return await prisma.mood.findFirst({
      where: { id, userId },
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

  async countByUserId(userId: string) {
    return await prisma.mood.count({
      where: { userId },
    });
  }
}
