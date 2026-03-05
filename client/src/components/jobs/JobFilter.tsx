import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Slider } from '../ui/slider';

// Dummy platform data matching the spec
const platforms = [
  { id: 'linkedin', label: 'LinkedIn', color: 'bg-[#0A66C2]' },
  { id: 'naukri', label: 'Naukri', color: 'bg-[#9333EA]' },
  { id: 'internshala', label: 'Internshala', color: 'bg-[#16A34A]' },
  { id: 'wellfound', label: 'Wellfound', color: 'bg-black' },
  { id: 'shine', label: 'Shine', color: 'bg-[#EA580C]' },
  { id: 'indeed', label: 'Indeed', color: 'bg-[#003A9B]' },
];

export default function JobFilters() {
  return (
    <div className="space-y-6">
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader className="pb-3 border-b dark:border-slate-700">
          <CardTitle className="text-lg">Filter Jobs</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-6">
          
          {/* Platform Filters */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">Platform</h4>
            <div className="space-y-2">
              {platforms.map((platform) => (
                <div key={platform.id} className="flex items-center space-x-2">
                  <Checkbox id={platform.id} defaultChecked />
                  <Label 
                    htmlFor={platform.id} 
                    className="text-sm font-normal flex items-center gap-2 cursor-pointer"
                  >
                    <span className={`w-2 h-2 rounded-full ${platform.color} dark:border dark:border-slate-600`}></span>
                    {platform.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Job Type Filters */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">Job Type</h4>
            <div className="space-y-2">
              {['Full-time', 'Part-time', 'Internship', 'Freelance'].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox id={`type-${type}`} />
                  <Label htmlFor={`type-${type}`} className="text-sm font-normal cursor-pointer">{type}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">Experience</h4>
            <Select>
              <SelectTrigger className="w-full dark:bg-slate-900">
                <SelectValue placeholder="Any Experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Experience</SelectItem>
                <SelectItem value="fresher">Fresher (0 yrs)</SelectItem>
                <SelectItem value="1-3">1-3 Years</SelectItem>
                <SelectItem value="3-5">3-5 Years</SelectItem>
                <SelectItem value="5+">5+ Years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">Location</h4>
            <Input placeholder="e.g. Bangalore, Remote" className="dark:bg-slate-900" />
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox id="remote-only" />
              <Label htmlFor="remote-only" className="text-sm font-normal cursor-pointer">Remote Only</Label>
            </div>
          </div>

          {/* Salary Match Filter */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">Match Score</h4>
              <span className="text-xs text-orange-500 font-medium">{'>'} 80%</span>
            </div>
            <Slider defaultValue={[80]} max={100} step={1} className="w-full" />
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
