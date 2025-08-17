export interface Question {
  id: string
  category: string
  question: string
  options: Option[]
  weight: number
}

export interface Option {
  value: number
  label: string
  description?: string
}

export interface Answer {
  questionId: string
  value: number
  category: string
}

export interface CategoryScore {
  category: string
  score: number
  maxScore: number
  percentage: number
  recommendations: string[]
}

export interface AssessmentResult {
  overallScore: number
  overallPercentage: number
  level: "Basecamp Basics" | "Trail Ready" | "Base Camp Strong" | "Summit Ready"
  categoryScores: CategoryScore[]
  completedAt: string
  levelIcon: string
  levelDescription: string
  quickWinTip: string
}

export interface EmailGateData {
  email: string
  website: string
}

export interface LeadData {
  firstName: string
  lastName: string
  email: string
  company: string
  phone?: string
  businessType: string
  currentChallenges: string[]
  annualRevenue?: string
  teamSize?: string
}
