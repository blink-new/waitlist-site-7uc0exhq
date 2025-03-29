
import { type ClassValue, clsx } from "clsx"
import { nanoid } from 'nanoid'
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateReferralCode() {
  return nanoid(8)
}

export function formatNumber(num: number) {
  return new Intl.NumberFormat('en-US').format(num)
}

export function getShareMessage(referralCode: string) {
  return `Join me on the waitlist for the next big thing! Use my referral code: ${referralCode}\n\n${window.location.origin}?ref=${referralCode}`
}