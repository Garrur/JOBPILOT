import { Request, Response } from 'express';
import { ScraperService } from '../services/scraper.service';

export const triggerScrape = async (req: Request, res: Response) => {
  try {
    const keyword = req.body?.keyword || 'react';
    const result = await ScraperService.scrapeInternshalaJobs(keyword);

    if (result.success) {
      res.json({ message: 'Scraping Internshala completed successfully', data: result });
    } else {
      res.status(500).json({ error: 'Scraping Internshala failed', details: result.error });
    }
  } catch (error) {
    console.error("Scrape Trigger Error:", error);
    res.status(500).json({ error: 'Server error triggering scrape' });
  }
};

export const triggerIndeedScrape = async (req: Request, res: Response) => {
  try {
    const keyword = req.body?.keyword || 'react';
    const result = await ScraperService.scrapeIndeedJobs(keyword);

    if (result.success) {
      res.json({ message: 'Scraping Indeed completed successfully', data: result });
    } else {
      res.status(500).json({ error: 'Scraping Indeed failed', details: result.error });
    }
  } catch (error) {
    console.error("Scrape Trigger Error:", error);
    res.status(500).json({ error: 'Server error triggering scrape' });
  }
};

export const triggerLinkedInScrape = async (req: Request, res: Response) => {
  try {
    const keyword = req.body?.keyword || 'react';
    const result = await ScraperService.scrapeLinkedInJobs(keyword);

    if (result.success) {
      res.json({ message: 'Scraping LinkedIn completed successfully', data: result });
    } else {
      res.status(500).json({ error: 'Scraping LinkedIn failed', details: result.error });
    }
  } catch (error) {
    console.error("Scrape Trigger Error:", error);
    res.status(500).json({ error: 'Server error triggering scrape' });
  }
};

export const triggerNaukriScrape = async (req: Request, res: Response) => {
  try {
    const keyword = req.body?.keyword || 'react';
    const result = await ScraperService.scrapeNaukriJobs(keyword);

    if (result.success) {
      res.json({ message: 'Scraping Naukri completed successfully', data: result });
    } else {
      res.status(500).json({ error: 'Scraping Naukri failed', details: result.error });
    }
  } catch (error) {
    console.error("Scrape Trigger Error:", error);
    res.status(500).json({ error: 'Server error triggering scrape' });
  }
};

export const triggerWellfoundScrape = async (req: Request, res: Response) => {
  try {
    const keyword = req.body?.keyword || 'react';
    const result = await ScraperService.scrapeWellfoundJobs(keyword);

    if (result.success) {
      res.json({ message: 'Scraping Wellfound completed successfully', data: result });
    } else {
      res.status(500).json({ error: 'Scraping Wellfound failed', details: result.error });
    }
  } catch (error) {
    console.error("Scrape Trigger Error:", error);
    res.status(500).json({ error: 'Server error triggering scrape' });
  }
};
