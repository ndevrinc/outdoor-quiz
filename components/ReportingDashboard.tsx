"use client"

import { useEffect, useState } from "react"
import { getAnalyticsData, exportAssessmentsToCSV } from "../utils/database"

interface AnalyticsData {
  totalAssessments: number
  levelDistribution: Record<string, number>
  eventCounts: Record<string, number>
  utmSources: Record<string, number>
  conversionRate: number
}

interface DateFilters {
  startDate: string
  endDate: string
  level: string
}

export const ReportingDashboard = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<DateFilters>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30 days ago
    endDate: new Date().toISOString().split("T")[0], // today
    level: "",
  })

  useEffect(() => {
    loadAnalytics()
  }, [filters])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const data = await getAnalyticsData({
        startDate: filters.startDate,
        endDate: filters.endDate,
      })
      setAnalytics(data)
    } catch (error) {
      console.error("Error loading analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportCSV = async () => {
    try {
      const csvContent = await exportAssessmentsToCSV({
        startDate: filters.startDate,
        endDate: filters.endDate,
        level: filters.level || undefined,
      })

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `assessment-report-${filters.startDate}-to-${filters.endDate}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting CSV:", error)
    }
  }

  if (loading) {
    return (
      <div className="bg-white p-8 border border-gray-200" style={{ borderRadius: "6px" }}>
        <div className="text-center">
          <div className="text-lg text-gray-600">Loading analytics...</div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="bg-white p-8 border border-gray-200" style={{ borderRadius: "6px" }}>
        <div className="text-center">
          <div className="text-lg text-gray-600">No data available</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-6 border border-gray-200" style={{ borderRadius: "6px" }}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              style={{ borderRadius: "4px" }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              style={{ borderRadius: "4px" }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assessment Level</label>
            <select
              value={filters.level}
              onChange={(e) => setFilters({ ...filters, level: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              style={{ borderRadius: "4px" }}
            >
              <option value="">All Levels</option>
              <option value="Basecamp Basics">Basecamp Basics</option>
              <option value="Trail Ready">Trail Ready</option>
              <option value="Base Camp Strong">Base Camp Strong</option>
              <option value="Summit Ready">Summit Ready</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleExportCSV}
              className="w-full bg-red-600 text-white px-4 py-2 text-sm font-semibold hover:bg-red-700 transition-colors duration-200"
              style={{ borderRadius: "4px" }}
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="bg-white p-6 border border-gray-200" style={{ borderRadius: "6px" }}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-gray-50" style={{ borderRadius: "4px" }}>
            <div className="text-2xl font-bold text-gray-900">{analytics.totalAssessments}</div>
            <div className="text-sm text-gray-600">Total Assessments</div>
          </div>
          <div className="text-center p-4 bg-gray-50" style={{ borderRadius: "4px" }}>
            <div className="text-2xl font-bold text-blue-600">{analytics.eventCounts["Assessment Started"] || 0}</div>
            <div className="text-sm text-gray-600">Started</div>
          </div>
          <div className="text-center p-4 bg-gray-50" style={{ borderRadius: "4px" }}>
            <div className="text-2xl font-bold text-green-600">
              {analytics.eventCounts["Assessment Completed"] || 0}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center p-4 bg-gray-50" style={{ borderRadius: "4px" }}>
            <div className="text-2xl font-bold text-purple-600">
              {analytics.eventCounts["Email Gate Submitted"] || 0}
            </div>
            <div className="text-sm text-gray-600">Email Captures</div>
          </div>
          <div className="text-center p-4 bg-gray-50" style={{ borderRadius: "4px" }}>
            <div className="text-2xl font-bold text-red-600">{analytics.conversionRate}%</div>
            <div className="text-sm text-gray-600">Conversion Rate</div>
          </div>
        </div>
      </div>

      {/* Level Distribution */}
      <div className="bg-white p-6 border border-gray-200" style={{ borderRadius: "6px" }}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment Level Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(analytics.levelDistribution).map(([level, count]) => (
            <div key={level} className="text-center p-4 bg-gray-50" style={{ borderRadius: "4px" }}>
              <div className="text-xl font-bold text-gray-900">{count}</div>
              <div className="text-sm text-gray-600">{level}</div>
              <div className="text-xs text-gray-500">{Math.round((count / analytics.totalAssessments) * 100)}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* UTM Sources */}
      <div className="bg-white p-6 border border-gray-200" style={{ borderRadius: "6px" }}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(analytics.utmSources)
            .slice(0, 6)
            .map(([source, count]) => (
              <div key={source} className="text-center p-4 bg-gray-50" style={{ borderRadius: "4px" }}>
                <div className="text-lg font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600">{source || "Direct"}</div>
              </div>
            ))}
        </div>
      </div>

      {/* Event Breakdown */}
      <div className="bg-white p-6 border border-gray-200" style={{ borderRadius: "6px" }}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Breakdown</h3>
        <div className="space-y-2">
          {Object.entries(analytics.eventCounts).map(([event, count]) => (
            <div
              key={event}
              className="flex justify-between items-center p-2 bg-gray-50"
              style={{ borderRadius: "4px" }}
            >
              <span className="text-sm text-gray-700">{event}</span>
              <span className="text-sm font-semibold text-gray-900">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
