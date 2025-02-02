"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push("/");
    };
    checkAuth();
  }, []);

  const handleOptionSelect = (option: string) => {
    if (option === "oglasavanje") router.push("/auth/post-jobs");
    if (option === "trazim") router.push("/auth/find-jobs");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white text-center mb-8">
          Choose your goal
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Post Jobs Card */}
          <div
            onClick={() => handleOptionSelect("oglasavanje")}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:scale-105 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                <svg
                  className="w-8 h-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  I advertise jobs
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Post new jobs and make it easier for others to find theirs
                </p>
              </div>
            </div>
          </div>

          {/* Find Jobs Card */}
          <div
            onClick={() => handleOptionSelect("trazim")}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:scale-105 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                <svg
                  className="w-8 h-8 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  I'm looking for a job
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Find jobs that match your qualifications and interests
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
