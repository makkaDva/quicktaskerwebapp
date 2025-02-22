"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Edit, ShieldCheck, Star, Briefcase, Clock, Globe, QrCode,
  Download, Lock, Bell, Palette, UserCheck2, Calendar, Settings,
  ClipboardList, FileText, Bookmark
} from 'lucide-react';
import Image from "next/image";
import supabase from "@/lib/supabase";
import { Spinner } from '@/components/ui/spinner';
import { FaEuroSign, FaMapMarkerAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface Job {
  id: string;
  grad: string;
  adresa: string;
  dnevnica: number;
  wage_type: string;
  created_at: string;
  applicants?: string[];
}

const ProfilePage: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Job[]>([]);
  const router = useRouter();

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        setUserData({
          ...user,
          ...profileData,
          firstName: user.user_metadata?.name?.split(" ")[0] || "User",
          lastName: user.user_metadata?.name?.split(" ")[1] || ""
        });

        const { data: jobsData } = await supabase
          .from('jobs')
          .select('*')
          .eq('user_email', user.email);

        const { data: applicationsData } = await supabase
          .from('jobs')
          .select('*')
          .contains('applicants', [user.user_metadata?.name]);

        setJobs(jobsData || []);
        setApplications(applicationsData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const renderJobsSection = () => (
    <div className="space-y-6">
      {jobs.map((job) => (
        <motion.div
          key={job.id}
          whileHover={{ scale: 1.02 }}
          className={`p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border cursor-pointer ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white/90 border-gray-100'
          }`}
          onClick={() => router.push(`/view-job/${job.id}`)}
        >
          <div className="mb-4 flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              darkMode ? 'bg-green-800/30 text-green-400' : 'bg-green-100 text-green-800'
            }`}>
              {job.wage_type === 'per_day' ? 'Daily Rate' : 'Job offer'}
            </span>
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {new Date(job.created_at).toLocaleDateString()}
            </span>
          </div>
          <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {job.grad}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                darkMode ? 'bg-gray-700' : 'bg-green-100'
              }`}>
                <FaMapMarkerAlt className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{job.adresa}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                darkMode ? 'bg-gray-700' : 'bg-green-100'
              }`}>
                <FaEuroSign className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <p className={`text-xl font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                {job.dnevnica}€
                <span className={`text-sm ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {job.wage_type === 'per day' ? '/day' : '/hour'}
                </span>
              </p>
            </div>
          </div>
        </motion.div>
      ))}
      {jobs.length === 0 && (
        <div className={`text-center p-8 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>You haven't posted any jobs yet</p>
        </div>
      )}
    </div>
  );

  const renderApplicationsSection = () => (
    <div className="space-y-6">
      {applications.map((job) => (
        <motion.div
          key={job.id}
          whileHover={{ scale: 1.02 }}
          className={`p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border cursor-pointer ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white/90 border-gray-100'
          }`}
          onClick={() => router.push(`/view-job/${job.id}`)}
        >
          <div className="mb-4 flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              darkMode ? 'bg-green-800/30 text-green-400' : 'bg-green-100 text-green-800'
            }`}>
              {job.wage_type === 'per_day' ? 'Daily Rate' : 'Job offer'}
            </span>
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {new Date(job.created_at).toLocaleDateString()}
            </span>
          </div>
          <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {job.grad}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                darkMode ? 'bg-gray-700' : 'bg-green-100'
              }`}>
                <FaMapMarkerAlt className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{job.adresa}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                darkMode ? 'bg-gray-700' : 'bg-green-100'
              }`}>
                <FaEuroSign className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <p className={`text-xl font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                {job.dnevnica}€
                <span className={`text-sm ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {job.wage_type === 'per day' ? '/day' : '/hour'}
                </span>
              </p>
            </div>
          </div>
        </motion.div>
      ))}
      {applications.length === 0 && (
        <div className={`text-center p-8 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>You haven't applied to any jobs yet</p>
        </div>
      )}
    </div>
  );

  if (loading) return (
    <div className={`min-h-screen flex justify-center items-center ${
      darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-green-50 to-white'
    }`}>
      <Spinner className="w-12 h-12 text-green-600" />
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-green-50 to-white'
    }`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-12 max-w-6xl"
      >
        <div className={`backdrop-blur-sm rounded-3xl shadow-xl p-8 border ${
          darkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'
        }`}>
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
            <div className="relative group">
              <div className={`w-32 h-32 rounded-2xl border-4 overflow-hidden shadow-lg ${
                darkMode ? 'border-gray-600' : 'border-green-200'
              }`}>
                <Image
                  src={userData?.avatar_url || "/basicProfilePicture.jpg"}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="object-cover"
                />
              </div>
              <button className="absolute -bottom-2 -right-2 bg-green-600 p-2 rounded-full shadow-xl hover:scale-105 transition-transform">
                <Edit className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-4">
                <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {userData?.firstName} {userData?.lastName}
                </h1>
                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full ${
                  darkMode ? 'bg-green-800/30' : 'bg-green-100/80'
                }`}>
                  <ShieldCheck className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                  <span className={`text-sm font-medium ${
                    darkMode ? 'text-green-400' : 'text-green-800'
                  }`}>
                    Verified Worker
                  </span>
                </div>
              </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard 
                  icon={<Star className="w-6 h-6 text-green-600" />}
                  title="Rating"
                  value="4.9"
                  darkMode={darkMode}
                />
                <StatCard 
                  icon={<Briefcase className="w-6 h-6 text-green-600" />}
                  title="Experience"
                  value="3+ Years"
                  darkMode={darkMode}
                />
                <StatCard 
                  icon={<FileText className="w-6 h-6 text-green-600" />}
                  title="Jobs Posted"
                  value={jobs.length}
                  darkMode={darkMode}
                />
                <StatCard 
                  icon={<Bookmark className="w-6 h-6 text-green-600" />}
                  title="Applications"
                  value={applications.length}
                  darkMode={darkMode}
                />
                </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className={`border-b mb-8 ${
            darkMode ? 'border-gray-700' : 'border-gray-200/50'
          }`}>
            <nav className="flex space-x-8">
              {[
                { id: "overview", label: "Overview", icon: <UserCheck2 className="w-5 h-5" /> },
                { id: "my-jobs", label: `My Jobs (${jobs.length})`, icon: <ClipboardList className="w-5 h-5" /> },
                { id: "applications", label: `Applications (${applications.length})`, icon: <Bookmark className="w-5 h-5" /> },
                { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 pb-4 relative font-medium ${
                    activeTab === tab.id 
                      ? darkMode ? 'text-green-400' : 'text-green-600' 
                      : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div 
                      layoutId="tab-underline"
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 rounded-full"
                    />
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {activeTab === "overview" && (
              <div className="grid md:grid-cols-2 gap-8">
                <div className={`p-6 rounded-2xl shadow-lg ${
                  darkMode ? 'bg-gray-800' : 'bg-green-50'
                }`}>
                  <h3 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <UserCheck2 className={`w-6 h-6 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                    Skills & Services
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {['Landscaping', 'Carpentry', 'Event Setup'].map((skill) => (
                      <div
                        key={skill}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                          darkMode 
                            ? 'bg-gray-700 text-green-400' 
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`p-6 rounded-2xl shadow-lg border ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <h3 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <Calendar className={`w-6 h-6 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                    Availability
                  </h3>
                  <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    Next available: Tomorrow 9 AM
                  </div>
                </div>
              </div>
            )}

            {activeTab === "my-jobs" && renderJobsSection()}
            {activeTab === "applications" && renderApplicationsSection()}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className={`p-6 rounded-2xl shadow-lg ${
                  darkMode ? 'bg-gray-800' : 'bg-green-50'
                }`}>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Palette className={`w-6 h-6 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                    <span className={darkMode ? 'text-gray-100' : 'text-gray-900'}>
                      Theme Preferences
                    </span>
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Dark Mode
                    </span>
                    <button 
                      onClick={() => setDarkMode(!darkMode)}
                      className={`relative w-14 h-8 rounded-full p-1 transition-colors duration-300 ${
                        darkMode ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <motion.div
                        className="w-6 h-6 bg-white rounded-full shadow-lg"
                        animate={{ x: darkMode ? 26 : 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                    </button>
                  </div>
                </div>

                <div className={`p-6 rounded-2xl shadow-lg border ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Lock className={`w-6 h-6 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                    <span className={darkMode ? 'text-gray-100' : 'text-gray-900'}>
                      Security
                    </span>
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                        Two-Factor Authentication
                      </span>
                      <button className={`px-4 py-2 rounded-full transition-colors ${
                        darkMode 
                          ? 'bg-green-700/30 text-green-400 hover:bg-green-700/50' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}>
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const StatCard = ({ icon, title, value, darkMode }: { 
  icon: React.ReactNode;
  title: string;
  value: string | number;
  darkMode: boolean;
}) => (
  <div className={`flex items-center gap-4 p-4 rounded-xl shadow-sm hover:shadow-md ${
    darkMode ? 'bg-gray-800 text-white' : 'bg-white'
  }`}>
    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-100'}`}>
      {icon}
    </div>
    <div>
      <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {title}
      </div>
      <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {value}
      </div>
    </div>
  </div>
);

export default ProfilePage;