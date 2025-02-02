"use client";

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-6 text-center">
      <h1 className="text-5xl font-bold text-green-700 mb-4">Welcome to Kviky</h1>
      <p className="text-lg text-gray-700 max-w-2xl mb-6">
        Finding quick jobs has never been easier! Kviky connects job seekers with daily wage opportunities in real-time. Whether you need an extra pair of hands or you're looking for work, Kviky is here to help!
      </p>

      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl">
        <h2 className="text-3xl font-semibold text-green-600 mb-4">Who We Are</h2>
        <p className="text-gray-600 mb-4">
          Kviky is the ultimate platform for those seeking short-term jobs and employers who need quick assistance. No lengthy hiring process—just instant connections to get the job done!
        </p>
        <p className="text-gray-600 mb-4">
          We bridge the gap between job seekers and businesses, making job hunting fast, simple, and reliable. Start earning today with Kviky!
        </p>
      </div>
      
      <button
        onClick={() => router.push('/login')}
        className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-full shadow-md transition duration-300"
      >
        Proceed to Sign In Page
      </button>
    </div>
  );
}
