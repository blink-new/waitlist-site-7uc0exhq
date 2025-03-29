
const requiredEnvs = {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
} as const

// Validate environment variables
Object.entries(requiredEnvs).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`)
  }
})

export const env = requiredEnvs