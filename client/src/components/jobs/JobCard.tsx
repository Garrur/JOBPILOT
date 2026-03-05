import { Badge } from '../ui/badge';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { MapPin, Briefcase, IndianRupee, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface JobProps {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  type: string;
  platform: string;
  matchScore: number;
  postedAt: string;
  companyLogo?: string;
}

const getPlatformColor = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'linkedin': return 'bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90';
    case 'naukri': return 'bg-[#9333EA] text-white hover:bg-[#9333EA]/90';
    case 'internshala': return 'bg-[#16A34A] text-white hover:bg-[#16A34A]/90';
    case 'wellfound': return 'bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black';
    case 'shine': return 'bg-[#EA580C] text-white hover:bg-[#EA580C]/90';
    case 'indeed': return 'bg-[#003A9B] text-white hover:bg-[#003A9B]/90';
    default: return 'bg-gray-500 text-white';
  }
};

export default function JobCard({ job }: { job: JobProps }) {
  return (
    <Card className="hover:shadow-md transition-shadow dark:bg-slate-800 dark:border-slate-700 h-full flex flex-col">
      <CardContent className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-md flex items-center justify-center font-bold text-xl text-gray-500 overflow-hidden">
              {job.companyLogo ? (
                <img src={job.companyLogo} alt={job.company} className="object-cover w-full h-full" />
              ) : (
                job.company.charAt(0)
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg line-clamp-1 dark:text-white" title={job.title}>
                {job.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium">{job.company}</p>
            </div>
          </div>
          <Badge className={`${getPlatformColor(job.platform)} uppercase text-[10px]`}>
            {job.platform}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
          <div className="flex items-center space-x-1.5">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="line-clamp-1">{job.location}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <IndianRupee className="w-4 h-4 text-gray-400" />
            <span className="line-clamp-1">{job.salary || 'Not specified'}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Briefcase className="w-4 h-4 text-gray-400" />
            <span className="line-clamp-1">{job.type}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="line-clamp-1">{job.postedAt}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">AI Match Score</span>
            <span className={`text-sm font-bold ${
              job.matchScore >= 80 ? 'text-green-500' : 
              job.matchScore >= 60 ? 'text-orange-500' : 'text-red-500'
            }`}>
              {job.matchScore}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full ${
                job.matchScore >= 80 ? 'bg-green-500' : 
                job.matchScore >= 60 ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${job.matchScore}%` }}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-gray-50 dark:bg-slate-800/50 border-t dark:border-slate-700 flex justify-between gap-2">
        <Button variant="outline" className="w-1/2 dark:border-slate-600 dark:hover:bg-slate-700">Save</Button>
        <Button asChild className="w-1/2 bg-orange-500 hover:bg-orange-600 text-white">
          <Link to={`/jobs/${job.id}`}>
            View <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
