import { Request, Response } from 'express';
import { AI } from '../services/ai.service';
import fs from 'fs';

// Helper to convert PDF to text (mocked for simplicity here, real app needs pdf-parse)
const extractTextFromPDF = async (filePath: string): Promise<string> => {
   // In a complete implementation, use 'pdf-parse' or similar to read the buffer
   // For now, returning a dummy string to pass to Claude
   return `CANDIDATE RESUME TEXT EXTRACTED FROM ${filePath}\n\nExperience: 5 years Software Engineering...`;
};

export const parseResume = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded' });
    }

    const rawText = await extractTextFromPDF(req.file.path);
    const parsedDataString = await AI.parseResume(rawText);
    
    // Clean up uploaded file if needed or keep for storage
    // fs.unlinkSync(req.file.path);

    res.json(JSON.parse(parsedDataString));
  } catch (error) {
    console.error("Parse Resume Error:", error);
    res.status(500).json({ error: 'Failed to parse resume' });
  }
};

export const generateCoverLetter = async (req: Request, res: Response) => {
  try {
    const { resumeText, jobDescription, companyName } = req.body;
    
    if (!resumeText || !jobDescription || !companyName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const coverLetter = await AI.generateCoverLetter(resumeText, jobDescription, companyName);
    res.json({ coverLetter });
  } catch (error) {
    console.error("Cover Letter Error:", error);
    res.status(500).json({ error: 'Failed to generate cover letter' });
  }
};

export const matchScore = async (req: Request, res: Response) => {
    try {
      const { resumeText, jobDescription } = req.body;
      
      if (!resumeText || !jobDescription) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      const matchDataString = await AI.calculateMatchScore(resumeText, jobDescription);
      res.json(JSON.parse(matchDataString));
    } catch (error) {
      console.error("Match Score Error:", error);
      res.status(500).json({ error: 'Failed to calculate match score' });
    }
  };
