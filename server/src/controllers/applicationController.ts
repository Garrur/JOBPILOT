import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Add this to your Express Request type in real app to avoid `any`
// Extend Express Request to include user
export interface AuthRequest extends Request {
  userId?: string;
}

export const getApplications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    const applications = await prisma.application.findMany({
      where: { userId },
      include: {
        job: true
      },
      orderBy: { updatedAt: 'desc' }
    });

    res.json(applications);
  } catch (error) {
    console.error("Get Applications Error:", error);
    res.status(500).json({ error: 'Server error fetching applications' });
  }
};

export const createApplication = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { jobId, coverLetter, resumeUrl } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if already applied
    const existing = await prisma.application.findFirst({
      where: { userId, jobId }
    });

    if (existing) {
      return res.status(400).json({ error: 'Already applied to this job' });
    }

    const application = await prisma.application.create({
      data: {
        userId,
        jobId,
        status: 'APPLIED',
        coverLetter,
        resumeUsed: resumeUrl
      },
      include: {
        job: true
      }
    });

    res.status(201).json(application);
  } catch (error) {
    console.error("Create Application Error:", error);
    res.status(500).json({ error: 'Server error creating application' });
  }
};

export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const id = req.params.id as string;
    const { status } = req.body;

    const application = await prisma.application.findUnique({
      where: { id }
    });

    if (!application || application.userId !== userId) {
      return res.status(404).json({ error: 'Application not found or unauthorized' });
    }

    const updated = await prisma.application.update({
      where: { id },
      data: { status }
    });

    res.json(updated);
  } catch (error) {
    console.error("Update Application Error:", error);
    res.status(500).json({ error: 'Server error updating application' });
  }
};
