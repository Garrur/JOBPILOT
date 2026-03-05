import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const submitOnboarding = async () => {
    setIsLoading(true);
    try {
      // Future: Submit all onboarding details here
      navigate('/');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold dark:text-white">Welcome, {user?.name || 'User'}!</h1>
        <p className="text-gray-500 mt-2">Let's set up your profile to find the best jobs.</p>
        
        {/* Progress Bar */}
        <div className="mt-6 flex items-center justify-between">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= s ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-500'
              }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`h-1 w-24 sm:w-48 mx-2 ${
                  step > s ? 'bg-orange-500' : 'bg-gray-200 dark:bg-slate-700'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader>
          <CardTitle>
            {step === 1 && "Step 1: Upload Resume"}
            {step === 2 && "Step 2: Basic Profile"}
            {step === 3 && "Step 3: Job Preferences"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Start by uploading your PDF resume. Our AI will parse it automatically."}
            {step === 2 && "Confirm the details we parsed from your resume."}
            {step === 3 && "Tell us what kind of jobs you're looking for."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Step 1 Form */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-10 text-center">
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={handleFileChange} 
                  className="hidden" 
                  id="resume-upload" 
                />
                <Label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                  <div className="bg-orange-100 dark:bg-slate-700 text-orange-500 p-4 rounded-full mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  </div>
                  <span className="text-lg font-medium dark:text-white">
                    {file ? file.name : "Click to select or drag and drop"}
                  </span>
                  <span className="text-sm text-gray-500 mt-1">PDF format (Max. 5MB)</span>
                </Label>
              </div>
            </div>
          )}

          {/* Step 2 Form (Placeholder) */}
          {step === 2 && (
             <div className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label htmlFor="location">Location</Label>
                   <Input id="location" placeholder="e.g., San Francisco, CA" className="dark:bg-slate-900" />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="phone">Phone</Label>
                   <Input id="phone" type="tel" placeholder="(555) 123-4567" className="dark:bg-slate-900" />
                 </div>
               </div>
               <div className="space-y-2">
                 <Label htmlFor="linkedin">LinkedIn URL</Label>
                 <Input id="linkedin" type="url" placeholder="https://linkedin.com/in/username" className="dark:bg-slate-900" />
               </div>
               <div className="space-y-2">
                 <Label>Skills (Comma separated)</Label>
                 <Input className="dark:bg-slate-900" placeholder="React, Node.js, TypeScript" />
                 <p className="text-xs text-gray-500">We'll autofill these from your resume later.</p>
               </div>
             </div>
          )}

          {/* Step 3 Form (Placeholder) */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Desired Roles</Label>
                <Input className="dark:bg-slate-900" placeholder="Frontend Developer, Full Stack Engineer" />
              </div>
              <div className="space-y-2">
                <Label>Job Types</Label>
                <div className="flex space-x-4 mt-2">
                  {['Remote', 'Hybrid', 'On-site'].map(type => (
                    <label key={type} className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                      <span className="text-sm dark:text-gray-300">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t dark:border-slate-700 pt-6">
          <Button 
            variant="outline" 
            onClick={prevStep} 
            disabled={step === 1 || isLoading}
            className="dark:border-slate-600 dark:text-gray-300"
          >
            Back
          </Button>
          
          {step < 3 ? (
            <Button 
              onClick={nextStep} 
              className="bg-orange-500 hover:bg-orange-600 text-white"
              disabled={step === 1 && !file}
            >
              Continue
            </Button>
          ) : (
            <Button 
              onClick={submitOnboarding}
              className="bg-orange-500 hover:bg-orange-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Complete Setup"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
