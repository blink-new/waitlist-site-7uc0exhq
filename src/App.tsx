
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, Users, ArrowRight, Copy, RefreshCw } from 'lucide-react'
import { Button } from './components/Button'
import { Input } from './components/Input'
import { Card } from './components/Card'
import { StatsCard } from './components/StatsCard'
import { PositionTracker } from './components/PositionTracker'
import { Leaderboard } from './components/Leaderboard'
import { useWaitlist } from './hooks/useWaitlist'
import { KEYBOARD_SHORTCUTS, triggerConfetti } from './lib/utils'
import { toast } from 'react-hot-toast'

function App() {
  const {
    email,
    setEmail,
    loading,
    waitlistEntry,
    stats,
    handleSubmit,
    handleShare,
    refreshStats
  } = useWaitlist()

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'k':
            e.preventDefault()
            handleShare()
            break
          case 'r':
            e.preventDefault()
            refreshStats()
            break
          case 'c':
            if (waitlistEntry) {
              e.preventDefault()
              navigator.clipboard.writeText(waitlistEntry.referral_code)
              toast.success('Copied to clipboard!')
            }
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [waitlistEntry, handleShare, refreshStats])

  const onSubmitSuccess = async () => {
    triggerConfetti()
    await refreshStats()
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

        <AnimatePresence mode="wait">
          {!waitlistEntry ? (
            <Card className="mt-12">
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={async (e) => {
                  await handleSubmit(e)
                  onSubmitSuccess()
                }}
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
            </Card>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-12 space-y-6"
            >
              <PositionTracker
                position={waitlistEntry.position}
                totalSignups={stats.totalSignups}
              />

              <Card>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <p className="text-sm text-white/80">
                      Share your referral link to move up the list!
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Button onClick={handleShare} variant="secondary">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Link
                        <kbd className="ml-2 text-xs">⌘K</kbd>
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          navigator.clipboard.writeText(waitlistEntry.referral_code)
                          toast.success('Copied to clipboard!')
                        }}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Code
                        <kbd className="ml-2 text-xs">⌘C</kbd>
                      </Button>
                    </div>
                  </div>

                  <motion.div className="pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/80">Your referral code</p>
                        <p className="text-xl font-mono font-bold">
                          {waitlistEntry.referral_code}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={refreshStats}
                        className="relative"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <kbd className="absolute -top-8 text-xs">⌘R</kbd>
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <StatsCard
              icon={<Users className="w-6 h-6" />}
              label="Total Signups"
              value={stats.totalSignups}
            />
          </div>
          <Leaderboard leaders={stats.referralLeaders} />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center text-sm text-white/60"
        >
          Built with ♥️ by the team
        </motion.p>
      </div>
    </div>
  )
}

export default App