import type { AssessmentResult, Answer, LeadData, EmailGateData } from "../types/assessment"
import type { TrackingData } from "./tracking"

const STORAGE_KEYS = {
  ANSWERS: "adventure_assessment_answers",
  RESULTS: "adventure_assessment_results",
  LEAD_DATA: "adventure_assessment_lead",
  EMAIL_GATE: "adventure_assessment_email_gate",
  TRACKING: "adventure_assessment_tracking",
  SESSION_ID: "adventure_assessment_session_id",
}

export const saveAnswers = (answers: Answer[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(answers))
  } catch (error) {
    console.error("Failed to save answers to localStorage:", error)
  }
}

export const loadAnswers = (): Answer[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ANSWERS)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Failed to load answers from localStorage:", error)
    return []
  }
}

export const saveResults = (results: AssessmentResult): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results))
  } catch (error) {
    console.error("Failed to save results to localStorage:", error)
  }
}

export const loadResults = (): AssessmentResult | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RESULTS)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error("Failed to load results from localStorage:", error)
    return null
  }
}

export const saveEmailGateData = (emailGateData: EmailGateData): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.EMAIL_GATE, JSON.stringify(emailGateData))
  } catch (error) {
    console.error("Failed to save email gate data to localStorage:", error)
  }
}

export const loadEmailGateData = (): EmailGateData | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.EMAIL_GATE)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error("Failed to load email gate data from localStorage:", error)
    return null
  }
}

export const saveLeadData = (leadData: LeadData): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.LEAD_DATA, JSON.stringify(leadData))
  } catch (error) {
    console.error("Failed to save lead data to localStorage:", error)
  }
}

export const loadLeadData = (): LeadData | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LEAD_DATA)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error("Failed to load lead data from localStorage:", error)
    return null
  }
}

export const saveTrackingData = (trackingData: TrackingData): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.TRACKING, JSON.stringify(trackingData))
  } catch (error) {
    console.error("Failed to save tracking data to localStorage:", error)
  }
}

export const loadTrackingData = (): TrackingData | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TRACKING)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error("Failed to load tracking data from localStorage:", error)
    return null
  }
}

export const clearAssessmentData = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      if (key !== STORAGE_KEYS.TRACKING && key !== STORAGE_KEYS.SESSION_ID) {
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error("Failed to clear assessment data:", error)
  }
}
