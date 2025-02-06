'use client';
import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, PlusCircle, User, LogIn, UserPlus, Briefcase } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import supabase from '@/lib/supabase';

export default function Navbar() {
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
  const [userEmail, setUserEmail] = useState('');
  const [userFullName, setUserFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Auth state management
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser({
          email: session.user.email,
          name: session.user.user_metadata?.full_name,
          avatar: session.user.user_metadata?.avatar_url
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Click outside handlers
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserFullName(user.user_metadata.full_name);
          setUserEmail(user.email || '');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

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

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading || !mounted) {
    return null;
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/90 backdrop-blur-sm shadow-sm py-3 px-6 flex items-center justify-between sticky top-0 z-50 border-b border-gray-100"
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <motion.div whileHover={{ scale: 1.05 }}>
          <Image
            src="/Kvikylogo.png"
            alt="Logo"
            width={120}
            height={50}
            className="object-contain"
            priority
          />
        </motion.div>
      </Link>

      {/* Search */}
      <div className="flex-grow mx-8 relative max-w-3xl" ref={searchRef}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-6 py-2.5 pl-12 rounded-full border-2 border-gray-200 focus:outline-none focus:border-green-500 transition-all text-sm"
            onFocus={() => setSearchOpen(true)}
          />
          <Search className="absolute left-4 top-2.5 h-4 w-4 text-gray-400" />
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 mt-3 w-full bg-white rounded-xl shadow-xl py-5 px-6 z-50 border border-gray-100"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    value={filters.city}
                    onChange={(e) => updateFilter('city', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Wage Type</label>
                  <select
                    value={filters.wageType}
                    onChange={(e) => updateFilter('wageType', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select</option>
                    <option value="per day">Per Day</option>
                    <option value="per hour">Per Hour</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Wage From</label>
                    <input
                      type="number"
                      value={filters.wageFrom}
                      onChange={(e) => updateFilter('wageFrom', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Wage To</label>
                    <input
                      type="number"
                      value={filters.wageTo}
                      onChange={(e) => updateFilter('wageTo', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Date From</label>
                    <input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => updateFilter('dateFrom', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Date To</label>
                    <input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => updateFilter('dateTo', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSearchSubmit}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Look up your gigs
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="bg-green-600 text-white px-5 py-2 rounded-full text-sm flex items-center gap-2"
          onClick={() => router.push('/post-job')}
        >
          <Briefcase className="w-4 h-4" />
          Post Job
        </motion.button>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-9 h-9 rounded-full bg-gray-100 border-2 border-green-100 overflow-hidden"
          >
            {user?.avatar ? (
              <Image src={user.avatar} alt="Avatar" width={36} height={36} className="object-cover" />
            ) : (
              <User className="w-4 h-4 text-gray-600 m-auto" />
            )}
          </motion.button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2"
              >
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium truncate">{user.name || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => router.push('/auth/view-profile')}
                      className="w-full px-4 py-2 text-sm hover:bg-gray-50 flex gap-2 items-center"
                    >
                      <User className="w-4 h-4" /> Profile
                    </button>
                    <button
                      onClick={async () => {
                        await supabase.auth.signOut();
                        router.refresh();
                      }}
                      className="w-full px-4 py-2 text-sm hover:bg-gray-50 flex gap-2 items-center"
                    >
                      <LogIn className="w-4 h-4" /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => router.push('/login')}
                      className="w-full px-4 py-2 text-sm hover:bg-gray-50 flex gap-2 items-center"
                    >
                      <LogIn className="w-4 h-4" /> Login
                    </button>
                    <button
                      onClick={() => router.push('/register-page')}
                      className="w-full px-4 py-2 text-sm hover:bg-gray-50 flex gap-2 items-center"
                    >
                      <UserPlus className="w-4 h-4" /> Register
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
}