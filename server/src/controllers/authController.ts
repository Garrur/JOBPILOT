import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { prisma } from '../index';
import { AI } from '../services/ai.service';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretplaceholderkey2026';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, email: user.email, name: user.name, skills: user.skills },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id, email: user.email, name: user.name,
        phone: user.phone, location: user.location, linkedinUrl: user.linkedinUrl,
        portfolioUrl: user.portfolioUrl, resumeUrl: user.resumeUrl, skills: user.skills
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * POST /api/auth/resume  (multipart/form-data, field: resume)
 * 1. Save the PDF file via multer
 * 2. Extract text with pdf-parse
 * 3. Call AI to parse skills + experience
 * 4. Update user record with resumeText + skills
 */
export const uploadResume = async (req: any, res: Response) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No PDF file uploaded' });

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pdfParse = require('pdf-parse');
    const pdfBuffer = fs.readFileSync(file.path);
    const pdfData = await pdfParse(pdfBuffer);
    const resumeText = pdfData.text?.trim() || '';

    // AI parse for skills (falls back to mock if no API key)
    let skills: string[] = [];
    try {
      const aiResult = await AI.parseResume(resumeText);
      const parsed = JSON.parse(aiResult);
      skills = parsed.skills || [];
    } catch {
      // If AI fails, extract basic skills via keyword matching
      const commonSkills = ['React', 'Node.js', 'TypeScript', 'JavaScript', 'Python', 'Java',
        'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'Git', 'CSS', 'HTML', 'Express', 'Next.js', 'Vue', 'Angular'];
      skills = commonSkills.filter(skill =>
        resumeText.toLowerCase().includes(skill.toLowerCase())
      );
    }

    // Build a public URL for the uploaded file
    const resumeUrl = `/uploads/${file.filename}`;

    await prisma.user.update({
      where: { id: userId },
      data: { resumeText, skills, resumeUrl },
    });

    res.json({
      message: 'Resume uploaded and parsed successfully',
      resumeUrl,
      skills,
      charCount: resumeText.length,
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({ error: 'Failed to process resume' });
  } finally {
    // Clean up temp file
    try { if (file?.path) fs.unlinkSync(file.path); } catch {}
  }
};
