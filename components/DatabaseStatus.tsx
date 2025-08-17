"use client"

import { useEffect, useState } from "react"
import { supabase, isSupabaseConfigured } from "../utils/supabase"

interface DatabaseStatus {
  configured: boolean
  connected: boolean
  tablesExist: {
    assessments: boolean
    leads: boolean
    events: boolean
  }
  error?: string
}

export const DatabaseStatus = () => {
  const [status, setStatus] = useState<DatabaseStatus>({
    configured: false,
    connected: false,
    tablesExist: {
      assessments: false,
      leads: false,
      events: false,
    },
  })

  useEffect(() => {
    checkDatabaseStatus()
  }, [])

  const checkDatabaseStatus = async () => {
    // First check if Supabase is configured
    if (!isSupabaseConfigured()) {
      setStatus({
        configured: false,
        connected: false,
        tablesExist: {
          assessments: false,
          leads: false,
          events: false,
        },
        error: "Supabase environment variables not configured",
      })
      return
    }

    if (!supabase) {
      setStatus({
        configured: false,
        connected: false,
        tablesExist: {
          assessments: false,
          leads: false,
          events: false,
        },
        error: "Supabase client not initialized",
      })
      return
    }

    try {
      // Test basic connection
      const { data, error } = await supabase.from("assessments").select("count", { count: "exact", head: true })

      if (error) {
        setStatus({
          configured: true,
          connected: false,
          tablesExist: {
            assessments: false,
            leads: false,
            events: false,
          },
          error: error.message,
        })
        return
      }

      // Check which tables exist
      const tablesExist = {
        assessments: true, // We know this exists if we got here
        leads: false,
        events: false,
      }

      // Test leads table
      try {
        await supabase.from("leads").select("count", { count: "exact", head: true })
        tablesExist.leads = true
      } catch (e) {
        console.log("Leads table not found")
      }

      // Test events table
      try {
        await supabase.from("events").select("count", { count: "exact", head: true })
        tablesExist.events = true
      } catch (e) {
        console.log("Events table not found")
      }

      setStatus({
        configured: true,
        connected: true,
        tablesExist,
      })
    } catch (error) {
      setStatus({
        configured: true,
        connected: false,
        tablesExist: {
          assessments: false,
          leads: false,
          events: false,
        },
        error: error.message,
      })
    }
  }

  // Only show in development - hidden in production
  if (process.env.NODE_ENV === "production") {
    return null
  }

  return (
    <div
      className="fixed bottom-4 right-4 bg-white border border-gray-300 p-4 text-xs max-w-xs z-50"
      style={{ borderRadius: "4px" }}
    >
      <h4 className="font-semibold mb-2">Database Status</h4>
      <div className="space-y-1">
        <div className={`flex items-center ${status.configured ? "text-green-600" : "text-red-600"}`}>
          <span className="mr-2">{status.configured ? "✓" : "✗"}</span>
          <span>Configuration: {status.configured ? "OK" : "Missing"}</span>
        </div>
        <div className={`flex items-center ${status.connected ? "text-green-600" : "text-red-600"}`}>
          <span className="mr-2">{status.connected ? "✓" : "✗"}</span>
          <span>Connection: {status.connected ? "Connected" : "Failed"}</span>
        </div>
        <div className={`flex items-center ${status.tablesExist.assessments ? "text-green-600" : "text-yellow-600"}`}>
          <span className="mr-2">{status.tablesExist.assessments ? "✓" : "○"}</span>
          <span>Assessments Table</span>
        </div>
        <div className={`flex items-center ${status.tablesExist.leads ? "text-green-600" : "text-yellow-600"}`}>
          <span className="mr-2">{status.tablesExist.leads ? "✓" : "○"}</span>
          <span>Leads Table</span>
        </div>
        <div className={`flex items-center ${status.tablesExist.events ? "text-green-600" : "text-yellow-600"}`}>
          <span className="mr-2">{status.tablesExist.events ? "✓" : "○"}</span>
          <span>Events Table</span>
        </div>
        {status.error && (
          <div className="text-red-600 mt-2">
            <div className="font-semibold">Error:</div>
            <div className="text-xs">{status.error}</div>
          </div>
        )}
      </div>
      <button
        onClick={checkDatabaseStatus}
        className="mt-2 bg-blue-500 text-white px-2 py-1 text-xs hover:bg-blue-600"
        style={{ borderRadius: "2px" }}
      >
        Refresh
      </button>
    </div>
  )
}
