
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  isLoading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading,
  className,
  ...props
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={clsx(
        'relative px-6 py-3 rounded-xl font-medium transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variant === 'primary' && 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white',
        variant === 'secondary' && 'glass text-white',
        className
      )}
      disabled={isLoading}
      {...props}
    >
      <span className={clsx(isLoading && 'opacity-0')}>
        {children}
      </span>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </motion.button>
  )
}