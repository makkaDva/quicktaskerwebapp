'use client';
import { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userFullName, setUserFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserFullName(user.user_metadata.full_name)
          setUserEmail(user.email || '');
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.profile-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleCreateJob = () => {
    router.push('/auth/post-jobs');
  };

  if (loading || !mounted) {
    return (
      <div className="bg-white shadow-sm py-3 px-6 text-center">
        Loading...
      </div>
    );
  }

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md py-3 px-6 flex justify-between items-center transition-colors">
      {/* Logo */}
      <Link href="/auth/find-jobs" className="flex items-center">
        <Image
          src="/kvikyLogo.png"
          alt="QuickTasker Logo"
          width={120}
          height={60}
          className="object-contain"
        />
      </Link>

      {/* Right-side controls */}
      <div className="flex items-center gap-4">
        {/* New Job Button */}
        <button
          onClick={handleCreateJob}
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-1.5 rounded-full text-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Post job offer
        </button>

        {/* Profile Dropdown */}
        <div className="relative profile-dropdown">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <Image
              src="/basicProfilePicture.jpg"
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full border border-gray-300 dark:border-gray-600"
            />
            <span className="hidden md:inline text-gray-700 dark:text-gray-300 font-medium">
              {userFullName}
            </span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-2 z-50 transition ease-in-out duration-150">
              <Link href="/auth/view-profile" onClick={() => setIsDropdownOpen(false)}>
                <div className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                  View Profile
                </div>
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
