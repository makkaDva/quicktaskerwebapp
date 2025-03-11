'use client';
import { FaUser, FaArrowRight, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import { FaMapMarkerAlt, FaCalendarAlt, FaEnvelope, FaPhoneAlt, FaEuroSign, FaUsers, FaArrowLeft, FaTrash } from 'react-icons/fa';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { Spinner } from '@/components/ui/spinner';
import { Link } from 'lucide-react';

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
  date_from: string;
  date_to: string;
  hours_per_day: number;
  applicants?: Array<{ display_name: string; email: string }>;
  accepted_applicants?: Array<{ display_name: string; email: string }>;
}

interface AdminData {
  email: string;
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
  const [leafletModule, setLeafletModule] = useState<typeof import('leaflet') | null>(null);
  const [markerIcon, setMarkerIcon] = useState<L.Icon | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const { id } = useParams();
  const router = useRouter();

  // Initialize Leaflet and markerIcon
  useEffect(() => {
    import('leaflet').then((leaflet) => {
      setLeafletModule(leaflet);
      const icon = new leaflet.Icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      setMarkerIcon(icon);
    });
  }, []);

  useEffect(() => {
    const checkIfAdmin = async () => {
      if (!currentUserEmail) return;
      try {
        const { data, error } = await supabase.from("admins").select("email");
        if (error) {
          console.error("Error fetching admin emails:", error);
          setIsAdmin(false);
          return;
        }
        const isAdmin = data.some(admin => admin.email === currentUserEmail);
        setIsAdmin(isAdmin);
      } catch (err) {
        console.error("Unexpected error checking admin status:", err);
        setIsAdmin(false);
      }
    };
    checkIfAdmin();
  }, [currentUserEmail]);

