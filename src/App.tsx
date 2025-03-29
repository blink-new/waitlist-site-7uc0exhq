
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, Users, ArrowRight } from 'lucide-react'
import { Button } from './components/Button'
import { Input } from './components/Input'
import { Card } from './components/Card'
import { StatsCard } from './components/StatsCard'
import { LeaderboardCard } from './components/LeaderboardCard'
import { useWaitlist } from './hooks/useWaitlist'

function App() {
  const {
    email,
    setEmail,
    loading,
    waitlistEntry,
    stats,
    handleSubmit,
    handleShare
  } = useWaitlist()

  return (
    <>
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

          <AnimatePresence mode="wait">
            <Card className="mt-12">
              {!waitlistEntry ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-label="Email address"
                  />
                  <Button type="submit" isLoading={loading} className="w-full">
                    Join Waitlist
                    <ArrowRight className="w-4 h-4 ml-2 inline" />
                  </Button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <motion.div 
                    className="p-4 rounded-xl bg-white/5 text-center"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <p className="text-sm text-white/80">Your position</p>
                    <p className="text-4xl font-bold gradient-text">
                      #{waitlistEntry.position}
                    </p>
                  </motion.div>
                  
                  <div className="space-y-3">
                    <p className="text-sm text-white/80">
                      Share your referral link to move up the list!
                    </p>
                    <Button onClick={handleShare} variant="secondary" className="w-full">
                      <Share2 className="w-4 h-4 mr-2 inline" />
                      Share Referral Link
                    </Button>
                  </div>

                  <motion.div 
                    className="pt-4 border-t border-white/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-sm text-white/80">Your referral code</p>
                    <p className="text-xl font-mono font-bold">
                      {waitlistEntry.referral_code}
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </Card>
          </AnimatePresence>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <StatsCard
              icon={<Users className="w-6 h-6" />}
              label="Total Signups"
              value={stats.totalSignups}
            />
            <LeaderboardCard leaders={stats.referralLeaders} />
          </div>
        </div>
      </div>
    </>
  )
}

export default App