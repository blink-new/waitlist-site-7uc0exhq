
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Share2, Star } from 'lucide-react'

function App() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [position, setPosition] = useState(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement actual waitlist signup
    setSubmitted(true)
    setPosition(Math.floor(Math.random() * 100) + 1) // Placeholder
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="hero-gradient absolute inset-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-6xl font-bold mb-6">
              The Future of <span className="gradient-text">Digital Experience</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands waiting to experience the next generation of digital interaction.
              Be among the first to get access.
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Join Waitlist
                  </button>
                </div>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/10 border border-white/20 rounded-lg p-6 max-w-md mx-auto"
              >
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">You're on the list!</h3>
                <p className="text-gray-400 mb-4">
                  Your position: #{position} 🎉
                </p>
                <button
                  onClick={() => {
                    // TODO: Implement sharing
                    navigator.clipboard.writeText(window.location.href)
                  }}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share with friends
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Features Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Star,
              title: "Premium Features",
              description: "Access exclusive tools and capabilities before anyone else."
            },
            {
              icon: CheckCircle,
              title: "Early Access",
              description: "Be among the first to experience the future."
            },
            {
              icon: Share2,
              title: "Invite Friends",
              description: "Share with friends to move up the waitlist."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-colors"
            >
              <feature.icon className="w-8 h-8 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Social Proof */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Join Our Growing Community</h2>
          <p className="text-gray-400">See what early access members are saying</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: "Alex Thompson",
              role: "Product Designer",
              comment: "The features are revolutionary. Can't wait for the full release!"
            },
            {
              name: "Sarah Chen",
              role: "Developer",
              comment: "This is exactly what I've been waiting for. The future is here."
            },
            {
              name: "Michael Roberts",
              role: "Entrepreneur",
              comment: "Game-changing platform. Getting in early was the best decision."
            }
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10"
            >
              <p className="text-gray-300 mb-4">"{testimonial.comment}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600" />
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            {
              q: "When will I get access?",
              a: "We're rolling out access gradually. Your position on the waitlist determines when you'll get in."
            },
            {
              q: "How can I move up the waitlist?",
              a: "Share your referral link with friends. Each signup moves you up!"
            },
            {
              q: "What features will be available?",
              a: "Early access members will get to try all premium features first."
            }
          ].map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-lg bg-white/5 border border-white/10"
            >
              <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
              <p className="text-gray-400">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center">
            <p className="text-gray-400">© 2024 Your Company. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Discord</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App