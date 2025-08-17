import type { Question } from "../types/assessment"

export const assessmentQuestions: Question[] = [
  // 📱 Audience Experience (3 Questions)
  {
    id: "audience-1",
    category: "Audience Experience",
    question: "How does your site perform during seasonal traffic spikes?",
    weight: 1,
    options: [
      {
        value: 0,
        label: "Crashes frequently during Memorial Day, Black Friday, spring launches",
        description: "Site goes down during peak seasons",
      },
      {
        value: 2,
        label: "Slows down but stays online during peak seasons",
        description: "Performance degrades but remains accessible",
      },
      {
        value: 4,
        label: "Handles 5× traffic increases with minor issues",
        description: "Good performance with occasional slowdowns",
      },
      {
        value: 6,
        label: "Seamlessly manages 10× traffic surges with zero downtime",
        description: "Enterprise-grade performance during peaks",
      },
    ],
  },
  {
    id: "audience-2",
    category: "Audience Experience",
    question: "What's your mobile page load speed on outdoor/remote LTE connections?",
    weight: 1,
    options: [
      {
        value: 0,
        label: "5+ seconds, customers complain about slow loading",
        description: "Poor mobile performance in remote areas",
      },
      {
        value: 2,
        label: "3-5 seconds, decent but could be faster",
        description: "Acceptable but not optimized for mobile",
      },
      {
        value: 4,
        label: "2-3 seconds, good performance most of the time",
        description: "Well-optimized for most mobile connections",
      },
      {
        value: 6,
        label: "<1 second globally via edge caching, lightning fast anywhere",
        description: "Enterprise CDN with global edge optimization",
      },
    ],
  },
  {
    id: "audience-3",
    category: "Audience Experience",
    question: "What's your mobile conversion rate compared to desktop?",
    weight: 1,
    options: [
      {
        value: 0,
        label: "Mobile converts 50%+ lower than desktop",
        description: "Poor mobile commerce experience",
      },
      {
        value: 2,
        label: "Mobile converts 25-50% lower than desktop",
        description: "Mobile experience needs improvement",
      },
      {
        value: 4,
        label: "Mobile converts within 15% of desktop rates",
        description: "Good mobile optimization",
      },
      {
        value: 6,
        label: "Mobile converts equal to or better than desktop",
        description: "Mobile-first commerce experience",
      },
    ],
  },

  // ✏️ Creator Experience (2 Questions)
  {
    id: "creator-1",
    category: "Creator Experience",
    question: "How quickly can your team publish installation guides and product content?",
    weight: 1,
    options: [
      {
        value: 0,
        label: "Requires developer help, takes weeks to publish new content",
        description: "Technical bottlenecks slow content creation",
      },
      {
        value: 2,
        label: "Content team can publish but process is slow and clunky",
        description: "Basic CMS with workflow limitations",
      },
      {
        value: 4,
        label: "Fairly efficient publishing but some bottlenecks remain",
        description: "Good content workflow with minor issues",
      },
      {
        value: 6,
        label: "Content team publishes instantly with reusable blocks and patterns",
        description: "Advanced content management with automation",
      },
    ],
  },
  {
    id: "creator-2",
    category: "Creator Experience",
    question: "How do you handle seasonal content planning and execution?",
    weight: 1,
    options: [
      {
        value: 0,
        label: "Scramble each season, often miss key content deadlines",
        description: "Reactive content planning",
      },
      {
        value: 2,
        label: "Basic planning but execution is often rushed and stressful",
        description: "Simple editorial calendar",
      },
      {
        value: 4,
        label: "Decent seasonal planning with some workflow bottlenecks",
        description: "Good planning with execution challenges",
      },
      {
        value: 6,
        label: "Advanced editorial calendars with automated seasonal workflows",
        description: "Enterprise content planning and automation",
      },
    ],
  },

  // ⚙️ Developer Experience (2 Questions)
  {
    id: "developer-1",
    category: "Developer Experience",
    question: "How does your platform handle complex integrations?",
    weight: 1,
    options: [
      {
        value: 0,
        label: "Custom development required for every integration, expensive and slow",
        description: "No API or integration framework",
      },
      {
        value: 2,
        label: "Some pre-built connectors but still need custom work",
        description: "Limited integration options",
      },
      {
        value: 4,
        label: "Good API support, can handle most integrations efficiently",
        description: "Solid API and integration capabilities",
      },
      {
        value: 6,
        label: "API-first architecture with headless capabilities and enterprise connectors",
        description: "Enterprise-grade API and headless architecture",
      },
    ],
  },
  {
    id: "developer-2",
    category: "Developer Experience",
    question: "How do you manage security and compliance requirements?",
    weight: 1,
    options: [
      {
        value: 0,
        label: "Basic security, worried about vulnerabilities and compliance gaps",
        description: "Minimal security measures",
      },
      {
        value: 2,
        label: "Decent security but some concerns about enterprise requirements",
        description: "Good security with some gaps",
      },
      {
        value: 4,
        label: "Good security practices with regular updates and monitoring",
        description: "Solid security practices and monitoring",
      },
      {
        value: 6,
        label: "SOC-2 compliance, enterprise security with proactive monitoring",
        description: "Enterprise-grade security and compliance",
      },
    ],
  },

  // 💰 Business Impact (3 Questions)
  {
    id: "business-1",
    category: "Business Impact",
    question: "How effectively do you track adventure content to commerce conversion?",
    weight: 1,
    options: [
      {
        value: 0,
        label: "Can't measure how installation guides/stories drive product sales",
        description: "No content attribution tracking",
      },
      {
        value: 2,
        label: "Basic analytics but limited insight into content impact",
        description: "Simple analytics with limited attribution",
      },
      {
        value: 4,
        label: "Good tracking of content engagement and some sales attribution",
        description: "Decent content performance tracking",
      },
      {
        value: 6,
        label: "Advanced analytics connecting every piece of content to revenue",
        description: "Complete content-to-commerce attribution",
      },
    ],
  },
  {
    id: "business-2",
    category: "Business Impact",
    question: "What's your average annual platform maintenance and development cost?",
    weight: 1,
    options: [
      {
        value: 0,
        label: "$200K+ annually, costs keep growing unexpectedly",
        description: "High and unpredictable platform costs",
      },
      {
        value: 2,
        label: "$100K-200K annually, reasonable but could be more efficient",
        description: "Moderate platform costs",
      },
      {
        value: 4,
        label: "$50K-100K annually, good value for features received",
        description: "Efficient platform investment",
      },
      {
        value: 6,
        label: "<$50K annually through managed platform with predictable costs",
        description: "Highly efficient managed platform",
      },
    ],
  },
  {
    id: "business-3",
    category: "Business Impact",
    question: "How prepared are you for the next level of growth?",
    weight: 1,
    options: [
      {
        value: 0,
        label: "Current platform will break if we double in size",
        description: "Platform cannot handle growth",
      },
      {
        value: 2,
        label: "Platform might handle 2× growth but will need major work",
        description: "Limited scalability without major investment",
      },
      {
        value: 4,
        label: "Platform can handle 2-3× growth with some optimizations",
        description: "Good scalability with minor improvements",
      },
      {
        value: 6,
        label: "Platform built to scale 10× current size without major changes",
        description: "Enterprise-grade scalability built-in",
      },
    ],
  },
]
