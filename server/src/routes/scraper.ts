import express from 'express';
import { triggerScrape, triggerIndeedScrape, triggerLinkedInScrape, triggerNaukriScrape, triggerWellfoundScrape } from '../controllers/scraperController';

const router = express.Router();

// Route to manually trigger the scraper, potentially pass a keyword
router.post('/internshala', triggerScrape);
router.post('/indeed', triggerIndeedScrape);
router.post('/linkedin', triggerLinkedInScrape);
router.post('/naukri', triggerNaukriScrape);
router.post('/wellfound', triggerWellfoundScrape);

export default router;
