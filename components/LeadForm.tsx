"use client"

import type React from "react"
import { useState, useCallback } from "react"
import type { LeadData } from "../types/assessment"
import { validateLeadForm, type ValidationErrors } from "../utils/validation"

interface LeadFormProps {
  onSubmit: (leadData: LeadData) => void
  onSkip: () => void
  isLoading?: boolean
  assessmentLevel: string
}

const businessTypes = [
  "Outdoor Gear Retailer",
  "Adventure Tour Operator",
  "Overlanding Outfitter",
  "Camping & RV Dealer",
  "Outdoor Equipment Manufacturer",
  "Adventure Travel Agency",
  "Outdoor Recreation Rental",
  "Multi-Brand Outdoor Conglomerate",
  "Other",
]

const revenueRanges = [
  "Under $1M",
  "$1M - $5M",
  "$5M - $10M",
  "$10M - $25M",
  "$25M - $50M",
  "$50M+",
  "Prefer not to say",
]

const teamSizes = ["1-5 employees", "6-15 employees", "16-50 employees", "51-100 employees", "100+ employees"]

const challengeOptions = [
  "Site crashes during seasonal traffic spikes",
  "Poor mobile performance in remote areas",
  "Content publishing requires developer help",
  "Can't track content impact on sales",
  "High platform maintenance costs",
  "Limited international commerce capabilities",
  "Poor vehicle fitment/compatibility tools",
  "Slow content workflow and publishing",
  "Security and compliance concerns",
  "Platform can't handle growth",
]

const getLeadMagnetByLevel = (level: string) => {
  switch (level) {
    case "Summit Ready":
      return {
        title: "Adventure Platform Mastery Guide",
        description: "50-page deep-dive into building publisher-grade infrastructure for outdoor brands",
        cta: "Download the Adventure Platform Mastery Guide",
      }
    case "Base Camp Strong":
      return {
        title: "Trail-to-Transactional Consultation",
        description: "Live demo of peer brand migration success stories and optimization strategies",
        cta: "Get Your Trail-to-Transactional Consultation",
      }
    case "Trail Ready":
      return {
        title: "Platform Readiness Audit",
        description: "Comprehensive technical assessment with prioritized improvement roadmap",
        cta: "Request Your Platform Readiness Audit",
      }
    default:
      return {
        title: "Complete Migration Playbook",
        description: "Step-by-step guide for platform transformation and WordPress VIP evaluation",
        cta: "Download the Complete Migration Playbook",
      }
  }
}

export const LeadForm: React.FC<LeadFormProps> = ({ onSubmit, onSkip, isLoading = false, assessmentLevel }) => {
  const [formData, setFormData] = useState<Partial<LeadData>>({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    phone: "",
    businessType: "",
    annualRevenue: "",
    teamSize: "",
    currentChallenges: [],
  })
  const [errors, setErrors] = useState<ValidationErrors>({})

  const leadMagnet = getLeadMagnetByLevel(assessmentLevel)

  const handleInputChange = useCallback(
    (field: keyof LeadData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      if (errors[field as keyof ValidationErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    },
    [errors],
  )

  const handleChallengeToggle = useCallback((challenge: string) => {
    setFormData((prev) => ({
      ...prev,
      currentChallenges: prev.currentChallenges?.includes(challenge)
        ? prev.currentChallenges.filter((c) => c !== challenge)
        : [...(prev.currentChallenges || []), challenge],
    }))
  }, [])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const validationErrors = validateLeadForm(formData)

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        return
      }

      onSubmit(formData as LeadData)
    },
    [formData, onSubmit],
  )

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{leadMagnet.cta}</h2>
          <p className="text-lg text-gray-600 mb-6">{leadMagnet.description}</p>
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              <strong>Exclusive for {assessmentLevel} companies:</strong> Get personalized recommendations and connect
              with our adventure commerce experts for a custom platform strategy session.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} id="outdoor-assessment-quiz" className="quz-form">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName || ""}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your first name"
              />
              {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName || ""}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your last name"
              />
              {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
            </div>
          </div>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                id="company"
                value={formData.company || ""}
                onChange={(e) => handleInputChange("company", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.company ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your company name"
              />
              {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone || ""}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your phone number"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
                Business Type *
              </label>
              <select
                id="businessType"
                value={formData.businessType || ""}
                onChange={(e) => handleInputChange("businessType", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.businessType ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select business type</option>
                {businessTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.businessType && <p className="mt-1 text-sm text-red-600">{errors.businessType}</p>}
            </div>

            <div>
              <label htmlFor="annualRevenue" className="block text-sm font-medium text-gray-700 mb-2">
                Annual Revenue
              </label>
              <select
                id="annualRevenue"
                value={formData.annualRevenue || ""}
                onChange={(e) => handleInputChange("annualRevenue", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select revenue range</option>
                {revenueRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700 mb-2">
                Team Size
              </label>
              <select
                id="teamSize"
                value={formData.teamSize || ""}
                onChange={(e) => handleInputChange("teamSize", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select team size</option>
                {teamSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Current Platform Challenges (Select all that apply)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {challengeOptions.map((challenge) => (
                <label key={challenge} className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.currentChallenges?.includes(challenge) || false}
                    onChange={() => handleChallengeToggle(challenge)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-1"
                  />
                  <span className="ml-3 text-sm text-gray-700">{challenge}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-3">What You'll Receive:</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center">
                <span className="text-red-600 mr-2">✓</span>
                {leadMagnet.title} (immediate download)
              </li>
              <li className="flex items-center">
                <span className="text-red-600 mr-2">✓</span>
                Personalized platform recommendations based on your assessment
              </li>
              <li className="flex items-center">
                <span className="text-red-600 mr-2">✓</span>
                30-minute strategy consultation with adventure commerce experts
              </li>
              <li className="flex items-center">
                <span className="text-red-600 mr-2">✓</span>
                Custom roadmap for your platform transformation
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
            >
              {isLoading ? "Processing..." : `Get My ${leadMagnet.title}`}
            </button>
            <button
              type="button"
              onClick={onSkip}
              className="flex-1 sm:flex-none border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-lg font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
            >
              Skip for Now
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            By submitting this form, you agree to receive communications about adventure commerce solutions. We respect
            your privacy and will never share your information. You can unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  )
}
