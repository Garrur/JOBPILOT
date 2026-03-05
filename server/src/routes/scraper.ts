import express from 'express';
import { triggerScrape } from '../controllers/scraperController';

const router = express.Router();

// Route to manually trigger the scraper, potentially pass a keyword
router.post('/internshala', triggerScrape);

export default router;
