"use client";

import { motion, useInView, useTransform } from 'framer-motion';
import { Star, Hammer, Sprout, UtensilsCrossed, UserCheck, ShieldCheck, Zap, BadgeDollarSign, ArrowRight, CheckCircle } from 'lucide-react';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils'; // Assuming you have utility classes
import { useRouter } from 'next/navigation'; // Updated import

const HeroIllustration = () => (
  <div className="relative max-w-2xl mx-auto">
    <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/10 blur-3xl rounded-full" />
    <div className="relative grid grid-cols-3 gap-4 transform rotate-12">
      {[...Array(9)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="h-20 bg-white/20 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10"
        />
      ))}
    </div>
  </div>
);

const InteractiveCard = ({
  icon,
  title,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  className?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "p-6 bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border-2 transition-all duration-300 relative overflow-hidden",
        className
      )}
    >
      <motion.div
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50"
      />
      <div className="relative z-10">
        <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-6">
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <motion.div
          animate={{ x: isHovered ? 5 : 0 }}
          className="text-emerald-600 flex items-center gap-2"
        >
          <span className="font-medium">Explore</span>
          <ArrowRight className="w-5 h-5" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function HomeClient() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const router = useRouter(); // Using the hook to get router instance

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/20 to-white overflow-hidden">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-32 text-center relative">
        <div className="absolute inset-0 bg-[url('/svg/grid.svg')] opacity-[0.03] pointer-events-none" />
        
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
              Redefining Local Work
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Where <span className="font-semibold text-emerald-600">opportunity</span> meets{' '}
            <span className="font-semibold text-green-600">talent</span> in your community
          </motion.p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-24">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative bg-gradient-to-br from-green-600 to-emerald-500 text-white px-8 py-5 rounded-2xl text-lg font-semibold shadow-2xl hover:shadow-emerald-200/40 transition-all"
              onClick={() => router.push("/register-page")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              <span className="relative flex items-center gap-3">
                <Zap className="w-6 h-6" />
                Get Started Now
              </span>
            </motion.button>
          </div>

          <HeroIllustration />
        </motion.div>

        {/* Value Proposition Grid */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-32 px-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
          }}
        >
          {['Instant Matching', 'Verified Professionals', 'Secure Payments'].map((text, i) => (
            <motion.div
              key={text}
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
            <p className="text-xl text-emerald-100/90 mb-12 max-w-2xl mx-auto">
              Join thousands of businesses and professionals already revolutionizing their local workforce
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-emerald-600 px-8 py-5 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl flex items-center gap-3"
                onClick={() => router.push("/post-jobs")}
              >
                <UserCheck className="w-6 h-6" />
                Hire Talent
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 text-white px-8 py-5 rounded-2xl text-lg font-semibold backdrop-blur-lg hover:bg-white/20 border border-white/20 flex items-center gap-3"
                onClick={() => router.push("/find-jobs")}
              >
                <BadgeDollarSign className="w-6 h-6" />
                Start Earning
              </motion.button>
            </div>
          </div>
        </motion.section>
      </section>
    </div>
  );
}
