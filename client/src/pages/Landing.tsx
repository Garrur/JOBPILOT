import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Briefcase, Zap, BarChart3, Target, Star, ChevronRight,
  Search, Bell, CheckCircle2, ArrowRight, Moon, Sun, Menu, X
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuthStore } from '../store/authStore';

const FEATURES = [
  {
    icon: <Search className="h-6 w-6" />,
    title: 'Multi-Platform Scraping',
    desc: 'Automatically aggregates jobs from LinkedIn, Naukri, Internshala, Indeed, Wellfound & more — all in one place.',
    color: 'bg-blue-500',
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: 'AI Match Score',
    desc: 'Our AI compares your resume against each job and gives a % match score so you apply to the right roles.',
    color: 'bg-orange-500',
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: 'Application Tracker',
    desc: 'Kanban-style board to track every application from Applied → Interview → Offer. Never lose track again.',
    color: 'bg-purple-500',
  },
  {
    icon: <Bell className="h-6 w-6" />,
    title: 'Smart Alerts',
    desc: 'Get notified when new jobs matching your profile are scraped, or when an application status changes.',
    color: 'bg-green-500',
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: 'Targeted Job Search',
    desc: 'Filter by platform, experience, job type, location, and match score to find exactly what you\'re looking for.',
    color: 'bg-red-500',
  },
  {
    icon: <CheckCircle2 className="h-6 w-6" />,
    title: 'One-Click Apply',
    desc: 'Direct apply links to every job. Easy Apply tags for faster applications.',
    color: 'bg-teal-500',
  },
];

const STATS = [
  { value: '6+', label: 'Job Platforms' },
  { value: '10K+', label: 'Jobs Scraped Daily' },
  { value: '95%', label: 'Match Accuracy' },
  { value: '3×', label: 'Faster Job Search' },
];

const PLATFORMS = ['LinkedIn', 'Naukri', 'Internshala', 'Indeed', 'Wellfound', 'Shine'];

const PLATFORM_COLORS: Record<string, string> = {
  LinkedIn:    'bg-[#0A66C2]',
  Naukri:      'bg-[#9333EA]',
  Internshala: 'bg-[#16A34A]',
  Indeed:      'bg-[#003A9B]',
  Wellfound:   'bg-black',
  Shine:       'bg-[#EA580C]',
};

