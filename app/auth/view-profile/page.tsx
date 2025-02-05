"use client";
import React, { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import Image from "next/image";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Profile Box */}
      <div className="bg-white p-8 rounded-lg shadow-md flex items-center space-x-8 w-full max-w-3xl">
        {/* Profile Picture */}
        <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-200 cursor-pointer relative">
          <Image
            src={profilePicture || "/basicProfilePicture.jpg"}
            alt="Profile Picture"
            width={192}
            height={192}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Profile Information */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-6 text-center text-black">Your Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <p className="mt-1 text-black text-lg">{userData?.firstName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <p className="mt-1 text-black text-lg">{userData?.lastName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-black text-lg">{userData?.email}</p>
            </div>
          </div>
          <Link href="/auth/find-jobs">
            <button className="w-full mt-6 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;