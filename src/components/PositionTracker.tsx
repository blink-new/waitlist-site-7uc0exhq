
import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import { formatNumber } from '../lib/utils'

interface PositionTrackerProps {
  position: number
  totalSignups: number
}

export function PositionTracker({ position, totalSignups }: PositionTrackerProps) {
  const progress = ((totalSignups - position) / totalSignups) * 100
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-6 rounded-xl glass"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-white/80">Your Position</h3>
          <p className="text-3xl font-bold gradient-text">#{formatNumber(position)}</p>
        </div>
        <Trophy className="w-8 h-8 text-yellow-500" />
      </div>

      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-cyan-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>

      <div className="mt-2 flex justify-between text-sm text-white/60">
        <span>Top {Math.round(progress)}%</span>
        <span>{formatNumber(totalSignups)} total signups</span>
      </div>
    </motion.div>
  )
}