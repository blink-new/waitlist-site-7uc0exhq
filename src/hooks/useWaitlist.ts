
import { useState } from 'react'
import { MOCK_DATA, type MockDataState } from '../lib/mockData'

interface WaitlistEntry {
  email: string
  referral_code: string
  position: number
  referral_count: number
}

interface Stats {
  totalSignups: number
  referralLeaders: Array<{
    email: string
    referral_count: number
  }>
}

const PREVIEW = true // Set this to true to see mock data

export function useWaitlist() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [mockState, setMockState] = useState<MockDataState>('empty')
  
  // In preview mode, we'll use mock data
  const [waitlistEntry, setWaitlistEntry] = useState<WaitlistEntry | null>(
    PREVIEW ? null : null
  )
  
  const [stats, setStats] = useState<Stats>(
    PREVIEW ? MOCK_DATA.stats : { totalSignups: 0, referralLeaders: [] }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    if (PREVIEW) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))
      setWaitlistEntry(MOCK_DATA.newSignup)
      setMockState('new-signup')
      setLoading(false)
      return
    }

    // Real API implementation would go here
    setLoading(false)
  }

  const handleShare = async () => {
    if (PREVIEW) {
      // Simulate share action
      console.log('Sharing...')
      return
    }
    // Real share implementation would go here
  }

  const refreshStats = async () => {
    if (PREVIEW) {
      setLoading(true)
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Toggle between different states for preview
      if (mockState === 'empty') {
        setWaitlistEntry(MOCK_DATA.newSignup)
        setMockState('new-signup')
      } else if (mockState === 'new-signup') {
        setWaitlistEntry(MOCK_DATA.activeUser)
        setMockState('active-user')
      } else {
        setWaitlistEntry(null)
        setMockState('empty')
      }
      
      setLoading(false)
      return
    }
    // Real refresh implementation would go here
  }

  return {
    email,
    setEmail,
    loading,
    waitlistEntry,
    stats,
    handleSubmit,
    handleShare,
    refreshStats,
  }
}