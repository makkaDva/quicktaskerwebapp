// pages/profile.tsx
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
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          window.location.href = "/";
          return;
        }

        // Extract full_name and split into firstName and lastName
        const fullName = user.user_metadata.full_name || "No Info";
        const [firstName, lastName] = fullName.split(" ").length >= 2
          ? fullName.split(" ")
          : [fullName, ""];

        // Fetch user metadata
        const { data: profileData } = await supabase
          .from("profiles") // Replace with your table name if different
          .select("avatar_url")
          .eq("id", user.id)
          .single();

        setUserData({
          email: user.email,
          firstName: firstName || "No Info",
          lastName: lastName || "No Info",
          avatarUrl: profileData?.avatar_url || "/basicProfilePicture.jpg",
        });

        setProfilePicture(profileData?.avatar_url || "/basicProfilePicture.jpg");
        
      } catch (err) {
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);


  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not logged in");

      // Upload the file to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL of the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Update the user's profile metadata with the new avatar URL
      const { error: updateError } = await supabase
        .from("profiles") // Replace with your table name if different
        .upsert({
          id: user.id,
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        });

      if (updateError) throw updateError;

      // Update the local state to reflect the new profile picture
      setProfilePicture(publicUrl);
      setUserData((prev: any) => ({ ...prev, avatarUrl: publicUrl }));
      
    } catch (err) {
      setError("Failed to upload profile picture");
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Profile Box */}
      <div className="bg-white p-8 rounded-lg shadow-md flex items-center space-x-8 w-full max-w-3xl">
        {/* Profile Picture */}
        <div
          className="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-200 cursor-pointer relative"
          onClick={handleProfilePictureClick}
        >
          <Image
            src={profilePicture || "/basicProfilePicture.jpg"}
            alt="Profile Picture"
            width={192}
            height={192}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <span className="text-white text-sm font-medium">Edit</span>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileUpload}
        />

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