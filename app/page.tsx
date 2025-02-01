"use client";
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import supabase from "../lib/supabase";
import { FaGoogle } from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    // ... keep existing handleLogin function unchanged ...
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-[#1fd655]">Welcome to Kviky</h1>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 mb-4 flex items-center justify-center gap-2"
        >
          <FaGoogle className="text-lg" />
          Continue with Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or sign in with email</span>
          </div>
        </div>

        {/* Keep existing email/password fields */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1fd655] text-white py-2 px-4 rounded-md hover:bg-[#1aa34a] transition-colors disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'SIGN IN'}
        </button>
        
        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account?{' '}
          <a href="/register-page" className="text-[#1fd655] hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}