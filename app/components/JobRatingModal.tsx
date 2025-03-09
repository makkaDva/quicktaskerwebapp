// components/JobRatingModal.tsx
"use client";

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import RatingPage from './RatingPage';

type JobRatingModalProps = {
  id: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function JobRatingModal({ 
  id, 
  isOpen, 
  onClose 
}: JobRatingModalProps) {
  const [jobData, setJobData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  const [error, setError] = useState<string | null>(null);
  
useEffect(() => {
    if (!isOpen) return;
    
    const fetchJobData = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('jobs')
          .select(`
            id,
            title,
            client_id,
            worker_id,
            workers:worker_id (id, full_name),
            status,
            created_at
          `)
          .eq('id', id)
          .single();
    
        if (error) throw error;
        if (!data) throw new Error('Job not found');
    
        setJobData(data);
      } catch (err) {
        console.error('Error fetching job data:', err);
        // Handle error state in your UI
        setError('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobData();
}, [id, isOpen, supabase]);
  
  if (!isOpen) return null;
  
  if (loading || !jobData) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-auto p-8 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  return (
    <RatingPage
      id={id}
      workerId={jobData.worker_id}
      workerName={jobData.workers.full_name}
      jobTitle={jobData.title}
      isModal={true}
      onClose={onClose}
    />
  );
}