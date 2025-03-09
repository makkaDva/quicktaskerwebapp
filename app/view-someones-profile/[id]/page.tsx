"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Import useRouter
import { motion } from "framer-motion";
import Image from "next/image";
import { ShieldCheck, Star, Briefcase, FileText, Bookmark } from "lucide-react";
import { FaMapMarkerAlt, FaEuroSign } from "react-icons/fa"; // Import icons for job cards
import supabase from "@/lib/supabase";

function ViewSomeonesProfile() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [jobNum, setJobNum] = useState<number>(0); // State for job count
  const [showJobs, setShowJobs] = useState(false); // State to toggle jobs list visibility
  const [jobs, setJobs] = useState<any[]>([]); // State to store jobs
  const { id } = useParams();
  const router = useRouter(); // Initialize the router

  // Function to format the date as MM/DD/YY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2); // Get the last two digits of the year
    return `${month}/${day}/${year}`;
  };

  // Fetch user profile and jobs count
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        // Fetch user data
        const { data: userData, error: userError } = await supabase
          .from("usersvisible")
          .select("uid, email, \"Display Name\", \"Created At\"")
          .eq("uid", id)
          .maybeSingle();

        if (userError) throw userError;
        if (!userData) throw new Error("User not found");

        setUserData(userData);

        // Fetch jobs count
        const { data: jobsData, error: jobsError } = await supabase
          .from("jobs")
          .select("user_email")
          .eq("user_email", userData.email);

        if (jobsError) throw jobsError;

        // Set the number of jobs
        setJobNum(jobsData.length);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  // Fetch jobs when "Jobs Posted" is clicked
  const handleJobsClick = async () => {
    if (!userData?.email) return;

    setLoading(true);
    try {
      const { data: jobsData, error: jobsError } = await supabase
        .from("jobs")
        .select("*")
        .eq("user_email", userData.email);

      if (jobsError) throw jobsError;

      setJobs(jobsData || []);
      setShowJobs(!showJobs); // Toggle jobs list visibility
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  // Extract the Created At timestamp
  const datumString = userData["Created At"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-12 max-w-6xl">
        {/* White Box */}
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
                <StatCard
                  icon={<Briefcase className="w-6 h-6 text-green-600" />}
                  title="Member since"
                  value={userData ? formatDate(datumString) : "Loading..."}
                />
                <StatCard icon={<Star className="w-6 h-6 text-green-600" />} title="Rating" value="4.9" />
                <div onClick={handleJobsClick} className="cursor-pointer">
                  <StatCard icon={<FileText className="w-6 h-6 text-green-600" />} title="Jobs Posted" value={jobNum} />
                </div>
                {/* <StatCard icon={<Bookmark className="w-6 h-6 text-green-600" />} title="Applications" value={0} /> */}
              </div>
            </div>
          </div>
        </div>

        {/* Jobs List in Green Zone */}
        {showJobs && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-6"
          >
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onClick={() => {
                  // Navigate to the job details page
                  router.push(`/view-job/${job.id}`);
                }}
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

// StatCard Component
const StatCard = ({ icon, title, value }: { icon: any; title: string; value: string | number }) => {
  return (
    <div className="p-4 rounded-2xl shadow-lg bg-green-50 text-center">
      <div className="flex items-center gap-2 justify-center">
        {icon}
        <span className="text-gray-900 font-medium">{title}</span>
      </div>
      <div className="text-xl font-semibold text-gray-900 mt-2">{value}</div>
    </div>
  );
};

// JobCard Component
const JobCard = ({ job, onClick }: { job: any; onClick: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 cursor-pointer"
      onClick={onClick}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
          {job.wage_type === "per_day" ? "Daily Rate" : "Job offer"}
        </span>
        <span className="text-sm text-gray-500">
          {new Date(job.created_at).toLocaleDateString()}
        </span>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-2">{job.grad}</h3>

      <div className="space-y-3 text-gray-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <FaMapMarkerAlt className="text-green-600 w-5 h-5" />
          </div>
          <p className="text-gray-700">{job.adresa}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <FaEuroSign className="text-green-600 w-5 h-5" />
          </div>
          <p className="text-xl font-semibold text-green-600">
            {job.dnevnica}€
            <span className="text-sm text-gray-500 ml-2">
              {job.wage_type === "per_day" ? "/day" : "/hour"}
            </span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ViewSomeonesProfile;