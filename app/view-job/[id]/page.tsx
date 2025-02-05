'use client';
import { useState, useEffect } from 'react';
// import { Resend } from 'resend'; // Commented out
import supabase from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import { FaMapMarkerAlt, FaCalendarAlt, FaEnvelope, FaPhoneAlt, FaEuroSign, FaUsers } from 'react-icons/fa';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
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

export default function ViewJob() {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
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

    if (id) {
      fetchJob();
    }
  }, [id]);

  const handleBackToList = () => {
    router.push('/auth/find-jobs');
  };

  const handleApplyForJob = async () => {
    try {
      if (!job) throw new Error('Job data is not available.');

      // Get the current authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push('/auth/login'); // Redirect to the login page
        throw new Error('You must be logged in to apply for a job.');
      }

      // Get the current user's email
      const applicantEmail = user.email;
      const applicantName = user.user_metadata.name;

      if (!applicantEmail) {
        throw new Error('User email is not available.');
      }

      if (applicantEmail === job.user_email) {
        alert('You cannot apply for your own job.');
        return;
      }

      if (job.broj_radnika > 0) {
        // Update the number of workers needed
        const { error: updateError } = await supabase
          .from('jobs')
          .update({ broj_radnika: job.broj_radnika - 1 })
          .eq('id', job.id);

        if (updateError) throw updateError;

        // Fetch the updated job data
        const { data: updatedJob, error: fetchError } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;

        setJob(updatedJob);

        // Commented out: Call the API route to send the email
        /*
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            applicantName,
            applicantEmail,
            jobPosterEmail: job.user_email,
            jobDescription: job.opis,
            jobCity: job.grad,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          console.log('Email sent successfully:', result.data);
          alert('You have successfully applied for this job! The job poster has been notified.');
        } else {
          console.error('Error sending email:', result.error);
          alert('Job application successful, but email notification failed.');
        }
        */
      } else {
        alert('No more workers are needed for this job.');
      }
    } catch (error: any) {
      console.error('Error applying for job:', error);
      alert(`Error: ${error.message || 'Failed to apply for the job.'}`);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-600">{error}</div>;
  if (!job) return <div className="flex justify-center items-center h-screen">Job not found.</div>;

  const markerIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Job Details</h1>
        <div className="p-6 bg-white rounded-xl shadow-lg flex flex-col md:flex-row">
          {/* Job Info */}
          <div className="md:w-2/3 space-y-3 text-gray-600">
            <h2 className="text-2xl font-bold text-green-700 mb-2">{job.grad}</h2>
            <div className="flex items-center space-x-2">
              <FaMapMarkerAlt className="text-green-600" />
              <p>{job.adresa}</p>
            </div>
            <div className="flex items-center space-x-2">
              <FaEuroSign className="text-green-600" />
              <p>
                {job.dnevnica} € {job.wage_type.toLowerCase() === 'per day' ? 'per day' : 'per hour'}
              </p>
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
            <div className="border-t border-gray-300 pt-4 mt-4">
              <h3 className="text-xl font-semibold text-green-700">Job Description</h3>
              <p className="text-gray-700 mt-2">{job.opis}</p>
            </div>
          </div>

          {/* Map Container */}
          {job.latitude && job.longitude && (
            <div className="md:w-1/3 h-48 md:h-64 rounded-lg overflow-hidden shadow-lg ml-4">
              <MapContainer
                center={[job.latitude, job.longitude]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[job.latitude, job.longitude]} icon={markerIcon}>
                  <Popup>{job.grad}, {job.adresa}</Popup>
                </Marker>
              </MapContainer>
            </div>
          )}
        </div>

        {/* Buttons */}
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