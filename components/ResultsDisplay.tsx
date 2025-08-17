"use client"

import type React from "react"
import type { AssessmentResult, CategoryScore } from "../types/assessment"
import { downloadPDF } from "../utils/pdfGenerator"
import { trackPDFDownload } from "../utils/tracking"

interface ResultsDisplayProps {
  results: AssessmentResult
  emailGateData: { email: string; website: string }
  onStartOver: () => void
  onGetRecommendations: () => void
}

const getLevelColor = (level: string): string => {
  switch (level) {
    case "Summit Ready":
      return "text-gray-900 bg-gray-100 border-gray-300"
    case "Base Camp Strong":
      return "text-gray-800 bg-gray-200 border-gray-400"
    case "Trail Ready":
      return "text-gray-700 bg-gray-300 border-gray-500"
    case "Basecamp Basics":
      return "text-red-700 bg-red-100 border-red-300"
    default:
      return "text-gray-700 bg-gray-100 border-gray-200"
  }
}

const getCategoryIcon = (category: string): string => {
  switch (category) {
    case "Audience Experience":
      return "📱"
    case "Creator Experience":
      return "✏️"
    case "Developer Experience":
      return "⚙️"
    case "Business Impact":
      return "💰"
    default:
      return "📊"
  }
}

const CategoryScoreCard: React.FC<{ categoryScore: CategoryScore }> = ({ categoryScore }) => {
  return (
    <div className="bg-white shadow-md border border-gray-200 p-6 mb-4" style={{ borderRadius: "4px" }}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <span className="text-2xl mr-3">{getCategoryIcon(categoryScore.category)}</span>
          <h3 className="text-lg font-semibold text-gray-900">{categoryScore.category}</h3>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {categoryScore.score}/{categoryScore.maxScore}
          </div>
          <div className="text-sm text-gray-600">{categoryScore.percentage}%</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="w-full bg-gray-200 h-3" style={{ borderRadius: "2px" }}>
          <div
            className="bg-red-600 h-3 transition-all duration-500"
            style={{ width: `${categoryScore.percentage}%`, borderRadius: "2px" }}
          />
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-3">Priority Recommendations:</h4>
        <ul className="space-y-2">
          {categoryScore.recommendations.slice(0, 3).map((rec, index) => (
            <li key={index} className="text-sm text-gray-700 flex items-start">
              <span className="text-red-600 mr-2 mt-1">•</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const getActionPlan = (level: string) => {
  switch (level) {
    case "Summit Ready":
      return {
        focus: "🎯 Advanced Optimization Focus",
        actions: [
          "Implement AI-powered personalization engines",
          "Advanced analytics and attribution modeling",
          "International expansion acceleration",
          "Emerging technology integration (AR/VR)",
        ],
        cta: "Schedule Your Strategy Call",
      }
    case "Base Camp Strong":
      return {
        focus: "⚡ Performance & Scale Focus",
        actions: [
          "CDN and caching optimization implementation",
          "Content workflow automation setup",
          "Integration enhancement roadmap",
          "Advanced security and compliance measures",
        ],
        cta: "Schedule Your Strategy Call",
      }
    case "Trail Ready":
      return {
        focus: "🔧 Foundation Strengthening Focus",
        actions: [
          "Mobile experience optimization",
          "Basic content management improvements",
          "Performance audit and fixes",
          "Essential integration setup",
        ],
        cta: "Schedule Your Strategy Call",
      }
    default:
      return {
        focus: "🚀 Platform Transformation Focus",
        actions: [
          "Comprehensive platform migration planning",
          "WordPress VIP evaluation and demo",
          "Legacy system assessment",
          "Foundation infrastructure setup",
        ],
        cta: "Schedule Your Strategy Call",
      }
  }
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  results,
  emailGateData,
  onStartOver,
  onGetRecommendations,
}) => {
  const actionPlan = getActionPlan(results.level)

  const handleDownloadPDF = () => {
    downloadPDF(results, emailGateData)
    trackPDFDownload(results.level, results.overallScore)
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Hero Results Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Your Adventure Commerce Readiness Assessment Results</h1>

        <div className="bg-white shadow-xl p-8 mb-8 border-2 border-gray-200" style={{ borderRadius: "6px" }}>
          <div className="text-8xl mb-4">{results.levelIcon}</div>
          <div className="text-6xl font-bold text-gray-900 mb-4">{results.overallScore}/60</div>
          <div
            className={`inline-block px-6 py-3 text-xl font-bold border-2 ${getLevelColor(results.level)}`}
            style={{ borderRadius: "4px" }}
          >
            {results.level}
          </div>
          <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto">{results.levelDescription}</p>
        </div>

        {/* Quick Win Tip */}
        <div className="bg-gray-50 p-6 mb-8 border border-gray-200" style={{ borderRadius: "4px" }}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">🎯 Quick Win Tip</h3>
          <p className="text-gray-700">{results.quickWinTip}</p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Category Breakdown</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {results.categoryScores.map((categoryScore) => (
            <CategoryScoreCard key={categoryScore.category} categoryScore={categoryScore} />
          ))}
        </div>
      </div>

      {/* Personalized Action Plan */}
      <div className="bg-white shadow-lg p-8 mb-8 border border-gray-200" style={{ borderRadius: "6px" }}>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Personalized Action Plan</h3>
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">{actionPlan.focus}</h4>
          <div className="grid md:grid-cols-2 gap-4">
            {actionPlan.actions.map((action, index) => (
              <div key={index} className="flex items-start p-4 bg-gray-50" style={{ borderRadius: "4px" }}>
                <span className="text-red-600 mr-3 mt-1">✓</span>
                <span className="text-gray-700">{action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PDF Download Section */}
      <div className="bg-red-50 p-8 mb-8 border border-red-200" style={{ borderRadius: "6px" }}>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">📄 Get Your Detailed Action Plan</h3>
          <p className="text-lg text-gray-700 mb-6">
            Download a comprehensive PDF report with all your results, detailed recommendations, and actionable next
            steps.
          </p>
          <button
            onClick={handleDownloadPDF}
            className="bg-red-600 text-white px-8 py-4 text-lg font-semibold hover:bg-red-700 transition-colors duration-200 shadow-lg"
            style={{ borderRadius: "4px" }}
          >
            Download PDF Report
          </button>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 p-8 text-white text-center mb-8" style={{ borderRadius: "4px" }}>
        <h3 className="text-3xl font-bold mb-4">Ready to Build Adventure-Grade Commerce?</h3>
        <p className="text-xl mb-6 text-gray-300">
          Transform your platform with publisher-grade infrastructure designed for outdoor brands that scale from
          basecamp to summit.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onGetRecommendations}
            className="bg-red-600 text-white px-8 py-4 text-lg font-semibold hover:bg-red-700 transition-colors duration-200 shadow-lg"
            style={{ borderRadius: "4px" }}
          >
            {actionPlan.cta}
          </button>
          <button
            onClick={onStartOver}
            className="border-2 border-gray-400 text-gray-300 px-8 py-4 text-lg font-semibold hover:bg-gray-800 hover:text-white transition-colors duration-200"
            style={{ borderRadius: "4px" }}
          >
            Retake Assessment
          </button>
        </div>
      </div>

      {/* Company Info */}
      <div className="text-center mb-8 bg-white p-6 border border-gray-200" style={{ borderRadius: "4px" }}>
        <div className="text-sm text-gray-600">
          <p>
            <strong>Company:</strong> {emailGateData.website}
          </p>
          <p>
            <strong>Contact:</strong> {emailGateData.email}
          </p>
          <p>
            <strong>Assessment completed:</strong> {new Date(results.completedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Footer with NDEVR Logo */}
      <div className="text-center bg-white p-8 border border-gray-200" style={{ borderRadius: "4px" }}>
        <div className="text-sm text-gray-500">
          <p className="mt-2">
            <strong>Tagline:</strong> "Build Adventure-Grade Commerce on Publisher-Grade Infrastructure"
          </p>
        </div>
      </div>
    </div>
  )
}
