"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push('/');
    };
    checkAuth();
  }, []);

  // U handleOptionSelect funkciji promenite:
  const handleOptionSelect = (option: string) => {
    if(option === 'oglasavanje') router.push('/auth/post-jobs');
    if(option === 'trazim') router.push('/auth/find-jobs');
  };
  

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dobrodosli na Quicktasker</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Kartica za oglašavanje poslova */}
          <div 
            onClick={() => handleOptionSelect('oglasavanje')}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Oglasavam poslove</h2>
                <p className="text-gray-600 mt-1">Postavite nove poslove i upravljajte oglasima</p>
              </div>
            </div>
          </div>

          {/* Kartica za traženje poslova */}
          <div 
            onClick={() => handleOptionSelect('trazim')}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Trazim posao</h2>
                <p className="text-gray-600 mt-1">Pronađite poslove koji odgovaraju vašim kvalifikacijama</p>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={async () => {
            await supabase.auth.signOut();
            router.push('/');
          }}
          className="w-full md:w-auto px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Odjavi se
        </button>
      </div>
    </div>
  );
}