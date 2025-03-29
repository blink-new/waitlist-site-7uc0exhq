
import { motion } from 'framer-motion'
import { getInitials } from '../lib/utils'

interface AvatarProps {
  email: string
  size?: 'sm' | 'md' | 'lg'
  animate?: boolean
}

export function Avatar({ email, size = 'md', animate = false }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg'
  }

  const Component = animate ? motion.div : 'div'

  return (
    <Component
      className={`relative rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center font-medium text-white ${sizeClasses[size]}`}
      initial={animate ? { scale: 0.5, opacity: 0 } : undefined}
      animate={animate ? { scale: 1, opacity: 1 } : undefined}
      transition={{ type: 'spring', stiffness: 200 }}
    >
      {getInitials(email)}
    </Component>
  )
}