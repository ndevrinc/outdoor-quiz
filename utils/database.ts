import { supabase, handleSupabaseError, isSupabaseConfigured } from "./supabase"
import type { AssessmentResult, Answer, LeadData, EmailGateData } from "../types/assessment"
import type { TrackingData } from "./tracking"

// Save assessment to database
export const saveAssessmentToDatabase = async (
  results: AssessmentResult,
  answers: Answer[],
  emailGateData: EmailGateData,
  trackingData: TrackingData,
): Promise<string> => {
  if (!isSupabaseConfigured() || !supabase) {
    console.warn("Supabase not configured, skipping database save")
    throw new Error("Database not configured")
  }

  try {
    // Insert main assessment record
    const { data: assessment, error: assessmentError } = await supabase
      .from("assessments")
      .insert({
        session_id: trackingData.sessionId,
        email: emailGateData.email,
        website: emailGateData.website,
        overall_score: results.overallScore,
        overall_percentage: results.overallPercentage,
        assessment_level: results.level,
        level_icon: results.levelIcon,
        level_description: results.levelDescription,
        quick_win_tip: results.quickWinTip,
        completed_at: results.completedAt,
      })
      .select()
      .single()

    if (assessmentError) {
      handleSupabaseError(assessmentError, "saveAssessmentToDatabase - assessment")
    }

    const assessmentId = assessment.id

    // Insert answers
    const answersToInsert = answers.map((answer) => ({
      assessment_id: assessmentId,
      question_id: answer.questionId,
      category: answer.category,
      value: answer.value,
    }))

    const { error: answersError } = await supabase.from("assessment_answers").insert(answersToInsert)

    if (answersError) {
      handleSupabaseError(answersError, "saveAssessmentToDatabase - answers")
    }

    // Insert category scores and recommendations
    for (const categoryScore of results.categoryScores) {
      const { data: categoryScoreRecord, error: categoryScoreError } = await supabase
        .from("category_scores")
        .insert({
          assessment_id: assessmentId,
          category: categoryScore.category,
          score: categoryScore.score,
          max_score: categoryScore.maxScore,
          percentage: categoryScore.percentage,
        })
        .select()
        .single()

      if (categoryScoreError) {
        handleSupabaseError(categoryScoreError, "saveAssessmentToDatabase - category scores")
      }

      // Insert recommendations for this category
      const recommendationsToInsert = categoryScore.recommendations.map((rec, index) => ({
        category_score_id: categoryScoreRecord.id,
        recommendation: rec,
        priority_order: index + 1,
      }))

      const { error: recommendationsError } = await supabase
        .from("category_recommendations")
        .insert(recommendationsToInsert)

      if (recommendationsError) {
        handleSupabaseError(recommendationsError, "saveAssessmentToDatabase - recommendations")
      }
    }

    // Insert tracking data
    const { error: trackingError } = await supabase.from("tracking_data").insert({
      assessment_id: assessmentId,
      session_id: trackingData.sessionId,
      utm_source: trackingData.utm.utm_source,
      utm_medium: trackingData.utm.utm_medium,
      utm_campaign: trackingData.utm.utm_campaign,
      utm_term: trackingData.utm.utm_term,
      utm_content: trackingData.utm.utm_content,
      referrer: trackingData.referrer,
      landing_page: trackingData.landingPage,
      user_agent: trackingData.userAgent,
    })

    if (trackingError) {
      handleSupabaseError(trackingError, "saveAssessmentToDatabase - tracking")
    }

    return assessmentId
  } catch (error) {
    console.error("Error saving assessment to database:", error)
    throw error
  }
}

// Save lead data to database
export const saveLeadToDatabase = async (leadData: LeadData, assessmentId: string): Promise<string> => {
  if (!isSupabaseConfigured() || !supabase) {
    console.warn("Supabase not configured, skipping database save")
    throw new Error("Database not configured")
  }

  try {
    // Insert lead record
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .insert({
        assessment_id: assessmentId,
        first_name: leadData.firstName,
        last_name: leadData.lastName,
        email: leadData.email,
        company: leadData.company,
        phone: leadData.phone,
        business_type: leadData.businessType,
        annual_revenue: leadData.annualRevenue,
        team_size: leadData.teamSize,
      })
      .select()
      .single()

    if (leadError) {
      handleSupabaseError(leadError, "saveLeadToDatabase - lead")
    }

    const leadId = lead.id

    // Insert challenges
    if (leadData.currentChallenges && leadData.currentChallenges.length > 0) {
      const challengesToInsert = leadData.currentChallenges.map((challenge) => ({
        lead_id: leadId,
        challenge,
      }))

      const { error: challengesError } = await supabase.from("lead_challenges").insert(challengesToInsert)

      if (challengesError) {
        handleSupabaseError(challengesError, "saveLeadToDatabase - challenges")
      }
    }

    return leadId
  } catch (error) {
    console.error("Error saving lead to database:", error)
    throw error
  }
}

