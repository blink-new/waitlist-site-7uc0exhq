
export const MOCK_DATA = {
  newSignup: {
    email: "sarah.miller@example.com",
    referral_code: "SARAH7X9",
    position: 1337,
    referral_count: 0
  },
  activeUser: {
    email: "john.doe@example.com",
    referral_code: "JOHN4K2",
    position: 42,
    referral_count: 15
  },
  stats: {
    totalSignups: 8427,
    referralLeaders: [
      { email: "emma.wilson@example.com", referral_count: 45 },
      { email: "alex.turner@example.com", referral_count: 38 },
      { email: "michael.brown@example.com", referral_count: 32 },
      { email: "lisa.anderson@example.com", referral_count: 28 },
      { email: "david.clark@example.com", referral_count: 25 }
    ]
  }
} as const

export type MockDataState = "new-signup" | "active-user" | "empty"