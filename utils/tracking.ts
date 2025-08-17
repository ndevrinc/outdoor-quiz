// UTM Parameter Management
export interface UTMParams {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
}

export interface TrackingData {
  utm: UTMParams
  referrer: string
  landingPage: string
  userAgent: string
  timestamp: string
  sessionId: string
}

// Generate a unique session ID
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Extract UTM parameters from URL
export const getUTMParams = (): UTMParams => {
  if (typeof window === "undefined") return {}

  const urlParams = new URLSearchParams(window.location.search)
  return {
    utm_source: urlParams.get("utm_source") || undefined,
    utm_medium: urlParams.get("utm_medium") || undefined,
    utm_campaign: urlParams.get("utm_campaign") || undefined,
    utm_term: urlParams.get("utm_term") || undefined,
    utm_content: urlParams.get("utm_content") || undefined,
  }
}

// Get comprehensive tracking data
export const getTrackingData = (): TrackingData => {
  const sessionId = getSessionId()

  return {
    utm: getUTMParams(),
    referrer: typeof window !== "undefined" ? document.referrer : "",
    landingPage: typeof window !== "undefined" ? window.location.href : "",
    userAgent: typeof window !== "undefined" ? navigator.userAgent : "",
    timestamp: new Date().toISOString(),
    sessionId,
  }
}

// Store session ID in localStorage
export const getSessionId = (): string => {
  if (typeof window === "undefined") return generateSessionId()

  let sessionId = localStorage.getItem("adventure_assessment_session_id")
  if (!sessionId) {
    sessionId = generateSessionId()
    localStorage.setItem("adventure_assessment_session_id", sessionId)
  }
  return sessionId
}

// Store UTM data in localStorage for the session
export const storeTrackingData = (trackingData: TrackingData): void => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("adventure_assessment_tracking", JSON.stringify(trackingData))
  } catch (error) {
    console.error("Failed to store tracking data:", error)
  }
}

// Retrieve stored tracking data
export const getStoredTrackingData = (): TrackingData | null => {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem("adventure_assessment_tracking")
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error("Failed to retrieve tracking data:", error)
    return null
  }
}

// Track page views with multiple analytics services and database
export const trackPageView = async (page: string, additionalData?: Record<string, any>, assessmentId?: string) => {
  const trackingData = getStoredTrackingData() || getTrackingData()

  const pageViewData = {
    event: "page_view",
    page,
    ...trackingData,
    ...additionalData,
    timestamp: new Date().toISOString(),
  }

  // Log for debugging
  console.log("Page View:", pageViewData)

  // Try to save to database, but don't fail if it doesn't work
  try {
    const { saveEventToDatabase } = await import("./database")
    await saveEventToDatabase("page_view", pageViewData, trackingData.sessionId, assessmentId, page)
  } catch (error) {
    console.warn("Database tracking unavailable, continuing with client-side tracking only")
  }

  // Send to Google Analytics 4 (if available)
  if (typeof window !== "undefined" && (window as any).gtag) {
    ;(window as any).gtag("event", "page_view", {
      page_title: page,
      page_location: window.location.href,
      custom_map: {
        utm_source: trackingData.utm.utm_source,
        utm_medium: trackingData.utm.utm_medium,
        utm_campaign: trackingData.utm.utm_campaign,
      },
    })
  }

  // Send to Vercel Analytics
  if (typeof window !== "undefined" && (window as any).va) {
    ;(window as any).va("track", "Page View", {
      page,
      utm_source: trackingData.utm.utm_source,
      utm_medium: trackingData.utm.utm_medium,
      utm_campaign: trackingData.utm.utm_campaign,
      ...additionalData,
    })
  }
}

// Track custom events with multiple analytics services and database
export const trackEvent = async (eventName: string, eventData?: Record<string, any>, assessmentId?: string) => {
  const trackingData = getStoredTrackingData() || getTrackingData()

  const fullEventData = {
    event: eventName,
    ...trackingData,
    ...eventData,
    timestamp: new Date().toISOString(),
  }

  // Log for debugging
  console.log("Event:", fullEventData)

  // Try to save to database, but don't fail if it doesn't work
  try {
    const { saveEventToDatabase } = await import("./database")
    await saveEventToDatabase(eventName, fullEventData, trackingData.sessionId, assessmentId)
  } catch (error) {
    console.warn("Database tracking unavailable, continuing with client-side tracking only")
  }

  // Send to Google Analytics 4 (if available)
  if (typeof window !== "undefined" && (window as any).gtag) {
    ;(window as any).gtag("event", eventName, {
      ...eventData,
      utm_source: trackingData.utm.utm_source,
      utm_medium: trackingData.utm.utm_medium,
      utm_campaign: trackingData.utm.utm_campaign,
    })
  }

  // Send to Vercel Analytics
  if (typeof window !== "undefined" && (window as any).va) {
    ;(window as any).va("track", eventName, {
      ...eventData,
      utm_source: trackingData.utm.utm_source,
      utm_medium: trackingData.utm.utm_medium,
      utm_campaign: trackingData.utm.utm_campaign,
    })
  }
}

