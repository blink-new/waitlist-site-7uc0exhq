
import { createClient } from '@supabase/supabase-js'
import { env } from '../env'

export const supabase = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_ANON_KEY
)

export interface WaitlistEntry {
  id: string
  email: string
  referral_code: string
  referred_by?: string
  position: number
  referral_count: number
  created_at: string
}

// Helper functions for database operations
export const waitlistApi = {
  async getEntry(email: string) {
    const { data, error } = await supabase
      .from('waitlist')
      .select()
      .eq('email', email)
      .single()
    
    if (error) throw error
    return data as WaitlistEntry
  },

  async createEntry(entry: Omit<WaitlistEntry, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('waitlist')
      .insert([entry])
      .select()
      .single()
    
    if (error) throw error
    return data as WaitlistEntry
  },

  async incrementReferralCount(referralCode: string) {
    const { error } = await supabase.rpc('increment_referral_count', {
      code: referralCode
    })
    
    if (error) throw error
  },

  async getStats() {
    const [countResult, leadersResult] = await Promise.all([
      supabase.from('waitlist').select('id', { count: 'exact' }),
      supabase
        .from('waitlist')
        .select('email, referral_count')
        .order('referral_count', { ascending: false })
        .limit(3)
    ])

    if (countResult.error) throw countResult.error
    if (leadersResult.error) throw leadersResult.error

    return {
      totalSignups: countResult.count || 0,
      referralLeaders: leadersResult.data || []
    }
  }
}