export default function Landing() {
  const { isAuthenticated } = useAuthStore();
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [count, setCount] = useState(0);

  // Animate the jobs count
  useEffect(() => {
    let start = 0;
    const target = 138;
    const timer = setInterval(() => {
      start += 4;
      setCount(Math.min(start, target));
      if (start >= target) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <div className={`min-h-screen font-sans ${dark ? 'dark bg-slate-950 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
      {/* ── NAV ── */}
      <nav className={`fixed top-0 inset-x-0 z-50 border-b backdrop-blur-lg ${dark ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-orange-500 text-white p-1.5 rounded-lg group-hover:bg-orange-600 transition-colors">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">Job<span className="text-orange-500">Pilot</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-gray-500 hover:text-orange-500 transition-colors">Features</a>
            <a href="#platforms" className="text-sm font-medium text-gray-500 hover:text-orange-500 transition-colors">Platforms</a>
            <a href="#stats" className="text-sm font-medium text-gray-500 hover:text-orange-500 transition-colors">Stats</a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button onClick={() => setDark(!dark)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            {isAuthenticated ? (
              <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
                <Link to="/dashboard">Go to Dashboard <ArrowRight className="h-4 w-4 ml-1" /></Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" className="hidden sm:inline-flex text-sm font-medium">
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white text-sm">
                  <Link to="/register">Sign up free</Link>
                </Button>
              </>
            )}
            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {menuOpen && (
          <div className={`md:hidden p-4 border-t ${dark ? 'bg-slate-950 border-slate-800' : 'bg-white border-gray-100'} flex flex-col gap-3`}>
            <a href="#features" className="text-sm font-medium" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#platforms" className="text-sm font-medium" onClick={() => setMenuOpen(false)}>Platforms</a>
            <a href="#stats" className="text-sm font-medium" onClick={() => setMenuOpen(false)}>Stats</a>
            <div className="flex gap-2 pt-2">
              <Button asChild variant="outline" className="flex-1 text-sm">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm">
                <Link to="/register">Sign up</Link>
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm font-medium px-4 py-1.5 rounded-full border border-orange-100 dark:border-orange-800 mb-6">
            <Zap className="h-3.5 w-3.5" />
            AI-Powered Job Search Platform
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Land Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500"> Dream Job </span>
            <br />Faster with AI
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            JobPilot scrapes jobs from 6+ platforms, scores them against your resume with AI,
            and helps you track every application — all in one beautiful dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 h-12 text-base shadow-lg shadow-orange-200 dark:shadow-orange-900/30">
              <Link to="/register">Get started for free <ChevronRight className="h-5 w-5 ml-1" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-8 h-12 text-base dark:border-slate-700">
              <Link to="/login">Log in to your account</Link>
            </Button>
          </div>

          {/* Live jobs count ticker */}
          <div className="mt-12 flex justify-center">
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl ${dark ? 'bg-slate-800' : 'bg-gray-50'} border ${dark ? 'border-slate-700' : 'border-gray-200'}`}>
              <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-3xl font-bold text-orange-500">{count}+</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">jobs live right now</span>
            </div>
          </div>
        </div>

        {/* Hero visual — mock dashboard cards */}
        <div className="mt-16 relative max-w-4xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/5 to-transparent rounded-3xl" />
          <div className={`rounded-2xl border shadow-2xl overflow-hidden ${dark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}>
            {/* Toolbar */}
            <div className={`flex items-center gap-2 px-4 py-3 border-b ${dark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
              <div className={`flex-1 mx-4 h-5 rounded-full text-xs flex items-center px-3 ${dark ? 'bg-slate-700 text-gray-500' : 'bg-white text-gray-400 border border-gray-200'}`}>
                jobpilot.app/dashboard
              </div>
            </div>
            {/* Mock job cards */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { title: 'Senior React Dev', co: 'TechCorp', loc: 'Remote', score: 92, platform: 'LinkedIn' },
                { title: 'Frontend Engineer', co: 'StartupX', loc: 'Bangalore', score: 85, platform: 'Naukri' },
                { title: 'Full Stack Trainee', co: 'InnoHub', loc: 'Mumbai', score: 72, platform: 'Internshala' },
              ].map((job, i) => (
                <div key={i} className={`rounded-xl p-4 border ${dark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className={`h-8 w-8 rounded-lg ${['bg-blue-500','bg-purple-500','bg-green-500'][i]} flex items-center justify-center text-white text-xs font-bold`}>
                      {job.co[0]}
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${PLATFORM_COLORS[job.platform]}`}>
                      {job.platform}
                    </span>
                  </div>
                  <p className="font-semibold text-sm mb-1 dark:text-white">{job.title}</p>
                  <p className="text-xs text-gray-500 mb-3">{job.co} · {job.loc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">AI Match</span>
                    <span className={`text-sm font-bold ${job.score >= 90 ? 'text-green-500' : job.score >= 80 ? 'text-orange-500' : 'text-yellow-500'}`}>{job.score}%</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden">
                    <div className={`h-full rounded-full ${job.score >= 90 ? 'bg-green-500' : job.score >= 80 ? 'bg-orange-500' : 'bg-yellow-500'}`} style={{ width: `${job.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PLATFORMS ── */}
      <section id="platforms" className={`py-16 ${dark ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-6">Jobs scraped from</p>
          <div className="flex flex-wrap justify-center gap-3">
            {PLATFORMS.map((p) => (
              <span key={p} className={`${PLATFORM_COLORS[p]} text-white font-bold px-5 py-2 rounded-xl text-sm shadow-md`}>
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section id="stats" className="py-20 px-4 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-extrabold text-orange-500">{s.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className={`py-20 ${dark ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold mb-4">Everything you need to<br />get hired faster</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              JobPilot automates the boring parts of job searching so you can focus on what matters — nailing the interview.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className={`rounded-2xl p-6 border ${dark ? 'bg-slate-800 border-slate-700 hover:border-orange-500' : 'bg-white border-gray-100 hover:border-orange-200'} transition-all hover:shadow-lg group`}>
                <div className={`${f.color} text-white h-12 w-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-lg mb-2 dark:text-white">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex mb-6">
            {[...Array(5)].map((_, i) => <Star key={i} className="h-6 w-6 text-yellow-400 fill-yellow-400" />)}
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6">
            Ready to land your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">next great role?</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-10">
            Join thousands of job seekers who found their dream job faster with JobPilot.
          </p>
          <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white text-base px-10 h-13 shadow-xl shadow-orange-200 dark:shadow-orange-900/30">
            <Link to="/register">Create your free account <ArrowRight className="h-5 w-5 ml-2" /></Link>
          </Button>
          <p className="text-sm text-gray-400 mt-4">No credit card required · Free forever</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={`border-t ${dark ? 'border-slate-800 bg-slate-950' : 'border-gray-100 bg-gray-50'} py-8`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 text-white p-1 rounded-lg">
              <Briefcase className="h-4 w-4" />
            </div>
            <span className="font-bold">Job<span className="text-orange-500">Pilot</span></span>
          </div>
          <p className="text-sm text-gray-400">© 2025 JobPilot. Built with ❤️ for job seekers.</p>
          <div className="flex gap-4 text-sm text-gray-400">
            <Link to="/login" className="hover:text-orange-500 transition-colors">Login</Link>
            <Link to="/register" className="hover:text-orange-500 transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
