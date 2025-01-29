'use client'
import { useState, useEffect } from 'react';
import supabase from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
 // const supabase = createClient();
  const router = useRouter();

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
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow-sm py-3 px-6 flex justify-between items-center">
      {/* Logo */}
      <Image 
  src="/kvikyLogo.png" 
  alt="QuickTasker Logo" 
  width={100} 
  height={40} 
/>

      {/* Profile Section sa dropdown klasom */}
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

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
            <a 
              href="/profile" 
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              View Profile
            </a>
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}