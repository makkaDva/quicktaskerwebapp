"use client";
import React, { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { 
  Edit, ShieldCheck, Star, Briefcase, Clock, Globe, QrCode, 
  Download, Lock, Bell, Palette, UserCheck2, Calendar 
} from 'lucide-react';
import Link from "next/link";
import Image from "next/image";
import supabase from "@/lib/supabase";

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // ✅ Wait for Supabase session to be ready
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          console.log("Session not found, waiting for auth state...");
          return;
        }

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          window.location.href = "/login";
          return;
        }

        const fullName = user.user_metadata.name || "No Info";
        const [firstName, lastName] = fullName.split(" ").length >= 2
          ? fullName.split(" ")
          : [fullName, ""];

        let { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("avatar_url")
          .eq("id", user.id)
          .maybeSingle(); // Prevents crash if no row exists

        if (!profileData) {
          await supabase.from("profiles").insert([{ UID: user.id, avatar_url: null }]);
          profileData = { avatar_url: "/basicProfilePicture.jpg" };
        }

        setUserData({
          email: user.email,
          firstName: firstName || "No Info",
          lastName: lastName || "No Info",
          avatarUrl: profileData?.avatar_url || "/basicProfilePicture.jpg",
        });

        setProfilePicture(profileData?.avatar_url || "/basicProfilePicture.jpg");
      } catch (err) {
        setError("Failed to fetch user data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // ✅ Listen for auth state changes to avoid first-load redirect issue
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        fetchUserData();
      }
    });

    fetchUserData(); // Initial fetch

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-12"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200">
          {/* Profile Top Section */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Profile Image with Edit */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-green-300 overflow-hidden">
                <Image
                  src={profilePicture || "/basicProfilePicture.jpg"}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 bg-green-600 p-2 rounded-full shadow-lg transition-transform hover:scale-110">
                <Edit className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {userData?.firstName} {userData?.lastName}
                </h1>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full text-sm font-medium text-green-800">
                  <ShieldCheck className="w-4 h-4" />
                  Verified Worker
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard icon={<Star className="w-5 h-5" />} 
                  title="4.9 Rating" value="98 Jobs" />
                <StatCard icon={<Briefcase className="w-5 h-5" />} 
                  title="Experience" value="3+ Years" />
                <StatCard icon={<Clock className="w-5 h-5" />} 
                  title="Response Time" value="15 mins" />
                <StatCard icon={<Globe className="w-5 h-5" />} 
                  title="Location" value="New York" />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 flex-wrap">
                <button className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors">
                  <QrCode className="w-5 h-5" />
                  Share Profile
                </button>
                <button className="flex items-center gap-2 px-6 py-2 bg-white border border-green-600 text-green-600 rounded-full hover:bg-green-50 transition-colors">
                  <Download className="w-5 h-5" />
                  Download vCard
                </button>
              </div>
            </div>
          </div>

          {/* Custom Tab Navigation */}
          <div className="mt-8 border-b border-gray-200">
            <nav className="flex space-x-6">
              {[
                { id: "overview", label: "Overview" },
                { id: "reviews", label: "Reviews (42)" },
                { id: "portfolio", label: "Portfolio" },
                { id: "settings", label: "Settings" },
                { id: "security", label: "Security" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 relative font-medium ${
                    activeTab === tab.id
                      ? "text-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="tab-underline"
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600"
                    />
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === "overview" && (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Skills/Service Section */}
                <div className="p-6 bg-green-50 rounded-xl">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <UserCheck2 className="w-6 h-6" />
                    Offered Services
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['Landscaping', 'Carpentry', 'Event Setup', 'Painting'].map((skill) => (
                      <div
                        key={skill}
                        className="px-4 py-2 rounded-full bg-white border border-gray-200 text-sm hover:bg-green-100 transition-colors"
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Availability Section */}
                <div className="p-6 bg-white rounded-xl border border-gray-200">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="w-6 h-6" />
                    Availability
                  </h3>
                  <div className="text-gray-500">Next available: Tomorrow 9 AM</div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Dark Mode</h4>
                    <p className="text-sm text-gray-600">Enable dark theme</p>
                  </div>
                  <button className="relative w-10 h-6 bg-gray-200 rounded-full p-1 transition-colors">
                    <div className="w-4 h-4 bg-white rounded-full shadow-md transform transition-transform" />
                  </button>
                </div>

                {/* Notification Preferences */}
                <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                  <div>
                    <h4 className="font-medium">Notification Preferences</h4>
                    <p className="text-sm text-gray-600">Manage alerts</p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-green-600 text-green-600 rounded-full hover:bg-green-50 transition-colors">
                    <Bell className="w-5 h-5" />
                    Configure
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ icon, title, value }: { 
  icon: React.ReactNode;
  title: string;
  value: string;
}) => (
  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
    <div className="p-2 bg-green-100 rounded-lg">{icon}</div>
    <div>
      <div className="text-sm text-gray-600">{title}</div>
      <div className="font-semibold text-gray-900">{value}</div>
    </div>
  </div>
);

export default ProfilePage;