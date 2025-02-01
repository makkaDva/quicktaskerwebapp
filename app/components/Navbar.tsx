'use client'
import { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
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

  if (loading) {
    return <div className="bg-white shadow-sm py-3 px-6">Loading...</div>;
  }

  return (
    <nav className="bg-white shadow-sm py-3 px-6 flex justify-between items-center">
      {/* Logo */}
      <Link href="/auth/find-jobs">
        <Image
          src="/kvikyLogo.png" 
          alt="QuickTasker Logo" 
          width={100} 
          height={40} 
        />
      </Link>
      

      {/* Right-side controls */}
      <div className="flex items-center gap-4">
        {/* New Job Button */}
        <button
          onClick={handleCreateJob}
          className="bg-green-500 hover:bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl transition-colors"
          aria-label="Dodaj novi posao"
        >
          +
        </button>

        {/* Profile Dropdown */}
        <div className="relative profile-dropdown">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2"
          >
            <Image 
              src="/basicProfilePicture.jpg" 
              alt="Profile" 
              width={40} 
              height={40} 
              className="rounded-full"
            />
            <span className="text-gray-600">{userEmail}</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
              <Link
                href="/auth/view-profile"
                onClick={() => setIsDropdownOpen(false)}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                View Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
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