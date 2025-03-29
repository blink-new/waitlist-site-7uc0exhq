
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Medal } from 'lucide-react'
import { Avatar } from './Avatar'
import { formatNumber } from '../lib/utils'

interface LeaderboardProps {
  leaders: Array<{
    email: string
    referral_count: number
  }>
}

export function Leaderboard({ leaders }: LeaderboardProps) {
  const medals = ['text-yellow-500', 'text-gray-400', 'text-amber-600']

  return (
    <div className="p-6 rounded-xl glass">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Top Referrers</h3>
        <Trophy className="w-6 h-6 text-yellow-500" />
      </div>

      <AnimatePresence>
        <div className="space-y-4">
          {leaders.map((leader, i) => (
            <motion.div
              key={leader.email}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar email={leader.email} size="sm" animate />
                  {i < 3 && (
                    <Medal className={`w-4 h-4 absolute -top-1 -right-1 ${medals[i]}`} />
                  )}
                </div>
                <span className="text-sm truncate max-w-[150px]">{leader.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <motion.span
                  key={leader.referral_count}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="font-medium"
                >
                  {formatNumber(leader.referral_count)}
                </motion.span>
                <span className="text-sm text-white/60">referrals</span>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {leaders.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-white/50"
        >
          <p>No referrals yet</p>
          <p className="text-sm mt-1">Be the first to refer friends!</p>
        </motion.div>
      )}
    </div>
  )
}