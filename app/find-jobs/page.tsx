"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';

interface Job {
  id: string;
  grad: string;
  adresa: string;
  opis: string;
  dnevnica: number;
  user_email: string;
  created_at: string;
}

export default function FindJobs() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }
  
      // Dodajte console.log za debug
      console.log('Pokušavam da dohvatim poslove...');
  
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
  
      if (error) {
        console.error('Greška pri dohvatanju poslova:', error);
        return;
      }
  
      console.log('Dohvaćeni poslovi:', data); // <-- Proverite podatke
      setJobs(data || []);
      setLoading(false);
    };
  
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dostupni poslovi</h1>
        
        {loading ? (
          <div className="text-center">Učitavam...</div>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{job.grad}</h2>
                    <p className="text-gray-600">{job.adresa}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {job.dnevnica} RSD/dan
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{job.opis}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-2">Poslodavac:</span>
                  <span className="font-medium">{job.user_email}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}