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
  moreInfo?: MoreInfo;
}

/** A city from the childhood map; `memory` is the text for its "?" pin. */
export interface LifeCity {
  name: string;
  state: string;
  ages: string;
  isHome?: boolean;
  memory?: string;
  photo?: string;
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
  quoteAuthor?: string;
  origin: string;
  stats?: LifeStat[];
  values: LifeValue[];
  cities?: LifeCity[];
  milestones: LifeMilestone[];
  funFacts: string[];
}

/** The story behind an item, shown when a visitor clicks its "?" hotspot. */
export interface MoreInfo {
  problem?: string;
  action: string;
  result?: string;
  link?: string;
  photo?: string;
}

export interface ExperienceHighlight {
  text: string;
  moreInfo?: MoreInfo;
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location?: string;
  type: string;
  highlights: ExperienceHighlight[];
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
  kind?: 'case-competition' | 'engineering-competition' | 'engineering-project' | 'internship' | 'case-study' | 'live-project';
  year?: string;
  role?: string;
  moreInfo?: MoreInfo;
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
  moreInfo?: MoreInfo;
}

export interface HobbyData {
  summary: string;
  hobbies: HobbyItem[];
  creativeQuote?: string;
}

export interface BookItem {
  title: string;
  author: string;
  rating?: number | string; // out of 5, exactly as Divyanshu rated it (e.g. 4.25 or "3.5–4")
  coverColor: string;
  genre: string;
  review?: string; // also the text for the book's "?" box
  favoriteQuote?: string;
  badge?: string;
}

export interface BookstagramData {
  summary: string;
  account?: { name: string; handle: string; url: string };
  booksRead?: number;
  yearlyGoal?: {
    read: number;
    target: number;
    year: number;
  };
  currentlyReading: {
    title: string;
    author: string;
    progress: number; // 0-100%
  }[];
  books: BookItem[];
  genres: string[];
}

export interface TravelDestination {
  city: string;
  country: string;
  year?: string;
  flag: string;
  stops?: string[];
  highlight?: string; // the memory shown on the trip's passport stamp / "?" box
  vibe?: string;
  tags: string[];
  photosUrl?: string; // public Google Photos share link
}

export interface TravelData {
  summary: string;
  countriesVisited?: number;
  citiesExplored?: number;
  nextWishlist?: string[];
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
