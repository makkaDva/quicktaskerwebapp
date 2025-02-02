"use client";
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import supabase from "../../lib/supabase";
import { FaGoogle } from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setLoading(true); // Set loading state to true
    setError(null); // Clear any previous errors
  
    try {
      // Attempt to sign in with email and password using Supabase
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      // If there's an error, throw it
      if (error) throw error;
  
      // If successful, redirect the user to the dashboard or home page
      router.push('/auth/dashboard'); // Adjust the redirect path as needed
    } catch (err) {
      // Handle any errors that occur during the login process
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      // Set loading state to false after the login attempt is complete
      setLoading(false);
    }
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
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h1 className="text-3xl font-bold text-center text-green-600 mb-8">Welcome to Kviky</h1>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="social-auth-button"
          disabled={loading}
        >
          <FaGoogle className="text-lg" />
          Continue with Google
        </button>

        <div className="auth-divider">
          <span className="bg-white dark:bg-gray-800 px-2">Or sign in with email</span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button
        type="submit"
        className="auth-button bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600"
        disabled={loading}
         >
       {loading ? 'Loading...' : 'SIGN IN'}
        </button>



        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <a href="/register-page" className="auth-link">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}