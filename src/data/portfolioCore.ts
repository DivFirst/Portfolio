import type { PortfolioData } from '../types/portfolio';

/**
 * The part of portfolioData the boot screen and the map need right away: name, headline and the 6 islands.
 * Kept apart so the first screen paints without waiting for the full CV (portfolioData.ts re-uses these).
 */
export const portfolioCore: Pick<PortfolioData, 'profile' | 'islands'> = {
  profile: {
    name: "Divyanshu Garg",
    title: "Product Manager | B2B & Platform Strategist | AI Enablement",
    tagline: "Building scalable platform products & exploring GenAI workflows.",
    bio: "Product Manager with an engineering foundation from IIT Ropar and strategic grounding from XLRI, specializing in scalable enterprise FinTech and AI-assisted platform systems. Adept at translating complex technical architectures into high-impact products that drive user adoption and operational efficiency.",
    location: "Mumbai, India",
    status: "Building scalable platform products & exploring GenAI workflows",
    avatarUrl: "/me.jpg", // local copy (public/me.jpg): 400x400, ~21 KB
    avatarWebpUrl: "/me.webp", // same photo, ~13 KB
    resumeUrl: "https://drive.google.com/file/d/1TVY6LS8TpDv1xyjGPLnntFcYQJdX83H3/view?usp=sharing",
    socials: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/divgarg03/", icon: "Linkedin" },
      { label: "GitHub", url: "https://github.com/DivFirst", icon: "Github" },
      { label: "Email", url: "mailto:divgarg03@gmail.com", icon: "Mail" }
    ]
  },

  islands: {
    life: {
      id: "life",
      index: 1,
      name: "My Life",
      subtitle: "Origins, Values & Life Philosophy",
      badge: "Heart of the World",
      accentColor: "#f59e0b", // Warm Amber
      lightColor: "#fef3c7",
      iconName: "Sparkles",
      coordinates: [0, 0, -12.5],
      cameraTarget: [0, 0.5, -12.5],
      cameraPosition: [6.5, 7.5, -5.5],
      minigame: {
        title: "Memory Path Weaver",
        description: "Guide glowing life orbs through memory milestones to unlock hidden reflections and life insights.",
        genre: "Chill Puzzle",
        difficulty: "Casual"
      }
    },
    professional: {
      id: "professional",
      index: 2,
      name: "Professional",
      subtitle: "Career Experience & Technical Mastery",
      badge: "Industry Track",
      accentColor: "#3b82f6", // Royal Blue
      lightColor: "#dbeafe",
      iconName: "Briefcase",
      coordinates: [10.8, 0, -6.25],
      cameraTarget: [10.8, 0.5, -6.25],
      cameraPosition: [17.3, 7.5, 0.75],
      minigame: {
        title: "Sprint Commander",
        description: "Squash priority bugs, brew artisanal espresso, and ship high-velocity deployments under the crunch!",
        genre: "Fast Arcade",
        difficulty: "Normal"
      }
    },
    projects: {
      id: "projects",
      index: 3,
      name: "Projects",
      subtitle: "Code, Products & Creative Experiments",
      badge: "Builder Forge",
      accentColor: "#10b981", // Emerald
      lightColor: "#d1fae5",
      iconName: "Terminal",
      coordinates: [10.8, 0, 6.25],
      cameraTarget: [10.8, 0.5, 6.25],
      cameraPosition: [17.3, 7.5, 13.25],
      minigame: {
        title: "Pipeline Overdrive",
        description: "Route encrypted data packets through microservices and launch serverless rockets into production!",
        genre: "Logic Runner",
        difficulty: "Challenging"
      }
    },
    hobby: {
      id: "hobby",
      index: 4,
      name: "Hobbies",
      subtitle: "Badminton, Music & Fantasy Worlds",
      badge: "Creative Grove",
      accentColor: "#ec4899", // Vivid Pink
      lightColor: "#fce7f3",
      iconName: "Gamepad2",
      coordinates: [0, 0, 12.5],
      cameraTarget: [0, 0.5, 12.5],
      cameraPosition: [6.5, 7.5, 19.5],
      minigame: {
        title: "Polyphony Beats",
        description: "Tap synth chords and groove with lo-fi rhythmic frequencies under neon streetlamps.",
        genre: "Rhythm Action",
        difficulty: "Easy / Fun"
      }
    },
    bookstagram: {
      id: "bookstagram",
      index: 5,
      name: "Bookstagram",
      subtitle: "Fantasy & Sci-Fi Reviews from The Unread Stack",
      badge: "Enchanted Gazebo",
      accentColor: "#8b5cf6", // Mystic Violet
      lightColor: "#ede9fe",
      iconName: "BookOpen",
      coordinates: [-10.8, 0, 6.25],
      cameraTarget: [-10.8, 0.5, 6.25],
      cameraPosition: [-4.3, 7.5, 13.25],
      minigame: {
        title: "Tower of Alexandria",
        description: "Stack falling hardcover books with balance and timing to build an infinitely tall literary citadel.",
        genre: "Physics Balance",
        difficulty: "Relaxing"
      }
    },
    travel: {
      id: "travel",
      index: 6,
      name: "Travel",
      subtitle: "Vietnam & Trips Across India",
      badge: "Wayfarer Camp",
      accentColor: "#06b6d4", // Cyan
      lightColor: "#cffafe",
      iconName: "Compass",
      coordinates: [-10.8, 0, -6.25],
      cameraTarget: [-10.8, 0.5, -6.25],
      cameraPosition: [-4.3, 7.5, 0.75],
      minigame: {
        title: "Skyborne Wayfarer",
        description: "Glide a paper plane through mountain clouds, collecting golden passport stamps and dodging turbulence.",
        genre: "Endless Flyer",
        difficulty: "Normal"
      }
    }
  }
};
