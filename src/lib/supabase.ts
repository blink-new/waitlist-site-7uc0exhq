
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface WaitlistEntry {
  id: string
  email: string
  position: number
  referral_code: string
  referred_by?: string
  referral_count: number
  created_at: string
}

export const waitlistApi = {
  async createEntry(entry: Omit<WaitlistEntry, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('waitlist')
      .insert([entry])
      .select()
      .single()

    if (error) throw error
    return data as WaitlistEntry
  },

  async getEntry(email: string) {
    const { data, error } = await supabase
      .from('waitlist')
      .select()
      .eq('email', email)
      .single()

    if (error) throw error
    return data as WaitlistEntry
  },

  async incrementReferralCount(referralCode: string) {
    const { error } = await supabase.rpc('increment_referral_count', {
      ref_code: referralCode
    })

    if (error) throw error
  },

  async getStats() {
    const [totalSignups, referralLeaders] = await Promise.all([
      supabase.from('waitlist').select('id', { count: 'exact' }),
      supabase
        .from('waitlist')
        .select('email, referral_count')
        .order('referral_count', { ascending: false })
        .limit(5)
    ])

    if (totalSignups.error) throw totalSignups.error
    if (referralLeaders.error) throw referralLeaders.error

    return {
      totalSignups: totalSignups.count || 0,
      referralLeaders: referralLeaders.data
    }
  }
}