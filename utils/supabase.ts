import { createClient } from "@supabase/supabase-js"
import type { Database } from "../types/database"

// Check if Supabase is configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only create client if both URL and key are provided
export const supabase = supabaseUrl && supabaseAnonKey ? createClient<Database>(supabaseUrl, supabaseAnonKey) : null

// Helper function to check if Supabase is available
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any, context: string) => {
  console.error(`Supabase error in ${context}:`, error)
  throw new Error(`Database operation failed: ${error.message}`)
}
