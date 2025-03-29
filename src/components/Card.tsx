
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx('glass rounded-2xl p-6', className)}
    >
      {children}
    </motion.div>
  )
}