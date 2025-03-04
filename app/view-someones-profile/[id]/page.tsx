"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { ShieldCheck, Star, Briefcase, FileText, Bookmark, ClipboardList, UserCheck2, Calendar, Settings } from "lucide-react";
import supabase from "@/lib/supabase";

function ViewSomeonesProfile()  {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();
  useEffect(() => {

    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("usersvisible")
          .select("uid, email, \"Display Name\"")
          .eq("uid", id)
          .maybeSingle();

        if (error) throw error;
        if (!data) throw new Error("User not found");

        setUserData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  },[id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="backdrop-blur-sm rounded-3xl shadow-xl p-8 border bg-white border-gray-200">
          <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl border-4 border-green-200 overflow-hidden shadow-lg">
                <Image
                  src={"/basicProfilePicture.jpg"}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-4">
                <h1 className="text-4xl font-bold text-gray-900">{userData?.["Display Name"]}</h1>
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100/80">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Verified Worker</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon={<Star className="w-6 h-6 text-green-600" />} title="Rating" value="4.9" />
                <StatCard icon={<Briefcase className="w-6 h-6 text-green-600" />} title="Experience" value="3+ Years" />
                <StatCard icon={<FileText className="w-6 h-6 text-green-600" />} title="Jobs Posted" value={0} />
                <StatCard icon={<Bookmark className="w-6 h-6 text-green-600" />} title="Applications" value={0} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const StatCard = ({ icon, title, value }: { icon: any; title: string; value: string | number }) => {
  return (
    <div className="p-4 rounded-2xl shadow-lg bg-green-50">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-gray-900 font-medium">{title}</span>
      </div>
      <div className="text-xl font-semibold text-gray-900">{value}</div>
    </div>
  );
};

export default ViewSomeonesProfile;
