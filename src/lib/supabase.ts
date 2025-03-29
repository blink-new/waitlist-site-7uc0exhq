
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project.supabase.co'
const supabaseKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface WaitlistEntry {
  id: string
  email: string
  referral_code: string
  referred_by?: string
  position: number
  referral_count: number
  created_at: string
}