export const kanbanData = {
  columns: [
    { id: 'applied', title: 'Applied', color: 'border-t-blue-500' },
    { id: 'viewed', title: 'Viewed', color: 'border-t-yellow-500' },
    { id: 'shortlisted', title: 'Shortlisted', color: 'border-t-purple-500' },
    { id: 'interview', title: 'Interview Scheduled', color: 'border-t-orange-500' },
    { id: 'offer', title: 'Offer', color: 'border-t-green-500' },
    { id: 'rejected', title: 'Rejected', color: 'border-t-red-500' },
  ],
  items: {
    applied: [
      { id: 'app-1', title: 'Frontend Engineer', company: 'Google', date: '2 days ago', score: 85, platform: 'LinkedIn' },
      { id: 'app-2', title: 'React Developer', company: 'Meta', date: '1 week ago', score: 92, platform: 'Wellfound' }
    ],
    viewed: [
      { id: 'app-3', title: 'SDE II', company: 'Amazon', date: '5 days ago', score: 78, platform: 'Naukri' }
    ],
    shortlisted: [
      { id: 'app-4', title: 'UI/UX Engineer', company: 'Apple', date: '10 days ago', score: 95, platform: 'Indeed' }
    ],
    interview: [
      { id: 'app-5', title: 'Senior Frontend Engineer', company: 'Netflix', date: '2 weeks ago', score: 88, platform: 'LinkedIn' }
    ],
    offer: [],
    rejected: [
      { id: 'app-6', title: 'Full Stack Developer', company: 'Microsoft', date: '3 weeks ago', score: 65, platform: 'Shine' }
    ]
  }
};
