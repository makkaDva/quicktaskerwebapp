'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { isValidUUID } from '@/lib/utils';
import ErrorMessage from './ErrorMessage';

interface RatingPageProps {
  JobId: string;
  workerId: string | null;
  workerName: string;
  jobTitle: string;
}

export default function RatingPage({ 
  jobId,
  userId
}: { 
  jobId: string;
  userId: string;
}) {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobDetails, setJobDetails] = useState<{
    title: string;
    workerName: string;
  } | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        if (!isValidUUID(jobId)) {
          throw new Error('Invalid job ID format');
        }

        const { data, error } = await supabase
          .from('jobs')
          .select(`
            title,
            workers:worker_id (full_name)
          `)
          .eq('id', jobId)
          .single();

        if (error || !data) {
          throw new Error(error?.message || 'Job not found');
        }

        setJobDetails({
          title: data.title,
          workerName: data.workers?.[0]?.full_name || 'Unknown Worker'
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load job details');
      }
    };

    fetchJobData();
  }, [jobId, supabase]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (!rating) {
        throw new Error('Please select a rating');
      }

      const { error } = await supabase
        .from('job_ratings')
        .upsert({
          job_id: jobId,
          user_id: userId,
          rating,
          comment
        });

      if (error) throw error;

      router.push('/confirmation');
    } catch (err) {
      handleSupabaseError(err);
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!jobDetails) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-6">Rate {jobDetails.workerName}</h1>
      
      <div className="mb-8">
        <p className="text-gray-600 mb-4">Job: {jobDetails.title}</p>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`p-2 ${rating && rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
            >
              <Star className="w-8 h-8 fill-current" />
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Additional comments..."
        className="w-full p-4 border rounded-lg mb-6"
        rows={4}
      />

      <button
        onClick={handleSubmit}
        disabled={!rating || isSubmitting}
        className="w-full bg-blue-600 text-white p-4 rounded-lg disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Rating'}
      </button>
    </div>
  );
}