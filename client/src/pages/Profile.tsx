import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { MapPin, Mail, Phone, ExternalLink, Download, Sparkles } from 'lucide-react';

export default function Profile() {
  const { user } = useAuthStore();
  const initials = user?.name?.split(' ').map(n => n[0]).join('') || 'U';

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl border dark:border-slate-700 shadow-sm relative overflow-hidden">
        {/* Decorative background flair */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
        
        <Avatar className="w-24 h-24 border-4 border-white dark:border-slate-800 shadow-md">
          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`} />
          <AvatarFallback className="text-2xl bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">{initials}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2 relative z-10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold dark:text-white">{user?.name || 'John Doe'}</h1>
              <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">Full Stack Developer</p>
            </div>
            <Button variant="outline" className="dark:border-slate-600 hidden md:flex">
              Edit Profile
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-600 dark:text-gray-300 mt-4">
            <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> Bangalore, India</div>
            <div className="flex items-center"><Mail className="w-4 h-4 mr-2" /> {user?.email || 'user@example.com'}</div>
            <div className="flex items-center"><Phone className="w-4 h-4 mr-2" /> +91 98765 43210</div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white dark:bg-slate-800 border dark:border-slate-700 h-12 p-1">
          <TabsTrigger value="overview" className="px-6 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white h-full">Overview</TabsTrigger>
          <TabsTrigger value="resume" className="px-6 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white h-full">Resume & AI</TabsTrigger>
          <TabsTrigger value="preferences" className="px-6 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white h-full">Job Preferences</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Stats */}
            <div className="space-y-6 md:col-span-1">
              <Card className="dark:bg-slate-800 border-none shadow-sm h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Application Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="flex justify-between items-center py-2 border-b dark:border-slate-700">
                    <span className="text-gray-500">Total Applied</span>
                    <span className="font-bold text-lg dark:text-white">42</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b dark:border-slate-700">
                    <span className="text-gray-500">Interviews</span>
                    <span className="font-bold text-lg text-orange-500">5</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-500">Offers</span>
                    <span className="font-bold text-lg text-green-500">1</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* About / Bio */}
            <div className="space-y-6 md:col-span-2">
              <Card className="dark:bg-slate-800 border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Professional Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                    Passionate Full Stack Developer with 4 years of experience building scalable web applications. 
                    Strong expertise in React, Node.js, and modern TypeScript ecosystems. Proven track record of 
                    optimizing performance and delivering high-quality user interfaces. Currently focusing on incorporating 
                    AI into traditional SaaS products.
                  </p>
                  
                  <Separator className="my-6 dark:bg-slate-700" />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm text-gray-500 mb-3">Links</h4>
                      <div className="space-y-2">
                        <a href="#" className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline">
                          <ExternalLink className="w-4 h-4 mr-2" /> LinkedIn Profile
                        </a>
                        <a href="#" className="flex items-center text-sm text-gray-700 dark:text-gray-300 hover:underline">
                          <ExternalLink className="w-4 h-4 mr-2" /> GitHub (johndoe)
                        </a>
                        <a href="#" className="flex items-center text-sm text-orange-600 dark:text-orange-400 hover:underline">
                          <ExternalLink className="w-4 h-4 mr-2" /> Personal Portfolio
                        </a>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-gray-500 mb-3">Top Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'AWS'].map(skill => (
                          <span key={skill} className="px-2.5 py-1 bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300 rounded-md text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Resume & AI Tab */}
        <TabsContent value="resume">
          <Card className="dark:bg-slate-800 border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Resume Management</span>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">Upload New</Button>
              </CardTitle>
              <CardDescription>
                Manage your master resume. Our AI uses this to parse skills and generate custom cover letters.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Resume Card */}
              <div className="p-4 border dark:border-slate-700 rounded-lg flex items-center justify-between bg-gray-50 dark:bg-slate-900/50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-100 text-red-600 dark:bg-red-900/30 flex items-center justify-center rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-medium dark:text-white">John_Doe_Software_Engineer.pdf</h4>
                    <p className="text-xs text-gray-500">Updated 2 months ago • 2.4 MB</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="dark:border-slate-600 text-gray-500"><Download className="w-4 h-4" /></Button>
                  <Button variant="outline" size="sm" className="dark:border-slate-600 text-red-500">Delete</Button>
                </div>
              </div>

              <Separator className="dark:bg-slate-700" />

              {/* AI Features */}
              <div>
                <h3 className="flex items-center font-semibold text-lg mb-4 text-gray-900 dark:text-white">
                  <Sparkles className="w-5 h-5 text-orange-500 mr-2" />
                  AI Document Analysis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border dark:border-slate-700 rounded-lg">
                    <h4 className="font-medium text-sm mb-2 dark:text-white">Extracted Skills Score</h4>
                    <div className="text-2xl font-bold text-green-500 mb-1">Excellent</div>
                    <p className="text-xs text-gray-500">The AI successfully identified 24 technical and 5 soft skills from your document.</p>
                  </div>
                  <div className="p-4 border dark:border-slate-700 rounded-lg">
                    <h4 className="font-medium text-sm mb-2 dark:text-white">ATS Formatting</h4>
                    <div className="text-2xl font-bold text-orange-500 mb-1">Good (85%)</div>
                    <p className="text-xs text-gray-500">Consider simplifying complex tables to improve Applicant Tracking System readability.</p>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card className="dark:bg-slate-800 border-none shadow-sm">
            <CardHeader>
               <CardTitle>Job Preferences</CardTitle>
               <CardDescription>Tell us what you're looking for to improve AI recommendations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-4 max-w-lg pt-4">
                  <div className="space-y-2">
                    <Label>Desired Roles</Label>
                    <Input defaultValue="Frontend Developer, Full Stack Engineer" className="dark:bg-slate-900" />
                  </div>
                  <div className="space-y-2">
                    <Label>Preferred Locations</Label>
                    <Input defaultValue="Bangalore, Remote, Hybrid" className="dark:bg-slate-900" />
                  </div>
                  <div className="space-y-2">
                    <Label>Minimum Target Salary (₹)</Label>
                    <Input type="number" defaultValue="1500000" className="dark:bg-slate-900" />
                  </div>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white mt-4">Save Preferences</Button>
               </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
