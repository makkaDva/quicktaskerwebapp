'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaEuroSign, FaFilter } from 'react-icons/fa';

interface Job {
  id: string;
  grad: string;
  adresa: string;
  dnevnica: number;
  wage_type: string;
  created_at: string;
}

export default function MyJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('user_email', user.email);

          if (error) throw error;
          setJobs(data || []);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
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
                My Jobs
              </span>
            </motion.h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Here are the jobs you&apos;ve posted
            </p>
          </div>

          {/* Job Listings */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {jobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 cursor-pointer"
                onClick={() => router.push(`/view-job/${job.id}`)}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                    {job.wage_type === 'per_day' ? 'Daily Rate' : 'Job offer'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(job.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">{job.grad}</h3>

                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <FaMapMarkerAlt className="text-green-600 w-5 h-5" />
                    </div>
                    <p className="text-gray-700">{job.adresa}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <FaEuroSign className="text-green-600 w-5 h-5" />
                    </div>
                    <p className="text-xl font-semibold text-green-600">
                      {job.dnevnica}€
                      <span className="text-sm text-gray-500 ml-2">
                        {job.wage_type === 'per day' ? '/day' : '/hour'}
                      </span>
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {jobs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-4xl mb-4">😕</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                No Jobs Posted Yet
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Start posting jobs to see them listed here
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
          <h2 className="text-3xl font-bold mb-6">Need Help Managing Your Jobs?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Explore tools and tips to make your job postings more effective
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-green-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition-all shadow-lg flex items-center gap-2 mx-auto"
          >
            <FaFilter className="w-5 h-5" />
            Manage Jobs
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
}