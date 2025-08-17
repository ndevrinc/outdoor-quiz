import type { Answer, CategoryScore, AssessmentResult } from "../types/assessment"
import { assessmentQuestions } from "../data/questions"

const getLevel = (
  score: number,
): {
  level: "Basecamp Basics" | "Trail Ready" | "Base Camp Strong" | "Summit Ready"
  icon: string
  description: string
  quickWinTip: string
} => {
  // Adjusted scoring for 10 questions (max 60 points instead of 120)
  if (score >= 45) {
    return {
      level: "Summit Ready",
      icon: "🏔️",
      description:
        "Your platform is adventure-grade ready! You're operating at the peak of adventure commerce capability.",
      quickWinTip:
        "Focus on advanced personalization and AI-powered product recommendations to push conversion rates even higher.",
    }
  }
  if (score >= 30) {
    return {
      level: "Base Camp Strong",
      icon: "🏕️",
      description:
        "Solid foundation, ready for the next ascent. Your platform handles basic requirements well but has opportunities for significant improvement.",
      quickWinTip:
        "Implement advanced caching and CDN optimization to improve performance during traffic spikes by 40%+.",
    }
  }
  if (score >= 18) {
    return {
      level: "Trail Ready",
      icon: "🥾",
      description:
        "Good start, but the summit requires more preparation. Your platform covers the essentials but struggles with advanced outdoor commerce requirements.",
      quickWinTip: "Prioritize mobile optimization and basic content workflow improvements for immediate impact.",
    }
  }
  return {
    level: "Basecamp Basics",
    icon: "⛺",
    description:
      "Time for a platform upgrade expedition. Your current platform isn't equipped for the demands of modern adventure commerce.",
    quickWinTip: "Start with a comprehensive platform audit to identify the most critical issues blocking growth.",
  }
}

const getRecommendations = (category: string, score: number): string[] => {
  const recommendations: Record<string, Record<string, string[]>> = {
    "Audience Experience": {
      high: [
        "Implement AI-powered personalization for adventure gear recommendations",
        "Add augmented reality features for gear visualization on vehicles",
        "Optimize for voice commerce and emerging mobile technologies",
        "Create immersive 360° product experiences with adventure context",
      ],
      medium: [
        "Implement advanced caching and CDN for global performance",
        "Add progressive web app features for offline browsing",
        "Enhance mobile checkout flow to match desktop conversion rates",
        "Create vehicle-specific product recommendation engines",
      ],
      low: [
        "Prioritize mobile-first responsive design optimization",
        "Implement basic CDN for improved loading speeds",
        "Create simple vehicle fitment guides and compatibility charts",
        "Optimize images for mobile and slow connections",
      ],
    },
    "Creator Experience": {
      high: [
        "Implement advanced editorial workflows with AI content suggestions",
        "Create automated seasonal content planning and publishing",
        "Build advanced UGC curation with automated rights management",
        "Develop cross-brand content syndication and governance",
      ],
      medium: [
        "Set up content workflow automation and approval processes",
        "Implement basic UGC collection and display systems",
        "Create shared content libraries across sub-brands",
        "Add collaborative editing and review workflows",
      ],
      low: [
        "Implement basic content management system with user roles",
        "Create simple editorial calendar and planning tools",
        "Set up basic social media content integration",
        "Establish content approval and publishing workflows",
      ],
    },
    "Developer Experience": {
      high: [
        "Implement microservices architecture for ultimate scalability",
        "Add advanced API management and developer portal",
        "Create custom integrations with outdoor industry platforms",
        "Implement advanced security monitoring and threat detection",
      ],
      medium: [
        "Set up proper CI/CD pipeline with automated testing",
        "Implement API-first architecture for better integrations",
        "Add comprehensive security monitoring and compliance",
        "Create staging and development environment workflows",
      ],
      low: [
        "Establish basic development and staging environments",
        "Implement fundamental security measures and SSL",
        "Set up basic API endpoints for essential integrations",
        "Create simple deployment and backup procedures",
      ],
    },
    "Business Impact": {
      high: [
        "Implement advanced attribution modeling for content ROI",
        "Create predictive analytics for inventory and demand planning",
        "Build advanced international commerce capabilities",
        "Develop custom analytics for outdoor industry insights",
      ],
      medium: [
        "Set up content-to-commerce attribution tracking",
        "Implement multi-currency and basic international features",
        "Create comprehensive analytics dashboards",
        "Add automated reporting for key business metrics",
      ],
      low: [
        "Implement basic Google Analytics and conversion tracking",
        "Set up simple sales and performance reporting",
        "Create basic customer journey and funnel analysis",
        "Establish key performance indicator monitoring",
      ],
    },
  }

  // Adjust scoring thresholds for fewer questions per category
  const categoryQuestionCount = assessmentQuestions.filter((q) => q.category === category).length
  const maxCategoryScore = categoryQuestionCount * 6
  const categoryScore = score / maxCategoryScore

  let level: string
  if (categoryScore >= 0.7) level = "high"
  else if (categoryScore >= 0.4) level = "medium"
  else level = "low"

  return recommendations[category]?.[level] || []
}

export const calculateResults = (answers: Answer[]): AssessmentResult => {
  const categories = [...new Set(assessmentQuestions.map((q) => q.category))]
  const categoryScores: CategoryScore[] = []

  categories.forEach((category) => {
    const categoryQuestions = assessmentQuestions.filter((q) => q.category === category)
    const categoryAnswers = answers.filter((a) => a.category === category)

    const score = categoryAnswers.reduce((sum, answer) => sum + answer.value, 0)
    const maxScore = categoryQuestions.length * 6 // Max value per question is 6
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
    const recommendations = getRecommendations(category, score)

    categoryScores.push({
      category,
      score,
      maxScore,
      percentage,
      recommendations,
    })
  })

  const overallScore = categoryScores.reduce((sum, cat) => sum + cat.score, 0)
  const overallMaxScore = 60 // 10 questions × 6 points max
  const overallPercentage = overallMaxScore > 0 ? Math.round((overallScore / overallMaxScore) * 100) : 0

  const levelInfo = getLevel(overallScore)

  return {
    overallScore,
    overallPercentage,
    level: levelInfo.level,
    levelIcon: levelInfo.icon,
    levelDescription: levelInfo.description,
    quickWinTip: levelInfo.quickWinTip,
    categoryScores,
    completedAt: new Date().toISOString(),
  }
}
