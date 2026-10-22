import { PortfolioData } from '../types/portfolio';

export const portfolioData: PortfolioData = {
  profile: {
    name: "Divyanshu Garg",
    title: "Product Manager | B2B & Platform Strategist | AI Enablement",
    tagline: "Building scalable platform products & exploring GenAI workflows.",
    bio: "Product Manager with an engineering foundation from IIT Ropar and strategic grounding from XLRI, specializing in scalable enterprise FinTech and AI-assisted platform systems. Adept at translating complex technical architectures into high-impact products that drive user adoption and operational efficiency.",
    location: "Mumbai, India",
    status: "Building scalable platform products & exploring GenAI workflows",
    avatarUrl: "/me.jpg", // local copy (public/me.jpg): 400x400, ~21 KB
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
  },

  life: {
    summary: "Product Manager with an engineering foundation from IIT Ropar and strategic grounding from XLRI, specializing in scalable enterprise FinTech and AI-assisted platform systems.",
    quote: "We shape our tools, and thereafter our tools shape us.",
    quoteAuthor: "Marshall McLuhan",
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
        subtext: "CAT"
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
        description: "Growing up in 6 cities across 5 states, then living in Punjab, Karnataka, Haryana and Maharashtra for college and work, forged an instinctive ability to thrive in ambiguous, dynamic environments and connect with diverse stakeholders.",
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
    // Childhood map, in order. Ages are as Divyanshu gave them.
    cities: [
      { name: "Ghaziabad", state: "Uttar Pradesh", ages: "Birth – 2", memory: "Where I was born." },
      { name: "Delhi", state: "Delhi", ages: "2 – 4", memory: "Spending Saturday evenings at India Gate with my parents." },
      { name: "Gorakhpur", state: "Uttar Pradesh", ages: "4 – 8", memory: "Getting my first full-sized bicycle and riding it all day through the summer vacations, in the parks of Sahara Estates." },
      { name: "Muzaffarpur", state: "Bihar", ages: "8 – 9", isHome: true, memory: "My hometown. Every weekend we visited my grandparents at Mahanth Maniyary." },
      { name: "Jamnagar", state: "Gujarat", ages: "9 – 10", memory: "Visiting my father's workplace, the Essar Oil refinery at Jamnagar." },
      { name: "Ranchi", state: "Jharkhand", ages: "10 – 18", memory: "The majestic Dasham Falls. Ranchi is also where I prepared for and qualified JEE Advanced, and got into IIT Ropar." }
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
        ],
        moreInfo: {
          action: "Completed ICSE Class X at Bishop Westcott Boys' School, Ranchi.",
          result: "Scored 92.80% and placed 33rd All-India & Abroad among 1,68,546 candidates."
        }
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
        ],
        moreInfo: {
          problem: "School ran 10 AM to 3 PM with a strict 80% attendance rule, coaching followed from 3:30 to 8 PM, and commuting took 2+ hours a day, leaving almost no time for self-study.",
          action: "Turned the daily commute into revision time.",
          result: "Cracked JEE Advanced on my first attempt with AIR 5,515."
        }
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
          "National 1st Runner-Up in the HY Contest by IOCL & the Hydrogen Association of India (hydrogen refuelling station design)",
          "Top 41 Teams nationwide in Flipkart GRID 2.0 Robotics Challenge",
          "Co-developed uBreathe Life air purifier (Patent Pending) with +60% CADR enhancement",
          "Certified SolidWorks Professional (CSWP) & Student Mentor (ISMP)"
        ],
        moreInfo: {
          action: "Captained the badminton team in the intra-college tournament. Event Head at the Advitiya tech fest, running 3 events (CADathon, Invento, SpeeDAC) for 100+ students from 30+ teams. ISMP mentor to 7 first-year students.",
          result: "Badminton team finished 2nd, and I won best player in 2 matches."
        }
      },
      {
        year: "2022 – 2024",
        title: "ICICI Bank — Growth Product Management",
        subtitle: "Manager - 1 / Growth PM | Internet Banking & iMobile Pay",
        location: "Bengaluru, Karnataka",
        description: "Took full ownership as First Person Responsible (FPR) for the Offer Zone platform across web and mobile. Orchestrated data-driven growth experiments and machine learning personalization models, driving substantial uplifts in traffic and transaction volume.",
        tag: "Career",
        icon: "TrendingUp",
        highlights: [
          "Drove a 20% net increase in user traffic (+100,000 monthly visitors) to Offer Zone",
          "Partnered with DSAG to deploy K-means ML personalization, boosting interactions by 40% and CTR by 5%",
          "Led campaigns for IPL 2023, Holi, Diwali, and Christmas & New Year"
        ]
      },
      {
        year: "2024 – 2026",
        title: "XLRI Delhi-NCR — Strategic Mastery & PGDM",
        subtitle: "PGDM in Business Management | Marketing & Strategy Focus",
        location: "Delhi-NCR",
        description: "Pursued management education after scoring 99.60 percentile in CAT and 98.65 percentile in XAT (99.92 percentile in Decision Making). Reached the finals of national case competitions like PwC Challenge 7.0 and DataViz @ IIM Bangalore, and completed a high-impact summer product internship at Centrum Broking.",
        tag: "Postgraduation",
        icon: "Briefcase",
        highlights: [
          "Scored 99.60%ile in CAT (Rank 1,152/2.88L+) & 99.92%ile in XAT Decision Making",
          "Product Management Intern @ Centrum Broking: drafted GenAI roadmap and evaluated MCP trading architectures",
          "Campus Finalist in Airtel iCreate (Top 5% out of 4,400+ teams) & Finalist in DataVIZ at IIM Bangalore",
          "Completed Coursera Digital Product Management Specialization (55+ hrs, Univ. of Virginia)"
        ],
        moreInfo: {
          problem: "Preparing for CAT while working full-time at ICICI Bank.",
          action: "Balanced the job and CAT preparation.",
          result: "Scored 99.60 percentile in CAT (99.61 in Quant) and joined XLRI Delhi-NCR."
        }
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
      "Has rewatched the Lord of the Rings films every year since 2020, and is still afraid the books won't live up to them.",
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
          {
            text: "Cut ingestion turnaround by 95% (2 hrs to 5 mins) with 99.4% accuracy across 21 provider formats by architecting a rule-based extraction engine using AI code synthesis, eliminating manual data entry.",
            moreInfo: {
              problem: "Client portfolio PDFs arrive from many different providers, each in its own format, and the data in them was being extracted by hand.",
              action: "Brainstormed the extraction logic with AI, working out rules for each provider's format, and built a rule-based extraction engine that reads the PDFs automatically.",
              result: "Turnaround fell from 2 hours to 5 minutes, with 99.4% accuracy across 21 provider formats and no manual data entry."
            }
          },
          {
            text: "Delivered 37 feature customisations for Kotak Private's Dubai (DIFC) WMS by authoring 60+ user stories and process flows with Infosys, lifting sprint velocity by 26% & resolving all functional ambiguity pre-UAT.",
            moreInfo: {
              problem: "Infosys's standard Wealth Management System didn't cover everything Kotak needed to run its Dubai (DIFC) branch and serve its clients there.",
              action: "Defined 37 custom requirements for Infosys, writing 60+ user stories and process flows so the team knew exactly what to build.",
              result: "All 37 delivered, sprint velocity up 26%, and no open functional questions left before user acceptance testing."
            }
          },
          {
            text: "Prevented critical launch breakdowns in DIFC WMS by executing an end-to-end QA framework of 700+ test cases (500+ UI, 200+ process), resolving 100+ high-priority defects across trade execution workflows.",
            moreInfo: {
              action: "Ran the full pre-launch testing for the DIFC system: 700+ test cases, 500+ on screens and 200+ on end-to-end processes, across trade execution workflows.",
              result: "100+ high-priority defects found and fixed before launch."
            }
          },
          {
            text: "Compressed regression cycles by 78% (8 hrs to 1 hr) across DIFC WMS by writing 36 automated Playwright test scripts triggered via one-click batch files, enabling instant delta-impact smoke testing across 36 system journeys.",
            moreInfo: {
              problem: "Regression testing was done by hand every second week and took about 8 hours.",
              action: "Wrote 36 automated Playwright test scripts, one per system journey, that run from one-click batch files.",
              result: "A regression run now takes 1 hour instead of 8, and the whole product team uses the scripts."
            }
          }
        ],
        technologies: ["AI Code Synthesis", "Rule-Based Extraction", "Playwright", "QA Frameworks", "User Stories"]
      },
      {
        company: "ICICI Bank",
        role: "Product Manager",
        period: "June 2022 - June 2024",
        location: "Bengaluru, India",
        type: "Full-Time",
        highlights: [
          {
            text: "Orchestrated a 40% increase in user interactions and a 5% CTR improvement by collaborating with data science teams to deploy K-means-driven personalised content delivery.",
            moreInfo: {
              problem: "Every user saw the same Offer Zone content. Then in May 2023 traffic suddenly fell 50%: a bank policy change deprioritised our notifications because we were sending to one huge segment of 1.5 crore users.",
              action: "Worked with the Data Science team on a K-means clustering model of user affinity. They wanted a complex, more accurate model and I pushed for a simpler, faster one, so we agreed on a hybrid. I split users into 8 categories by spending pattern and 6 smaller segments, each with its own notifications.",
              result: "Traffic was back within two months, with 40% more user interactions and a 5% CTR lift."
            }
          },
          {
            text: "Elevated engagement levels by 30% while reducing bounce rates by 12% through comparative analysis of seven competitors and restructuring information architecture.",
            moreInfo: {
              action: "Led a comparison of seven competitors' offer pages and used the findings to restructure the Offer Zone page. Worked with the SEO team to make Offer Zone easier to find.",
              result: "Engagement up 30% and bounce rate down 12%."
            }
          },
          {
            text: "Strengthened retention by 10% and increased page views by 15% by delivering custom campaign experiences across four large-scale initiatives, including IPL 2023 and New Year 2023.",
            moreInfo: {
              action: "Ran four campaign experiences on Offer Zone: IPL 2023, Holi, Diwali, and Christmas & New Year. For IPL I was the only owner on the business side: I worked with the UI/UX team on an IPL-themed design with a pop-up, then with the platform team to launch it.",
              result: "Retention up 10% and page views up 15% across the four campaigns."
            }
          }
        ],
        technologies: ["K-means Personalisation", "Information Architecture", "Campaign Design"]
      },
      {
        company: "Centrum Broking",
        role: "Product Management Intern",
        period: "April 2025 - June 2025",
        location: "Mumbai, India",
        type: "Internship",
        highlights: [
          {
            text: "Championed a cross-functional GenAI enablement roadmap resulting in leadership approval for 10+ automation initiatives following structured discovery and ROI assessment.",
            moreInfo: {
              action: "Studied how GenAI and agentic AI could help a broker, documented 25+ use cases across teams, proposed a multi-agent setup, and presented a 50+ slide business proposition to senior leadership.",
              result: "Leadership approved 10+ automation initiatives, including an agentic AI system that answers and routes customer queries."
            }
          },
          {
            text: "Assessed revenue disruption potential of LLM-powered trading platforms worth USD 5M by performing a technical evaluation of Zerodha Kite MCP and benchmarking 10+ rival MCP solutions.",
            moreInfo: {
              action: "Benchmarked 15+ trading apps across 8 instrument types and 25+ features, then evaluated Zerodha's Kite MCP, which lets AI assistants connect to a trading account, against 10+ rival MCP tools.",
              result: "Sized the opportunity in AI-powered trading at USD 5M."
            }
          }
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
    summary: "Case competitions, engineering projects and product work from IIT Ropar and XLRI.",
    // Results and details come from Divyanshu (interview, Oct 2026) and his own application forms.
    projects: [
      {
        id: "airtel-icreate",
        kind: "case-competition",
        year: "2025",
        title: "Airtel iCreate 2025",
        tagline: "Strategy to grow Airtel broadband across India",
        description: "Built a strategy for increasing the penetration of Airtel broadband connections in India.",
        tags: ["Strategy", "Secondary Research", "Data Analysis"],
        featured: false,
        stats: { metric: "Campus Finalist · Top 5% of 4,400+" },
        moreInfo: {
          problem: "How can Airtel get more Indian households onto its broadband?",
          action: "Built a penetration strategy backed by secondary research and data analysis.",
          result: "Campus Finalist, in the top 5% of 4,400+ teams."
        }
      },
      {
        id: "dataviz-iimb",
        kind: "case-competition",
        title: "DataViz @ IIM Bangalore",
        tagline: "Market-entry plan for EV charging stations",
        description: "Sized the EV and EV-charging market, analysed competitors, and recommended how to enter and set up a charging network.",
        tags: ["Market Sizing", "Competitor Analysis", "Data Visualisation", "EV"],
        featured: false,
        stats: { metric: "Finalist" },
        moreInfo: {
          problem: "How should a new player enter India's EV charging market?",
          action: "Sized the market (EV market CAGR of 92.61% for FY25 to FY28), showed that AC chargers are 75% of the market so fast charging has room to grow, ran SWOT and Porter's Five Forces, and recommended partnering with an EV maker such as Ola and with real-estate and parking operators.",
          result: "Finalist."
        }
      },
      {
        id: "pwc-challenge",
        kind: "case-competition",
        title: "PwC AC India Challenge 7.0",
        tagline: "Choosing the best APAC market for a climate-tech company",
        description: "As team Invictus, picked the most strategic APAC market for ClimateX's expansion and planned a phased entry.",
        tags: ["Market Entry", "Climate Tech", "Decision Framework"],
        featured: false,
        stats: { metric: "Finalist" },
        moreInfo: {
          problem: "Which APAC market should ClimateX expand into, balancing how attractive the market is with how ready the company is to operate there?",
          action: "Built a 7-pillar decision framework mapped to each C-suite leader's concerns, and recommended Vietnam: strong policy push (net zero by 2050), almost no local competition, and cheaper manufacturing. Planned a phased product launch over 3 years, with Vietnam as a regional manufacturing hub.",
          result: "Finalist."
        }
      },
      {
        id: "asian-paints-canvas",
        kind: "case-competition",
        year: "2025",
        title: "Asian Paints Canvas 2025",
        tagline: "Turning Beautiful Homes into a phygital home-décor platform",
        description: "As team Zero to One, designed how Asian Paints could join inspiration, design and delivery into one online-plus-offline home-décor journey.",
        tags: ["Phygital Strategy", "Consumer Research", "AI", "Brand Positioning"],
        featured: false,
        stats: { metric: "Campus Finalist" },
        moreInfo: {
          problem: "People want personalised, reliable, end-to-end home décor, but face scattered services, too many choices and low trust in execution.",
          action: "Interviewed 38 respondents and mapped the journeys of three customer personas. Proposed experience stores, AI-powered design search and cost estimates, a client dashboard for tracking projects, and a brand repositioning campaign (\"Har Ghar Ab Kahega Aapki Kahani\"), with a 36-month roadmap.",
          result: "Campus Finalist."
        }
      },
      {
        id: "sun-pharma-prism",
        kind: "case-competition",
        year: "2025",
        title: "Sun Pharma PRISM 2025",
        tagline: "From awareness to affinity: making Sun Pharma the trusted name",
        description: "As team XLrators, built a plan to make Sun Pharma the most trusted pharma brand for consumers, caregivers and chemists, not just doctors.",
        tags: ["Brand Trust", "Healthcare", "Go-To-Market"],
        featured: false,
        stats: { metric: "Campus Finalist" },
        moreInfo: {
          problem: "Doctors trust Sun Pharma, but in a market full of generics and substitutes, consumer loyalty is fragile.",
          action: "Proposed a \"Sun Suraksha\" trust programme: QR codes on packs so anyone can verify a medicine is genuine, a \"Suraksha Circle\" programme for stockists, a wellness blog and co-branded health camps, rolled out over 18 months to move from \"Promise of Trust\" to \"Proof of Trust\".",
          result: "Campus Finalist."
        }
      },
      {
        id: "itc-interrobang",
        kind: "case-competition",
        title: "ITC Interrobang 15: Sunrise Spices",
        tagline: "Helping a legacy spice brand win new-age consumers",
        description: "Built a brand, product and go-to-market plan to take Sunrise Spices, ITC's West Bengal spice leader, into modern retail, e-commerce and quick commerce.",
        tags: ["Brand Strategy", "Go-To-Market", "Consumer Research", "FMCG"],
        featured: false,
        stats: { metric: "Campus Finalist" },
        moreInfo: {
          problem: "Sunrise leads in traditional West Bengal stores but is seen as a cheaper brand, and younger, more experimental shoppers are moving online.",
          action: "Surveyed 57 respondents, built three consumer personas, and proposed a branded-house architecture with a new sauce range and blended masalas, new packaging, a launch campaign (#GustoYourWay) and a five-year financial estimate.",
          result: "Campus Finalist."
        }
      },
      {
        id: "bajaj-atom",
        kind: "case-competition",
        title: "Bajaj ATOM Season 8",
        tagline: "Taking Bajaj Finserv Health's digital healthcare abroad",
        description: "As team Zero to One, built a go-to-market strategy to take Bajaj Finserv Health's digital healthcare products to the Gulf, Middle East & Africa and Southeast Asia.",
        tags: ["Go-To-Market", "International Expansion", "HealthTech"],
        featured: false,
        stats: { metric: "Quarter Finalist" },
        moreInfo: {
          problem: "How can Bajaj Finserv Health take what it learned in India's fragmented healthcare market to other countries?",
          action: "Mapped each target country's healthcare pain points, such as Indonesia's high out-of-pocket spending and paper-based clinics, to a matching Bajaj product, then set out the competitors, who to sell to, pricing and Bajaj's right to win.",
          result: "Reached the quarter finals."
        }
      },
      {
        id: "thoucentric-bottoms-up",
        kind: "case-competition",
        title: "Thoucentric Bottoms Up",
        tagline: "Winning on service, not price, for a legacy paint brand",
        description: "As team Thou Shalt Know, built a growth strategy for Colorico Paints, a 40-year-old paint brand squeezed by bigger rivals.",
        tags: ["Business Strategy", "Competitor Analysis", "Positioning"],
        featured: false,
        stats: { metric: "Finalist" },
        moreInfo: {
          problem: "Colorico's products looked much like its rivals', it couldn't win a price war with bigger players, and it had no digital presence.",
          action: "Recommended competing on quality of service by building on Colorico's long dealer and painter relationships, building a digital presence to reach younger homeowners, and launching green decorative paints.",
          result: "Finalist."
        }
      },
      {
        id: "salaryse",
        kind: "case-competition",
        title: "SalarySe Case Competition",
        tagline: "Product improvement strategy for a personal-finance app",
        description: "Solo submission: a product strategy to improve financial wellness for SalarySe's users, India's emerging investors.",
        tags: ["Product Strategy", "FinTech", "MVP Planning"],
        featured: false,
        stats: { metric: "Finalist" },
        moreInfo: {
          problem: "Users of personal-finance apps lack spending awareness and struggle to keep good money habits.",
          action: "Designed a single Financial Health Score (0 to 100), personalised learning modules, planning calculators and gamified budgeting, launched as a free MVP first with a premium tier to follow.",
          result: "Finalist."
        }
      },
      {
        id: "flipkart-quick-commerce",
        kind: "case-competition",
        title: "Flipkart Case Competition",
        tagline: "Loyalty and user acquisition for quick commerce",
        description: "As team Prod Xlrators, designed a loyalty programme and user-acquisition plan for Flipkart's quick-commerce business.",
        tags: ["Quick Commerce", "Loyalty", "User Acquisition"],
        featured: false,
        stats: { metric: "Round 2" },
        moreInfo: {
          action: "Sized the quick-commerce market (33.05% CAGR for 2024 to 2027, 52.1 million users, ₹450 average order), built three customer personas, and designed a loyalty programme and a plan to win new users.",
          result: "Reached Round 2."
        }
      },
      {
        id: "reckitt-veet",
        kind: "case-competition",
        title: "Reckitt: Veet Pure",
        tagline: "Relaunching hair-removal cream with a trust-first plan",
        description: "As team Market XLrators, built a go-to-market and digital marketing plan for Veet Pure.",
        tags: ["Go-To-Market", "Digital Marketing", "FMCG"],
        featured: false,
        moreInfo: {
          problem: "Veet's hair-removal cream was losing market share, held back by a negative perception of the category.",
          action: "Proposed openly acknowledging past concerns, proving the new formulation with skin tests, pop-up stores and mall demos, launch offers, and an influencer and media plan with a monthly budget."
        }
      },
      {
        id: "adpilot",
        kind: "case-study",
        title: "AdPilot: AI Ad Co-Pilot for Small Businesses",
        tagline: "Launch a safe ad campaign in under 15 minutes",
        description: "Product case study for Media.net and Pine Labs: an AI-powered, self-serve ad tool for non-technical small businesses, with a working prototype.",
        tags: ["Product Management", "GenAI", "MVP", "AdTech", "Prototype"],
        featured: true,
        liveUrl: "https://ai.studio/apps/drive/1J0ZlOayAvpbSmG-kLZhE54_AWcMy_xbN?fullscreenApplet=true",
        stats: { metric: "Interview shortlist · Media.net & Pine Labs" },
        moreInfo: {
          problem: "Nearly 60% of small businesses have no real digital marketing strategy. Ad jargon confuses them and they fear one wrong click will cost thousands.",
          action: "Defined three user personas, scored 15 features with ICE to pick the MVP (a hard spending cap, a setup wizard that asks business questions instead of technical ones, plain-language insights, typed targeting, AI-made ads), set success metrics, planned a 3-phase rollout, and built a working prototype.",
          result: "Shortlisted for interviews at both Media.net and Pine Labs.",
          link: "https://ai.studio/apps/drive/1J0ZlOayAvpbSmG-kLZhE54_AWcMy_xbN?fullscreenApplet=true"
        }
      },
      {
        id: "swasthiq",
        kind: "live-project",
        title: "SwasthiQ: AI Preventive Healthcare",
        tagline: "Bringing AI-led preventive care to India through insurers and government",
        description: "Solo submission to win a live project with SwasthiQ: a plan to scale AI-driven preventive healthcare in India.",
        tags: ["HealthTech", "AI", "Business Model", "B2G"],
        featured: false,
        stats: { metric: "Final interview" },
        moreInfo: {
          problem: "India's public healthcare is overstretched, with a 38% specialist vacancy rate in public hospitals and overcrowded outpatient departments.",
          action: "Proposed two routes to market: a SaaS licence sold through insurers, who already reward preventive care, and outcome-priced health kiosks for government, procured through the GeM portal and integrated with ABDM.",
          result: "Reached the final interview for the live project."
        }
      },
      {
        id: "vivnovation",
        kind: "live-project",
        title: "Vivnovation Market Research",
        tagline: "Clinical education opportunities in Nepal, Vietnam & the Philippines",
        description: "Market research for Vivnovation, a healthcare ed-tech company exploring expansion into three Asian markets.",
        tags: ["Market Research", "EdTech", "International Expansion"],
        featured: false,
        stats: { metric: "Won the live project" },
        moreInfo: {
          problem: "Where should Vivnovation take its clinical education and internship programmes next?",
          action: "Assessed the market size and growth for clinical education in each country, found gaps in current training, ran a SWOT, and proposed entry points through partnerships, pilots and tech integrations that fit local accreditation.",
          result: "Won the live project with Vivnovation."
        }
      },
      {
        id: "hy-contest",
        kind: "case-competition",
        year: "2019",
        title: "HY Contest 2019",
        tagline: "Hydrogen refuelling station for 100 buses a day in Delhi",
        description: "Designed a hydrogen refuelling station for Delhi in the HY Contest, conducted by IOCL and the Hydrogen Association of India.",
        tags: ["Hydrogen", "Financial Modelling", "Break-even Analysis"],
        featured: true,
        stats: { metric: "National 2nd Prize" },
        moreInfo: {
          problem: "Design a hydrogen refuelling station able to serve 100 buses a day in Delhi.",
          action: "Designed the station and built its financial model and break-even analysis.",
          result: "National 2nd prize, and our team presented the work at the Hydrogen Conference in Mumbai in 2019."
        }
      },
      {
        id: "flipkart-grid",
        kind: "engineering-competition",
        title: "Flipkart GRID 2.0: Intelligent Picking",
        tagline: "Automated warehouse sorting robot",
        description: "Designed an automated warehouse sorting robot as team Mechengers 2.0 from IIT Ropar.",
        tags: ["Robotics", "Automation", "Mechanical Design"],
        featured: true,
        stats: { metric: "Top 41 · Top 1% of 6,000+" },
        // Video approved for later use: "D:\Everything about me\IIT Ropar\Projects\Intelligent Picking\Grid_working.mp4"
        moreInfo: {
          problem: "Design a robot that can sort items in a warehouse automatically.",
          action: "Designed an automated sorting robot with my team, Mechengers 2.0.",
          result: "Top 41 teams nationwide, in the top 1% of 6,000+ teams."
        }
      },
      {
        id: "ubreathe-life",
        kind: "internship",
        title: "uBreathe Life",
        tagline: "Plant-based air purifier (patent pending)",
        description: "Six-month internship at uBreathe, a Gurugram startup, helping design uBreathe Life, a plant-based air purifier.",
        tags: ["Product Design", "Prototyping", "Sustainability"],
        featured: true,
        stats: { metric: "Patent Pending · +60% efficiency" },
        // Text only: uBreathe work is under an NDA, so no CAD images or video.
        moreInfo: {
          problem: "The plant pot had to push air through the plant's roots, which drives the purifier's efficiency. The first design was too complex to make, and 3D-printed prototypes were too rough and too costly.",
          action: "Went back to the drawing board and redesigned the pot so it could be made cheaply in fibreglass.",
          result: "The new design led to the \"Urban Munnar Effect\", a patent-pending technology that raised purification efficiency by over 60%."
        }
      },
      {
        id: "cadathon",
        kind: "engineering-competition",
        title: "CADathon @ IIT Ropar",
        tagline: "Overnight design-and-pitch contest, as a first-year",
        description: "An overnight contest at IIT Ropar's annual tech fest: invent a new product using at least four items from a random list of fifteen, then pitch it to judges.",
        tags: ["Product Design", "CAD", "Pitching"],
        featured: false,
        stats: { metric: "3rd Place" },
        moreInfo: {
          problem: "We were first-years with almost no pitching experience, up against fifteen other teams, most of them postgraduate students.",
          action: "Designed a new product overnight from the random items and pitched it to the panel.",
          result: "3rd place, and the judges praised us for doing it as first-years."
        }
      },
      {
        id: "robowars",
        kind: "engineering-competition",
        title: "RoboWars",
        tagline: "A competitive combat robot on a shoestring budget",
        description: "Built a combat robot for RoboWars despite very limited funding.",
        tags: ["Robotics", "Frugal Engineering"],
        featured: false,
        stats: { metric: "Quarter-finals" },
        moreInfo: {
          problem: "Our team had very little funding to build a robot.",
          action: "Found low-cost ways to build a competitive robot. The next year, I used that experience to convince a group of hesitant first-years to enter, and brainstormed cheap build methods with them.",
          result: "Reached the quarter-finals."
        }
      },
      {
        id: "micro-pin-fin",
        kind: "engineering-project",
        title: "Micro Pin-Fin Heat Sink Research",
        tagline: "Comparing fin shapes for better cooling",
        description: "Research project at IIT Ropar: modelled about a dozen micro pin-fin shapes for heat-sink simulations.",
        tags: ["Heat Transfer", "SolidWorks", "Simulation", "Research"],
        featured: false,
        moreInfo: {
          action: "Modelled micro pin-fin shapes in SolidWorks, including circular, elliptical, staggered, aerofoil, hydrofoil, diamond, droplet, cone, square and piranha, at 600 and 800 micron sizes and 0.8 mm height, ready for heat-transfer simulations."
        }
      },
      {
        id: "vehicle-body",
        kind: "engineering-project",
        year: "2019",
        title: "Vehicle Body & Chassis Design",
        tagline: "CAD and drag simulation for a vehicle shell",
        description: "Designed a vehicle body shell and chassis in SolidWorks and ran aerodynamic drag simulations in ANSYS Fluent.",
        tags: ["SolidWorks", "ANSYS Fluent", "CFD", "Vehicle Design"],
        featured: false,
        moreInfo: {
          action: "Modelled the body shell and chassis in SolidWorks, then simulated airflow in ANSYS Fluent to measure drag on the design."
        }
      }
    ]
  },

  hobby: {
    summary: "Off the clock I'm on a badminton court, singing with my guitar, or deep in a fantasy world.",
    hobbies: [
      {
        id: "badminton",
        name: "Badminton",
        icon: "Trophy",
        description: "My sport since IIT Ropar, where I captained the badminton team. I've kept playing through ICICI, XLRI and now Mumbai.",
        currentObsession: "Playing almost every day in Mumbai",
        stats: [
          { label: "IIT Ropar", value: "Captain · 2nd place" },
          { label: "Plays", value: "Almost daily" }
        ],
        tags: ["Captain", "Daily Player", "Team Sport"],
        moreInfo: {
          action: "Captained the IIT Ropar badminton team in the intra-college tournament, and kept playing through my jobs and B-school.",
          result: "The team finished 2nd and I won best player in 2 matches. Today I play almost every day in Mumbai."
        }
      },
      {
        id: "music",
        name: "Singing & Guitar",
        icon: "Music",
        description: "I sing and play the guitar, and I'm now learning the flute.",
        currentObsession: "Learning the flute",
        stats: [
          { label: "Instruments", value: "Guitar · Flute (learning)" },
          { label: "Also", value: "Vocals" }
        ],
        tags: ["Singing", "Guitar", "Flute"]
      },
      {
        id: "sff",
        name: "Fantasy & Sci-Fi Worlds",
        icon: "Swords",
        description: "I read a lot of science fiction and fantasy, and share honest reactions on my bookstagram, The Unread Stack. I also rewatch the Lord of the Rings films every year.",
        currentObsession: "Reading The Sword of Kaigen and Assassin's Quest",
        stats: [
          { label: "Reads", value: "Sanderson · Hobb · Pierce Brown" },
          { label: "Bookstagram", value: "@theun_readstack" }
        ],
        tags: ["Brandon Sanderson", "Pierce Brown", "M. L. Wang", "Blake Crouch", "Robin Hobb", "John Gwynne", "Sarah J. Maas"]
      }
    ]
  },

  bookstagram: {
    // Source: Divyanshu's reading tracker sheet and his @theun_readstack reel scripts (Oct 2026).
    // Ratings and reviews are his own words; books without a stated rating show none.
    summary: "After about 10 years of not reading for fun, a leg injury that left me bedridden for weeks got me back into books. The Unread Stack is my reading journal: honest, real-time reactions right after each reading session.",
    account: { name: "The Unread Stack", handle: "@theun_readstack", url: "https://www.instagram.com/theun_readstack/" },
    booksRead: 15,
    currentlyReading: [
      { title: "The Sword of Kaigen", author: "M. L. Wang", progress: 90 },
      { title: "Assassin's Quest", author: "Robin Hobb", progress: 20 }
    ],
    genres: ["Epic Fantasy", "Sci-Fi", "LitRPG", "Indian Fantasy", "Literary Fiction", "Mystery"],
    books: [
      {
        title: "Mistborn: The Final Empire",
        author: "Brandon Sanderson",
        coverColor: "#64748b",
        genre: "Epic Fantasy",
        review: "A world where the Dark Lord already won and ash falls from the sky. I fell in love with Allomancy, and the action plays out like a high-octane anime in your head."
      },
      {
        title: "The Well of Ascension",
        author: "Brandon Sanderson",
        rating: "3.5–4",
        coverColor: "#0ea5e9",
        genre: "Epic Fantasy",
        review: "The middle drags with political mind games, but the final 20% is absolutely insane and completely saved the book for me."
      },
      {
        title: "The Hero of Ages",
        author: "Brandon Sanderson",
        rating: 5,
        coverColor: "#f59e0b",
        genre: "Epic Fantasy",
        badge: "Best trilogy ending",
        review: "The most satisfying trilogy conclusion I've ever experienced. Every unanswered question gets resolved, and then a single plot point changes everything."
      },
      {
        title: "The Kite Runner",
        author: "Khaled Hosseini",
        rating: 5,
        coverColor: "#b45309",
        genre: "Literary Fiction",
        review: "Around chapter seven it stops being just a story and turns into a gut punch. A 5-star masterpiece, but respect the emotional toll and don't rush it."
      },
      {
        title: "And Then There Were None",
        author: "Agatha Christie",
        coverColor: "#475569",
        genre: "Mystery"
      },
      {
        title: "Assassin's Apprentice",
        author: "Robin Hobb",
        rating: 4,
        coverColor: "#7c3aed",
        genre: "Epic Fantasy",
        review: "A slow-burn character study. The first 40% is slow, but after the Forge incident it picks up, with an incredible emotional payoff."
      },
      {
        title: "Red Rising",
        author: "Pierce Brown",
        rating: 4.5,
        coverColor: "#dc2626",
        genre: "Sci-Fi",
        review: "Absolute chaos, brutal pacing and an instant hook from page one. Finishing it gave me so much energy I wanted to jump straight into book two."
      },
      {
        title: "The Knife's Edge",
        author: "Matthew Wolf",
        rating: 3.7,
        coverColor: "#0d9488",
        genre: "Fantasy (Indie)",
        review: "Reads like a high-stakes shonen anime in print. Some parts dragged, but it kept getting better as it went."
      },
      {
        title: "Dark Matter",
        author: "Blake Crouch",
        rating: 4.25,
        coverColor: "#1e293b",
        genre: "Sci-Fi Thriller",
        review: "A relentless sci-fi mind-bender you can finish in a weekend. It has plot holes, but the human psychology sold me."
      },
      {
        title: "Golden Son",
        author: "Pierce Brown",
        rating: 5,
        coverColor: "#ca8a04",
        genre: "Sci-Fi",
        review: "Pierce Brown made me care about the very monsters I wanted burned to the ground. The final pages didn't just break the story, they broke me."
      },
      {
        title: "Morning Star",
        author: "Pierce Brown",
        rating: 5,
        coverColor: "#ea580c",
        genre: "Sci-Fi",
        review: "The best writing in the trilogy, even though Golden Son's story felt tighter to me."
      },
      {
        title: "Dungeon Crawler Carl",
        author: "Matt Dinniman",
        rating: 4.5,
        coverColor: "#16a34a",
        genre: "LitRPG",
        badge: "First LitRPG",
        review: "I expected a trashy joke of a book and came out 48 hours later obsessed. Unhinged video-game chaos that gets surprisingly dark."
      },
      {
        title: "Carl's Doomsday Scenario",
        author: "Matt Dinniman",
        coverColor: "#65a30d",
        genre: "LitRPG",
        review: "Felt like a DLC for book one: setup, setup, setup. Still a fun read, and it has me hyped for book three."
      },
      {
        title: "Royal Assassin",
        author: "Robin Hobb",
        coverColor: "#6d28d9",
        genre: "Epic Fantasy",
        review: "This one put me on the Robin Hobb hype train. The good guys never win and you grind your teeth in frustration, but you still can't put it down."
      },
      {
        title: "Rakshas: The Fall of Halcyon",
        author: "M. Ninad",
        coverColor: "#be123c",
        genre: "Indian Fantasy",
        badge: "First Indian fantasy",
        review: "Set in Mumbai, it mixes fantasy, sci-fi and Indian mythology in a way I didn't see coming. The scenery felt thin, but it's a fun, fast story with a fresh concept."
      }
    ]
  },

  travel: {
    // From Divyanshu (interview, Oct 2026). More trips to be added later.
    summary: "From motorbiking the Ha Giang Loop in Vietnam to trips across India: Kasol, Goa, Hampi, Meghalaya, Varkala and Manali.",
    destinations: [
      {
        city: "Northern Vietnam",
        country: "Vietnam",
        year: "2026",
        flag: "🇻🇳",
        stops: ["Hanoi", "Ninh Binh", "Cat Ba Island", "Lan Ha Bay", "Ha Giang Loop"],
        highlight: "The best part was the Ha Giang Loop: our group was strangers from different countries, sharing drinks, singing through the night and riding motorbikes through the mountains.",
        tags: ["Ha Giang Loop", "Motorbikes", "Lan Ha Bay"],
        photosUrl: "https://photos.app.goo.gl/ZTZytufQj8NbDWwC7"
      },
      {
        city: "Kasol",
        country: "India",
        flag: "🇮🇳",
        tags: ["Himachal Pradesh"],
        photosUrl: "https://photos.app.goo.gl/fkCdLpBP8zE7Gj819"
      },
      {
        city: "Goa",
        country: "India",
        flag: "🇮🇳",
        tags: ["Goa"],
        photosUrl: "https://photos.google.com/share/AF1QipPFyNv11GHTWdvQxjZlMYlF5oLohmNzJUei3T03wqFmkcvznkLfeWWMwAcPjIB3iQ?key=Nlo2ZlVvdHVfd2NxY3RUdVotTFBqYlhHc3JKUElR"
      },
      {
        city: "Srisailam & Hampi",
        country: "India",
        flag: "🇮🇳",
        tags: ["Andhra Pradesh", "Karnataka"],
        photosUrl: "https://photos.app.goo.gl/i5jSKkZj3Ygq91vS9"
      },
      {
        city: "Meghalaya",
        country: "India",
        flag: "🇮🇳",
        tags: ["Meghalaya"],
        photosUrl: "https://photos.google.com/share/AF1QipPESBoVRhXPy_1EJxQ50xfmVmf7tfM2LJUMmOpkpY6M7QpiksV5bcUH7TwaYAC_rg?key=OF9LSnhnNkZoUTF2RVR4MXRRN1RWX3A0cGY2LVpB"
      },
      {
        city: "Varkala",
        country: "India",
        flag: "🇮🇳",
        tags: ["Kerala"],
        photosUrl: "https://photos.google.com/share/AF1QipP5frMcZyBOmE81D9SO6GDSjXPSTv91PLBSXpcK87olDWuVROZVh8s4hd8dH1oYxA?key=ZGRRQ3kxVE9ucFRRS1BlWUQ1S3FVSU56WFJ6N21B"
      },
      {
        city: "Manali",
        country: "India",
        flag: "🇮🇳",
        tags: ["Himachal Pradesh"],
        photosUrl: "https://photos.app.goo.gl/Djt6QQt2fKmdQbS27"
      }
    ]
  }
};
