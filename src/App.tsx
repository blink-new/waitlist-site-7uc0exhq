
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Share2, Trophy, Users, Star, ArrowRight } from 'lucide-react'
import { Button } from './components/Button'
import { Input } from './components/Input'
import { Card } from './components/Card'
import { waitlistApi, type WaitlistEntry } from './lib/supabase'
import { toast } from 'react-hot-toast'

function App() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [waitlistEntry, setWaitlistEntry] = useState<WaitlistEntry | null>(null)
  const [stats, setStats] = useState<{
    totalSignups: number
    referralLeaders: { email: string; referral_count: number }[]
  }>({
    totalSignups: 0,
    referralLeaders: []
  })

  useEffect(() => {
    fetchStats()
    checkReferral()
    checkExistingEntry()
  }, [])

  const checkExistingEntry = async () => {
    const savedEmail = localStorage.getItem('waitlistEmail')
    if (savedEmail) {
      try {
        const entry = await waitlistApi.getEntry(savedEmail)
        setWaitlistEntry(entry)
        setEmail(savedEmail)
      } catch (error) {
        console.error('Error fetching existing entry:', error)
      }
    }
  }

  const checkReferral = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const referralCode = urlParams.get('ref')
    if (referralCode) {
      localStorage.setItem('referralCode', referralCode)
      toast.success('Referral code applied!')
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
    const shareUrl = `${window.location.origin}?ref=${waitlistEntry?.referral_code}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join the waitlist!',
          text: 'Check out this awesome app!',
          url: shareUrl
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Referral link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Join the <span className="gradient-text">Waitlist</span>
          </h1>
          <p className="mt-4 text-lg text-white/80">
            Be the first to know when we launch. Invite friends to move up the list!
          </p>
        </motion.div>

        <Card className="mt-12">
          {!waitlistEntry ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" isLoading={loading} className="w-full">
                Join Waitlist
                <ArrowRight className="w-4 h-4 ml-2 inline" />
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-white/5 text-center">
                <p className="text-sm text-white/80">Your position</p>
                <p className="text-4xl font-bold gradient-text">
                  #{waitlistEntry.position}
                </p>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm text-white/80">
                  Share your referral link to move up the list!
                </p>
                <Button onClick={handleShare} variant="secondary" className="w-full">
                  <Share2 className="w-4 h-4 mr-2 inline" />
                  Share Referral Link
                </Button>
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-sm text-white/80">Your referral code</p>
                <p className="text-xl font-mono font-bold">
                  {waitlistEntry.referral_code}
                </p>
              </div>
            </div>
          )}
        </Card>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <Card className="text-center">
            <Users className="w-6 h-6 mx-auto mb-3" />
            <p className="text-sm text-white/80">Total Signups</p>
            <p className="text-3xl font-bold gradient-text">
              {stats.totalSignups}
            </p>
          </Card>

          <Card>
            <div className="flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
              <h3 className="font-medium">Top Referrers</h3>
            </div>
            <div className="space-y-2">
              {stats.referralLeaders.map((leader, i) => (
                <div key={i} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-white/5">
                  <div className="flex items-center space-x-2">
                    {i === 0 && <Star className="w-4 h-4 text-yellow-500" />}
                    <span className="truncate">{leader.email}</span>
                  </div>
                  <span className="font-medium">{leader.referral_count}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default App