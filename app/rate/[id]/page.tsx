// app/rate/[jobId]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import RatingPage from '../../components/RatingPage';
import { Loader2 } from 'lucide-react';
import { isValidUUID } from '@/lib/utils';

interface JobData {
  id: string;
  title: string;
  worker_id: string | null;
  workers: {
    id: string;
    full_name: string;
  } | null;
}

export default function RateJobPage({ params }: { params: { jobId: string } }) {
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();
  
  useEffect(() => {
    const fetchJobData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Validate UUID format
        if (!isValidUUID(params.jobId)) {
          throw new Error('Invalid job ID format');
        }

        const { data: job, error: jobError } = await supabase
          .from('jobs')
          .select(`
            id,
            title,
            worker_id,
            workers:worker_id (
              id,
              full_name
            )
          `)
          .eq('id', params.jobId)
          .single();

        if (jobError) throw jobError;
        if (!job) throw new Error('Job not found');
        
        // Validate worker relationship
        if (!job.worker_id || !job.workers) {
          throw new Error('Worker information not found for this job');
        }

        setJobData(job);
      } catch (err: unknown) {
        console.error('Error fetching job data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobData();
  }, [params.jobId, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
      </div>
    );
  }
  
  if (error || !jobData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Unable to load job details'}
          </h2>
          <p className="text-gray-600 mb-6">
            Please check the link and try again, or contact support.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <RatingPage
      jobId={params.jobId}
      userId={jobData.worker_id!}
      workerName={jobData.workers?.full_name || 'Unknown Worker'}
      jobTitle={jobData.title}
    />
  );
}