  useEffect(() => {
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

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserEmail(user.email || "");
    };

    if (id) {
      fetchJob();
      fetchUser();
    }
  }, [id]);

  const handleBackToList = () => router.push('/find-jobs');


  const handleAcceptApplicant = async (index: number) => {
    if (!job?.applicants || job.applicants.length <= index) return;
    try {
      const applicant = job.applicants[index];
      const updatedApplicants = job.applicants.filter((_, i) => i !== index);
      const updatedAccepted = [...(job.accepted_applicants || []), applicant];
  
      const { error } = await supabase
        .from('jobs')
        .update({
          broj_radnika: job.broj_radnika - 1,
          applicants: updatedApplicants,
          accepted_applicants: updatedAccepted
        })
        .eq('id', job.id);
  
      setJob(prev => prev ? {
        ...prev,
        broj_radnika: prev.broj_radnika - 1,
        applicants: updatedApplicants,
        accepted_applicants: updatedAccepted
      } : null);
    } catch (error) {
      // ... error handling
    }
  };

  const handleRemoveAcceptedApplicant = async (index: number) => {
    if (!job || !job.accepted_applicants || job.accepted_applicants.length <= index) return;
    try {
      const updatedBrojRadnika = job.broj_radnika + 1;
      const updatedAcceptedApplicants = job.accepted_applicants.filter((_, i) => i !== index);
      const { error } = await supabase
        .from('jobs')
        .update({ broj_radnika: updatedBrojRadnika, accepted_applicants: updatedAcceptedApplicants })
        .eq('id', job.id);
      if (error) throw error;
      setJob(prev => prev ? { ...prev, broj_radnika: updatedBrojRadnika, accepted_applicants: updatedAcceptedApplicants } : null);
      alert('Applicant removed successfully!');
    } catch (error) {
      console.error('Error removing applicant:', error);
      alert('Failed to remove applicant. Please try again.');
    }
  };

  const handleDeclineApplicant = async (index: number) => {
    if (!job || !job.applicants || job.applicants.length <= index) return;
    try {
      const updatedApplicants = job.applicants.filter((_, i) => i !== index);
      const { error } = await supabase
        .from('jobs')
        .update({ applicants: updatedApplicants })
        .eq('id', job.id);
      if (error) throw error;
      setJob(prev => prev ? { ...prev, applicants: updatedApplicants } : null);
      alert('Applicant declined successfully!');
    } catch (error) {
      console.error('Error declining applicant:', error);
      alert('Failed to decline applicant. Please try again.');
    }
  };

  const handleApplyForJob = async () => {
    if (!job || applying) return;
    try {
      setApplying(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setShowLoginPopup(true);
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
      
      const applicantName = user.user_metadata?.name || 'Unknown Applicant';
      const applicantEmail = user.email || 'Unknown Email';
  
      // Check if already applied using email
      if (job.applicants?.some(app => app.email === applicantEmail)) {
  alert('You have already applied for this job.');
  return;
}
  
      const { error } = await supabase
        .from('jobs')
        .update({ 
          applicants: [...(job.applicants || []), 
          { display_name: applicantName, email: applicantEmail }
          ] 
        })
        .eq('id', job.id);
  
      setJob(prev => prev ? { 
        ...prev, 
        applicants: [...(prev.applicants || []), 
        { display_name: applicantName, email: applicantEmail }
      ] } : null);
      alert('Application successful! The job poster has been notified.');
    } catch (error) {
      // ... error handling
    } finally {
      setApplying(false);
    }
  };


  const [profileLoading, setProfileLoading] = useState(false);

  const handleViewSomeonesProfile = async (email: string) => {
    try {
      setProfileLoading(true);
  
      // Normalize the email (trim and convert to lowercase)
      const normalizedEmail = email.trim().toLowerCase();
  
      // Query the usersvisible table
              console.log('Querying email:', email);

        const { data: user, error } = await supabase
          .from('usersvisible')
          .select('uid, email, "Display Name"')
          .eq('email', email)
          .maybeSingle();

        console.log('Query Result:', user, error);
      if (error) {
        console.error('Supabase Error:', error);
        throw new Error(`Failed to find user: ${error.message}`);
      }
  
      if (!user) {
        throw new Error('User profile not found');
      }
  
      // Navigate to the profile page using the UID
      router.push(`/view-someones-profile/${user.uid}`);
    } catch (error) {
      console.error('Profile Navigation Error:', error);
      if (error instanceof Error) {
        setError(error.message || 'Failed to load profile');
      } else {
        setError('Failed to load profile');
      }
    } finally {
      setProfileLoading(false);
    }
  };


  const handleDeleteJob = async () => {
    if (!job || !currentUserEmail) return;
    const { data: adminData } = await supabase
      .from("admins")
      .select("email")
      .eq("email", currentUserEmail)
      .single<AdminData>();
    const isAdmin = !!adminData;
    const isJobPoster = currentUserEmail === job.user_email;
    if (!isAdmin && !isJobPoster) {
      alert("You don't have permission to delete this job.");
      return;
    }
    try {
      const { error } = await supabase.from("jobs").delete().eq("id", job.id);
      if (error) throw error;
      alert("Job deleted successfully.");
      router.push("/find-jobs");
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete job. Please try again.");
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
      <button onClick={handleBackToList} className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors">
        Return to Job List
      </button>
    </div>
  );

  if (!job) return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col justify-center items-center gap-4">
      <div className="text-xl text-gray-700">Job not found</div>
      <button onClick={handleBackToList} className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors">
        Return to Job List
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <section className="container mx-auto px-4 sm:px-6 py-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
          <div className="mb-12">
            <motion.button onClick={handleBackToList} whileHover={{ scale: 1.05 }} className="mb-8 flex items-center gap-2 text-green-600 hover:text-green-700">
              <FaArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Jobs</span>
            </motion.button>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">
              <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">{job.grad}</span>
            </motion.h1>
          </div>

          <motion.div variants={staggerVariants} initial="hidden" animate="visible" className="grid md:grid-cols-2 gap-8">
            <motion.div variants={fadeInUp} className="p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FaEuroSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {job.dnevnica}€
                      <span className="text-lg text-gray-600 ml-2">({job.wage_type.toLowerCase()})</span>
                    </h3>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-2 text-green-600">
                      <FaUsers className="w-5 h-5" />
                      <span className="font-semibold">Positions Left</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mt-2">{job.broj_radnika}</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-2 text-green-600">
                      <FaCalendarAlt className="w-5 h-5" />
                      <span className="font-semibold">Posted</span>
                    </div>
                    <div className="text-gray-900 mt-2">{new Date(job.created_at).toLocaleDateString()}</div>
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
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <FaCalendarAlt className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Work Period</h3>
                      <p className="text-gray-600">
                        {new Date(job.date_from).toLocaleDateString()} - {new Date(job.date_to).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <FaUsers className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Work Hours</h3>
                      <p className="text-gray-600">{job.hours_per_day} hours/day</p>
                    </div>
                    {/* Add this section after the work hours block */}
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <FaUser className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Poster Profile</h3>
                        {currentUserEmail === job.user_email ? (
                            // Case 3: User is logged in and owns the job post
                            <div
                              onClick={() => !profileLoading && router.push('/auth/view-profile')}
                              className={`inline-flex items-center gap-2 ${
                                profileLoading ? 'opacity-50 cursor-wait' : 
                                'text-green-600 hover:text-green-700 cursor-pointer'
                              }`}
                            >
                              <span>View your profile</span>
                              {profileLoading ? (
                                <FaSpinner className="w-4 h-4 animate-spin" />
                              ) : (
                                <FaArrowRight className="w-4 h-4" />
                              )}
                            </div>
                          ) : (
                            // Cases 1 & 2: User not logged in or different email
                            <div
                              onClick={() => !profileLoading && handleViewSomeonesProfile(job.user_email)}
                              className={`inline-flex items-center gap-2 ${
                                profileLoading ? 'opacity-50 cursor-wait' : 
                                'text-green-600 hover:text-green-700 cursor-pointer'
                              }`}
                            >
                              <span>View poster's profile</span>
                              {profileLoading ? (
                                <FaSpinner className="w-4 h-4 animate-spin" />
                              ) : (
                                <FaArrowRight className="w-4 h-4" />
                              )}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Job Description</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{job.opis}</p>
              </div>
            </motion.div>

            <motion.div style={{ zIndex: 0 }} variants={fadeInUp} className="h-full w-full rounded-2xl overflow-hidden shadow-xl border border-gray-100">
              {job.latitude && job.longitude && leafletModule && markerIcon && (
                <MapContainer center={[job.latitude, job.longitude]} zoom={15} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
                                    <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[job.latitude, job.longitude]} icon={markerIcon}>
                    <Popup className="text-sm font-semibold">{job.grad}, {job.adresa}</Popup>
                  </Marker>
                </MapContainer>
              )}
            </motion.div>
          </motion.div>

          {currentUserEmail && currentUserEmail === job.user_email && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Applicants</h3>
              {job.applicants && job.applicants.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-lg shadow-lg border border-green-600 overflow-hidden">
                    <thead className="bg-green-600 rounded-t-lg">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Applied On</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {job.applicants?.map((applicant, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {applicant.display_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {applicant.email}
                        </td>
                        {/* ... actions buttons */}
                      </tr>
                    ))}

                    {job.accepted_applicants?.map((applicant, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {applicant.display_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {applicant.email}
                        </td>
                        {/* ... actions buttons */}
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600">No applicants yet.</p>
              )}
            </motion.div>
          )}

          {currentUserEmail && currentUserEmail === job.user_email && job.accepted_applicants && job.accepted_applicants.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Accepted Applicants</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow-lg border border-green-600 overflow-hidden">
                  <thead className="bg-green-600 rounded-t-lg">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Accepted On</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {job.accepted_applicants.map((applicant, index) => (
                      <tr key={index} className="hover:bg-green-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{applicant.display_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(job.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <button
                            onClick={() => handleRemoveAcceptedApplicant(index)}
                            className="p-1.5 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                            title="Remove"
                          >
                            <FaTrash className="w-4 h-4 text-red-600" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12 text-center">
            <button onClick={handleApplyForJob} disabled={applying || job.broj_radnika <= 0} className="bg-gradient-to-br from-green-600 to-emerald-500 text-white px-12 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {applying ? (
                <div className="flex items-center gap-2">
                  <Spinner className="w-5 h-5 text-current" />
                  Applying...
                </div>
              ) : (
                `Apply Now ${job.broj_radnika > 0 ? `(${job.broj_radnika} positions left)` : ''}`
              )}
            </button>
            {job.broj_radnika <= 0 && <p className="text-red-600 mt-2">This position is no longer available</p>}
          </motion.div>

          {currentUserEmail && (currentUserEmail === job.user_email || isAdmin) && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-center">
              <button onClick={handleDeleteJob} className="bg-red-600 text-white px-12 py-4 rounded-full text-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2">
                <FaTrash className="w-5 h-5" />
                Delete Job
              </button>
            </motion.div>
          )}

          {showLoginPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Login Required</h2>
                <p className="mb-4">You need to log in to apply for this job.</p>
                <button onClick={() => router.push('/login')} className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors">
                  Go to Login
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </section>
    </div>
  );
}