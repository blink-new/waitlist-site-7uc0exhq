
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, CheckCircle, Share2, Star, Loader2 } from 'lucide-react'
import { Toaster, toast } from 'sonner'
import { supabase, type WaitlistEntry } from './lib/supabase'
import { generateReferralCode, formatNumber, getShareMessage } from './lib/utils'

function App() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [waitlistEntry, setWaitlistEntry] = useState<WaitlistEntry | null>(null)
  const [stats, setStats] = useState({ totalSignups: 0, referralLeaders: [] })

  useEffect(() => {
    // Check for referral code in URL
    const urlParams = new URLSearchParams(window.location.search)
    const refCode = urlParams.get('ref')
    if (refCode) {
      localStorage.setItem('referralCode', refCode)
    }

    // Fetch waitlist stats
    fetchStats()
  }, [])

  const fetchStats = async () => {
    const { data: totalCount } = await supabase
      .from('waitlist')
      .select('id', { count: 'exact' })

    const { data: leaders } = await supabase
      .from('waitlist')
      .select('email, referral_count')
      .order('referral_count', { ascending: false })
      .limit(3)

    setStats({
      totalSignups: totalCount?.length || 0,
      referralLeaders: leaders || []
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Check if email already exists
      const { data: existing } = await supabase
        .from('waitlist')
        .select()
        .eq('email', email)
        .single()

      if (existing) {
        setWaitlistEntry(existing)
        toast.error('Email already registered!')
        return
      }

      const referralCode = generateReferralCode()
      const referredBy = localStorage.getItem('referralCode')

      // Insert new entry
      const { data, error } = await supabase
        .from('waitlist')
        .insert([
          {
            email,
            referral_code: referralCode,
            referred_by: referredBy,
            position: stats.totalSignups + 1,
            referral_count: 0
          }
        ])
        .select()
        .single()

      if (error) throw error

      // Update referrer's count if exists
      if (referredBy) {
        await supabase.rpc('increment_referral_count', {
          code: referredBy
        })
      }

      setWaitlistEntry(data)
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

    const shareMessage = getShareMessage(waitlistEntry.referral_code)

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join the Waitlist',
          text: shareMessage,
          url: `${window.location.origin}?ref=${waitlistEntry.referral_code}`
        })
        toast.success('Shared successfully!')
      } catch (err) {
        await navigator.clipboard.writeText(shareMessage)
        toast.success('Copied to clipboard!')
      }
    } else {
      await navigator.clipboard.writeText(shareMessage)
      toast.success('Copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Toaster position="top-center" />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="hero-gradient absolute inset-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-6xl font-bold mb-6">
              The Future of <span className="gradient-text">Digital Experience</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join {formatNumber(stats.totalSignups)} others waiting to experience the next generation of digital interaction.
              Be among the first to get access.
            </p>

            <AnimatePresence mode="wait">
              {!waitlistEntry ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="max-w-md mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Joining...
                        </>
                      ) : (
                        <>
                          Join Waitlist
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white/10 border border-white/20 rounded-lg p-6 max-w-md mx-auto"
                >
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">You're on the list!</h3>
                  <p className="text-gray-400 mb-4">
                    Position #{formatNumber(waitlistEntry.position)} 🎉
                    {waitlistEntry.referral_count > 0 && (
                      <span className="block mt-1">
                        You've referred {waitlistEntry.referral_count} people!
                      </span>
                    )}
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={handleShare}
                      className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      Share with friends
                    </button>
                    <p className="text-sm text-gray-400">
                      Your referral code: <code className="bg-white/10 px-2 py-1 rounded">{waitlistEntry.referral_code}</code>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Leaderboard Section */}
      {stats.referralLeaders.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">Top Referrers</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {stats.referralLeaders.map((leader, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-xl font-bold">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Top Referrer</p>
                    <p className="font-medium">{leader.email.split('@')[0]}***</p>
                    <p className="text-sm text-purple-400">{leader.referral_count} referrals</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Features Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Star,
              title: "Premium Features",
              description: "Access exclusive tools and capabilities before anyone else."
            },
            {
              icon: CheckCircle,
              title: "Early Access",
              description: "Be among the first to experience the future."
            },
            {
              icon: Share2,
              title: "Invite Friends",
              description: "Share with friends to move up the waitlist faster."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-colors"
            >
              <feature.icon className="w-8 h-8 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            {
              q: "How does the referral system work?",
              a: "Share your unique referral code with friends. For each person who joins using your code, you'll move up in the waitlist!"
            },
            {
              q: "Can I check my position later?",
              a: "Yes! Just enter your email again and we'll show you your current position and referral stats."
            },
            {
              q: "What happens when I reach the top?",
              a: "You'll receive an exclusive email invitation to be among the first to access our platform."
            }
          ].map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-lg bg-white/5 border border-white/10"
            >
              <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
              <p className="text-gray-400">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400">© 2024 Your Company. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Discord</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App