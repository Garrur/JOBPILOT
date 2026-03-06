import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { PrismaClient } from '@prisma/client';

puppeteer.use(StealthPlugin());
const prisma = new PrismaClient();

export const ScraperService = {
  async scrapeInternshalaJobs(keyword = 'react') {
    let browser;
    try {
      console.log(`Starting scraper for Internshala: ${keyword}`);
      browser = await puppeteer.launch({
        headless: true, // or 'new' depending on puppeteer version
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800 });

      // Build search URL
      const searchUrl = `https://internshala.com/jobs/${keyword}-jobs/`;
      await page.goto(searchUrl, { waitUntil: 'networkidle2' });

      // Scrape data
      const jobs = await page.evaluate((keyword) => {
        const jobElements = document.querySelectorAll('.container-fluid.individual_internship');
        const scrapedData: any[] = [];

        jobElements.forEach((el) => {
          try {
            // New UI Selectors
            const titleEl = el.querySelector('.job-internship-name');
            const companyEl = el.querySelector('.company-name');
            const locationsEl = el.querySelectorAll('.locations a');
            // usually stipend/salary is the first or second item in job-meta
            const salaryEl = el.querySelector('.stipend'); 

            // Extract text securely
            const title = titleEl?.textContent?.trim();
            const company = companyEl?.textContent?.trim() || 'Unknown Company';
            
            // Map over locations since there can be multiple
            let location = 'Unknown Location';
            if (locationsEl && locationsEl.length > 0) {
               location = Array.from(locationsEl).map(l => l.textContent?.trim()).join(', ');
            }

            const salary = salaryEl?.textContent?.trim() || 'Not Disclosed';
            
            // Generate link
            const path = el.getAttribute('data-href') || titleEl?.parentElement?.getAttribute('href') || null;
            const applyUrl = path ? `https://internshala.com${path}` : null;
            
            // Internshala jobs have an id in the parent div
            const externalId = el.getAttribute('internshipid') || el.getAttribute('jobid') || null;

            if (title && externalId) {
                scrapedData.push({
                    externalId: `internshala_${externalId}`,
                    platform: 'Internshala',
                    title,
                    company,
                    location,
                    salary,
                    jobType: 'Full-time', // Usually Jobs on Internshala are full time, or we'd check tags
                    description: `Scraped from Internshala. Search keyword: ${keyword}.`,
                    applyUrl: applyUrl || 'https://internshala.com',
                    requiredSkills: [keyword], // default tagging
                    isEasyApply: false
                });
            }
          } catch (e) {
             console.error("Error parsing a job element", e);
          }
        });

        return scrapedData;
      }, keyword);

      console.log(`Successfully scraped ${jobs.length} jobs from Internshala.`);

      // Save to database
      let savedCount = 0;
      for (const job of jobs) {
        try {
          // Upsert to handle duplicates
          await prisma.job.upsert({
             where: { externalId: job.externalId },
             update: job,
             create: job
          });
          savedCount++;
        } catch (dbError) {
          console.error("Failed to save job to DB:", dbError);
        }
      }

      console.log(`Saved ${savedCount} new/updated jobs to the database.`);
      return { success: true, scraped: jobs.length, saved: savedCount };

    } catch (error: any) {
      console.error('Fatal Scraper Error:', error);
      return { success: false, error: error.message };
    } finally {
      if (browser) await browser.close();
    }
  }
};
