import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { MapPin, Briefcase, IndianRupee, Clock, Building2, CheckCircle2, ChevronLeft, Sparkles } from 'lucide-react';
import ApplyModal from '../components/apply/ApplyModal';

// Interface defining what the backend returns for a job
interface JobDetailData {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  jobType?: string;
  platform: string;
  scrapedAt: string;
  description: string;
}

export default function JobDetail() {
  const { id } = useParams();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [jobData, setJobData] = useState<JobDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Dummy AI Match data for now since backend parser isn't connected to specific users yet
  const aiMatchData = {
    matchScore: 85,
    requirements: [
       { text: 'Required skills found in resume', hasSkill: true },
       { text: 'Relevant professional experience', hasSkill: true },
       { text: 'Location/Remote preference match', hasSkill: false },
    ]
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:5000/api/jobs/${id}`);
        setJobData(response.data);
      } catch (error) {
        console.error("Failed to fetch job details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchJob();
  }, [id]);

  if (isLoading) {
    return (
       <div className="flex justify-center items-center h-64">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
       </div>
    );
  }

  if (!jobData) {
    return (
       <div className="max-w-4xl mx-auto text-center py-20">
         <h2 className="text-2xl font-bold dark:text-white mb-4">Job Not Found</h2>
         <Link to="/jobs"><Button>Back to Jobs</Button></Link>
       </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* Back Button */}
      <Link to="/jobs" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Jobs
      </Link>

      {/* Header Card */}
      <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-2xl flex-shrink-0">
              T
            </div>
            <div>
              <h1 className="text-2xl font-bold dark:text-white">{jobData.title}</h1>
              <div className="flex items-center text-gray-500 mt-1 mb-3">
                <Building2 className="w-4 h-4 mr-1" />
                <span className="font-medium mr-3">{jobData.company}</span>
                <Badge variant="outline" className="bg-[#0A66C2]/10 text-[#0A66C2] border-0">{jobData.platform}</Badge>
              </div>
              <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center"><MapPin className="w-4 h-4 mr-1 text-gray-400"/> {jobData.location}</div>
                <div className="flex items-center"><IndianRupee className="w-4 h-4 mr-1 text-gray-400"/> {jobData.salary || 'Not Specified'}</div>
                <div className="flex items-center"><Briefcase className="w-4 h-4 mr-1 text-gray-400"/> {jobData.jobType || 'Full-time'}</div>
                <div className="flex items-center"><Clock className="w-4 h-4 mr-1 text-gray-400"/> {new Date(jobData.scrapedAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 min-w-[200px]">
            <Button 
              size="lg" 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold"
              onClick={() => setIsApplyModalOpen(true)}
            >
              Apply Now
            </Button>
            <Button variant="outline" className="w-full dark:border-slate-600">Save Job</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4 dark:text-white">Job Description</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm mb-6 whitespace-pre-wrap">
              {jobData.description}
            </p>
            
            <h3 className="font-semibold mb-3 dark:text-white">AI Predicted Requirements</h3>
            <ul className="space-y-3">
              {aiMatchData.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start text-sm">
                  <CheckCircle2 className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${req.hasSkill ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`} />
                  <span className={req.hasSkill ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500'}>{req.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Match Card */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-slate-800 dark:to-slate-800 border border-orange-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-bold dark:text-white">AI Match Analysis</h2>
            </div>
            
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-8 border-orange-100 dark:border-slate-700">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent"
                    className="text-orange-500" strokeDasharray={`${aiMatchData.matchScore * 3.51} 351`} />
                </svg>
                <div className="text-center">
                  <span className="text-3xl font-bold dark:text-white">{aiMatchData.matchScore}%</span>
                  <span className="block text-xs text-gray-500 font-medium">Match Score</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Skills Match</span>
                <span className="font-semibold text-green-500">95%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Experience Match</span>
                <span className="font-semibold text-orange-500">80%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Role Match</span>
                <span className="font-semibold text-green-500">100%</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button variant="outline" className="w-full bg-white dark:bg-slate-900 dark:border-slate-600 text-sm h-9">
                Tailor Resume for this Job
              </Button>
              <Button variant="outline" className="w-full bg-white dark:bg-slate-900 dark:border-slate-600 text-sm h-9">
                Generate Cover Letter
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ApplyModal 
        isOpen={isApplyModalOpen} 
        onClose={() => setIsApplyModalOpen(false)} 
        jobId={jobData.id}
        jobTitle={jobData.title}
        companyName={jobData.company}
      />
    </div>
  );
}
