'use client';
import { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
          setUserFullName(user.user_metadata.full_name);
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

  // Click outside listener for both dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;

      // Close profile dropdown if clicked outside
      if (!target.closest('.profile-dropdown')) {
        setIsDropdownOpen(false);
      }

      // Close search dropdown if clicked outside
      if (!target.closest('.search-dropdown')) {
        setIsSearchDropdownOpen(false);
      }
    };

    // Add event listener when the component mounts
    document.addEventListener('click', handleClickOutside);

    // Clean up event listener when the component unmounts
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
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
    router.push('post-jobs');
  };

  const handleSearchSubmit = () => {
    // Collect all search filter values
    const city = document.querySelector('input[placeholder="Type city"]') as HTMLInputElement | null;
    const wageType = document.querySelector('select') as HTMLSelectElement | null;
    const wageFrom = document.querySelector('input[placeholder="Min wage"]') as HTMLInputElement | null;
    const wageTo = document.querySelector('input[placeholder="Max wage"]') as HTMLInputElement | null;
    const dateFrom = document.querySelector('input[type="date"]:nth-of-type(1)') as HTMLInputElement | null;
    const dateTo = document.querySelector('input[type="date"]:nth-of-type(2)') as HTMLInputElement | null;

    // Construct query parameters object
    const queryParams: Record<string, string> = {};

    // Add only non-empty values to the query parameters
    if (city?.value) queryParams.city = city.value;
    if (wageType?.value) queryParams.wageType = wageType.value;
    if (wageFrom?.value) queryParams.wageFrom = wageFrom.value;
    if (wageTo?.value) queryParams.wageTo = wageTo.value;
    if (dateFrom?.value) queryParams.dateFrom = dateFrom.value;
    if (dateTo?.value) queryParams.dateTo = dateTo.value;

    // Convert query parameters to a string
    const queryString = new URLSearchParams(queryParams).toString();

    // Redirect to /find-jobs with query parameters
    window.location.href = `/find-jobs?${queryString}`;
  };

  const handleSearch = () => {
    setIsSearchDropdownOpen(!isSearchDropdownOpen);
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
      <Link href="find-jobs" className="flex items-center">
        <Image
          src="/kvikyLogo.png"
          alt="QuickTasker Logo"
          width={120}
          height={60}
          className="object-contain"
        />
      </Link>

      {/* Search Bar */}
      <div className="flex-grow mx-8 relative search-dropdown">
        <div
          className="flex items-center cursor-pointer"
          onClick={handleSearch}
        >
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Find your job"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {/* Search Loop Icon */}
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Search Filters Dropdown */}
        {isSearchDropdownOpen && (
          <div className="absolute left-0 mt-2 w-full bg-white dark:bg-gray-700 rounded-md shadow-lg py-4 px-6 z-50">
            <div className="space-y-4">
              {/* City Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  City:
                </label>
                <input
                  type="text"
                  placeholder="Type city"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              {/* Wage Type Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Wage Type:
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400">
                  <option value="">Select Wage Type</option>
                  <option value="per_day">Per Day</option>
                  <option value="per_hour">Per Hour</option>
                </select>
              </div>

              {/* Wage Filter */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Wage From:
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Min wage"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                      €
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Wage To:
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Max wage"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                      €
                    </span>
                  </div>
                </div>
              </div>

              {/* Date Filter */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    From:
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    To:
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
              </div>

              {/* Search Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleSearchSubmit}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

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