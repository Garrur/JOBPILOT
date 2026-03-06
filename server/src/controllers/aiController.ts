import { Request, Response } from 'express';
import { AI } from '../services/ai.service';
import fs from 'fs';
const pdfParse = require('pdf-parse');

// Helper to convert PDF to text
const extractTextFromPDF = async (filePath: string): Promise<string> => {
   try {
     const dataBuffer = fs.readFileSync(filePath);
     const data = await pdfParse(dataBuffer);
     return data.text;
   } catch (error) {
     console.error("PDF Parsing Error:", error);
     throw new Error("Could not extract text from PDF");
   }
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
