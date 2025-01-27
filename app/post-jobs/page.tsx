"use client";
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';

export default function PostJob() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    grad: '',
    adresa: '',
    opis: '',
    dnevnica: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      // Provera autentifikacije
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user?.email) {
        setErrorMessage('Morate biti prijavljeni da biste postavili oglas');
        setTimeout(() => router.push('/'), 2000);
        return;
      }

      // Validacija brojčanog polja
      if (isNaN(Number(formData.dnevnica))) {
        setErrorMessage('Dnevnica mora biti brojčana vrednost');
        return;
      }

      // Insert u Supabase
      const { error } = await supabase
        .from('jobs')
        .insert([{
          ...formData,
          dnevnica: Number(formData.dnevnica),
          user_email: user.email,
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) {
        console.error('Supabase Error:', error);
        setErrorMessage(`Greška pri postavljanju: ${error.message}`);
        return;
      }

      // Uspešno postavljanje
      alert('Oglas uspešno postavljen!');
      router.push('/find-jobs');

    } catch (err) {
      console.error('General Error:', err);
      setErrorMessage('Došlo je do neočekivane greške');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Postavite novi oglas</h1>
        
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md">
          {/* Prikaz greške */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {errorMessage}
            </div>
          )}

          <div className="grid gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grad <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                value={formData.grad}
                onChange={(e) => setFormData({...formData, grad: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresa <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                value={formData.adresa}
                onChange={(e) => setFormData({...formData, adresa: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opis posla <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                className="w-full px-3 py-2 border rounded-md h-32 focus:ring-2 focus:ring-blue-500"
                value={formData.opis}
                onChange={(e) => setFormData({...formData, opis: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dnevnica (RSD) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                className="w-full px-3 py-2 border rounded-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                value={formData.dnevnica}
                onChange={(e) => setFormData({...formData, dnevnica: e.target.value})}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex justify-center items-center gap-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {loading ? 'Postavljanje...' : 'Postavi oglas'}
          </button>
        </form>
      </div>
    </div>
  );
}