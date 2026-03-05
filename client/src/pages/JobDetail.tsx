import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { MapPin, Briefcase, IndianRupee, Clock, Building2, CheckCircle2, ChevronLeft, Sparkles } from 'lucide-react';
import ApplyModal from '../components/apply/ApplyModal';

// Dummy data
const jobData = {
  id: '1',
  title: 'Senior React Developer',
  company: 'TechCorp Solutions',
  location: 'Remote',
  salary: '₹18L - ₹25L',
  type: 'Full-time',
  platform: 'LinkedIn',
  matchScore: 92,
  postedAt: '2h ago',
  about: 'TechCorp Solutions is a leading provider of enterprise SaaS products. We are looking for a highly skilled Senior React Developer to join our core engineering team and help build the next generation of our analytics platform.',
  description: 'As a Senior React Developer, you will be responsible for defining the architecture of our frontend applications, mentoring junior developers, and writing clean, maintainable, and highly performant code. You will work closely with product managers and designers to deliver exceptional user experiences.',
  requirements: [
    { text: '5+ years of experience with React.js and modern JavaScript (ES6+)', hasSkill: true },
    { text: 'Deep understanding of React state management (Redux, Zustand, Context)', hasSkill: true },
    { text: 'Experience with TypeScript in large scale applications', hasSkill: true },
    { text: 'Knowledge of testing frameworks (Jest, React Testing Library)', hasSkill: false },
    { text: 'Familiarity with CI/CD pipelines and Webpack/Vite configuration', hasSkill: false },
  ]
};

export default function JobDetail() {
  // Real app: use `id` to fetch the specific job
  const { id } = useParams();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  
  // Dummy effect to satisfy compiler for unused variable temporarily
  useEffect(() => {
    if (id) console.log(`Job Detail View: ${id}`);
  }, [id]);

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
                <div className="flex items-center"><IndianRupee className="w-4 h-4 mr-1 text-gray-400"/> {jobData.salary}</div>
                <div className="flex items-center"><Briefcase className="w-4 h-4 mr-1 text-gray-400"/> {jobData.type}</div>
                <div className="flex items-center"><Clock className="w-4 h-4 mr-1 text-gray-400"/> {jobData.postedAt}</div>
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
            <h2 className="text-lg font-bold mb-4 dark:text-white">About the Company</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
              {jobData.about}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4 dark:text-white">Job Description</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm mb-6">
              {jobData.description}
            </p>
            
            <h3 className="font-semibold mb-3 dark:text-white">Requirements & Skills</h3>
            <ul className="space-y-3">
              {jobData.requirements.map((req, idx) => (
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
                    className="text-orange-500" strokeDasharray={`${jobData.matchScore * 3.51} 351`} />
                </svg>
                <div className="text-center">
                  <span className="text-3xl font-bold dark:text-white">{jobData.matchScore}%</span>
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
        jobTitle={jobData.title}
        companyName={jobData.company}
      />
    </div>
  );
}
