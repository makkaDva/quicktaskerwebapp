'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, PlusCircle, User, LogIn, UserPlus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface SearchFilters {
  city: string;
  wageType: string;
  wageFrom: string;
  wageTo: string;
  dateFrom: string;
  dateTo: string;
}

export default function OfflineNavbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    city: '',
    wageType: '',
    wageFrom: '',
    wageTo: '',
    dateFrom: '',
    dateTo: ''
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleSearchSubmit = () => {
    const queryParams = new URLSearchParams(
      Object.entries(filters).filter(([_, value]) => value)
    ).toString();
    
    if (typeof window !== 'undefined') {
      window.location.href = `/find-jobs?${queryParams}`;
    }
  };

  const updateFilter = (field: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/90 backdrop-blur-sm shadow-sm py-4 px-8 flex items-center justify-between sticky top-0 z-50 border-b border-gray-100"
    >
      {/* Logo */}
      <Link href="/find-jobs" className="flex items-center">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Image
            src="/kvikyLogo.png"
            alt="Kviky Logo"
            width={120}
            height={60}
            className="object-contain"
          />
        </motion.div>
      </Link>

      {/* Search Section */}
      <div className="flex-grow mx-8 relative max-w-3xl" ref={searchRef}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center cursor-pointer"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
        >
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Find your next gig"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-3 pl-12 rounded-full border-2 border-gray-200 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 mt-3 w-full bg-white rounded-xl shadow-xl py-5 px-6 z-50 border border-gray-100"
            >
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="Enter city"
                      value={filters.city}
                      onChange={(e) => updateFilter('city', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Type
                    </label>
                    <select
                      value={filters.wageType}
                      onChange={(e) => updateFilter('wageType', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select type</option>
                      <option value="hourly">Hourly Rate</option>
                      <option value="fixed">Fixed Price</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rate Range
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          placeholder="Min"
                          value={filters.wageFrom}
                          onChange={(e) => updateFilter('wageFrom', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg pl-8"
                        />
                        <span className="absolute left-3 top-3 text-gray-400">€</span>
                      </div>
                      <div className="relative flex-1">
                        <input
                          type="number"
                          placeholder="Max"
                          value={filters.wageTo}
                          onChange={(e) => updateFilter('wageTo', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg pl-8"
                        />
                        <span className="absolute left-3 top-3 text-gray-400">€</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Range
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={filters.dateFrom}
                        onChange={(e) => updateFilter('dateFrom', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                      />
                      <input
                        type="date"
                        value={filters.dateTo}
                        onChange={(e) => updateFilter('dateTo', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  onClick={handleSearchSubmit}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Search Gigs
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/post-jobs')}
          className="bg-gradient-to-br from-green-600 to-emerald-500 text-white px-6 py-2.5 rounded-full text-md font-semibold flex items-center gap-2 shadow-lg hover:shadow-emerald-100"
        >
          <PlusCircle className="w-5 h-5" />
          Post Job
        </motion.button>

        {/* Profile Section */}
        <div className="relative ml-4" ref={profileRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border-2 border-green-100"
          >
            <User className="w-5 h-5 text-gray-600" />
          </motion.button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100"
              >
                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={() => router.push('/login')}
                  className="w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Log In
                </motion.button>
                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={() => router.push('/register-page')}
                  className="w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Register
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
}