export type IslandId = 'life' | 'professional' | 'projects' | 'hobby' | 'bookstagram';

export interface SocialLink {
  label: string;
  url: string;
  icon: string;
}

export interface ProfileData {
  name: string;
  tagline: string;
  title: string;
  bio?: string;
  location: string;
  status: string;
  avatarUrl: string;
  resumeUrl: string;
  socials: SocialLink[];
}

export interface IslandMeta {
  id: IslandId;
  index: number;
  name: string;
  subtitle: string;
  badge: string;
  accentColor: string; // Hex color for ground highlights & UI glow
  lightColor: string;
  iconName: string;
  coordinates: [number, number, number]; // [x, y, z] in 3D scene
  cameraTarget: [number, number, number];
  cameraPosition: [number, number, number];
  minigame: {
    title: string;
    description: string;
    genre: string;
    difficulty: string;
  };
}

export interface LifeMilestone {
  year: string;
  title: string;
  subtitle?: string;
  location?: string;
  description: string;
  tag: string;
  highlights?: string[];
  icon?: string;
}

export interface LifeStat {
  label: string;
  value: string;
  subtext?: string;
}

export interface LifeValue {
  title: string;
  description: string;
  icon: string;
}

export interface MyLifeData {
  summary: string;
  quote: string;
  origin: string;
  stats?: LifeStat[];
  values: LifeValue[];
  milestones: LifeMilestone[];
  funFacts: string[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location: string;
  type: string;
  highlights: string[];
  technologies: string[];
}

export interface ProfessionalData {
  summary: string;
  yearsOfExperience: string;
  headline: string;
  experiences: ExperienceItem[];
  coreCompetencies: {
    category: string;
    skills: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
}

export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  featured: boolean;
  githubUrl?: string;
  liveUrl?: string;
  stats?: {
    stars?: number;
    users?: string;
    metric?: string;
  };
}

export interface ProjectsData {
  summary: string;
  projects: ProjectItem[];
}

export interface HobbyItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  currentObsession: string;
  stats: { label: string; value: string }[];
  tags: string[];
}

export interface HobbyData {
  summary: string;
  hobbies: HobbyItem[];
  creativeQuote: string;
}

export interface BookItem {
  title: string;
  author: string;
  rating: number; // 1-5
  coverColor: string;
  genre: string;
  review: string;
  favoriteQuote?: string;
  badge?: string;
}

export interface BookstagramData {
  summary: string;
  yearlyGoal: {
    read: number;
    target: number;
    year: number;
  };
  currentlyReading: {
    title: string;
    author: string;
    progress: number; // 0-100%
  };
  books: BookItem[];
  genres: string[];
}

export interface TravelDestination {
  city: string;
  country: string;
  year: string;
  flag: string;
  highlight: string;
  vibe: string;
  tags: string[];
}

export interface TravelData {
  summary: string;
  countriesVisited: number;
  citiesExplored: number;
  nextWishlist: string[];
  destinations: TravelDestination[];
}

export interface PortfolioData {
  profile: ProfileData;
  islands: Record<IslandId, IslandMeta>;
  life: MyLifeData;
  professional: ProfessionalData;
  projects: ProjectsData;
  hobby: HobbyData;
  bookstagram: BookstagramData;
  travel?: TravelData;
}
