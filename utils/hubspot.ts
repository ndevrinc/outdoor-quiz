import type { EmailGateData, LeadData } from "../types/assessment"
import type { TrackingData } from "./tracking"

// HubSpot API configuration - Using your actual Portal ID
const HUBSPOT_PORTAL_ID = "2143432" // Your actual Portal ID
const HUBSPOT_FORM_GUID = "your-form-guid-here" // You'll need to replace this with your actual form GUID

// Check if HubSpot is configured
const isHubSpotConfigured = () => {
  return HUBSPOT_PORTAL_ID && HUBSPOT_FORM_GUID && HUBSPOT_FORM_GUID !== "your-form-guid-here"
}

// HubSpot contact properties mapping
interface HubSpotContact {
  email: string
  website?: string
  firstname?: string
  lastname?: string
  company?: string
  phone?: string
  business_type?: string
  annual_revenue?: string
  team_size?: string
  // UTM tracking fields
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  // Assessment specific fields
  assessment_score?: string
  assessment_level?: string
  assessment_completed_date?: string
  current_challenges?: string
  referrer_url?: string
  landing_page?: string
  session_id?: string
}

// Submit email gate data to HubSpot
export const submitEmailGateToHubSpot = async (
  emailGateData: EmailGateData,
  trackingData: TrackingData,
): Promise<boolean> => {
  // Skip HubSpot submission if not configured
  if (!isHubSpotConfigured()) {
    console.log("HubSpot form GUID not configured, skipping submission")
    return true // Return true to not block the flow
  }

  try {
    const hubspotData: HubSpotContact = {
      email: emailGateData.email,
      website: emailGateData.website,
      utm_source: trackingData.utm.utm_source,
      utm_medium: trackingData.utm.utm_medium,
      utm_campaign: trackingData.utm.utm_campaign,
      utm_term: trackingData.utm.utm_term,
      utm_content: trackingData.utm.utm_content,
      referrer_url: trackingData.referrer,
      landing_page: trackingData.landingPage,
      session_id: trackingData.sessionId,
      assessment_completed_date: new Date().toISOString(),
    }

    // Method 1: HubSpot Forms API (Recommended)
    const response = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_GUID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: Object.entries(hubspotData)
            .filter(([_, value]) => value !== undefined && value !== "")
            .map(([name, value]) => ({
              name,
              value: String(value),
            })),
          context: {
            hutk: getHubSpotCookie(),
            pageUri: window.location.href,
            pageName: "Adventure Commerce Assessment - Email Gate",
            ipAddress: await getUserIP(),
          },
        }),
      },
    )

    if (response.ok) {
      console.log("Email gate data submitted to HubSpot successfully")
      return true
    } else {
      console.error("Failed to submit email gate data to HubSpot:", response.statusText)
      return false
    }
  } catch (error) {
    console.error("Error submitting email gate data to HubSpot:", error)
    return false
  }
}

// Submit full lead data to HubSpot
export const submitLeadDataToHubSpot = async (
  leadData: LeadData,
  trackingData: TrackingData,
  assessmentScore?: number,
  assessmentLevel?: string,
): Promise<boolean> => {
  // For lead data, we'll use the CollectedForms approach or direct contact creation
  // Since you mentioned using CollectedForms placeholder approach, we'll use that method

  try {
    // Method 1: Use HubSpot's CollectedForms API (if you have a form set up)
    if (isHubSpotConfigured()) {
      const hubspotData: HubSpotContact = {
        email: leadData.email,
        firstname: leadData.firstName,
        lastname: leadData.lastName,
        company: leadData.company,
        phone: leadData.phone,
        business_type: leadData.businessType,
        annual_revenue: leadData.annualRevenue,
        team_size: leadData.teamSize,
        current_challenges: leadData.currentChallenges?.join("; "),
        utm_source: trackingData.utm.utm_source,
        utm_medium: trackingData.utm.utm_medium,
        utm_campaign: trackingData.utm.utm_campaign,
        utm_term: trackingData.utm.utm_term,
        utm_content: trackingData.utm.utm_content,
        referrer_url: trackingData.referrer,
        landing_page: trackingData.landingPage,
        session_id: trackingData.sessionId,
        assessment_score: assessmentScore?.toString(),
        assessment_level: assessmentLevel,
        assessment_completed_date: new Date().toISOString(),
      }

      const response = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_GUID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fields: Object.entries(hubspotData)
              .filter(([_, value]) => value !== undefined && value !== "")
              .map(([name, value]) => ({
                name,
                value: String(value),
              })),
            context: {
              hutk: getHubSpotCookie(),
              pageUri: window.location.href,
              pageName: "Adventure Commerce Assessment - Lead Form",
              ipAddress: await getUserIP(),
            },
          }),
        },
      )

      if (response.ok) {
        console.log("Lead data submitted to HubSpot successfully")
        return true
      } else {
        console.error("Failed to submit lead data to HubSpot:", response.statusText)
        return false
      }
    }

    // Method 2: Use HubSpot's client-side tracking (CollectedForms approach)
    if (typeof window !== "undefined" && (window as any)._hsq) {
      // Track the lead form submission event
      ;(window as any)._hsq.push([
        "identify",
        {
          email: leadData.email,
          firstname: leadData.firstName,
          lastname: leadData.lastName,
          company: leadData.company,
          phone: leadData.phone,
          business_type: leadData.businessType,
          annual_revenue: leadData.annualRevenue,
          team_size: leadData.teamSize,
          current_challenges: leadData.currentChallenges?.join("; "),
          assessment_score: assessmentScore,
          assessment_level: assessmentLevel,
        },
      ])

      // Track the event
      ;(window as any)._hsq.push([
        "trackEvent",
        {
          id: "lead_form_submitted",
          value: assessmentScore,
          assessment_level: assessmentLevel,
          business_type: leadData.businessType,
        },
      ])

      console.log("Lead data tracked via HubSpot client-side")
      return true
    }

    console.log("HubSpot tracking not available")
    return true // Don't block the flow
  } catch (error) {
    console.error("Error submitting lead data to HubSpot:", error)
    return false
  }
}

// Get HubSpot tracking cookie
const getHubSpotCookie = (): string | undefined => {
  if (typeof document === "undefined") return undefined

  const cookies = document.cookie.split(";")
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=")
    if (name === "hubspotutk") {
      return value
    }
  }
  return undefined
}

// Get user IP address (optional, for better tracking)
const getUserIP = async (): Promise<string | undefined> => {
  try {
    const response = await fetch("https://api.ipify.org?format=json")
    const data = await response.json()
    return data.ip
  } catch (error) {
    console.error("Failed to get user IP:", error)
    return undefined
  }
}

// Alternative method using HubSpot's client-side tracking
export const trackHubSpotEvent = (eventName: string, properties: Record<string, any> = {}) => {
  if (typeof window !== "undefined" && (window as any)._hsq) {
    ;(window as any)._hsq.push([
      "trackEvent",
      {
        id: eventName,
        ...properties,
      },
    ])
  }
}

// Initialize HubSpot tracking script
export const initializeHubSpotTracking = (portalId: string) => {
  if (typeof window === "undefined") return

  // Add HubSpot tracking script
  const script = document.createElement("script")
  script.type = "text/javascript"
  script.id = "hs-script-loader"
  script.async = true
  script.defer = true
  script.src = `//js.hs-scripts.com/${portalId}.js`
  document.head.appendChild(script)

  // Initialize _hsq array
  ;(window as any)._hsq = (window as any)._hsq || []
}
