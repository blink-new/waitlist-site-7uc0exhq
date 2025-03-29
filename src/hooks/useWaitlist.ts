
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { waitlistApi } from '../lib/supabase'
import type { WaitlistEntry, WaitlistStats, UseWaitlistReturn } from '../types/waitlist'

export function useWaitlist(): UseWaitlistReturn {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [waitlistEntry, setWaitlistEntry] = useState<WaitlistEntry | null>(null)
  const [stats, setStats] = useState<WaitlistStats>({
    totalSignups: 0,
    referralLeaders: []
  })

  useEffect(() => {
    const controller = new AbortController()
    
    Promise.all([
      fetchStats(),
      checkReferral(),
      checkExistingEntry()
    ]).catch(console.error)

    return () => controller.abort()
  }, [])

  const checkExistingEntry = async () => {
    const savedEmail = localStorage.getItem('waitlistEmail')
    if (!savedEmail) return

    try {
      const entry = await waitlistApi.getEntry(savedEmail)
      setWaitlistEntry(entry)
      setEmail(savedEmail)
    } catch (error) {
      console.error('Error fetching existing entry:', error)
      localStorage.removeItem('waitlistEmail')
    }
  }

  const checkReferral = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const referralCode = urlParams.get('ref')
    if (!referralCode) return

    localStorage.setItem('referralCode', referralCode)
    toast.success('Referral code applied!')
  }

  const fetchStats = async () => {
    try {
      const stats = await waitlistApi.getStats()
      setStats(stats)
    } catch (error) {
      console.error('Error fetching stats:', error)
      toast.error('Failed to load stats')
    }
  }

  const generateReferralCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setLoading(true)

    try {
      const existing = await waitlistApi.getEntry(email).catch(() => null)

      if (existing) {
        setWaitlistEntry(existing)
        localStorage.setItem('waitlistEmail', email)
        toast.error('Email already registered!')
        return
      }

      const referralCode = generateReferralCode()
      const referredBy = localStorage.getItem('referralCode')

      const entry = await waitlistApi.createEntry({
        email,
        referral_code: referralCode,
        referred_by: referredBy,
        position: stats.totalSignups + 1,
        referral_count: 0
      })

      if (referredBy) {
        await waitlistApi.incrementReferralCount(referredBy)
      }

      setWaitlistEntry(entry)
      localStorage.setItem('waitlistEmail', email)
      toast.success('Successfully joined the waitlist!')
      await fetchStats()

    } catch (error) {
      console.error('Error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    if (!waitlistEntry) return
    
    const shareUrl = `${window.location.origin}?ref=${waitlistEntry.referral_code}`
    const shareData = {
      title: 'Join the waitlist!',
      text: 'Check out this awesome app!',
      url: shareUrl
    }
    
    try {
      if (navigator.share) {
        await navigator.share(shareData)
        toast.success('Thanks for sharing!')
      } else {
        await navigator.clipboard.writeText(shareUrl)
        toast.success('Referral link copied to clipboard!')
      }
    } catch (err) {
      console.error('Error sharing:', err)
      toast.error('Failed to share')
    }
  }

  return {
    email,
    setEmail,
    loading,
    waitlistEntry,
    stats,
    handleSubmit,
    handleShare
  }
}