// Save event to database
export const saveEventToDatabase = async (
  eventName: string,
  eventData: any,
  sessionId: string,
  assessmentId?: string,
  page?: string,
): Promise<void> => {
  if (!isSupabaseConfigured() || !supabase) {
    console.log("Supabase not configured, skipping event storage")
    return
  }

  try {
    // Check if events table exists first
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .eq("table_name", "events")

    if (tablesError || !tables || tables.length === 0) {
      console.log("Events table not found, skipping event storage")
      return
    }

    const { error } = await supabase.from("events").insert({
      assessment_id: assessmentId,
      session_id: sessionId,
      event_name: eventName,
      event_data: eventData,
      page,
      timestamp: new Date().toISOString(),
    })

    if (error) {
      console.warn("Event storage failed, continuing without database tracking:", error.message)
    }
  } catch (error) {
    console.warn("Event storage failed, continuing without database tracking:", error)
    // Don't throw here to avoid breaking the user experience
  }
}

// Get assessment by ID
export const getAssessmentById = async (assessmentId: string) => {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error("Database not configured")
  }

  try {
    const { data: assessment, error: assessmentError } = await supabase
      .from("assessments")
      .select(`
        *,
        assessment_answers (*),
        category_scores (
          *,
          category_recommendations (*)
        ),
        leads (
          *,
          lead_challenges (*)
        ),
        tracking_data (*),
        events (*)
      `)
      .eq("id", assessmentId)
      .single()

    if (assessmentError) {
      handleSupabaseError(assessmentError, "getAssessmentById")
    }

    return assessment
  } catch (error) {
    console.error("Error getting assessment:", error)
    throw error
  }
}

// Get assessments with filters for reporting
export const getAssessments = async (filters?: {
  startDate?: string
  endDate?: string
  level?: string
  utmSource?: string
  limit?: number
  offset?: number
}) => {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error("Database not configured")
  }

  try {
    let query = supabase
      .from("assessments")
      .select(`
        *,
        category_scores (*),
        leads (*),
        tracking_data (*)
      `)
      .order("completed_at", { ascending: false })

    if (filters?.startDate) {
      query = query.gte("completed_at", filters.startDate)
    }

    if (filters?.endDate) {
      query = query.lte("completed_at", filters.endDate)
    }

    if (filters?.level) {
      query = query.eq("assessment_level", filters.level)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1)
    }

    const { data: assessments, error } = await query

    if (error) {
      handleSupabaseError(error, "getAssessments")
    }

    return assessments
  } catch (error) {
    console.error("Error getting assessments:", error)
    throw error
  }
}

// Get analytics data for reporting
export const getAnalyticsData = async (filters?: {
  startDate?: string
  endDate?: string
}) => {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error("Database not configured")
  }

  try {
    // Get assessment counts by level
    const { data: levelCounts, error: levelError } = await supabase
      .from("assessments")
      .select("assessment_level")
      .gte("completed_at", filters?.startDate || "2024-01-01")
      .lte("completed_at", filters?.endDate || new Date().toISOString())

    if (levelError) {
      handleSupabaseError(levelError, "getAnalyticsData - levels")
    }

    // Get conversion funnel data
    const { data: events, error: eventsError } = await supabase
      .from("events")
      .select("event_name, created_at")
      .gte("created_at", filters?.startDate || "2024-01-01")
      .lte("created_at", filters?.endDate || new Date().toISOString())

    if (eventsError) {
      handleSupabaseError(eventsError, "getAnalyticsData - events")
    }

    // Get UTM source data
    const { data: utmData, error: utmError } = await supabase
      .from("tracking_data")
      .select("utm_source, utm_medium, utm_campaign")
      .gte("created_at", filters?.startDate || "2024-01-01")
      .lte("created_at", filters?.endDate || new Date().toISOString())

    if (utmError) {
      handleSupabaseError(utmError, "getAnalyticsData - utm")
    }

    // Process and return analytics
    const levelDistribution = levelCounts.reduce(
      (acc, item) => {
        acc[item.assessment_level] = (acc[item.assessment_level] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const eventCounts = events.reduce(
      (acc, item) => {
        acc[item.event_name] = (acc[item.event_name] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const utmSources = utmData.reduce(
      (acc, item) => {
        if (item.utm_source) {
          acc[item.utm_source] = (acc[item.utm_source] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      totalAssessments: levelCounts.length,
      levelDistribution,
      eventCounts,
      utmSources,
      conversionRate: eventCounts["lead_form_submitted"]
        ? Math.round((eventCounts["lead_form_submitted"] / eventCounts["email_gate_submitted"]) * 100)
        : 0,
    }
  } catch (error) {
    console.error("Error getting analytics data:", error)
    throw error
  }
}

// Export assessments to CSV
export const exportAssessmentsToCSV = async (filters?: {
  startDate?: string
  endDate?: string
  level?: string
}) => {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error("Database not configured")
  }

  try {
    const assessments = await getAssessments(filters)

    const csvData = assessments.map((assessment) => ({
      id: assessment.id,
      email: assessment.email,
      website: assessment.website,
      score: assessment.overall_score,
      level: assessment.assessment_level,
      completed_at: assessment.completed_at,
      utm_source: assessment.tracking_data?.[0]?.utm_source || "",
      utm_campaign: assessment.tracking_data?.[0]?.utm_campaign || "",
      has_lead: assessment.leads?.length > 0 ? "Yes" : "No",
      company: assessment.leads?.[0]?.company || "",
      business_type: assessment.leads?.[0]?.business_type || "",
    }))

    const headers = Object.keys(csvData[0] || {})
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => headers.map((header) => `"${row[header] || ""}"`).join(",")),
    ].join("\n")

    return csvContent
  } catch (error) {
    console.error("Error exporting assessments:", error)
    throw error
  }
}
