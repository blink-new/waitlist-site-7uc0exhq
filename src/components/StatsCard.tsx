
import { motion } from 'framer-motion'
import { Card } from './Card'
import type { ReactNode } from 'react'

interface StatsCardProps {
  icon: ReactNode
  label: string
  value: string | number
}

export const StatsCard = ({ icon, label, value }: StatsCardProps) => {
  return (
    <Card className="text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center"
      >
        <div className="mb-3">{icon}</div>
        <p className="text-sm text-white/80">{label}</p>
        <p className="text-3xl font-bold gradient-text">{value}</p>
      </motion.div>
    </Card>
  )
}