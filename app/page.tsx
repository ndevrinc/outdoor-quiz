"use client"

import { useState, useEffect, useCallback } from "react"
import type { Answer, AssessmentResult, LeadData, EmailGateData } from "../types/assessment"
import { assessmentQuestions } from "../data/questions"
import { calculateResults } from "../utils/calculations"
import {
  saveAnswers,
  loadAnswers,
  saveResults,
  loadResults,
  saveLeadData,
  saveEmailGateData,
  loadEmailGateData,
  clearAssessmentData,
} from "../utils/storage"
import {
  getTrackingData,
  storeTrackingData,
  trackPageView,
  trackEvent,
  getStoredTrackingData,
  trackAssessmentStart,
  trackQuestionAnswered,
  trackAssessmentCompleted,
  trackEmailGateSubmission,
  trackLeadFormSubmission,
} from "../utils/tracking"
import { submitEmailGateToHubSpot, submitLeadDataToHubSpot, initializeHubSpotTracking } from "../utils/hubspot"
import { ProgressBar } from "../components/ProgressBar"
import { QuestionCard } from "../components/QuestionCard"
import { ResultsDisplay } from "../components/ResultsDisplay"
import { LeadForm } from "../components/LeadForm"
import { EmailGate } from "../components/EmailGate"
import { DatabaseStatus } from "../components/DatabaseStatus"
import { Footer } from "../components/Footer"

type AppState = "welcome" | "assessment" | "email-gate" | "results" | "lead-form" | "thank-you"

// Using your actual HubSpot Portal ID
const HUBSPOT_PORTAL_ID = "2143432"

