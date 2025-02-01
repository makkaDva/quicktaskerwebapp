'use client';
import { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { FaMapMarkerAlt, FaCalendarAlt, FaEnvelope, FaPhoneAlt, FaEuroSign } from 'react-icons/fa';

interface Job {
  id: string; // Change from uid to id
  grad: string;
  adresa: string;
  opis: string;
  dnevnica: number;
  created_at: string;
  user_email: string;
  broj_telefona: string;
}

export default function FindJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*');

        if (error) throw error;

        // Filter out invalid jobs (those without an ID)
        const validJobs = data?.filter((job) => job.id) || [];
        setJobs(validJobs);
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
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Find Jobs</h1>
        <div className="space-y-6">
          {jobs.map((job) => (
            <div
              key={job.id} // Use job.id as the key
              onClick={() => router.push(`/auth/view-job/${job.id}`)}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            >
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}