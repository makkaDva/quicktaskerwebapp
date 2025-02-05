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
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string; name?: string; avatar?: string } | null>(null);
  const [loading, setLoading] = useState(true);
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
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Hide navbar on auth pages
  const hiddenPaths = ['/login', '/register', '/auth'];
  if (hiddenPaths.some(path => pathname?.startsWith(path)) || loading) return null;

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
              className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl p-4 space-y-4"
            >
              {/* Search filters */}
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