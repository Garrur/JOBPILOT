import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, SlidersHorizontal, Briefcase, RefreshCw, X, ArrowUpDown } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import JobCard from '../components/jobs/JobCard';
import type { JobProps } from '../components/jobs/JobCard';
import JobFilters from '../components/jobs/JobFilter';
import { useFilterStore } from '../store/filterStore';

type SortKey = 'newest' | 'oldest' | 'salary_high' | 'salary_low' | 'match';

function parseSalaryMax(salary?: string): number {
  if (!salary) return 0;
  const m = salary.match(/[\d.]+/g);
  return m ? parseFloat(m[m.length - 1]) : 0;
}

export default function Jobs() {
  const {
    searchQuery, setSearchQuery,
    platforms, jobTypes, location, minMatchScore, experience,
    togglePlatform, toggleJobType, setLocation, resetFilters
  } = useFilterStore();
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [jobs, setJobs] = useState<JobProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('newest');

  const fetchJobs = async () => {
    const {
      searchQuery: sq, platforms: plats, jobTypes: types,
      location: loc, minMatchScore: score, experience: exp
    } = useFilterStore.getState();

    const ALL_PLATFORMS = ['linkedin', 'naukri', 'internshala', 'wellfound', 'shine', 'indeed'];
    const ALL_TYPES = ['Full-time', 'Part-time', 'Internship', 'Freelance'];

    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (sq) params.append('search', sq);
      if (loc) params.append('location', loc);
      if (plats.length > 0 && plats.length < ALL_PLATFORMS.length) params.append('platform', plats.join(','));
      if (types.length > 0 && types.length < ALL_TYPES.length) params.append('type', types.join(','));
      if (exp && exp !== 'any') params.append('experience', exp);
      const response = await axios.get(`http://localhost:5000/api/jobs?${params.toString()}`);
      let fetchedJobs = response.data || [];
      if (score > 0) fetchedJobs = fetchedJobs.filter((job: any) => (job.matchScore || 0) >= score);
      setJobs(fetchedJobs);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platforms, jobTypes, location, minMatchScore, experience]);

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
      setUpdateStatus('Update failed');
      setTimeout(() => setUpdateStatus(''), 3000);
    } finally {
      setIsUpdating(false);
    }
  };

  // Sort jobs
  const sortedJobs = [...jobs].sort((a: any, b: any) => {
    if (sortBy === 'match')       return (b.matchScore || 0) - (a.matchScore || 0);
    if (sortBy === 'salary_high') return parseSalaryMax(b.salary) - parseSalaryMax(a.salary);
    if (sortBy === 'salary_low')  return parseSalaryMax(a.salary) - parseSalaryMax(b.salary);
    if (sortBy === 'oldest')      return new Date(a.postedAt || a.scrapedAt).getTime() - new Date(b.postedAt || b.scrapedAt).getTime();
    // newest (default)
    return new Date(b.postedAt || b.scrapedAt).getTime() - new Date(a.postedAt || a.scrapedAt).getTime();
  });

  // Active filter chips
  const ALL_PLATFORMS_DEFAULT = ['linkedin', 'naukri', 'internshala', 'wellfound', 'shine', 'indeed'];

  // Show platform chip only when a platform is excluded (missing from default)
  const excludedPlatforms = ALL_PLATFORMS_DEFAULT.filter(p => !platforms.includes(p));
  const activeChips: { label: string; onRemove: () => void }[] = [
    ...excludedPlatforms.map(p => ({
      label: `Not: ${p.charAt(0).toUpperCase() + p.slice(1)}`,
      onRemove: () => togglePlatform(p)
    })),
    ...jobTypes.map(t => ({ label: t, onRemove: () => toggleJobType(t) })),
    ...(location ? [{ label: `📍 ${location}`, onRemove: () => setLocation('') }] : []),
    ...(experience && experience !== 'any' ? [{ label: `Exp: ${experience}`, onRemove: () => useFilterStore.getState().setExperience('any') }] : []),
    ...(minMatchScore > 0 ? [{ label: `Match ≥ ${minMatchScore}%`, onRemove: () => useFilterStore.getState().setMinMatchScore(0) }] : []),
  ];

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
        <Button variant="outline" size="icon" onClick={() => setShowFiltersMobile(!showFiltersMobile)} className="dark:border-slate-700 dark:bg-slate-800">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Sidebar Filters */}
      <aside className={`md:w-64 flex-shrink-0 ${showFiltersMobile ? 'block' : 'hidden md:block'}`}>
        <JobFilters />
      </aside>

      {/* Main Content */}
      <div className="flex-1 space-y-4 min-w-0">
        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search job title, keywords, or company..."
              className="pl-10 h-11 border-none bg-gray-50 dark:bg-slate-900 focus-visible:ring-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
            />
          </div>
          <Button className="h-11 px-8 bg-orange-500 hover:bg-orange-600 text-white" onClick={fetchJobs} disabled={isUpdating}>
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

        {/* Active Filter Chips */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Active filters:</span>
            {activeChips.map((chip) => (
              <button
                key={chip.label}
                onClick={chip.onRemove}
                className="flex items-center gap-1 text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2.5 py-1 rounded-full hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
              >
                {chip.label}
                <X className="h-3 w-3" />
              </button>
            ))}
            <button
              onClick={resetFilters}
              className="text-xs text-gray-400 hover:text-red-500 underline transition-colors ml-1"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Results header + Sort */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold dark:text-white">
              {isLoading ? 'Loading...' : `${jobs.length} Jobs Found`}
            </h2>
            {updateStatus && (
              <span className="text-xs font-medium text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2.5 py-1 rounded-full">
                {updateStatus}
              </span>
            )}
          </div>
          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-gray-400 hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="text-sm border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-orange-400 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="match">Best Match</option>
              <option value="salary_high">Salary: High → Low</option>
              <option value="salary_low">Salary: Low → High</option>
            </select>
          </div>
        </div>

        {/* Job Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : sortedJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Briefcase className="h-14 w-14 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">No jobs found</h3>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search query</p>
            {activeChips.length > 0 && (
              <Button variant="outline" size="sm" className="mt-4" onClick={resetFilters}>
                Clear all filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {sortedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