export default function AdventureCommerceAssessment() {
  const [currentState, setCurrentState] = useState<AppState>("welcome")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [results, setResults] = useState<AssessmentResult | null>(null)
  const [emailGateData, setEmailGateData] = useState<EmailGateData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [assessmentId, setAssessmentId] = useState<string | null>(null)

  // Initialize tracking and HubSpot on component mount
  useEffect(() => {
    // Initialize HubSpot tracking with your Portal ID
    if (HUBSPOT_PORTAL_ID) {
      initializeHubSpotTracking(HUBSPOT_PORTAL_ID)
    }

    // Get or create tracking data
    let trackingData = getStoredTrackingData()
    if (!trackingData) {
      trackingData = getTrackingData()
      storeTrackingData(trackingData)
    }

    // Track initial page view
    trackPageView("welcome")
    trackAssessmentStart(trackingData.utm.utm_source)

    // Load saved data
    const savedAnswers = loadAnswers()
    const savedResults = loadResults()
    const savedEmailGate = loadEmailGateData()

    if (savedResults && savedEmailGate) {
      setResults(savedResults)
      setEmailGateData(savedEmailGate)
      setCurrentState("results")
      trackPageView("results")
    } else if (savedAnswers.length === assessmentQuestions.length) {
      setAnswers(savedAnswers)
      setCurrentState("email-gate")
      trackPageView("email-gate")
    } else if (savedAnswers.length > 0) {
      setAnswers(savedAnswers)
      setCurrentQuestionIndex(savedAnswers.length)
      setCurrentState("assessment")
      trackPageView("assessment", { question_index: savedAnswers.length })
    }
  }, [])

  const handleAnswer = useCallback(
    (questionId: string, value: number, category: string) => {
      const newAnswer: Answer = { questionId, value, category }
      const updatedAnswers = answers.filter((a) => a.questionId !== questionId)
      updatedAnswers.push(newAnswer)

      setAnswers(updatedAnswers)
      saveAnswers(updatedAnswers)

      // Track answer event
      trackQuestionAnswered(questionId, category, value, currentQuestionIndex + 1, assessmentId)
    },
    [answers, currentQuestionIndex, assessmentId],
  )

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < assessmentQuestions.length - 1) {
      const nextIndex = currentQuestionIndex + 1
      setCurrentQuestionIndex(nextIndex)
      trackEvent(
        "question_navigation",
        {
          direction: "next",
          question_index: nextIndex + 1,
          total_questions: assessmentQuestions.length,
        },
        assessmentId,
      )
    } else {
      // Assessment complete, go to email gate
      setCurrentState("email-gate")
      trackPageView("email-gate")
      trackAssessmentCompleted(assessmentQuestions.length, undefined, assessmentId)
    }
  }, [currentQuestionIndex, assessmentId])

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1
      setCurrentQuestionIndex(prevIndex)
      trackEvent(
        "question_navigation",
        {
          direction: "previous",
          question_index: prevIndex + 1,
          total_questions: assessmentQuestions.length,
        },
        assessmentId,
      )
    }
  }, [currentQuestionIndex, assessmentId])

  const handleStartAssessment = useCallback(() => {
    setCurrentState("assessment")
    setCurrentQuestionIndex(0)
    setAnswers([])
    clearAssessmentData()
    trackPageView("assessment", { question_index: 1 })
    trackEvent("assessment_started_fresh")
  }, [])

  const handleStartOver = useCallback(() => {
    setCurrentState("welcome")
    setCurrentQuestionIndex(0)
    setAnswers([])
    setResults(null)
    setEmailGateData(null)
    setAssessmentId(null)
    clearAssessmentData()
    trackPageView("welcome")
    trackEvent("assessment_restarted")
  }, [])

  // Update the handleEmailGateSubmit function to handle database errors gracefully
  const handleEmailGateSubmit = useCallback(
    async (emailData: EmailGateData) => {
      setIsLoading(true)

      try {
        // Get tracking data
        const trackingData = getStoredTrackingData() || getTrackingData()

        // Calculate results
        const assessmentResults = calculateResults(answers)
        setResults(assessmentResults)
        setEmailGateData(emailData)

        // Try to save to database, but don't fail if it doesn't work
        let newAssessmentId: string | null = null
        try {
          const { saveAssessmentToDatabase } = await import("../utils/database")
          newAssessmentId = await saveAssessmentToDatabase(assessmentResults, answers, emailData, trackingData)
          setAssessmentId(newAssessmentId)
          console.log("Assessment saved to database successfully")
        } catch (dbError) {
          console.warn("Database save failed, continuing without database storage:", dbError)
        }

        // Submit to HubSpot (this can also fail gracefully)
        try {
          await submitEmailGateToHubSpot(emailData, trackingData)
          console.log("Data submitted to HubSpot successfully")
        } catch (hubspotError) {
          console.warn("HubSpot submission failed, continuing without HubSpot integration:", hubspotError)
        }

        // Save to local storage (this should always work)
        saveResults(assessmentResults)
        saveEmailGateData(emailData)

        // Track events (these will work even without database)
        trackEmailGateSubmission(
          emailData.email,
          emailData.website,
          assessmentResults.overallScore,
          assessmentResults.level,
          newAssessmentId,
        )

        trackPageView("results", undefined, newAssessmentId)

        setCurrentState("results")
      } catch (error) {
        console.error("Error processing email gate submission:", error)
        trackEvent("email_gate_error", { error: error.message }, assessmentId)

        // Even if everything fails, we can still show results from local calculation
        const assessmentResults = calculateResults(answers)
        setResults(assessmentResults)
        setEmailGateData(emailData)
        saveResults(assessmentResults)
        saveEmailGateData(emailData)
        setCurrentState("results")
      } finally {
        setIsLoading(false)
      }
    },
    [answers, assessmentId],
  )

  // Update the handleLeadSubmit function similarly
  const handleLeadSubmit = useCallback(
    async (leadData: LeadData) => {
      setIsLoading(true)

      try {
        // Get tracking data
        const trackingData = getStoredTrackingData() || getTrackingData()

        // Try to save to database
        try {
          if (assessmentId) {
            const { saveLeadToDatabase } = await import("../utils/database")
            await saveLeadToDatabase(leadData, assessmentId)
            console.log("Lead data saved to database successfully")
          }
        } catch (dbError) {
          console.warn("Database save failed, continuing without database storage:", dbError)
        }

        // Submit to HubSpot - This is now enabled with your Portal ID
        try {
          await submitLeadDataToHubSpot(leadData, trackingData, results?.overallScore, results?.level)
          console.log("Lead data submitted to HubSpot successfully")
        } catch (hubspotError) {
          console.warn("HubSpot submission failed, continuing without HubSpot integration:", hubspotError)
        }

        // Save to local storage
        saveLeadData(leadData)

        // Track events
        trackLeadFormSubmission(
          {
            businessType: leadData.businessType,
            annualRevenue: leadData.annualRevenue,
            teamSize: leadData.teamSize,
            challengesCount: leadData.currentChallenges?.length || 0,
            assessmentLevel: results?.level || "",
            assessmentScore: results?.overallScore || 0,
          },
          assessmentId,
        )

        trackPageView("thank-you", undefined, assessmentId)
        setCurrentState("thank-you")
      } catch (error) {
        console.error("Error processing lead form submission:", error)
        trackEvent("lead_form_error", { error: error.message }, assessmentId)

        // Even if everything fails, we can still proceed
        saveLeadData(leadData)
        setCurrentState("thank-you")
      } finally {
        setIsLoading(false)
      }
    },
    [results, assessmentId],
  )

  const handleSkipLead = useCallback(() => {
    setCurrentState("thank-you")
    trackPageView("thank-you", undefined, assessmentId)
    trackEvent(
      "lead_form_skipped",
      {
        assessment_level: results?.level,
        assessment_score: results?.overallScore,
      },
      assessmentId,
    )
  }, [results, assessmentId])

  const handleGetRecommendations = useCallback(() => {
    const ndevrUrl =
      "https://www.ndevr.io/website-fragility-audit/?utm_term=manufacturing&utm_source=landing&utm_content=readiness-assessment-quiz&utm_campaign=mdf-august-2025"
    window.open(ndevrUrl, "_blank")

    trackEvent(
      "schedule_call_clicked",
      {
        assessment_level: results?.level,
        assessment_score: results?.overallScore,
        destination_url: ndevrUrl,
      },
      assessmentId,
    )
  }, [results, assessmentId])

  const currentQuestion = assessmentQuestions[currentQuestionIndex]
  const currentAnswer = answers.find((a) => a.questionId === currentQuestion?.id)

  if (currentState === "welcome") {
    return (
      <div>
        <div className="min-h-screen bg-gray-50 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="text-6xl mb-6">🏔️</div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Adventure Commerce
                <br />
                <span className="text-red-600">Readiness Assessment</span>
              </h1>
              <p className="text-2xl text-gray-600 mb-4 font-medium">
                "Build Adventure-Grade Commerce on Publisher-Grade Infrastructure"
              </p>
              <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                Is your outdoor brand ready to scale from basecamp to summit? This comprehensive assessment evaluates
                your digital platform against the unique challenges facing specialized outdoor and overlanding
                companies. In just 2 minutes, discover where your adventure commerce platform stands and unlock
                personalized recommendations to transform your digital foundation.
              </p>
            </div>

            {/* Why This Matters */}
            <div className="bg-white shadow-xl p-8 mb-12 border border-gray-200" style={{ borderRadius: "6px" }}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why This Assessment Matters</h2>
              <div className="bg-gray-100 p-6 mb-6" style={{ borderRadius: "4px" }}>
                <p className="text-lg text-gray-800 leading-relaxed">
                  <strong>Outdoor brands have evolved into content-first lifestyle publishers.</strong> Your platform
                  needs newsroom-proven scale, speed, and security while preserving the brand storytelling that fuels
                  product demand. This assessment identifies gaps between your current capabilities and the
                  publisher-grade infrastructure required for adventure commerce success.
                </p>
              </div>
            </div>

            {/* Assessment Overview */}
            <div className="bg-white shadow-xl p-8 mb-12" style={{ borderRadius: "6px" }}>
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Assessment Overview</h2>
              <div className="grid md:grid-cols-4 gap-8 mb-8">
                <div className="text-center">
                  <div
                    className="w-20 h-20 bg-gray-100 flex items-center justify-center mx-auto mb-4"
                    style={{ borderRadius: "50%" }}
                  >
                    <span className="text-3xl">📱</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Audience Experience</h3>
                  <p className="text-gray-600 text-sm">Performance, mobile optimization, and customer journey</p>
                </div>
                <div className="text-center">
                  <div
                    className="w-20 h-20 bg-gray-100 flex items-center justify-center mx-auto mb-4"
                    style={{ borderRadius: "50%" }}
                  >
                    <span className="text-3xl">✏️</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Creator Experience</h3>
                  <p className="text-gray-600 text-sm">Content publishing, workflows, and team collaboration</p>
                </div>
                <div className="text-center">
                  <div
                    className="w-20 h-20 bg-gray-100 flex items-center justify-center mx-auto mb-4"
                    style={{ borderRadius: "50%" }}
                  >
                    <span className="text-3xl">⚙️</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Developer Experience</h3>
                  <p className="text-gray-600 text-sm">Integrations, security, and technical scalability</p>
                </div>
                <div className="text-center">
                  <div
                    className="w-20 h-20 bg-gray-100 flex items-center justify-center mx-auto mb-4"
                    style={{ borderRadius: "50%" }}
                  >
                    <span className="text-3xl">💰</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Business Impact</h3>
                  <p className="text-gray-600 text-sm">Analytics, costs, growth, and ROI measurement</p>
                </div>
              </div>

              <div className="text-center bg-gray-50 p-6" style={{ borderRadius: "4px" }}>
                <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-700">
                  <div>
                    <strong className="text-gray-900">Time to Complete:</strong>
                    <br />
                    2-5 minutes
                  </div>
                  <div>
                    <strong className="text-gray-900">Total Questions:</strong>
                    <br />
                    {assessmentQuestions.length} questions
                  </div>
                  <div>
                    <strong className="text-gray-900">Scoring Range:</strong>
                    <br />
                    0-60 points
                  </div>
                </div>
              </div>
            </div>

            {/* Readiness Levels Preview */}
            <div className="bg-white shadow-xl p-8 mb-12" style={{ borderRadius: "6px" }}>
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Adventure Commerce Readiness Levels</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-red-50 border border-red-200" style={{ borderRadius: "4px" }}>
                  <div className="text-4xl mb-3">⛺</div>
                  <h3 className="font-bold text-red-700 mb-2">Basecamp Basics</h3>
                  <p className="text-sm text-red-600">0-17 points</p>
                  <p className="text-xs text-gray-600 mt-2">Platform upgrade needed</p>
                </div>
                <div className="text-center p-6 bg-gray-100 border border-gray-300" style={{ borderRadius: "4px" }}>
                  <div className="text-4xl mb-3">🥾</div>
                  <h3 className="font-bold text-gray-700 mb-2">Trail Ready</h3>
                  <p className="text-sm text-gray-600">18-29 points</p>
                  <p className="text-xs text-gray-600 mt-2">Foundation strengthening</p>
                </div>
                <div className="text-center p-6 bg-gray-200 border border-gray-400" style={{ borderRadius: "4px" }}>
                  <div className="text-4xl mb-3">🏕️</div>
                  <h3 className="font-bold text-gray-700 mb-2">Base Camp Strong</h3>
                  <p className="text-sm text-gray-600">30-44 points</p>
                  <p className="text-xs text-gray-600 mt-2">Performance & scale focus</p>
                </div>
                <div className="text-center p-6 bg-gray-300 border border-gray-500" style={{ borderRadius: "4px" }}>
                  <div className="text-4xl mb-3">🏔️</div>
                  <h3 className="font-bold text-gray-800 mb-2">Summit Ready</h3>
                  <p className="text-sm text-gray-700">45-60 points</p>
                  <p className="text-xs text-gray-600 mt-2">Advanced optimization</p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <div className="bg-gray-900 p-8 text-white mb-8" style={{ borderRadius: "6px" }}>
                <h2 className="text-3xl font-bold mb-4">Ready to Discover Your Adventure Commerce Readiness?</h2>
                <p className="text-xl mb-6 text-gray-300">
                  Join hundreds of outdoor brands who've used this assessment to transform their digital platforms and
                  accelerate growth.
                </p>
                <button
                  onClick={handleStartAssessment}
                  className="bg-red-600 text-white px-12 py-4 text-xl font-bold hover:bg-red-700 transition-colors duration-200 shadow-lg transform hover:scale-105"
                  style={{ borderRadius: "4px" }}
                >
                  Start Your Assessment
                </button>
              </div>

              <p className="text-sm text-gray-500 max-w-3xl mx-auto">
                This assessment is designed specifically for outdoor gear retailers, adventure tour operators,
                overlanding outfitters, camping & RV dealers, outdoor equipment manufacturers, and related adventure
                commerce businesses seeking to build publisher-grade digital infrastructure.
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (currentState === "assessment") {
    return (
      <div>
        <div className="min-h-screen bg-gray-50 py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <ProgressBar current={currentQuestionIndex + 1} total={assessmentQuestions.length} className="mb-6" />
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Adventure Commerce Readiness Assessment</h1>
                <p className="text-gray-600">"Build Adventure-Grade Commerce on Publisher-Grade Infrastructure"</p>
              </div>
            </div>

            <QuestionCard
              question={currentQuestion}
              selectedValue={currentAnswer?.value}
              onAnswer={handleAnswer}
              onNextQuestion={handleNext}
            />

            <div className="flex justify-between items-center mt-8">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-semibold"
                style={{ borderRadius: "4px" }}
              >
                Previous
              </button>

              <div className="text-center">
                <span className="text-sm text-gray-500">
                  Question {currentQuestionIndex + 1} of {assessmentQuestions.length}
                </span>
                <div className="text-xs text-gray-400 mt-1">
                  {Math.round(((currentQuestionIndex + 1) / assessmentQuestions.length) * 100)}% Complete
                </div>
              </div>

              {/* Empty div to maintain spacing */}
              <div></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (currentState === "email-gate") {
    return (
      <div>
        <EmailGate onSubmit={handleEmailGateSubmit} isLoading={isLoading} />
        <Footer />
      </div>
    )
  }

  if (currentState === "results" && results && emailGateData) {
    return (
      <div>
        <div className="min-h-screen bg-gray-50 py-12 px-4">
          <ResultsDisplay
            results={results}
            emailGateData={emailGateData}
            onStartOver={handleStartOver}
            onGetRecommendations={handleGetRecommendations}
          />
        </div>
        <Footer />
      </div>
    )
  }

  if (currentState === "lead-form" && results) {
    return (
      <div>
        <div className="min-h-screen bg-gray-50 py-12 px-4">
          <LeadForm
            onSubmit={handleLeadSubmit}
            onSkip={handleSkipLead}
            isLoading={isLoading}
            assessmentLevel={results.level}
          />
        </div>
        <Footer />
      </div>
    )
  }

  if (currentState === "thank-you") {
    return (
      <div>
        <div className="min-h-screen bg-gray-50 py-12 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-white shadow-xl p-12" style={{ borderRadius: "6px" }}>
              <div
                className="w-24 h-24 bg-red-100 flex items-center justify-center mx-auto mb-8"
                style={{ borderRadius: "50%" }}
              >
                <span className="text-5xl">🎯</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Mission Accomplished!</h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Your adventure commerce readiness assessment is complete! Our team of adventure commerce experts will
                review your results and reach out within 24 hours with your personalized platform strategy and next
                steps.
              </p>

              <div className="bg-gray-100 p-6 mb-8" style={{ borderRadius: "4px" }}>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What happens next?</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div className="flex items-start">
                    <span className="text-red-600 mr-2">✓</span>
                    <span>Detailed results sent to your email</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-red-600 mr-2">✓</span>
                    <span>Personalized action plan delivered</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-red-600 mr-2">✓</span>
                    <span>Expert consultation scheduled</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-red-600 mr-2">✓</span>
                    <span>Custom platform roadmap created</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleStartOver}
                  className="w-full bg-red-600 text-white px-8 py-4 text-lg font-semibold hover:bg-red-700 transition-all duration-200 shadow-lg"
                  style={{ borderRadius: "4px" }}
                >
                  Take Assessment Again
                </button>
                <p className="text-sm text-gray-500">
                  Want to assess another brand or division? Feel free to retake the assessment.
                </p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div>
      {/* DatabaseStatus component only shows in development, hidden in production */}
      <DatabaseStatus />
      <Footer />
    </div>
  )
}
