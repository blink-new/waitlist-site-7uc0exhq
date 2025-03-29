
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import confetti from 'canvas-confetti'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num)
}

export function getInitials(email: string): string {
  return email
    .split('@')[0]
    .split(/[-._]/)
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function triggerConfetti() {
  const duration = 3000
  const end = Date.now() + duration

  ;(function frame() {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#4F46E5', '#06B6D4']
    })
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#4F46E5', '#06B6D4']
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  })()
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return function(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export const KEYBOARD_SHORTCUTS = {
  SHARE: ['⌘', 'K'],
  COPY: ['⌘', 'C'],
  REFRESH: ['⌘', 'R']
} as const