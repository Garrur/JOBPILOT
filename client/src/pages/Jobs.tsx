import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, SlidersHorizontal, Briefcase, RefreshCw } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import JobCard from '../components/jobs/JobCard';
import type { JobProps } from '../components/jobs/JobCard';
import JobFilters from '../components/jobs/JobFilter';
import { useFilterStore } from '../store/filterStore';


export default function Jobs() {
  const { searchQuery, setSearchQuery, platforms, jobTypes, location, minMatchScore, experience } = useFilterStore();
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  
  const [jobs, setJobs] = useState<JobProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');

  // IMPORTANT: Rather than relying on closure over component variables (which can go stale),
  // we read the LATEST filter state directly from the Zustand store during each fetch.
  const fetchJobs = async () => {
    const {
      searchQuery: sq,
      platforms: plats,
      jobTypes: types,
      location: loc,
      minMatchScore: score,
      experience: exp
    } = useFilterStore.getState();

    const ALL_PLATFORMS = ['linkedin', 'naukri', 'internshala', 'wellfound', 'shine', 'indeed'];
    const ALL_TYPES = ['Full-time', 'Part-time', 'Internship', 'Freelance'];

    try {
      setIsLoading(true);
      
      const params = new URLSearchParams();
      if (sq) params.append('search', sq);
      if (loc) params.append('location', loc);
      
      // Only filter by platform if it's a SUBSET (not all selected = no filter)
      if (plats.length > 0 && plats.length < ALL_PLATFORMS.length) {
        params.append('platform', plats.join(','));
      }
      
      // Only filter by type if specific types are selected (not all or none = no filter)
      if (types.length > 0 && types.length < ALL_TYPES.length) {
        params.append('type', types.join(','));
      }
      
      if (exp && exp !== 'any') params.append('experience', exp);

      const response = await axios.get(`http://localhost:5000/api/jobs?${params.toString()}`);
      
      let fetchedJobs = response.data || [];
      
      // Frontend match-score filter
      if (score > 0) {
         fetchedJobs = fetchedJobs.filter((job: any) => (job.matchScore || 0) >= score);
      }

      setJobs(fetchedJobs);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platforms, jobTypes, location, minMatchScore, experience]);

  // Trigger all scrapers in sequence, then re-fetch fresh data
  const updateAllScrapers = async () => {
    setIsUpdating(true);
    const scrapers = [
      { name: 'Naukri',      url: 'http://localhost:5000/api/scraper/naukri' },
      { name: 'LinkedIn',    url: 'http://localhost:5000/api/scraper/linkedin' },
      { name: 'Internshala', url: 'http://localhost:5000/api/scraper/internshala' },
      { name: 'Indeed',      url: 'http://localhost:5000/api/scraper/indeed' },
    ];
    try {
      for (const s of scrapers) {
        setUpdateStatus(`Scraping ${s.name}...`);
        await axios.post(s.url);
      }
      setUpdateStatus('Refreshing jobs...');
      await fetchJobs();
      setUpdateStatus('Done! ✓');
      setTimeout(() => setUpdateStatus(''), 3000);
    } catch (err) {
      console.error('Scraper update failed:', err);
      setUpdateStatus('Update failed');
      setTimeout(() => setUpdateStatus(''), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      
      {/* Mobile filter toggle */}
      <div className="md:hidden flex gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Job title, keywords, or company" 
            className="pl-9 dark:bg-slate-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
          />
        </div>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setShowFiltersMobile(!showFiltersMobile)}
          className="dark:border-slate-700 dark:bg-slate-800"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Sidebar Filters */}
      <aside className={`md:w-64 flex-shrink-0 ${showFiltersMobile ? 'block' : 'hidden md:block'}`}>
        <JobFilters />
      </aside>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        
        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input 
              placeholder="Job title, keywords, or company..." 
              className="pl-10 h-11 border-none bg-gray-50 dark:bg-slate-900 focus-visible:ring-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
            />
          </div>
          <Button 
            className="h-11 px-8 bg-orange-500 hover:bg-orange-600 text-white"
            onClick={fetchJobs}
            disabled={isUpdating}
          >
            Search
          </Button>
          <Button 
            variant="outline"
            className="h-11 px-4 gap-2 dark:border-slate-600 dark:bg-slate-900 dark:text-gray-200"
            onClick={updateAllScrapers}
            disabled={isUpdating}
            title="Re-scrape all job portals and refresh"
          >
            <RefreshCw className={`h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
            {isUpdating ? (updateStatus || 'Updating...') : 'Update All'}
          </Button>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold dark:text-white">Recommended Jobs</h2>
          <div className="flex items-center gap-3">
            {updateStatus && (
              <span className="text-xs font-medium text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-full">
                {updateStatus}
              </span>
            )}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing <span className="font-semibold text-gray-900 dark:text-gray-100">{jobs.length}</span> results
            </div>
          </div>
        </div>

        {/* Job Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Briefcase className="h-14 w-14 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">No jobs found</h3>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
