'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    // Handle search logic here
    setIsSearchDropdownOpen(!isSearchDropdownOpen);
  };

  const handleCreateJob = () => {
    router.push('/post-jobs');
  };

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
          onClick={handleSearch}
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
    </nav>
  );
}