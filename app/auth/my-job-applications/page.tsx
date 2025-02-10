'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';
import { Spinner } from '@/components/ui/spinner';
import { motion } from 'framer-motion';
import { FaEuroSign, FaMapMarkerAlt } from 'react-icons/fa';

interface Job {
  id: string;
  grad: string;
  adresa: string;
  opis: string;
  dnevnica: number;
  wage_type: string;
  created_at: string;
  user_email: string;
  broj_telefona: string;
  broj_radnika: number;
  latitude: number;
  longitude: number;
  date_from: string;
  date_to: string;
  hours_per_day: number;
  applicants?: string[];
}

export default function MyJobApplicationsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserDisplayName, setCurrentUserDisplayName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndJobs = async () => {
      try {
        // Fetch the current user's display name
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const displayName = user.user_metadata?.name || null;
        setCurrentUserDisplayName(displayName);

        // Fetch all jobs where the user is an applicant
        const { data: jobsData, error } = await supabase
          .from('jobs')
          .select('*')
          .contains('applicants', [displayName]);

        if (error) throw error;

        setJobs(jobsData || []);
      } catch (error) {
        console.error('Error fetching job applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndJobs();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex justify-center items-center">
        <Spinner className="w-12 h-12 text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <section className="container mx-auto px-4 sm:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center"
            >
              <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                My Job Applications
              </span>
            </motion.h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto text-center">
              Here are the jobs you've applied for.
            </p>
          </div>

          {/* Job Listings */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {jobs.length > 0 ? (
              jobs.map((job) => (
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
              ))
            ) : (
              <p className="text-gray-600 text-center">You haven't applied for any jobs yet.</p>
            )}
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}