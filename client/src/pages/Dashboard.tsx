import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Briefcase, Send, CalendarCheck, Star, TrendingUp,
  ArrowRight, LayoutGrid, Clock, CheckCircle2,
  RefreshCw, ChevronRight, Building2, MapPin
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const STATUS_COLORS: Record<string, string> = {
  Applied:    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Interview:  'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Offer:      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Rejected:   'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Saved:      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
};

const PLATFORM_COLORS: Record<string, string> = {
  LinkedIn:    'bg-[#0A66C2] text-white',
  Naukri:      'bg-[#9333EA] text-white',
  Internshala: 'bg-[#16A34A] text-white',
  Wellfound:   'bg-black text-white',
  Indeed:      'bg-[#003A9B] text-white',
  Shine:       'bg-[#EA580C] text-white',
};

export default function Dashboard() {
  const [applications, setApplications] = useState<any[]>([]);
  const [topJobs, setTopJobs] = useState<any[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        const [appsRes, jobsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/applications', { headers }).catch(() => ({ data: [] })),
          axios.get('http://localhost:5000/api/jobs').catch(() => ({ data: [] })),
        ]);
        setApplications(appsRes.data || []);
        const jobs = jobsRes.data || [];
        setTotalJobs(jobs.length);
        // Top jobs: sort by matchScore desc, take 4
        const sorted = [...jobs].sort((a: any, b: any) => (b.matchScore || 0) - (a.matchScore || 0));
        setTopJobs(sorted.slice(0, 4));
      } catch {
        /* silently fail */
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Derive stats from applications — use lowercase for case-insensitive matching
  const s = (status: string) => status?.toLowerCase() || '';
  const stats = {
    applied:   applications.filter(a => s(a.status) === 'applied').length,
    interview: applications.filter(a => s(a.status) === 'interview').length,
    offer:     applications.filter(a => s(a.status) === 'offer').length,
    rejected:  applications.filter(a => s(a.status) === 'rejected').length,
  };
  const recent = [...applications].sort((a, b) =>
    new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
  ).slice(0, 5);

  const STAT_CARDS = [
    {
      label: 'Total Jobs Available',
      value: isLoading ? '—' : totalJobs,
      icon: <Briefcase className="h-5 w-5" />,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-100 dark:border-blue-800',
    },
    {
      label: 'Applications Sent',
      value: isLoading ? '—' : applications.length,
      icon: <Send className="h-5 w-5" />,
      color: 'text-orange-500',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-orange-100 dark:border-orange-800',
    },
    {
      label: 'Interviews Scheduled',
      value: isLoading ? '—' : stats.interview,
      icon: <CalendarCheck className="h-5 w-5" />,
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-100 dark:border-purple-800',
    },
    {
      label: 'Offers Received',
      value: isLoading ? '—' : stats.offer,
      icon: <CheckCircle2 className="h-5 w-5" />,
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-100 dark:border-green-800',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Welcome back! 👋</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Here's what's happening with your job search today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="gap-2 dark:border-slate-700">
            <Link to="/tracker">
              <LayoutGrid className="h-4 w-4" />
              View Tracker
            </Link>
          </Button>
          <Button asChild className="gap-2 bg-orange-500 hover:bg-orange-600 text-white">
            <Link to="/jobs">
              <Briefcase className="h-4 w-4" />
              Browse Jobs
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => (
          <Card key={card.label} className={`border ${card.border} dark:bg-slate-800 dark:border-slate-700`}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                {card.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
                <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Middle Row: Recent Applications + Top Matched Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Applications */}
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardHeader className="pb-3 flex flex-row items-center justify-between border-b dark:border-slate-700">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              Recent Applications
            </CardTitle>
            <Button asChild variant="ghost" size="sm" className="text-xs text-orange-500 hover:text-orange-600">
              <Link to="/tracker">View all <ChevronRight className="h-3 w-3 ml-1" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <RefreshCw className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            ) : recent.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center text-gray-400">
                <Send className="h-10 w-10 mb-2 opacity-30" />
                <p className="text-sm">No applications yet</p>
                <Button asChild size="sm" className="mt-3 bg-orange-500 hover:bg-orange-600 text-white">
                  <Link to="/jobs">Find Jobs →</Link>
                </Button>
              </div>
            ) : (
              <ul className="divide-y dark:divide-slate-700">
                {recent.map((app) => (
                  <li key={app.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {(app.job?.company || app.job?.title || 'J')[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium dark:text-white truncate">{app.job?.title || 'Unknown Role'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{app.job?.company}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${STATUS_COLORS[app.status] || STATUS_COLORS['Applied']}`}>
                      {app.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Top Matched Jobs */}
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardHeader className="pb-3 flex flex-row items-center justify-between border-b dark:border-slate-700">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Star className="h-4 w-4 text-orange-500" />
              Top Matched Jobs
            </CardTitle>
            <Button asChild variant="ghost" size="sm" className="text-xs text-orange-500 hover:text-orange-600">
              <Link to="/jobs">View all <ChevronRight className="h-3 w-3 ml-1" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <RefreshCw className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            ) : topJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center text-gray-400">
                <Briefcase className="h-10 w-10 mb-2 opacity-30" />
                <p className="text-sm">No jobs loaded yet</p>
                <Button asChild size="sm" className="mt-3 bg-orange-500 hover:bg-orange-600 text-white">
                  <Link to="/jobs">Update Jobs →</Link>
                </Button>
              </div>
            ) : (
              <ul className="divide-y dark:divide-slate-700">
                {topJobs.map((job) => (
                  <li key={job.id} className="px-5 py-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-medium dark:text-white truncate">{job.title}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${PLATFORM_COLORS[job.platform] || 'bg-gray-200 text-gray-700'}`}>
                            {job.platform}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{job.company}</span>
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {job.matchScore ? (
                          <span className={`text-sm font-bold ${job.matchScore >= 80 ? 'text-green-500' : job.matchScore >= 60 ? 'text-orange-500' : 'text-gray-400'}`}>
                            {job.matchScore}%
                          </span>
                        ) : null}
                        <Button asChild size="sm" variant="outline" className="h-7 text-xs dark:border-slate-600">
                          <Link to={`/jobs/${job.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Application Pipeline */}
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader className="pb-3 border-b dark:border-slate-700">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-orange-500" />
            Application Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          {isLoading ? (
            <div className="flex justify-center py-6">
              <RefreshCw className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-6 text-gray-400">
              <p className="text-sm">No applications yet. Start applying to jobs!</p>
              <Button asChild size="sm" className="mt-3 bg-orange-500 hover:bg-orange-600 text-white">
                <Link to="/jobs">Find Jobs →</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Applied',   count: stats.applied,   color: 'bg-blue-500',   light: 'bg-blue-100 dark:bg-blue-900/20' },
                { label: 'Interview', count: stats.interview, color: 'bg-purple-500', light: 'bg-purple-100 dark:bg-purple-900/20' },
                { label: 'Offer',     count: stats.offer,     color: 'bg-green-500',  light: 'bg-green-100 dark:bg-green-900/20' },
                { label: 'Rejected',  count: stats.rejected,  color: 'bg-red-500',    light: 'bg-red-100 dark:bg-red-900/20' },
              ].map((stage) => (
                <div key={stage.label} className={`${stage.light} rounded-xl p-4 text-center`}>
                  <p className="text-2xl font-bold dark:text-white">{stage.count}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stage.label}</p>
                  <div className="mt-2 h-1.5 rounded-full bg-white/50 dark:bg-black/20 overflow-hidden">
                    <div
                      className={`h-full ${stage.color} rounded-full transition-all duration-700`}
                      style={{ width: applications.length > 0 ? `${Math.round((stage.count / applications.length) * 100)}%` : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>


      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold dark:text-white mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              to: '/jobs',
              icon: <Briefcase className="h-6 w-6" />,
              title: 'Browse Jobs',
              desc: 'Explore 138+ live job listings',
              color: 'from-orange-500 to-orange-600',
            },
            {
              to: '/tracker',
              icon: <LayoutGrid className="h-6 w-6" />,
              title: 'Application Tracker',
              desc: 'Manage your pipeline',
              color: 'from-blue-500 to-blue-600',
            },
            {
              to: '/profile',
              icon: <Star className="h-6 w-6" />,
              title: 'Update Profile',
              desc: 'Improve your match score',
              color: 'from-purple-500 to-purple-600',
            },
          ].map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className={`bg-gradient-to-br ${action.color} text-white rounded-2xl p-5 flex items-center gap-4 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 group`}
            >
              <div className="bg-white/20 p-3 rounded-xl">{action.icon}</div>
              <div className="flex-1">
                <p className="font-semibold">{action.title}</p>
                <p className="text-sm text-white/75">{action.desc}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-white/60 group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
