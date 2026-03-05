import { Anthropic } from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY || 'dummy_key_for_build',
});

const DEFAULT_MODEL = 'claude-3-7-sonnet-20250219';

export const AI = {
  /**
   * Parse a raw resume text into structured data
   */
  async parseResume(rawText: string) {
    if (!process.env.CLAUDE_API_KEY) {
      console.warn("No Claude API Key. Returning mock parsed resume.");
      return JSON.stringify({ skills: ["React", "Node.js"], experience: 3 });
    }

    try {
      const response = await anthropic.messages.create({
        model: DEFAULT_MODEL,
        max_tokens: 1000,
        system: "You are an expert HR assistant. Extract programming languages, frameworks, and years of experience from the resume text. Return ONLY valid JSON in format: { skills: string[], experience: number }",
        messages: [{ role: 'user', content: rawText }]
      });

      // @ts-ignore
      return response.content[0].text;
    } catch (error) {
      console.error("AI Parse Error:", error);
      throw error;
    }
  },

  /**
   * Calculate match score between a resume and job description
   */
  async calculateMatchScore(resumeText: string, jobDescription: string) {
     if (!process.env.CLAUDE_API_KEY) {
      return JSON.stringify({ score: 85, reasoning: "Mock reasoning due to missing API key." });
    }

    try {
      const response = await anthropic.messages.create({
        model: DEFAULT_MODEL,
        max_tokens: 500,
        system: "You are an expert technical recruiter. Compare the candidate's resume with the job description. Return an alignment score out of 100 and brief reasoning. Return ONLY valid JSON in format: { score: number, reasoning: string }",
        messages: [
          { role: 'user', content: `Resume:\n${resumeText}\n\nJob Desc:\n${jobDescription}` }
        ]
      });

      // @ts-ignore
      return response.content[0].text;
    } catch (error) {
      console.error("AI Match Error:", error);
      throw error;
    }
  },

  /**
   * Generate a tailored cover letter
   */
  async generateCoverLetter(resumeText: string, jobDescription: string, companyName: string) {
    if (!process.env.CLAUDE_API_KEY) {
      return "Dear Hiring Manager,\n\nI am writing to apply for the position. I have the required skills.\n\nBest,\nCandidate";
    }

    try {
      const response = await anthropic.messages.create({
        model: DEFAULT_MODEL,
        max_tokens: 1000,
        system: `You are an expert career coach. Write a compelling, concise cover letter (max 3 paragraphs) tailored for the company and job description using the candidate's resume. Do not use placeholders like [Your Name].`,
        messages: [
          { role: 'user', content: `Company: ${companyName}\n\nResume:\n${resumeText}\n\nJob Desc:\n${jobDescription}` }
        ]
      });

      // @ts-ignore
      return response.content[0].text;
    } catch (error) {
      console.error("AI Cover Letter Error:", error);
      throw error;
    }
  }
};
