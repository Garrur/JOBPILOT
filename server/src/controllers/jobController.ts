import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getJobs = async (req: Request, res: Response) => {
  try {
    const { platform, type, location, search, experience } = req.query;

    const query: any = {
      where: {
        AND: []
      },
      orderBy: { scrapedAt: 'desc' }
    };

    if (platform) {
      const platformsArr = (platform as string).split(',');
      query.where.AND.push({
         OR: platformsArr.map(p => ({
           platform: { equals: p, mode: 'insensitive' }
         }))
      });
    }
    
    if (type) {
      const typesArr = (type as string).split(',');
      query.where.AND.push({
         OR: typesArr.map(t => ({
           jobType: { contains: t, mode: 'insensitive' }
         }))
      });
    }
    
    if (location) query.where.location = { contains: location as string, mode: 'insensitive' };
    
    // Fallback logic for experience: Since external websites don't reliably give us an "Experience Level" field, 
    // we use a naive full-text search against the job description to estimate filtering.
    if (experience && experience !== 'any') {
      const expString = experience as string;
      // Query against the dedicated experienceLevel field (populated by scrapers)
      // Use 'contains' to match 'fresher', '1-3', '3-5', '5+' etc.
      query.where.AND.push({
        experienceLevel: { equals: expString, mode: 'insensitive' }
      });
    }
    
    if (search) {
      query.where.AND.push({
         OR: [
           { title: { contains: search as string, mode: 'insensitive' } },
           { company: { contains: search as string, mode: 'insensitive' } },
           { description: { contains: search as string, mode: 'insensitive' } },
         ]
      });
    }

    // Prisma throws an error if AND is present but empty
    if (query.where.AND.length === 0) {
       delete query.where.AND;
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
