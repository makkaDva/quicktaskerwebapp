'use client';
import { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaMapMarkerAlt, FaCalendarAlt, FaEuroSign } from 'react-icons/fa';

interface Job {
  id: string;
  grad: string;
  adresa: string;
  dnevnica: number;
  wage_type: string; // Add wage_type to the interface
  created_at: string;
}

export default function FindJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<'newest' | 'oldest'>('newest');
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract query parameters
  const city = searchParams.get('city') || '';
  const wageType = searchParams.get('wageType') || '';
  const wageFrom = parseFloat(searchParams.get('wageFrom') || '0');
  const wageTo = parseFloat(searchParams.get('wageTo') || 'Infinity');
  const dateFrom = searchParams.get('dateFrom') || '';
  const dateTo = searchParams.get('dateTo') || '';

  // Sort jobs based on the selected option
  const sortedJobs = [...jobs].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortOption === 'newest' ? dateB - dateA : dateA - dateB;
  });

  // Filter jobs based on query parameters
  const filteredJobs = sortedJobs.filter((job) => {
    const jobDate = new Date(job.created_at).toISOString().split('T')[0];
    const matchesCity = city ? job.grad.toLowerCase().includes(city.toLowerCase()) : true;
    const matchesWageType = wageType ? job.wage_type === wageType : true;
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
          .select('id, grad, adresa, dnevnica, wage_type, created_at'); // Fetch wage_type along with other fields

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
          {filteredJobs.map((job) => (
            <div
              key={job.id} // Use job.id as the key
              onClick={() => router.push(`/view-job/${job.id}`)}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            >
              <h2 className="text-2xl font-bold text-green-700 mb-2">{job.grad}</h2>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-center space-x-2">
                  <FaMapMarkerAlt className="text-green-600" />
                  <p>{job.adresa}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <FaEuroSign className="text-green-600" />
                  <p>
                    {job.dnevnica} € {job.wage_type === 'per_day' ? 'per day' : 'per hour'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCalendarAlt className="text-green-600" />
                  <p>Posted on: {new Date(job.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}