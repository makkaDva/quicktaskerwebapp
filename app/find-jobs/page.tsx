'use client';
import { ReactNode } from "react";
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaMapMarkerAlt, FaCalendarAlt, FaEuroSign, FaFilter } from 'react-icons/fa';
import { Spinner } from '@/components/ui/spinner';
import { Suspense } from 'react';

interface Job {
  vrsta_posla: ReactNode;
  id: string;
  grad: string;
  adresa: string;
  dnevnica: number;
  wage_type: string;
  created_at: string;
  broj_radnika: number; // Add this line
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

function FindJobsContent() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<'newest' | 'oldest'>('newest');
  const router = useRouter();
  const searchParams = useSearchParams();

  // Query parameters extraction
  const city = searchParams.get('city') || '';
  const wageType = searchParams.get('wageType') || '';
  const wageFrom = parseFloat(searchParams.get('wageFrom') || '0');
  const wageTo = parseFloat(searchParams.get('wageTo') || 'Infinity');
  const dateFrom = searchParams.get('dateFrom') || '';
  const dateTo = searchParams.get('dateTo') || '';

  // Sorting and filtering logic
  const sortedJobs = [...jobs].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortOption === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const filteredJobs = sortedJobs.filter((job) => {
    const jobDate = new Date(job.created_at).toISOString().split('T')[0];
    const matchesCity = city ? job.grad.toLowerCase().includes(city.toLowerCase()) : true;
    const matchesWageType = wageType ? job.wage_type.toLowerCase() === wageType.toLowerCase() : true;
    const matchesWageRange = job.dnevnica >= wageFrom && job.dnevnica <= wageTo;
    const matchesDateRange =
      (!dateFrom || jobDate >= dateFrom) && (!dateTo || jobDate <= dateTo);

    return matchesCity && matchesWageType && matchesWageRange && matchesDateRange;
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('id, grad, adresa, dnevnica, wage_type, created_at, vrsta_posla, broj_radnika'); // Add broj_radnika here

        if (error) throw error;
        setJobs(data?.filter((job) => job.id) || []);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError('Failed to fetch jobs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex justify-center items-center">
        <Spinner className="w-12 h-12 text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex justify-center items-center text-red-600 text-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <section className="container mx-auto px-4 sm:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header Section */}
          <div className="text-center mb-16">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                Find Your Next Opportunity
              </span>
            </motion.h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover local jobs that match your skills and availability
            </p>
          </div>

          {/* Filters Section */}
          <motion.div
            variants={fadeInUp}
            className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg mb-12 border border-gray-100"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-2 text-green-600">
                <FaFilter className="w-5 h-5" />
                <span className="font-semibold">Filters:</span>
              </div>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as 'newest' | 'oldest')}
                className="p-2 rounded-lg border border-gray-200 bg-white/50"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </motion.div>

          {/* Job Listings */}
          <motion.div
            variants={staggerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredJobs.map((job) => (
              <motion.div
                key={job.id}
                variants={fadeInUp}
                whileHover={{ scale: job.broj_radnika > 0 ? 1.02 : 1 }}
                className={`p-6 ${job.broj_radnika === 0 ? 'bg-gray-200' : 'bg-white/90'} backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 cursor-pointer`}
                onClick={() => job.broj_radnika > 0 && router.push(`/view-job/${job.id}`)}
              >
                {job.broj_radnika === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200/90 rounded-2xl">
                    <span className="text-2xl font-bold text-gray-600 -rotate-45">Popunjeno</span>
                  </div>
                )}
                <div className="mb-4 flex items-center justify-between">
                  <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                    {'Job offer'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(job.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">{job.vrsta_posla}</h3>
                
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <FaMapMarkerAlt className="text-green-600 w-5 h-5" />
                    </div>
                    <p className="text-gray-700">{job.grad}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <FaEuroSign className="text-green-600 w-5 h-5" />
                    </div>
                    <p className="text-xl font-semibold text-green-600">
                      {job.dnevnica}€
                      <span className="text-sm text-gray-500 ml-2">
                        {job.wage_type === 'Per day' ? '/day' : '/hour'}
                      </span>
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {filteredJobs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-4xl mb-4">😕</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                No Jobs Found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Try adjusting your filters or check back later for new opportunities
              </p>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-green-600 to-emerald-500 text-white py-16"
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Can't Find Your Perfect Job?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Sign up for job alerts and be the first to know about new opportunities
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-green-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition-all shadow-lg flex items-center gap-2 mx-auto"
          >
            <FaFilter className="w-5 h-5" />
            Set Up Job Alerts
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
}

export default function FindJobs() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex justify-center items-center">
        <Spinner className="w-12 h-12 text-green-600" />
      </div>
    }>
      <FindJobsContent />
    </Suspense>
  );
}