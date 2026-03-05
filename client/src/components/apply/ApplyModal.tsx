import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '../ui/dialog';
import { useAuthStore } from '../../store/authStore';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  companyName: string;
}

export default function ApplyModal({ isOpen, onClose, jobTitle, companyName }: ApplyModalProps) {
  const { user } = useAuthStore();
  const [isApplying, setIsApplying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Pre-filled Cover Letter using AI logic (mocked here)
  const defaultCoverLetter = `Dear Hiring Manager at ${companyName},\n\nI am writing to express my strong interest in the ${jobTitle} position. With my background in software development and my technical skill set, I am confident I can make an immediate impact on your team.\n\nThank you for your time and consideration.`;

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplying(true);
    
    // Simulate API call and platform submission
    setTimeout(() => {
      setIsApplying(false);
      setIsSuccess(true);
      
      // Auto close after success
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] flex flex-col items-center justify-center p-8 dark:bg-slate-900 border-none">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-bold dark:text-white mb-2">Application Sent!</h2>
          <p className="text-center text-gray-500">Your application for {jobTitle} at {companyName} has been submitted successfully.</p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] md:h-auto flex flex-col p-0 dark:bg-slate-900 dark:border-slate-800">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl">Apply for {jobTitle}</DialogTitle>
          <DialogDescription>
            Review and edit your application details before submitting to {companyName}.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-grow px-6 py-2">
          <form id="apply-form" onSubmit={handleApply} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium border-b dark:border-slate-800 pb-2">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" defaultValue={user?.name} className="dark:bg-slate-800" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user?.email} className="dark:bg-slate-800" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" defaultValue="+91 9876543210" className="dark:bg-slate-800" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" defaultValue="Bangalore, India" className="dark:bg-slate-800" required />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium border-b dark:border-slate-800 pb-2">Professional Links</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input id="linkedin" type="url" defaultValue="https://linkedin.com/in/" className="dark:bg-slate-800" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portfolio">Portfolio URL</Label>
                  <Input id="portfolio" type="url" className="dark:bg-slate-800" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium border-b dark:border-slate-800 pb-2">Documents</h3>
              <div className="space-y-2">
                <Label>Resume</Label>
                <div className="flex items-center justify-between p-3 border dark:border-slate-700 rounded-md bg-gray-50 dark:bg-slate-800">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                    <span className="text-sm font-medium">{user?.name?.replace(' ', '_')}_Resume.pdf</span>
                  </div>
                  <Button variant="outline" size="sm" type="button" className="h-8 text-xs">
                    Tailor with AI
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="coverLetter">Cover Letter</Label>
                  <span className="text-xs bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 px-2 py-0.5 rounded-full flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    AI Generated
                  </span>
                </div>
                <Textarea 
                  id="coverLetter" 
                  defaultValue={defaultCoverLetter}
                  className="min-h-[150px] dark:bg-slate-800 resize-none font-sans text-sm" 
                  required 
                />
              </div>
            </div>
          </form>
        </ScrollArea>
        
        <DialogFooter className="p-6 pt-2 border-t dark:border-slate-800">
          <Button variant="outline" type="button" onClick={onClose} disabled={isApplying} className="dark:text-white">
            Cancel
          </Button>
          <Button form="apply-form" type="submit" disabled={isApplying} className="bg-orange-500 hover:bg-orange-600 text-white min-w-[140px]">
            {isApplying ? "Submitting..." : "Confirm & Apply"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
