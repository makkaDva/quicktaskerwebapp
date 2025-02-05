'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function OfflineNavbar() {
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const handleSearchSubmit = () => {
  // Ensure this code runs only on the client side
  if (typeof window === 'undefined') return;

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

  const handleCreateJob = () => {
    router.push('/post-jobs');
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogin = () => {
    router.push('/app/login');
  };

  const handleRegister = () => {
    router.push('/app/register-page');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target as Node) &&
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSearchDropdownOpen(false);
        setIsProfileDropdownOpen(false);
      }
    };

    // Add event listener when either dropdown is open
    if (isSearchDropdownOpen || isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Clean up the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchDropdownOpen, isProfileDropdownOpen]);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md py-3 px-6 flex justify-between items-center transition-colors">
      {/* Logo */}
      <Link href="/find-jobs" className="flex items-center">
        <Image
          src="/kvikyLogo.png"
          alt="QuickTasker Logo"
          width={120}
          height={60}
          className="object-contain"
        />
      </Link>

      {/* Search Bar */}
      <div className="flex-grow mx-8 relative">
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
          <div ref={searchDropdownRef} className="absolute left-0 mt-2 w-full bg-white dark:bg-gray-700 rounded-md shadow-lg py-4 px-6 z-50">
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

      {/* Post Job Button */}
      <button
        onClick={handleCreateJob}
        className="bg-green-500 hover:bg-green-600 text-white px-5 py-1.5 rounded-full text-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        Post job offer
      </button>

      {/* Profile Circle and Dropdown */}
      <div className="relative ml-8" ref={profileDropdownRef}> {/* Added ml-8 for margin-left */}
  <div
    className="w-10 h-10 rounded-full overflow-hidden cursor-pointer"
    onClick={handleProfileClick}
  >
    <Image
      src="/basicProfilePicture.jpg"
      alt="Profile"
      width={40}
      height={40}
      className="object-cover"
    />
  </div>

  {/* Profile Dropdown */}
  {isProfileDropdownOpen && (
    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-2 z-50">
      <button
        onClick={handleLogin}
        className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
      >
        Log in
      </button>
      <button
        onClick={handleRegister}
        className="block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
      >
        Register
      </button>
    </div>
  )}
</div>
    </nav>
  );
}