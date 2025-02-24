// app/auth/my-jobs/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaEuroSign, FaFilter } from 'react-icons/fa';
import { ErrorBoundary } from 'react-error-boundary';

interface Job {
  id: string;
  grad: string;
  adresa: string;
  dnevnica: number;
  wage_type: string;
  created_at: string;
}

// Error Fallback Component
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button
          onClick={resetErrorBoundary}
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

// Job Card Component
function JobCard({ job, onClick }: { job: Job; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 cursor-pointer"
      onClick={onClick}
    >
      {/* Your existing job card content */}
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
              {job.wage_type === 'per_day' ? '/day' : '/hour'}
            </span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// JobsList Component
function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('user_email', user.email);

        if (error) throw error;
        setJobs(data || []);
      } catch (error) {
        setError(error instanceof Error ? error : new Error('Failed to fetch jobs'));
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    throw error; // This will be caught by the ErrorBoundary
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Your existing JSX */}
      <section className="container mx-auto px-4 sm:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Jobs list */}
          <motion.div initial="hidden" animate="visible" className="space-y-8">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onClick={() => router.push(`/view-job/${job.id}`)}
              />
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
    </div>
  );
}

// Default export wrapped in ErrorBoundary
export default function MyJobsPage() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <JobsList />
    </ErrorBoundary>
  );
}