
export interface WaitlistEntry {
  id: string
  email: string
  position: number
  referral_code: string
  referred_by?: string
  referral_count: number
  created_at: string
}

export interface WaitlistStats {
  totalSignups: number
  referralLeaders: {
    email: string
    referral_count: number
  }[]
}

export interface UseWaitlistReturn {
  email: string
  setEmail: (email: string) => void
  loading: boolean
  waitlistEntry: WaitlistEntry | null
  stats: WaitlistStats
  handleSubmit: (e: React.FormEvent) => Promise<void>
  handleShare: () => Promise<void>
}