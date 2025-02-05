'use client';
import { usePathname } from 'next/navigation';
import { AuthProvider } from './AuthContext';
import Navbar from './components/Navbar';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Define routes where the navbar should NOT be shown
  const excludedRoutes = ['/login', '/register-page'];

  // Check if the current route is excluded
  const shouldShowNavbar = !excludedRoutes.includes(pathname);

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {shouldShowNavbar && <Navbar />} {/* Conditionally render the Navbar */}
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}