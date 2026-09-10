/**
 * SkillSwap Default Seed Data
 * Provides diverse, realistic profiles across tech, arts, languages, business, and music.
 */

const DEFAULT_CATEGORIES = [
  { id: "all", name: "All Categories", icon: "sparkles" },
  { id: "tech", name: "Tech & Code", icon: "code" },
  { id: "design", name: "Design & Creative", icon: "palette" },
  { id: "languages", name: "Languages", icon: "globe" },
  { id: "business", name: "Business & Growth", icon: "trending-up" },
  { id: "music", name: "Music & Audio", icon: "music" },
  { id: "wellness", name: "Wellness & Lifestyle", icon: "heart" }
];

const INITIAL_SWAPS = [
  {
    id: "swap-1",
    name: "Elena Rostova",
    title: "Senior Full-Stack Engineer",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    category: "tech",
    rating: 4.95,
    swapsCompleted: 34,
    location: "Berlin (UTC+2) • Virtual",
    bio: "Passionate about modern web architecture and functional programming. Looking to level up my conversational Italian for an upcoming work trip!",
    teaches: [
      { skill: "React & Next.js", level: "Expert" },
      { skill: "TypeScript", level: "Advanced" },
      { skill: "Node.js API Design", level: "Advanced" }
    ],
    wants: [
      { skill: "Italian (Conversational)", level: "Beginner" },
      { skill: "Public Speaking", level: "Any" }
    ],
    availability: "Evenings & Weekends (2 hrs/wk)",
    featured: true
  },
  {
    id: "swap-2",
    name: "Marcus Vance",
    title: "Brand Strategist & Product Designer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    category: "design",
    rating: 4.9,
    swapsCompleted: 28,
    location: "Toronto (UTC-4) • Virtual",
    bio: "10+ years shaping tech brands and building high-converting design systems. I want to understand Python for data visualization & generative art.",
    teaches: [
      { skill: "Figma & Design Systems", level: "Expert" },
      { skill: "UI/UX Strategy", level: "Advanced" },
      { skill: "Brand Storytelling", level: "Master" }
    ],
    wants: [
      { skill: "Python for Data", level: "Beginner" },
      { skill: "Webflow", level: "Intermediate" }
    ],
    availability: "Flexible weekdays (1-2 hrs/wk)",
    featured: true
  },
  {
    id: "swap-3",
    name: "Sofia Chen",
    title: "Certified Polyglot & Cultural Coach",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    category: "languages",
    rating: 5.0,
    swapsCompleted: 52,
    location: "Kyoto (UTC+9) • Virtual",
    bio: "Native Mandarin & fluent Japanese speaker. I love immersive teaching methods. In exchange, I need hands-on help building my personal newsletter & SEO.",
    teaches: [
      { skill: "Mandarin Chinese", level: "Native" },
      { skill: "Japanese (JLPT Prep)", level: "Fluent" },
      { skill: "Language Learning Hacks", level: "Expert" }
    ],
    wants: [
      { skill: "SEO & Content Marketing", level: "Beginner" },
      { skill: "Video Editing (Premiere)", level: "Beginner" }
    ],
    availability: "Mornings UTC / Weekends",
    featured: true
  },
  {
    id: "swap-4",
    name: "David Kalu",
    title: "Venture Associate & Financial Modeler",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    category: "business",
    rating: 4.88,
    swapsCompleted: 19,
    location: "London (UTC+1) • Virtual",
    bio: "Ex-consultant teaching startup financial modeling and fundraising pitch deck preparation. Wanting to learn acoustic fingerstyle guitar from scratch.",
    teaches: [
      { skill: "Financial Modeling", level: "Expert" },
      { skill: "Pitch Deck Structuring", level: "Advanced" },
      { skill: "Excel Automation", level: "Master" }
    ],
    wants: [
      { skill: "Acoustic Guitar", level: "Absolute Beginner" },
      { skill: "Music Theory Basics", level: "Beginner" }
    ],
    availability: "Saturday & Sunday mornings",
    featured: false
  },
  {
    id: "swap-5",
    name: "Maya Lin-Borges",
    title: "Indie Music Producer & Audio Engineer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    category: "music",
    rating: 4.96,
    swapsCompleted: 41,
    location: "Austin (UTC-5) • Virtual",
    bio: "Mixing, mastering, and Ableton Live wizardry. Can teach you beat making, synth patch design, or vocal mixing. Seeking digital marketing or personal branding guidance!",
    teaches: [
      { skill: "Ableton Live & Production", level: "Expert" },
      { skill: "Vocal Mixing & Mastering", level: "Advanced" },
      { skill: "Sound Design", level: "Advanced" }
    ],
    wants: [
      { skill: "Social Media Growth", level: "Beginner" },
      { skill: "Personal Branding", level: "Intermediate" }
    ],
    availability: "Weekday afternoons / Weekends",
    featured: true
  },
  {
    id: "swap-6",
    name: "Liam O'Connor",
    title: "Cloud Architect & DevOps Specialist",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
    category: "tech",
    rating: 4.92,
    swapsCompleted: 23,
    location: "Dublin (UTC+0) • Virtual",
    bio: "Kubernetes, Docker, AWS infrastructure as code. Let's make your deployments seamless! Eager to learn French for my family relocation.",
    teaches: [
      { skill: "Docker & Kubernetes", level: "Expert" },
      { skill: "AWS & Terraform", level: "Master" },
      { skill: "CI/CD Pipelines", level: "Advanced" }
    ],
    wants: [
      { skill: "French (A2-B1)", level: "Beginner" },
      { skill: "Espresso Brewing & Latte Art", level: "Curious" }
    ],
    availability: "Tuesday & Thursday evenings",
    featured: false
  },
  {
    id: "swap-7",
    name: "Amara Nwosu",
    title: "Holistic Nutritionist & Mindfulness Coach",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80",
    category: "wellness",
    rating: 4.98,
    swapsCompleted: 60,
    location: "New York (UTC-4) • Virtual",
    bio: "Helping busy professionals conquer burnout, optimize gut health, and establish meditation rituals. Wanting to learn UI design basics to overhaul my wellness app.",
    teaches: [
      { skill: "High-Performance Nutrition", level: "Master" },
      { skill: "Mindfulness & Stress Relief", level: "Expert" },
      { skill: "Ergonomics & Habit Design", level: "Advanced" }
    ],
    wants: [
      { skill: "Figma Basics", level: "Beginner" },
      { skill: "Webflow / Framer", level: "Beginner" }
    ],
    availability: "Flexible scheduling (2 hrs/wk)",
    featured: false
  },
  {
    id: "swap-8",
    name: "Tariq Al-Mansoor",
    title: "3D Motion Designer & Blender Artist",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    category: "design",
    rating: 4.87,
    swapsCompleted: 15,
    location: "Dubai (UTC+4) • Virtual",
    bio: "Blender 3D modeling, lighting, geometry nodes, and cinema-grade animation. Wanting to learn Arabic calligraphy digital lettering or modern iOS Swift dev.",
    teaches: [
      { skill: "Blender 3D Modeling", level: "Expert" },
      { skill: "Motion Graphics", level: "Advanced" },
      { skill: "Lighting & Texturing", level: "Expert" }
    ],
    wants: [
      { skill: "Swift / iOS Development", level: "Beginner" },
      { skill: "Arabic Typography", level: "Intermediate" }
    ],
    availability: "Weekend mornings (UTC+4)",
    featured: false
  },
  {
    id: "swap-9",
    name: "Camila Ortiz",
    title: "Spanish Literature Scholar & Translator",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    category: "languages",
    rating: 4.97,
    swapsCompleted: 47,
    location: "Madrid (UTC+2) • Virtual",
    bio: "Native Castilian Spanish speaker. I teach conversational nuances, business Spanish, and creative writing. Hoping to learn React to build language games!",
    teaches: [
      { skill: "Spanish (All Levels)", level: "Native/Master" },
      { skill: "Creative Writing", level: "Advanced" },
      { skill: "Accent Neutralization", level: "Expert" }
    ],
    wants: [
      { skill: "React & JavaScript", level: "Beginner" },
      { skill: "CSS Animations", level: "Beginner" }
    ],
    availability: "Weekday evenings",
    featured: true
  }
];

const INITIAL_PROPOSALS = [
  {
    id: "prop-demo-1",
    targetSwapId: "swap-1",
    partnerName: "Elena Rostova",
    partnerTeaches: "React & Next.js",
    offeredSkill: "Italian (Conversational)",
    hoursPerWeek: "1 hr/week",
    message: "Hi Elena! I grew up in Florence and would love to exchange Italian practice for some deep-dive guidance on Next.js 14 server actions.",
    status: "Active Exchange",
    date: "2 days ago"
  }
];
