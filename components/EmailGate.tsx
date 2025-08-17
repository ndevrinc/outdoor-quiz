"use client"

import type React from "react"
import { useState, useCallback } from "react"
import type { EmailGateData } from "../types/assessment"
import { validateEmailGate, type EmailGateErrors } from "../utils/validation"

interface EmailGateProps {
  onSubmit: (emailGateData: EmailGateData) => void
  isLoading?: boolean
}

export const EmailGate: React.FC<EmailGateProps> = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState<Partial<EmailGateData>>({
    email: "",
    website: "",
  })
  const [errors, setErrors] = useState<EmailGateErrors>({})

  const handleInputChange = useCallback(
    (field: keyof EmailGateData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      if (errors[field as keyof EmailGateErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    },
    [errors],
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const validationErrors = validateEmailGate(formData)

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        return
      }

      onSubmit(formData as EmailGateData)
    },
    [formData, onSubmit],
  )

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-6">🎯</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Assessment Complete!</h2>
            <p className="text-lg text-gray-600 mb-6">
              You've successfully completed all 10 questions. Enter your details below to unlock your personalized
              Adventure Commerce Readiness results and actionable recommendations.
            </p>
          </div>

          <form onSubmit={handleSubmit} id="outdoor-quiz-results-form" className="get-results-form">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Business Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={formData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your business email address"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                Company Website *
              </label>
              <input
                type="url"
                id="website"
                value={formData.website || ""}
                onChange={(e) => handleInputChange("website", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.website ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="https://yourcompany.com"
              />
              {errors.website && <p className="mt-1 text-sm text-red-600">{errors.website}</p>}
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">What You'll Get:</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <span className="text-red-600 mr-2">✓</span>
                  Your complete Adventure Commerce Readiness score and level
                </li>
                <li className="flex items-center">
                  <span className="text-red-600 mr-2">✓</span>
                  Detailed breakdown across all 4 assessment categories
                </li>
                <li className="flex items-center">
                  <span className="text-red-600 mr-2">✓</span>
                  Personalized action plan with priority recommendations
                </li>
                <li className="flex items-center">
                  <span className="text-red-600 mr-2">✓</span>
                  Downloadable PDF report with actionable tips
                </li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-lg"
            >
              {isLoading ? "Generating Results..." : "Get My Results"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              By submitting this form, you agree to receive your assessment results and occasional communications about
              adventure commerce solutions. We respect your privacy and will never share your information.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
