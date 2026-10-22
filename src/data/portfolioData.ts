import { PortfolioData } from '../types/portfolio';

export const portfolioData: PortfolioData = {
  profile: {
    name: "Divyanshu Garg",
    title: "Product Manager | B2B & Platform Strategist | AI Enablement",
    tagline: "Building scalable platform products & exploring GenAI workflows.",
    bio: "Product Manager with an engineering foundation from IIT Ropar and strategic grounding from XLRI, specializing in scalable enterprise FinTech and AI-assisted platform systems. Adept at translating complex technical architectures into high-impact products that drive user adoption and operational efficiency.",
    location: "Mumbai, India",
    status: "Building scalable platform products & exploring GenAI workflows",
    avatarUrl: "https://lh3.googleusercontent.com/d/1Fa3r1kFeYwrd0Wqoy7THDFHaU1vrsRJN",
    resumeUrl: "https://drive.google.com/file/d/14vjMSekZyCbwovDT5DyhKMMmWKzBm-L4/view?usp=sharing",
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
      coordinates: [11.9, 0, -3.9],
      cameraTarget: [11.9, 0.5, -3.9],
      cameraPosition: [18.4, 7.5, 3.1],
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
      coordinates: [7.3, 0, 10.1],
      cameraTarget: [7.3, 0.5, 10.1],
      cameraPosition: [13.8, 7.5, 17.1],
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
      subtitle: "Music, Visual Arts & Digital Play",
      badge: "Creative Grove",
      accentColor: "#ec4899", // Vivid Pink
      lightColor: "#fce7f3",
      iconName: "Gamepad2",
      coordinates: [-7.3, 0, 10.1],
      cameraTarget: [-7.3, 0.5, 10.1],
      cameraPosition: [-0.8, 7.5, 17.1],
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
      coordinates: [-11.9, 0, -3.9],
      cameraTarget: [-11.9, 0.5, -3.9],
      cameraPosition: [-5.4, 7.5, 3.1],
      minigame: {
        title: "Tower of Alexandria",
        description: "Stack falling hardcover books with balance and timing to build an infinitely tall literary citadel.",
        genre: "Physics Balance",
        difficulty: "Relaxing"
      }
    }
  },

  life: {
    summary: "Product Manager with an engineering foundation from IIT Ropar and strategic grounding from XLRI, specializing in scalable enterprise FinTech and AI-assisted platform systems.",
    quote: "We shape our tools, and thereafter our tools shape us.",
    origin: "A nomadic childhood shaped by my father's career transfers across India—growing up between Ghaziabad, Delhi, Gorakhpur, Muzaffarpur, Jamnagar, and Ranchi. Moving constantly taught me rapid adaptability, deep empathy for different cultures, and an innate curiosity for how complex systems and communities interact.",
    stats: [
      {
        label: "Cities Lived In",
        value: "6+",
        subtext: "Nomadic upbringing across India"
      },
      {
        label: "Alma Maters",
        value: "IIT & XLRI",
        subtext: "Engineering + Strategy grounding"
      },
      {
        label: "Competitive Edge",
        value: "99.6 %ile",
        subtext: "CAT Quant & 99.92%ile XAT DM"
      },
      {
        label: "Experience",
        value: "~3 Yrs",
        subtext: "FinTech, Platforms & AI Enablement"
      }
    ],
    values: [
      {
        title: "Adaptability & Empathy",
        description: "Moving across 6 states forged an instinctive ability to thrive in ambiguous, dynamic environments and connect with diverse stakeholders.",
        icon: "Compass"
      },
      {
        title: "Systems Thinking",
        description: "Bridging deep IIT engineering principles with XLRI business strategy to architect resilient, scalable platform solutions.",
        icon: "Cpu"
      },
      {
        title: "First Person Responsibility",
        description: "True product leadership is about extreme ownership—taking accountability from early concept to production telemetry and customer delight.",
        icon: "ShieldCheck"
      },
      {
        title: "Continuous Exploration",
        description: "Relentlessly exploring emerging frontiers—from mechanical robotics and CAD to ML personalization and autonomous GenAI workflows.",
        icon: "Sparkles"
      }
    ],
    milestones: [
      {
        year: "2000 – 2016",
        title: "Nomadic Roots & Academic Spark",
        subtitle: "Class X ICSE — 92.80% | 33rd All-India & Abroad Merit Rank",
        location: "Ghaziabad → Delhi → Gorakhpur → Muzaffarpur → Jamnagar → Ranchi",
        description: "Traversed six cities across India due to father's transfers, developing resilience, quick cultural adaptation, and a love for science and technology. Completed ICSE Class X at Bishop Westcott Boys' School, Ranchi, securing the 33rd merit rank nationwide.",
        tag: "Foundations",
        icon: "MapPin",
        highlights: [
          "Lived across 6 distinct regions of India, adapting to varied schools and communities",
          "Ranked 33rd All-India & Abroad in ICSE Class X (1.68L+ candidates)"
        ]
      },
      {
        year: "2016 – 2018",
        title: "Senior School & Cracking JEE",
        subtitle: "Class XII CBSE (88.60%) | JEE Advanced AIR 5,515",
        location: "Ranchi, Jharkhand",
        description: "Completed senior secondary education in the Science stream at Jawahar Vidya Mandir (JVM), Shyamali, Ranchi. Concurrently prepared for and conquered the Joint Entrance Examination, securing AIR 5,515 in JEE Advanced and 98.41 percentile in JEE Mains.",
        tag: "Milestone",
        icon: "Award",
        highlights: [
          "AIR 5,515 in JEE Advanced (Top 2.4% out of 2.31L+ candidates)",
          "98.41 percentile in JEE Mains (10.4L+ applicants)"
        ]
      },
      {
        year: "2018 – 2022",
        title: "IIT Ropar — Engineering & Innovation",
        subtitle: "B.Tech in Mechanical Engineering | CGPA 8.01 / 10.00",
        location: "Rupnagar, Punjab",
        description: "Deepened engineering problem-solving across robotics, product design, and sustainable technologies. Certified as SolidWorks Professional (CSWP). Patented 'uBreathe Life' plant-based air purifier with Urban Munnar Effect (+60% CADR). Captained the intra-college badminton team and served as Tech Fest Event Head.",
        tag: "Alma Mater",
        icon: "GraduationCap",
        highlights: [
          "National 1st Runner-Up in National HY Contest (Hydrogen refueling station model for IOCL)",
          "Top 41 Teams nationwide in Flipkart GRID 2.0 Robotics Challenge",
          "Co-developed uBreathe Life air purifier (Patent Pending) with +60% CADR enhancement",
          "Certified SolidWorks Professional (CSWP) & Student Mentor (ISMP)"
        ]
      },
      {
        year: "2022 – 2024",
        title: "ICICI Bank — Growth Product Management",
        subtitle: "Manager - 1 / Growth PM | Internet Banking & iMobile Pay",
        location: "Mumbai, Maharashtra",
        description: "Took full ownership as First Person Responsible (FPR) for the Offer Zone platform across web and mobile. Orchestrated data-driven growth experiments and machine learning personalization models, driving substantial uplifts in traffic and transaction volume.",
        tag: "Career",
        icon: "TrendingUp",
        highlights: [
          "Drove a 20% net increase in user traffic (+100,000 monthly visitors) to Offer Zone",
          "Partnered with DSAG to deploy K-means ML personalization, boosting interactions by 40% and CTR by 5%",
          "Eliminated 85% of production errors through automated health checks and better chatbot intent classification",
          "Led marquee campaigns for IPL 2023, New Year, and Apple App Store (75+ partner offers/month)"
        ]
      },
      {
        year: "2024 – 2026",
        title: "XLRI Delhi-NCR — Strategic Mastery & PGDM",
        subtitle: "PGDM in Business Management | Marketing & Strategy Focus",
        location: "Delhi-NCR",
        description: "Pursued management education after scoring 99.60 percentile in CAT and 98.65 percentile in XAT (99.92 percentile in Decision Making). Led campus teams to podium finishes in marquee national case competitions and completed a high-impact summer product internship at Centrum Broking.",
        tag: "Postgraduation",
        icon: "Briefcase",
        highlights: [
          "Scored 99.60%ile in CAT (Rank 1,152/2.88L+) & 99.92%ile in XAT Decision Making",
          "Product Management Intern @ Centrum Broking: drafted GenAI roadmap and evaluated MCP trading architectures",
          "Campus Finalist in Airtel iCreate (Top 5% out of 4,000+ teams) & National Top 6 in DataVIZ at IIM Bangalore",
          "Completed Coursera Digital Product Management Specialization (55+ hrs, Univ. of Virginia)"
        ]
      },
      {
        year: "2026 – Present",
        title: "Kotak Private — Scaling Wealth Platforms",
        subtitle: "Senior Product Manager / Senior Manager (M4)",
        location: "Mumbai, Maharashtra",
        description: "Leading wealth management platform modernization within Support Services - Applications - CTB. Spearheading core system journeys, international wealth platform customization for Dubai (DIFC), and architecting AI-driven automation workflows.",
        tag: "Current Role",
        icon: "ShieldAlert",
        highlights: [
          "Architected AI code synthesis ingestion engine slashing turnaround by 95% (2 hrs to 5 mins) with 99.4% accuracy",
          "Spearheaded Dubai (DIFC) Wealth Management System customization with Infosys, boosting sprint velocity by 26%",
          "Engineered 36 automated Playwright regression scripts, compressing testing cycles by 78% (8 hrs to 1 hr)",
          "Executed comprehensive QA framework across 700+ test cases to secure mission-critical trade execution"
        ]
      },
      {
        year: "Now & Beyond",
        title: "The Horizon — AI-Enabled Platform Frontier",
        subtitle: "Building at the Intersection of Systems, Strategy & GenAI",
        location: "Mumbai, India",
        description: "Continuously pushing the envelope in product architecture. Exploring autonomous agentic frameworks, Model Context Protocol (MCP) integrations, and intelligent developer tooling to create the next generation of intuitive, high-leverage software.",
        tag: "Vision",
        icon: "Sparkles",
        highlights: [
          "Building scalable platform systems with deep focus on developer experience and user adoption",
          "Prototyping autonomous multi-agent workflows and local AI tooling",
          "Mentoring aspiring product managers and engineers navigating tech transitions"
        ]
      }
    ],
    funFacts: [
      "Intra-college badminton team captain at IIT Ropar; represented the institute at the URJA Sports Fest.",
      "Devoted fantasy lore enthusiast and audiobook collector—regularly re-listens to Tolkien's The Lord of the Rings.",
      "Scored a near-perfect 99.92 percentile in XAT Decision Making, reflecting a natural passion for complex game-theoretic dilemmas.",
      "Hands-on mechanical maker: designed and rapid-prototyped a 3D-printed manual transmission gearbox."
    ]
  },

  professional: {
    // Source of truth: "D:\Everything about me\Resume\Latest\Divyanshu Garg Resume.pdf"
    headline: "Data-driven Product Manager with ~3 years of experience across wealth management & retail banking.",
    summary: "Combines an engineering foundation from IIT Ropar with strategic execution from XLRI to scale mission-critical platforms. Proven track record of cutting ingestion latency by 95% via AI-assisted extraction and leveraging machine-learning personalisation to drive double-digit engagement growth.",
    yearsOfExperience: "~3 Years",
    experiences: [
      {
        company: "Kotak Private",
        role: "Sr. Product Manager",
        period: "June 2026 - Present",
        location: "Mumbai, India",
        type: "Full-Time",
        highlights: [
          "Cut ingestion turnaround by 95% (2 hrs to 5 mins) with 99.4% accuracy across 21 provider formats by architecting a rule-based extraction engine using AI code synthesis, eliminating manual data entry.",
          "Delivered 37 feature customisations for Kotak Private's Dubai (DIFC) WMS by authoring 60+ user stories and process flows with Infosys, lifting sprint velocity by 26% & resolving all functional ambiguity pre-UAT.",
          "Prevented critical launch breakdowns in DIFC WMS by executing an end-to-end QA framework of 700+ test cases (500+ UI, 200+ process), resolving 100+ high-priority defects across trade execution workflows.",
          "Compressed regression cycles by 78% (8 hrs to 1 hr) across DIFC WMS by writing 36 automated Playwright test scripts triggered via one-click batch files, enabling instant delta-impact smoke testing across 36 system journeys."
        ],
        technologies: ["AI Code Synthesis", "Rule-Based Extraction", "Playwright", "QA Frameworks", "User Stories"]
      },
      {
        company: "ICICI Bank",
        role: "Product Manager",
        period: "June 2022 - June 2024",
        location: "Mumbai, India",
        type: "Full-Time",
        highlights: [
          "Orchestrated a 40% increase in user interactions and a 5% CTR improvement by collaborating with data science teams to deploy K-means-driven personalised content delivery.",
          "Elevated engagement levels by 30% while reducing bounce rates by 12% through comparative analysis of seven competitors and restructuring information architecture.",
          "Accelerated mobile adoption by raising app installs by 10% and in-app activity by 30% through launch of interactive UI elements and focused app store optimisation.",
          "Eliminated 85% of production errors by introducing automated system health checks and enhancing chatbot intent classification to automate 80% of routine support flows.",
          "Strengthened retention by 10% and increased page views by 15% by delivering custom campaign experiences across four large-scale initiatives, including IPL 2023 and New Year 2023."
        ],
        technologies: ["K-means Personalisation", "Intent Classification", "Information Architecture", "App Store Optimisation"]
      },
      {
        company: "Centrum Broking",
        role: "Product Management Intern",
        period: "April 2025 - June 2025",
        // location: not on resume (ask Divyanshu)
        type: "Internship",
        highlights: [
          "Championed a cross-functional GenAI enablement roadmap resulting in leadership approval for 10+ automation initiatives following structured discovery and ROI assessment.",
          "Assessed revenue disruption potential of LLM-powered trading platforms worth USD 5M by performing a technical evaluation of Zerodha Kite MCP and benchmarking 10+ rival MCP solutions."
        ],
        technologies: ["GenAI", "LLMs", "Zerodha Kite MCP", "ROI Assessment"]
      }
    ],
    coreCompetencies: [
      {
        category: "Product Strategy & Execution",
        skills: ["Product Vision & Roadmap", "Feature Prioritisation", "Requirement Definition (PRDs/User Stories)", "Agile & Scrum", "Sprint Planning", "Release Management", "Go-to-Market (GTM) Strategy", "Cross-Functional Leadership"]
      },
      {
        category: "Data Analytics & Growth",
        skills: ["Data Analysis (SQL, Excel)", "Funnel & Cohort Analysis", "A/B Testing & Experimentation", "Personalisation Engines", "Product Metrics & KPIs", "App Store Optimisation (ASO)"]
      },
      {
        category: "User Research & Product Design",
        skills: ["User Research (Qual & Quant)", "User Journey Mapping", "Wireframing & Prototyping", "Information Architecture", "Design Thinking", "Usability Testing"]
      },
      {
        category: "Technical & AI Enablement",
        skills: ["System Architecture & Integration", "AI/ML Product Integration (LLMs, GenAI, Intent Classification)", "Automated Testing & QA Frameworks", "Technical Feasibility & ROI Evaluation"]
      },
      {
        category: "Tools & Platforms",
        skills: ["Azure DevOps", "Jira", "Figma", "Balsamiq", "Tableau", "Power BI", "Google Analytics", "SQL", "Playwright", "ChatGPT", "Claude", "Gemini", "Notion", "Aha!"]
      }
    ],
    education: [
      {
        degree: "PGDM - BM, Marketing & Strategy",
        institution: "XLRI Delhi-NCR",
        year: "June 2024 - Feb 2026"
      },
      {
        degree: "B.Tech., Mechanical Engineering",
        institution: "IIT Ropar",
        year: "June 2018 - May 2022"
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
