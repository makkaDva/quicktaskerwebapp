"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Animacioni varijanti za fade-in efekat
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Sačekaj da Supabase sesija bude spremna
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

        let { data: profileData } = await supabase
          .from("profiles")
          .select("avatar_url")
          .eq("id", user.id)
          .maybeSingle();

        // Ako nema unetih podataka u profilu, kreiraj novi red sa default slikom
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

    // Slušaj promene autentifikacionog stanja
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        fetchUserData();
      }
    });

    fetchUserData();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-12 p-8 w-full max-w-4xl border border-gray-200"
      >
        {/* Profilna slika */}
        <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-green-300 cursor-pointer transition-transform hover:scale-105">
          <Image
            src={profilePicture || "/basicProfilePicture.jpg"}
            alt="Profile Picture"
            layout="fill"
            objectFit="cover"
          />
        </div>
        {/* Informacije o korisniku */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center md:text-left">
            Your Profile
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <p className="mt-1 text-lg text-gray-800">{userData?.firstName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <p className="mt-1 text-lg text-gray-800">{userData?.lastName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <p className="mt-1 text-lg text-gray-800">{userData?.email}</p>
            </div>
          </div>
          <div className="mt-6">
          <Link href="/auth/find-jobs" legacyBehavior>
          <a className="w-full block text-center bg-gradient-to-br from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white py-2 px-4 rounded-full transition-all shadow-md">
            Back to Home
          </a>
        </Link>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
