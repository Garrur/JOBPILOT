import { Request, Response } from 'express';
import { ScraperService } from '../services/scraper.service';

export const triggerScrape = async (req: Request, res: Response) => {
  try {
    const { keyword } = req.body;
    
    // Start scraping process asynchronously so we don't block the HTTP request
    // Alternatively, await it if you want the user to wait for the results
    const result = await ScraperService.scrapeInternshalaJobs(keyword || 'react');

    if (result.success) {
      res.json({ message: 'Scraping completed successfully', data: result });
    } else {
      res.status(500).json({ error: 'Scraping failed', details: result.error });
    }
  } catch (error) {
    console.error("Scrape Trigger Error:", error);
    res.status(500).json({ error: 'Server error triggering scrape' });
  }
};
