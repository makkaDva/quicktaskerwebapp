"use client";

import { motion, useInView } from 'framer-motion';
import { Star, Hammer, Sprout, UtensilsCrossed, UserCheck, ShieldCheck, Zap, BadgeDollarSign, CheckCircle } from 'lucide-react';
import { useRef } from 'react';

const staggerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Memoize JobCategory to avoid unnecessary re-renders
const JobCategory = React.memo(({ icon, title }: { 
  icon: React.ReactNode; 
  title: string; 
}) => (
  <motion.div
    variants={fadeInUp}
    whileHover={{ scale: 1.05 }}
    className="p-4 sm:p-6 bg-white/90 backdrop-blur-lg rounded-xl sm:rounded-3xl shadow-lg hover:shadow-xl transition-all border border-emerald-100/50"
  >
    <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-100/80 to-green-50 rounded-lg sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto">
      {icon}
    </div>
    <h3 className="text-lg sm:text-2xl font-bold text-gray-900 text-center bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
      {title}
    </h3>
  </motion.div>
));

// Memoize FeatureCard to avoid unnecessary re-renders
const FeatureCard = React.memo(({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
}) => (
  <motion.div 
    variants={fadeInUp}
    className="p-6 sm:p-8 bg-white/95 backdrop-blur-lg rounded-xl sm:rounded-3xl shadow-lg hover:shadow-xl transition-all border border-emerald-100/50 relative overflow-hidden group"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-emerald-50/10 opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-green-100 to-emerald-50 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6">
      {icon}
    </div>
    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">{title}</h3>
    <p className="text-gray-600 leading-relaxed text-base sm:text-lg">{description}</p>
  </motion.div>
));

export default function HomeClient() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Memoize the static stats array to avoid recreating it on every render
  const stats = useMemo(() => [
    { value: '100+', label: 'Daily Gigs Posted', icon: <BadgeDollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" /> },
    { value: '4.8', label: 'Average Rating', icon: <Star className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" /> },
    { value: '99%', label: 'Verified Workers', icon: <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" /> },
  ], []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/30 to-white">
      {/* Mobile-Optimized Hero */}
      <section className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center relative overflow-hidden">
        {/* Hide grid background on small screens */}
        <div className="absolute inset-0 hidden sm:block bg-[url('/svg/grid.svg')] opacity-[0.02] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto relative z-10 mb-24"
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight"
          >
            <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              Find Local Jobs
            </span>
            <br />
            <span className="text-2xl sm:text-3xl md:text-4xl font-medium text-gray-600 mt-2 sm:mt-4 block">
              Work that works for you
            </span>
          </motion.h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed">
            Connect with <span className="font-semibold text-emerald-600">verified local opportunities</span> in real-time.
            Simple, fast, and reliable - earn or hire in minutes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-16 sm:mb-20">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="min-h-[48px] bg-gradient-to-br from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white px-6 py-4 sm:px-8 sm:py-5 rounded-lg sm:rounded-[1.25rem] text-base sm:text-lg font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto"
            >
              <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
              Find Work Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="min-h-[48px] bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-6 py-4 sm:px-8 sm:py-5 rounded-lg sm:rounded-[1.25rem] text-base sm:text-lg font-semibold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto"
            >
              <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              Hire Workers
            </motion.button>
          </div>

          <HeroIllustration />
        </motion.div>

        {/* Value Proposition Grid */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-32 px-4"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 mb-20 sm:mb-28 max-w-6xl mx-auto"
        >
          {[
            { value: '100+', label: 'Daily Gigs Posted', icon: <BadgeDollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" /> },
            { value: '4.8', label: 'Average Rating', icon: <Star className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" /> },
            { value: '99%', label: 'Verified Workers', icon: <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" /> },
          ].map(({ value, label, icon }) => (
            <motion.div
              key={label}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="p-8 bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20"
            >
              <div className="text-emerald-600 mb-4">
                <CheckCircle className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{text}</h3>
              <p className="text-gray-600">Real-time connections with trusted local professionals</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Interactive Categories */}
        <section className="mb-32 relative">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
              Explore Opportunities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <InteractiveCard
                icon={<Hammer className="w-8 h-8 text-emerald-600" />}
                title="Skilled Trades"
                className="hover:border-green-100"
              />
              <InteractiveCard
                icon={<Sprout className="w-8 h-8 text-emerald-600" />}
                title="Outdoor Services"
                className="hover:border-emerald-100"
              />
              <InteractiveCard
                icon={<UtensilsCrossed className="w-8 h-8 text-emerald-600" />}
                title="Hospitality"
                className="hover:border-green-100"
              />
              <InteractiveCard
                icon={<UserCheck className="w-8 h-8 text-emerald-600" />}
                title="Personal Services"
                className="hover:border-emerald-100"
              />
            </div>
          </div>
        </section>

        {/* Animated Feature Section */}
        <section className="py-32 bg-gradient-to-br from-emerald-50/50 to-green-50/30 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <h2 className="text-4xl font-bold text-gray-900">
                  Transform Your Workforce Strategy
                </h2>
                <p className="text-xl text-gray-600">
                  Leverage our intelligent platform to find, manage, and retain top local talent
                </p>
                <ul className="space-y-6">
                  {['Real-time analytics', 'Automated scheduling', 'Integrated payments'].map((item) => (
                    <li key={item} className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      </div>
                      <span className="text-lg font-medium text-gray-900">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="relative h-96 bg-gradient-to-br from-green-100/30 to-emerald-100/20 rounded-[4rem] shadow-2xl border border-white/20 backdrop-blur-lg"
              >
                <div className="absolute -top-8 -left-8 w-32 h-32 bg-green-200/30 rounded-3xl transform rotate-45" />
                <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-emerald-200/20 rounded-[2rem] transform -rotate-12" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Dynamic CTA */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="relative py-32 bg-gradient-to-br from-green-700 to-emerald-600 rounded-[4rem] shadow-2xl overflow-hidden mx-4"
        >
          <div className="absolute inset-0 bg-[url('/svg/noise.svg')] opacity-10" />
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Experience the Future of Work?
            </h2>
            <p className="text-lg sm:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto opacity-90">
              Join 50,000+ professionals already finding success in our community
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="min-h-[48px] bg-white text-emerald-600 px-6 py-4 sm:px-8 sm:py-5 rounded-lg sm:rounded-[1.25rem] text-base sm:text-lg font-semibold hover:bg-gray-50 transition-all shadow-lg flex items-center justify-center gap-2 sm:gap-3 mx-auto w-full sm:w-auto"
            >
              <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
              Start Free Today
            </motion.button>
            <p className="mt-4 sm:mt-6 text-sm text-emerald-100/90">
              No credit card required • 24/7 support • Cancel anytime
            </p>
          </div>
        </motion.section>
      </section>
    </div>
  );
}
