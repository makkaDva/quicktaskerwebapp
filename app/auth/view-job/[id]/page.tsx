'use client';
import { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation'; // Import useRouter for navigation
import { FaMapMarkerAlt, FaCalendarAlt, FaEnvelope, FaPhoneAlt, FaEuroSign } from 'react-icons/fa';

interface Job {
  id: string;
  grad: string;
  adresa: string;
  opis: string;
  dnevnica: number;
  created_at: string;
  user_email: string;
  broj_telefona: string;
}

export default function ViewJob() {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const router = useRouter(); // Initialize useRouter
  console.log('ID from URL:', id);

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
    router.push('/auth/find-jobs'); // Adjust the route to your job list page
  };

  const handleApplyForJob = () => {
    // Add your logic for applying to the job
    alert(`Applying for job: ${job?.grad}`);
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
        

        {/* Job Details Section */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Job Details</h1>
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-green-700 mb-2">{job.grad}</h2>
          <div className="space-y-3 text-gray-600">
            <div className="flex items-center space-x-2">
              <FaMapMarkerAlt className="text-green-600" />
              <p>{job.adresa}</p>
            </div>
            <p className="text-gray-700">{job.opis}</p>
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
            
          </div>
          
        </div>
        {/* Buttons Section */}
        <div className="flex justify-between mb-8">
          {/* Back to Job List Button (Red) */}
          <button
            onClick={handleBackToList}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Back to Job List
          </button>

          {/* Apply for this Job Button (Green with Hover) */}
          <button
            onClick={handleApplyForJob}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Apply for this Job
          </button>
        </div>
      </div>
      
    </div>
  );
}