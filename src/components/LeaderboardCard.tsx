
import { motion } from 'framer-motion'
import { Trophy, Star } from 'lucide-react'
import { Card } from './Card'

interface LeaderboardCardProps {
  leaders: Array<{
    email: string
    referral_count: number
  }>
}

export const LeaderboardCard = ({ leaders }: LeaderboardCardProps) => {
  return (
    <Card>
      <div className="flex items-center justify-center mb-4">
        <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
        <h3 className="font-medium">Top Referrers</h3>
      </div>
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {leaders.map((leader, i) => (
          <motion.div
            key={i}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center space-x-2">
              {i === 0 && <Star className="w-4 h-4 text-yellow-500" />}
              <span className="truncate max-w-[150px]">{leader.email}</span>
            </div>
            <span className="font-medium">{leader.referral_count}</span>
          </motion.div>
        ))}
        {leaders.length === 0 && (
          <p className="text-center text-white/50 text-sm">No referrals yet</p>
        )}
      </motion.div>
    </Card>
  )
}