"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';

export default function PostJobs() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    grad: '',
    adresa: '',
    broj_telefona: '',
    dnevnica: '',
    opis: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        console.error('Auth error:', error);
        router.push('/');
      }
    };
    checkAuth();
  }, [router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const phoneRegex = /^\+?[0-9\s-]{6,}$/;

    if (!formData.grad.trim()) newErrors.grad = 'Grad je obavezan';
    if (!formData.adresa.trim()) newErrors.adresa = 'Adresa je obavezna';
    if (!formData.broj_telefona.trim()) {
      newErrors.broj_telefona = 'Broj telefona je obavezan';
    } else if (!phoneRegex.test(formData.broj_telefona)) {
      newErrors.broj_telefona = 'Nevalidan format telefona';
    }
    if (!formData.dnevnica.trim()) {
      newErrors.dnevnica = 'Dnevnica je obavezna';
    } else if (isNaN(Number(formData.dnevnica))) {
      newErrors.dnevnica = 'Mora biti broj';
    }
    if (!formData.opis.trim()) newErrors.opis = 'Opis posla je obavezan';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('Niste autentifikovani');
      }

      const { data, error } = await supabase
        .from('jobs')
        .insert([{
          grad: formData.grad,
          adresa: formData.adresa,
          broj_telefona: formData.broj_telefona,
          dnevnica: Number(formData.dnevnica),
          opis: formData.opis,
          user_email: user.email
        }])
        .select();

      if (error) throw error;

      router.push('/auth/find-jobs');
    } catch (error: any) {
      console.error('Full error:', error);
      alert(`Greška: ${error.message || 'Došlo je do neočekivane greške'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-8">Post job offer</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-black font-medium mb-2">City *</label>
            <input
              type="text"
              name="grad"
              value={formData.grad}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg text-black ${errors.grad ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.grad && <p className="text-red-500 text-sm mt-1">{errors.grad}</p>}
          </div>

          <div>
            <label className="block text-black font-medium mb-2">Address *</label>
            <input
              type="text"
              name="adresa"
              value={formData.adresa}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg text-black ${errors.adresa ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.adresa && <p className="text-red-500 text-sm mt-1">{errors.adresa}</p>}
          </div>

          <div>
            <label className="block text-black font-medium mb-2">Phone number *</label>
            <input
              type="tel"
              name="broj_telefona"
              value={formData.broj_telefona}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg text-black ${errors.broj_telefona ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.broj_telefona && <p className="text-red-500 text-sm mt-1">{errors.broj_telefona}</p>}
          </div>

          <div>
            <label className="block text-black font-medium mb-2">Wage (RSD) *</label>
            <input
              type="number"
              name="dnevnica"
              value={formData.dnevnica}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg text-black ${errors.dnevnica ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.dnevnica && <p className="text-red-500 text-sm mt-1">{errors.dnevnica}</p>}
          </div>

          <div>
            <label className="block text-black font-medium mb-2">Job Description *</label>
            <textarea
              name="opis"
              value={formData.opis}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg text-black h-32 ${errors.opis ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.opis && <p className="text-red-500 text-sm mt-1">{errors.opis}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Posting...' : 'Post job offer'}
          </button>
        </form>
      </div>
    </div>
  );
}