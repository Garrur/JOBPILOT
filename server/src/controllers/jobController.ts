import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getJobs = async (req: Request, res: Response) => {
  try {
    const { platform, type, location, search } = req.query;

    const query: any = {
      where: {},
      orderBy: { createdAt: 'desc' }
    };

    if (platform) query.where.platform = { in: (platform as string).split(',') };
    if (type) query.where.type = { in: (type as string).split(',') };
    if (location) query.where.location = { contains: location as string, mode: 'insensitive' };
    
    if (search) {
      query.where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { company: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const jobs = await prisma.job.findMany(query);
    res.json(jobs);
  } catch (error) {
    console.error("Get Jobs Error:", error);
    res.status(500).json({ error: 'Server error fetching jobs' });
  }
};

export const getJobById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const job = await prisma.job.findUnique({ where: { id } });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error("Get Job By ID Error:", error);
    res.status(500).json({ error: 'Server error fetching job details' });
  }
};
