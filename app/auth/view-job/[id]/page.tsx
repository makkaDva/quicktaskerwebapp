'use client';
import { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import { FaMapMarkerAlt, FaCalendarAlt, FaEnvelope, FaPhoneAlt, FaEuroSign, FaUsers } from 'react-icons/fa';

interface Job {
  id: string;
  grad: string;
  adresa: string;
  opis: string;
  dnevnica: number;
  created_at: string;
  user_email: string;
  broj_telefona: string;
  broj_radnika: number;
}

export default function ViewJob() {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        console.log('Fetched Job Data:', data);
        setJob(data);
      } catch (error) {
        console.error('Error fetching job:', error);
        setError('Failed to fetch job details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id]);

  const handleBackToList = () => {
    router.push('/auth/find-jobs');
  };

  const handleApplyForJob = async () => {
    try {
      if (!job) {
        throw new Error('Job data is not available.');
      }

      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('You must be logged in to apply for a job.');
      }

      if (user.email === job.user_email) {
        alert('You cannot apply for your own job.');
        return;
      }

      if (job.broj_radnika > 0) {
        console.log('Updating broj_radnika to:', job.broj_radnika - 1);

        const { error: updateError } = await supabase
          .from('jobs')
          .update({ broj_radnika: job.broj_radnika - 1 })
          .eq('id', job.id);

        if (updateError) throw updateError;

        console.log('Fetching updated job data...');

        const { data: updatedJob, error: fetchError } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;

        console.log('Updated Job Data:', updatedJob);

        setJob(updatedJob);
        alert('You have successfully applied for this job!');
      } else {
        alert('No more workers are needed for this job.');
      }
    } catch (error: any) {
      console.error('Error applying for job:', error);
      alert(`Error: ${error.message || 'Failed to apply for the job.'}`);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-600">{error}</div>;
  }

  if (!job) {
    return <div className="flex justify-center items-center h-screen">Job not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Job Details</h1>
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-green-700 mb-2">{job.grad}</h2>
          <div className="space-y-3 text-gray-600">
            <div className="flex items-center space-x-2">
              <FaMapMarkerAlt className="text-green-600" />
              <p>{job.adresa}</p>
            </div>
            <div className="flex items-center space-x-2">
              <FaEuroSign className="text-green-600" />
              <p>{job.dnevnica} € per day</p>
            </div>
            <div className="flex items-center space-x-2">
              <FaCalendarAlt className="text-green-600" />
              <p>Posted on: {new Date(job.created_at).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center space-x-2">
              <FaEnvelope className="text-green-600" />
              <p>{job.user_email}</p>
            </div>
            <div className="flex items-center space-x-2">
              <FaPhoneAlt className="text-green-600" />
              <p>{job.broj_telefona}</p>
            </div>
            <div className="flex items-center space-x-2">
              <FaUsers className="text-green-600" />
              <p>Workers Needed: {job.broj_radnika}</p>
            </div>
            {/* Job description moved to last */}
            <div className="border-t border-gray-300 pt-4 mt-4">
              <h3 className="text-xl font-semibold text-green-700">Job Description</h3>
              <p className="text-gray-700 mt-2">{job.opis}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={handleBackToList}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Back to Job List
          </button>

          <button
             onClick={handleApplyForJob}
             disabled={!job}
             className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400"
          >
              Apply for this Job
          </button>
        </div>
      </div>
    </div>
  );
}
