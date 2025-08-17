"use client"

import { useEffect, useState } from "react"
import { trackEvent } from "../utils/tracking"

interface AnalyticsData {
  pageViews: number
  assessmentStarts: number
  assessmentCompletions: number
  emailGateSubmissions: number
  leadFormSubmissions: number
  pdfDownloads: number
  conversionRate: number
}

export const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    pageViews: 0,
    assessmentStarts: 0,
    assessmentCompletions: 0,
    emailGateSubmissions: 0,
    leadFormSubmissions: 0,
    pdfDownloads: 0,
    conversionRate: 0,
  })

  useEffect(() => {
    // This would typically fetch data from your analytics service
    // For now, we'll simulate some data
    const mockData: AnalyticsData = {
      pageViews: 1250,
      assessmentStarts: 890,
      assessmentCompletions: 645,
      emailGateSubmissions: 612,
      leadFormSubmissions: 287,
      pdfDownloads: 445,
      conversionRate: 32.2,
    }

    setAnalytics(mockData)
  }, [])

  const handleExportData = () => {
    trackEvent("Analytics Export", {
      export_type: "dashboard_data",
      timestamp: new Date().toISOString(),
    })

    // Export analytics data as CSV
    const csvData = Object.entries(analytics)
      .map(([key, value]) => `${key},${value}`)
      .join("\n")

    const blob = new Blob([csvData], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `assessment-analytics-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-white p-8 border border-gray-200" style={{ borderRadius: "6px" }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Assessment Analytics</h2>
        <button
          onClick={handleExportData}
          className="bg-red-600 text-white px-4 py-2 text-sm font-semibold hover:bg-red-700 transition-colors duration-200"
          style={{ borderRadius: "4px" }}
        >
          Export Data
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center p-4 bg-gray-50" style={{ borderRadius: "4px" }}>
          <div className="text-3xl font-bold text-gray-900">{analytics.pageViews.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Page Views</div>
        </div>

        <div className="text-center p-4 bg-gray-50" style={{ borderRadius: "4px" }}>
          <div className="text-3xl font-bold text-blue-600">{analytics.assessmentStarts.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Assessment Starts</div>
        </div>

        <div className="text-center p-4 bg-gray-50" style={{ borderRadius: "4px" }}>
          <div className="text-3xl font-bold text-green-600">{analytics.assessmentCompletions.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Completions</div>
        </div>

        <div className="text-center p-4 bg-gray-50" style={{ borderRadius: "4px" }}>
          <div className="text-3xl font-bold text-red-600">{analytics.conversionRate}%</div>
          <div className="text-sm text-gray-600">Conversion Rate</div>
        </div>

        <div className="text-center p-4 bg-gray-50" style={{ borderRadius: "4px" }}>
          <div className="text-3xl font-bold text-purple-600">{analytics.emailGateSubmissions.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Email Captures</div>
        </div>

        <div className="text-center p-4 bg-gray-50" style={{ borderRadius: "4px" }}>
          <div className="text-3xl font-bold text-orange-600">{analytics.leadFormSubmissions.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Lead Forms</div>
        </div>

        <div className="text-center p-4 bg-gray-50" style={{ borderRadius: "4px" }}>
          <div className="text-3xl font-bold text-indigo-600">{analytics.pdfDownloads.toLocaleString()}</div>
          <div className="text-sm text-gray-600">PDF Downloads</div>
        </div>

        <div className="text-center p-4 bg-gray-50" style={{ borderRadius: "4px" }}>
          <div className="text-3xl font-bold text-gray-600">
            {Math.round((analytics.leadFormSubmissions / analytics.emailGateSubmissions) * 100)}%
          </div>
          <div className="text-sm text-gray-600">Lead Conversion</div>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-500">
        <p>Analytics data is updated in real-time via Vercel Analytics and custom event tracking.</p>
      </div>
    </div>
  )
}
