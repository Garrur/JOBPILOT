import { create } from 'zustand';

interface FilterState {
  searchQuery: string;
  platforms: string[];
  jobTypes: string[];
  location: string;
  minMatchScore: number;
  experience: string;
  
  setSearchQuery: (query: string) => void;
  togglePlatform: (platform: string) => void;
  toggleJobType: (type: string) => void;
  setLocation: (location: string) => void;
  setMinMatchScore: (score: number) => void;
  setExperience: (exp: string) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  searchQuery: '',
  platforms: ['linkedin', 'naukri', 'internshala', 'wellfound', 'shine', 'indeed'],
  jobTypes: [],
  location: '',
  minMatchScore: 0, // Default to 0 so we see all by default
  experience: 'any',
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  togglePlatform: (platform) => set((state) => {
    const isSelected = state.platforms.includes(platform);
    if (isSelected) {
      return { platforms: state.platforms.filter(p => p !== platform) };
    } else {
      return { platforms: [...state.platforms, platform] };
    }
  }),
  
  toggleJobType: (type) => set((state) => {
    const isSelected = state.jobTypes.includes(type);
    if (isSelected) {
      return { jobTypes: state.jobTypes.filter(t => t !== type) };
    } else {
      return { jobTypes: [...state.jobTypes, type] };
    }
  }),
  
  setLocation: (location) => set({ location }),
  
  setMinMatchScore: (score) => set({ minMatchScore: score }),
  
  setExperience: (experience) => set({ experience }),
  
  resetFilters: () => set({ 
    searchQuery: '', 
    platforms: ['linkedin', 'naukri', 'internshala', 'wellfound', 'shine', 'indeed'], 
    jobTypes: [], 
    location: '', 
    minMatchScore: 0,
    experience: 'any'
  })
}));
