import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import JobCard from '../components/jobs/JobCard';
import type { JobProps } from '../components/jobs/JobCard';
import JobFilters from '../components/jobs/JobFilter';

// Dummy data for initial UI development
const dummyJobs: JobProps[] = [
  {
    id: '1',
    title: 'Senior React Developer',
    company: 'TechCorp Solutions',
    location: 'Remote',
    salary: '₹18L - ₹25L',
    type: 'Full-time',
    platform: 'LinkedIn',
    matchScore: 92,
    postedAt: '2h ago',
  },
  {
    id: '2',
    title: 'Frontend Engineer (Vue.js)',
    company: 'InnovateHub',
    location: 'Bangalore, India',
    salary: '₹12L - ₹18L',
    type: 'Full-time',
    platform: 'Naukri',
    matchScore: 85,
    postedAt: '5h ago',
  },
  {
    id: '3',
    title: 'Full Stack JavaScript Trainee',
    company: 'StartupX',
    location: 'Mumbai, India',
    type: 'Internship',
    platform: 'Internshala',
    matchScore: 65,
    postedAt: '1d ago',
  },
  {
    id: '4',
    title: 'Node.js Backend Developer',
    company: 'DataFlow Systems',
    location: 'Pune, India',
    salary: '₹15L - ₹22L',
    type: 'Full-time',
    platform: 'Wellfound',
    matchScore: 78,
    postedAt: '2d ago',
  },
  {
    id: '5',
    title: 'Sr. Backend Engineer',
    company: 'CloudScale Inc',
    location: 'Remote',
    salary: '₹20L - ₹30L',
    type: 'Full-time',
    platform: 'Indeed',
    matchScore: 88,
    postedAt: '3h ago',
  },
  {
    id: '6',
    title: 'React Native Developer',
    company: 'AppMakers',
    location: 'Delhi, India',
    salary: '₹10L - ₹15L',
    type: 'Contract',
    platform: 'Shine',
    matchScore: 45,
    postedAt: '4d ago',
  }
];

export default function Jobs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  
  const [jobs, setJobs] = useState<JobProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        // Assuming your backend runs on port 5000 and has a /api/jobs endpoint
        const response = await axios.get('http://localhost:5000/api/jobs');
        
        // Use the fetched jobs, fallback to dummyJobs if empty for UX purposes while testing
        if (response.data && response.data.length > 0) {
           setJobs(response.data);
        } else {
           setJobs(dummyJobs);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        setJobs(dummyJobs); // fallback on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

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
            />
          </div>
          <Button className="h-11 px-8 bg-orange-500 hover:bg-orange-600 text-white">
            Search
          </Button>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold dark:text-white">Recommended Jobs</h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-gray-100">{jobs.length}</span> results
          </div>
        </div>

        {/* Job Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
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