// Specific tracking functions for assessment events
export const trackAssessmentStart = async (source?: string, assessmentId?: string) => {
  await trackEvent(
    "Assessment Started",
    {
      source: source || "organic",
      timestamp: new Date().toISOString(),
    },
    assessmentId,
  )
}

export const trackQuestionAnswered = async (
  questionId: string,
  category: string,
  value: number,
  questionIndex: number,
  assessmentId?: string,
) => {
  await trackEvent(
    "Question Answered",
    {
      question_id: questionId,
      category,
      value,
      question_index: questionIndex,
      progress_percentage: Math.round((questionIndex / 20) * 100),
    },
    assessmentId,
  )
}

export const trackAssessmentCompleted = async (
  totalQuestions: number,
  completionTime?: number,
  assessmentId?: string,
) => {
  await trackEvent(
    "Assessment Completed",
    {
      total_questions: totalQuestions,
      completion_time_seconds: completionTime,
      timestamp: new Date().toISOString(),
    },
    assessmentId,
  )
}

export const trackEmailGateSubmission = async (
  email: string,
  website: string,
  assessmentScore: number,
  assessmentLevel: string,
  assessmentId?: string,
) => {
  await trackEvent(
    "Email Gate Submitted",
    {
      email_domain: email.split("@")[1],
      website_domain: website.replace(/^https?:\/\//, "").split("/")[0],
      assessment_score: assessmentScore,
      assessment_level: assessmentLevel,
    },
    assessmentId,
  )
}

export const trackLeadFormSubmission = async (
  leadData: {
    businessType: string
    annualRevenue?: string
    teamSize?: string
    challengesCount: number
    assessmentLevel: string
    assessmentScore: number
  },
  assessmentId?: string,
) => {
  await trackEvent(
    "Lead Form Submitted",
    {
      business_type: leadData.businessType,
      annual_revenue: leadData.annualRevenue,
      team_size: leadData.teamSize,
      challenges_count: leadData.challengesCount,
      assessment_level: leadData.assessmentLevel,
      assessment_score: leadData.assessmentScore,
    },
    assessmentId,
  )
}

export const trackPDFDownload = async (assessmentLevel: string, assessmentScore: number, assessmentId?: string) => {
  await trackEvent(
    "PDF Downloaded",
    {
      assessment_level: assessmentLevel,
      assessment_score: assessmentScore,
      timestamp: new Date().toISOString(),
    },
    assessmentId,
  )
}

export const trackFormAbandonment = async (
  formType: "email_gate" | "lead_form",
  fieldsCompleted: number,
  totalFields: number,
  assessmentId?: string,
) => {
  await trackEvent(
    "Form Abandoned",
    {
      form_type: formType,
      fields_completed: fieldsCompleted,
      total_fields: totalFields,
      completion_percentage: Math.round((fieldsCompleted / totalFields) * 100),
    },
    assessmentId,
  )
}

// Track user engagement metrics
export const trackTimeOnPage = async (page: string, timeSpent: number, assessmentId?: string) => {
  await trackEvent(
    "Time on Page",
    {
      page,
      time_spent_seconds: timeSpent,
      engagement_level: timeSpent > 60 ? "high" : timeSpent > 30 ? "medium" : "low",
    },
    assessmentId,
  )
}

// Track assessment performance metrics
export const trackAssessmentMetrics = async (
  metrics: {
    totalTime: number
    questionsSkipped: number
    questionsRevisited: number
    averageTimePerQuestion: number
  },
  assessmentId?: string,
) => {
  await trackEvent(
    "Assessment Metrics",
    {
      total_time_seconds: metrics.totalTime,
      questions_skipped: metrics.questionsSkipped,
      questions_revisited: metrics.questionsRevisited,
      average_time_per_question: metrics.averageTimePerQuestion,
      engagement_score: calculateEngagementScore(metrics),
    },
    assessmentId,
  )
}

// Calculate engagement score based on user behavior
const calculateEngagementScore = (metrics: {
  totalTime: number
  questionsSkipped: number
  questionsRevisited: number
}) => {
  let score = 100

  // Penalize for skipping questions
  score -= metrics.questionsSkipped * 5

  // Reward for revisiting questions (shows thoughtfulness)
  score += Math.min(metrics.questionsRevisited * 2, 10)

  // Penalize for rushing through (less than 10 seconds per question on average)
  if (metrics.totalTime < 200) score -= 20

  // Penalize for taking too long (more than 20 minutes)
  if (metrics.totalTime > 1200) score -= 10

  return Math.max(0, Math.min(100, score))
}
