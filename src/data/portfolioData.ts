import { PortfolioData } from '../types/portfolio';

export const portfolioData: PortfolioData = {
  profile: {
    name: "Alex Rivera",
    title: "Full-Stack Engineer & Creative Technologist",
    tagline: "Crafting playful digital experiences, scalable systems, and visual worlds.",
    location: "San Francisco, CA / Remote",
    status: "Exploring high-impact opportunities",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    resumeUrl: "#",
    socials: [
      { label: "GitHub", url: "https://github.com", icon: "Github" },
      { label: "LinkedIn", url: "https://linkedin.com", icon: "Linkedin" },
      { label: "Instagram", url: "https://instagram.com", icon: "Instagram" },
      { label: "Twitter / X", url: "https://twitter.com", icon: "Twitter" },
      { label: "Email", url: "mailto:alex@example.com", icon: "Mail" }
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
      coordinates: [11, 0, -6.3],
      cameraTarget: [11, 0.5, -6.3],
      cameraPosition: [17.5, 7.5, 0.7],
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
      coordinates: [11, 0, 6.3],
      cameraTarget: [11, 0.5, 6.3],
      cameraPosition: [17.5, 7.5, 13.3],
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
      name: "Hobby",
      subtitle: "Music, Visual Arts & Digital Play",
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
      subtitle: "Literary Discoveries, Reviews & Quotes",
      badge: "Enchanted Gazebo",
      accentColor: "#8b5cf6", // Mystic Violet
      lightColor: "#ede9fe",
      iconName: "BookOpen",
      coordinates: [-11, 0, 6.3],
      cameraTarget: [-11, 0.5, 6.3],
      cameraPosition: [-4.5, 7.5, 13.3],
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
      subtitle: "Passport Stamps & Global Expeditions",
      badge: "Summit Basecamp",
      accentColor: "#06b6d4", // Sky Cyan
      lightColor: "#cffafe",
      iconName: "Compass",
      coordinates: [-11, 0, -6.3],
      cameraTarget: [-11, 0.5, -6.3],
      cameraPosition: [-4.5, 7.5, 0.7],
      minigame: {
        title: "Skyborne Wayfarer",
        description: "Glide a paper glider over misty peaks, dodging thunderclouds and collecting golden passport stamps.",
        genre: "Endless Glider",
        difficulty: "Normal"
      }
    }
  },

  life: {
    summary: "Curious builder, continuous learner, and believer in creating tools that empower human creativity.",
    quote: "We shape our tools, and thereafter our tools shape us.",
    origin: "Grew up fascinated by dismantling computers, sketching fantasy maps, and reading sci-fi novels until sunrise.",
    values: [
      {
        title: "Curiosity Over Comfort",
        description: "Constantly diving into unfamiliar domains—whether it's 3D shader math, generative art, or mechanical keyboards.",
        icon: "Compass"
      },
      {
        title: "Craft & Detail",
        description: "The difference between good software and memorable software lives in the micro-interactions, tactile feel, and empathy.",
        icon: "Hammer"
      },
      {
        title: "Playful Exploration",
        description: "Serious engineering doesn't need to be dry. Playfulness is the quickest engine of genuine innovation.",
        icon: "Sparkles"
      },
      {
        title: "Open Knowledge",
        description: "Sharing learning in public, mentoring aspiring developers, and writing honest reflections along the journey.",
        icon: "BookOpen"
      }
    ],
    milestones: [
      {
        year: "Early Spark",
        title: "First Lines of Code",
        description: "Built custom text-based RPGs and customized web forums with HTML, CSS, and rudimentary JavaScript.",
        tag: "Origins"
      },
      {
        year: "2019",
        title: "Graduation & First Startup",
        description: "Earned a B.S. in Computer Science and joined an early-stage fintech team building real-time transaction pipelines.",
        tag: "Career Launch"
      },
      {
        year: "2022",
        title: "Lead Engineer & Public Speaker",
        description: "Promoted to tech lead for design systems and spoke at developer meetups about WebGL and micro-frontends.",
        tag: "Leadership"
      },
      {
        year: "Present",
        title: "Creative Technologist",
        description: "Blending web software architecture with interactive 3D graphics, generative interfaces, and creative writing.",
        tag: "Current Era"
      }
    ],
    funFacts: [
      "Collects vintage mechanical cameras from the 1970s and shoots 35mm film.",
      "Can solve a Rubik's cube in under 45 seconds.",
      "Has brewed pour-over coffee across 14 different countries.",
      "Secretly dreams of building an indie cozy video game."
    ]
  },

  professional: {
    headline: "Senior Software Engineer specializing in Modern Web, Distributed Systems & 3D Interactive Interfaces.",
    summary: "Over 6 years of experience shipping high-traffic client applications, robust APIs, and delighting users with intuitive interactive experiences.",
    yearsOfExperience: "6+ Years",
    experiences: [
      {
        company: "Aether Dynamics",
        role: "Senior Full-Stack Engineer",
        period: "2023 - Present",
        location: "San Francisco, CA (Hybrid)",
        type: "Full-Time",
        highlights: [
          "Architected real-time collaboration canvas serving 150k+ daily active users with 99.98% uptime.",
          "Spearheaded adoption of WebGL/Three.js rendering for spatial visualization, boosting engagement by 42%.",
          "Reduced client bundle size by 38% and achieved sub-800ms First Contentful Paint across all global edge nodes."
        ],
        technologies: ["React", "TypeScript", "Three.js", "Node.js", "PostgreSQL", "Docker", "AWS"]
      },
      {
        company: "Nexus Labs",
        role: "Software Engineer II",
        period: "2021 - 2023",
        location: "New York, NY (Remote)",
        type: "Full-Time",
        highlights: [
          "Developed core microservices for high-throughput financial data streaming processing 20k events/sec.",
          "Mentored 4 junior engineers and organized weekly internal engineering tech talks.",
          "Implemented comprehensive end-to-end testing suite decreasing regression bug escape rate by 60%."
        ],
        technologies: ["TypeScript", "Next.js", "GraphQL", "Redis", "Kafka", "Kubernetes", "Jest"]
      },
      {
        company: "Catalyst Interactive",
        role: "Frontend Developer",
        period: "2019 - 2021",
        location: "Austin, TX",
        type: "Full-Time",
        highlights: [
          "Built responsive UI design system with 60+ accessible components used across 5 enterprise apps.",
          "Collaborated closely with UX designers to prototype interactive animated marketing experiences."
        ],
        technologies: ["React", "Tailwind CSS", "Storybook", "Figma", "Webpack", "REST APIs"]
      }
    ],
    coreCompetencies: [
      {
        category: "Frontend & Creative Tech",
        skills: ["React", "TypeScript", "Three.js / R3F", "Tailwind CSS", "Next.js", "Canvas / WebGL", "State Management"]
      },
      {
        category: "Backend & Cloud Systems",
        skills: ["Node.js", "Python", "PostgreSQL", "Redis", "GraphQL", "Docker", "AWS / Cloudflare"]
      },
      {
        category: "Architecture & Practices",
        skills: ["System Design", "CI/CD Pipelines", "Performance Optimization", "Web Accessibility (a11y)", "Agile Leadership"]
      }
    ],
    education: [
      {
        degree: "B.S. in Computer Science",
        institution: "University of California",
        year: "Class of 2019"
      }
    ]
  },

  projects: {
    summary: "Selected projects spanning interactive 3D web experiments, open-source developer tooling, and productivity applications.",
    projects: [
      {
        id: "chronos-3d",
        title: "Chronos 3D World Engine",
        tagline: "Procedural voxel terrain generator with real-time day/night physics",
        description: "An in-browser 3D procedural terrain engine built with Three.js and WebGL compute shaders. Generates biomes, infinite voxel meshes, and dynamic celestial lighting at 60 FPS.",
        tags: ["Three.js", "WebGL", "TypeScript", "React", "GLSL"],
        featured: true,
        githubUrl: "https://github.com",
        liveUrl: "https://example.com",
        stats: { stars: 320, users: "8.4k", metric: "60 FPS" }
      },
      {
        id: "syntax-flow",
        title: "SyntaxFlow Studio",
        tagline: "Visual node-based API composition & mock testing sandbox",
        description: "Developer canvas tool that allows engineers to visually connect APIs, synthesize mock responses with edge workers, and generate typed client SDKs automatically.",
        tags: ["React", "TypeScript", "Tailwind", "Node.js", "Zustand"],
        featured: true,
        githubUrl: "https://github.com",
        liveUrl: "https://example.com",
        stats: { stars: 850, users: "12k+", metric: "Top 5 PH" }
      },
      {
        id: "aeropulse",
        title: "AeroPulse Telemetry",
        tagline: "Real-time drone telemetry & flight path 3D visualizer",
        description: "Web application rendering live telemetry feeds from autonomous drones on a 3D topographic map with altitude profiles, velocity vectors, and geofence alerts.",
        tags: ["React Three Fiber", "WebSockets", "Mapbox", "Go", "Docker"],
        featured: true,
        githubUrl: "https://github.com",
        liveUrl: "https://example.com",
        stats: { stars: 180, metric: "<15ms latency" }
      },
      {
        id: "lofi-garden",
        title: "Lo-Fi Sound Garden",
        tagline: "Ambient generative audio sanctuary in the browser",
        description: "Interactive sound environment using Web Audio API synthesis to generate soothing rain, pentatonic bells, and vinyl crackle that evolves based on local weather.",
        tags: ["Web Audio API", "Canvas", "Tailwind CSS", "Vite"],
        featured: false,
        githubUrl: "https://github.com",
        liveUrl: "https://example.com",
        stats: { users: "25k+" }
      }
    ]
  },

  hobby: {
    summary: "When stepping away from terminals, you can find me exploring vintage synthesizers, shooting film photography, and gaming.",
    creativeQuote: "Creativity is intelligence having fun.",
    hobbies: [
      {
        id: "music",
        name: "Acoustic & Synth Music",
        icon: "Music",
        description: "Fingerstyle acoustic guitar and tinkering with modular hardware synthesizers. Love crafting cozy ambient tape loops.",
        currentObsession: "Writing a 4-track EP inspired by vintage sci-fi soundtracks",
        stats: [
          { label: "Instruments", value: "Guitar, Synth, Piano" },
          { label: "Favorite Key", value: "D Minor" }
        ],
        tags: ["Acoustic Guitar", "Analog Synths", "Lo-Fi Hip Hop", "Field Recording"]
      },
      {
        id: "photography",
        name: "35mm Film Photography",
        icon: "Camera",
        description: "Capturing fleeting candid moments, golden hour architectural geometry, and misty forest trails on 35mm film stock.",
        currentObsession: "Kodak Portra 400 & Tri-X 400 black & white street snapshots",
        stats: [
          { label: "Primary Gear", value: "Olympus OM-1" },
          { label: "Film Rolls Shot", value: "85+" }
        ],
        tags: ["Analog Film", "Street Photography", "Darkroom Printing", "Golden Hour"]
      },
      {
        id: "gaming",
        name: "Indie Games & Retro Speedrunning",
        icon: "Gamepad2",
        description: "Passionate about atmospheric indie masterworks with brilliant narrative design, environmental storytelling, and tight mechanics.",
        currentObsession: "Hollow Knight, Celeste, Outer Wilds, and Chrono Trigger",
        stats: [
          { label: "Favorite Game", value: "Outer Wilds" },
          { label: "Steam Deck Hours", value: "450+" }
        ],
        tags: ["Indie Games", "Metroidvanias", "Game Dev", "Chiptune"]
      },
      {
        id: "coffee",
        name: "Specialty Coffee Brewing",
        icon: "Coffee",
        description: "Obsessing over brew ratios, water minerality, grind uniformity, and light roast Ethiopian heirloom beans.",
        currentObsession: "Natural process fermented Geisha beans with jasmine notes",
        stats: [
          { label: "Brewer", value: "Hario V60" },
          { label: "Ratio", value: "1:16" }
        ],
        tags: ["Pour Over", "Light Roast", "Hand Grinder", "Cafe Hopping"]
      }
    ]
  },

  bookstagram: {
    summary: "An avid reader exploring thought-provoking sci-fi, philosophical essays, speculative design, and captivating fiction.",
    yearlyGoal: {
      read: 26,
      target: 35,
      year: 2026
    },
    currentlyReading: {
      title: "Klara and the Sun",
      author: "Kazuo Ishiguro",
      progress: 68
    },
    genres: ["Sci-Fi", "Philosophy", "Design", "Literary Fiction", "Tech & Society"],
    books: [
      {
        title: "Exhalation",
        author: "Ted Chiang",
        rating: 5,
        coverColor: "#6366f1",
        genre: "Sci-Fi / Short Stories",
        review: "A breathtaking exploration of entropy, free will, and what it truly means to be conscious. Every story is a masterpiece of philosophical empathy.",
        favoriteQuote: "Contemplate the marvel that is existence, and rejoice that you are able to do so.",
        badge: "All-Time Favorite"
      },
      {
        title: "The Design of Everyday Things",
        author: "Don Norman",
        rating: 5,
        coverColor: "#f59e0b",
        genre: "Design & UX",
        review: "Changed forever how I view doors, light switches, and interactive software interfaces. Essential reading for every builder.",
        favoriteQuote: "Good design is actually a lot harder to notice than poor design, in part because good designs fit our needs so well.",
        badge: "Must Read"
      },
      {
        title: "Tomorrow, and Tomorrow, and Tomorrow",
        author: "Gabrielle Zevin",
        rating: 5,
        coverColor: "#ec4899",
        genre: "Literary Fiction",
        review: "An exquisite love letter to video games, collaborative creativity, long-lasting friendship, and the worlds we build to survive reality.",
        favoriteQuote: "To allow yourself to play with another person is no small risk.",
        badge: "Staff Pick"
      },
      {
        title: "Gödel, Escher, Bach",
        author: "Douglas Hofstadter",
        rating: 5,
        coverColor: "#10b981",
        genre: "Computer Science & Philosophy",
        review: "A monumental journey through recursion, fugues, self-reference, and the emerging nature of mind from mechanical systems.",
        favoriteQuote: "Meaning lies in the relation between the symbols and the reality they represent."
      },
      {
        title: "Project Hail Mary",
        author: "Andy Weir",
        rating: 4.8,
        coverColor: "#06b6d4",
        genre: "Hard Sci-Fi",
        review: "Unabashed scientific optimism, ingenious problem-solving, and one of the most heartwarming friendships in recent fiction history.",
        favoriteQuote: "Amaze! Amaze! Amaze!"
      }
    ]
  },

  travel: {
    summary: "Traversing mountain ridges, bustling night markets, ancient temples, and coastal coastlines around the globe.",
    countriesVisited: 16,
    citiesExplored: 42,
    nextWishlist: ["Kyoto, Japan", "Reykjavik, Iceland", "Patagonia, Chile", "Lofoten, Norway"],
    destinations: [
      {
        city: "Tokyo",
        country: "Japan",
        year: "2024",
        flag: "🇯🇵",
        highlight: "Night strolls through Akihabara alleyways and quiet sunrise tea in Yanaka.",
        vibe: "Neon Cyberpunk meets Zen Tranquility",
        tags: ["Ramen", "Bullet Train", "Arcades", "Architecture"]
      },
      {
        city: "Interlaken & Lauterbrunnen",
        country: "Switzerland",
        year: "2023",
        flag: "🇨🇭",
        highlight: "Hiking beneath 72 roaring waterfalls framed by the towering snowy Jungfrau peaks.",
        vibe: "Alpine Wonderland",
        tags: ["Hiking", "Glaciers", "Fondue", "Cable Cars"]
      },
      {
        city: "Reykjavik & Golden Circle",
        country: "Iceland",
        year: "2023",
        flag: "🇮🇸",
        highlight: "Witnessing the emerald Northern Lights dance across black sand volcanic beaches.",
        vibe: "Primordial Otherworld",
        tags: ["Aurora", "Geysers", "Volcanoes", "Hot Springs"]
      },
      {
        city: "Florence & Tuscany",
        country: "Italy",
        year: "2022",
        flag: "🇮🇹",
        highlight: "Golden sunsets over Ponte Vecchio and studying Renaissance architecture up close.",
        vibe: "Artistic Heritage & Gelato",
        tags: ["Art", "Espresso", "Renaissance", "Hilltop Towns"]
      },
      {
        city: "Banff National Park",
        country: "Canada",
        year: "2021",
        flag: "🇨🇦",
        highlight: "Canoeing across turquoise glacial waters of Lake Moraine under pine-crested peaks.",
        vibe: "Untamed Mountain Wilderness",
        tags: ["Canoeing", "Lakes", "Wildlife", "Campfire"]
      }
    ]
  }
};
