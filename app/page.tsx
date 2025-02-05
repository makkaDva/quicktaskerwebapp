// app/HomeClient.tsx
"use client";

import { motion, useInView } from 'framer-motion';
import { Star, Hammer, Sprout, UtensilsCrossed, UserCheck, ShieldCheck, Zap, BadgeDollarSign } from 'lucide-react';
import { useRef } from 'react';

const staggerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const JobCategory = ({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) => (
  <motion.div
    variants={fadeInUp}
    whileHover={{ scale: 1.05 }}
    className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100"
  >
    <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-50 rounded-xl flex items-center justify-center mb-6 mx-auto">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-gray-900 text-center">{title}</h3>
  </motion.div>
);

const FeatureCard = ({ icon, title, description }: { 
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <motion.div 
    variants={fadeInUp}
    className="p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-100"
  >
    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </motion.div>
);

export default function HomeClient() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              gg
            </span>
            <br />
            nista mikrofon check
          </motion.h1>

          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Connect with local opportunities in real-time. Whether you need extra hands 
            or want to earn - simple, fast, and reliable.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-br from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-lg flex items-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Find Work Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-sm flex items-center gap-2"
            >
              <UserCheck className="w-5 h-5" />
              Hire Workers
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerVariants}
          className="grid md:grid-cols-3 gap-8 mb-28 max-w-6xl mx-auto"
        >
          {[
            { value: '100+', label: 'Daily Gigs Posted', icon: <BadgeDollarSign className="w-8 h-8" /> },
            { value: '4.8', label: 'Average Rating', icon: <Star className="w-8 h-8" /> },
            { value: '99%', label: 'Verified Workers', icon: <ShieldCheck className="w-8 h-8" /> },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={fadeInUp}
              className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-100"
            >
              <div className="text-green-600 mb-4">{stat.icon}</div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Job Categories */}
        <section className="mb-28">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
              Popular Gig Categories
            </h2>
            <motion.div
              variants={staggerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
            >
              <JobCategory
                icon={<Hammer className="w-8 h-8 text-green-600" />}
                title="Construction"
              />
              <JobCategory
                icon={<Sprout className="w-8 h-8 text-green-600" />}
                title="Yard Work"
              />
              <JobCategory
                icon={<UtensilsCrossed className="w-8 h-8 text-green-600" />}
                title="Event Staff"
              />
              <JobCategory
                icon={<ShieldCheck className="w-8 h-8 text-green-600" />}
                title="Home Services"
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="mb-28">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
              Why Choose Kviky
            </h2>
            <motion.div
              variants={staggerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              <FeatureCard
                icon={<Zap className="w-6 h-6 text-green-600" />}
                title="Instant Matching"
                description="Get connected with local workers or jobs in under 5 minutes"
              />
              <FeatureCard
                icon={<ShieldCheck className="w-6 h-6 text-green-600" />}
                title="Verified Profiles"
                description="All users undergo strict identity and background checks"
              />
              <FeatureCard
                icon={<BadgeDollarSign className="w-6 h-6 text-green-600" />}
                title="Secure Payments"
                description="Escrow protection and instant payouts for completed jobs"
              />
              <FeatureCard
                icon={<Star className="w-6 h-6 text-green-600" />}
                title="Rating System"
                description="Transparent reviews from both workers and employers"
              />
            </motion.div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-green-600 to-emerald-500 text-white py-20 rounded-[2.5rem] shadow-2xl"
        >
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-6">Start Today, Earn Tomorrow</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join our community of 50,000+ trusted users transforming local work
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-green-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition-all shadow-lg flex items-center gap-2 mx-auto"
            >
              <Zap className="w-5 h-5" />
              Get Started Free
            </motion.button>
            <p className="mt-6 text-sm text-green-100">
              No credit card required • Cancel anytime
            </p>
          </div>
        </motion.section>
      </section>
    </div>
  );
}