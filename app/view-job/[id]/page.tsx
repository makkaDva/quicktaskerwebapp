'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import { FaMapMarkerAlt, FaCalendarAlt, FaEnvelope, FaPhoneAlt, FaEuroSign, FaUsers, FaArrowLeft } from 'react-icons/fa';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { Spinner } from '@/components/ui/spinner';

const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 animate-pulse rounded-xl" />
});
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

interface Job {
  id: string;
  grad: string;
  adresa: string;
  opis: string;
  dnevnica: number;
  wage_type: string;
  created_at: string;
  user_email: string;
  broj_telefona: string;
  broj_radnika: number;
  latitude: number;
  longitude: number;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function ViewJob() {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [L, setL] = useState<any>(null);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    import('leaflet').then((leaflet) => {
      setL(leaflet);
    });

    const fetchJob = async () => {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setJob(data);
      } catch (error) {
        console.error('Error fetching job:', error);
        setError('Failed to fetch job details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchJob();
  }, [id]);

  const handleBackToList = () => router.push('/find-jobs');

  const handleApplyForJob = async () => {
    if (!job || applying) return;
    
    try {
      setApplying(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      if (user.email === job.user_email) {
        alert('You cannot apply for your own job.');
        return;
      }

      if (job.broj_radnika <= 0) {
        alert('No more workers needed for this job.');
        return;
      }

      const { error } = await supabase
        .from('jobs')
        .update({ broj_radnika: job.broj_radnika - 1 })
        .eq('id', job.id);

      if (error) throw error;

      setJob(prev => prev ? { ...prev, broj_radnika: prev.broj_radnika - 1 } : null);
      alert('Application successful! The job poster has been notified.');

    } catch (error: any) {
      console.error('Application failed:', error);
      alert(error.message || 'Application failed. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex justify-center items-center">
      <Spinner className="w-12 h-12 text-green-600" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col justify-center items-center text-red-600 gap-4">
      <div className="text-xl">{error}</div>
      <button
        onClick={handleBackToList}
        className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors"
      >
        Return to Job List
      </button>
    </div>
  );

  if (!job) return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col justify-center items-center gap-4">
      <div className="text-xl text-gray-700">Job not found</div>
      <button
        onClick={handleBackToList}
        className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors"
      >
        Return to Job List
      </button>
    </div>
  );

  const markerIcon = L && new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <section className="container mx-auto px-4 sm:px-6 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="mb-12">
            <motion.button
              onClick={handleBackToList}
              whileHover={{ scale: 1.05 }}
              className="mb-8 flex items-center gap-2 text-green-600 hover:text-green-700"
            >
              <FaArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Jobs</span>
            </motion.button>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center"
            >
              <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                {job.grad}
              </span>
            </motion.h1>
          </div>

          {/* Main Content */}
          <motion.div
            variants={staggerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 gap-8"
          >
            {/* Job Details */}
            <motion.div
              variants={fadeInUp}
              className="p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FaEuroSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {job.dnevnica}€
                      <span className="text-lg text-gray-600 ml-2">
                        ({job.wage_type.toLowerCase()})
                      </span>
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-2 text-green-600">
                      <FaUsers className="w-5 h-5" />
                      <span className="font-semibold">Positions Left</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mt-2">
                      {job.broj_radnika}
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-2 text-green-600">
                      <FaCalendarAlt className="w-5 h-5" />
                      <span className="font-semibold">Posted</span>
                    </div>
                    <div className="text-gray-900 mt-2">
                      {new Date(job.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <FaMapMarkerAlt className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Address</h3>
                      <p className="text-gray-600">{job.adresa}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <FaPhoneAlt className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Contact</h3>
                      <p className="text-gray-600">{job.broj_telefona}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <FaEnvelope className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                      <p className="text-gray-600 break-all">{job.user_email}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Job Description</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {job.opis}
                </p>
              </div>
            </motion.div>

            {/* Map Section */}
            <motion.div
              variants={fadeInUp}
              className="h-full w-full rounded-2xl overflow-hidden shadow-xl border border-gray-100"
            >
              {job.latitude && job.longitude && L && (
                <MapContainer
                  center={[job.latitude, job.longitude]}
                  zoom={15}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[job.latitude, job.longitude]} icon={markerIcon}>
                    <Popup className="text-sm font-semibold">
                      {job.grad}, {job.adresa}
                    </Popup>
                  </Marker>
                </MapContainer>
              )}
            </motion.div>
          </motion.div>

          {/* Apply Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-center"
          >
            <button
              onClick={handleApplyForJob}
              disabled={applying || job.broj_radnika <= 0}
              className="bg-gradient-to-br from-green-600 to-emerald-500 text-white px-12 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {applying ? (
                <div className="flex items-center gap-2">
                  <Spinner className="w-5 h-5 text-current" />
                  Applying...
                </div>
              ) : (
                `Apply Now ${job.broj_radnika > 0 ? `(${job.broj_radnika} positions left)` : ''}`
              )}
            </button>
            {job.broj_radnika <= 0 && (
              <p className="text-red-600 mt-2">This position is no longer available</p>
            )}
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}