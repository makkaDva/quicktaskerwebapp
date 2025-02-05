'use client'; // Add this if you're using hooks like usePathname
import { usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from './AuthContext'; // Import the AuthProvider
import OfflineNavbar from './components/offlineNavbar'; // Corrected import path
import Navbar from './components/Navbar'; // Import the Navbar for logged-in users
import './globals.css'; // Import global styles

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
          <NavbarWrapper shouldShowNavbar={shouldShowNavbar} />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}

const NavbarWrapper = ({ shouldShowNavbar }: { shouldShowNavbar: boolean }) => {
  const { isLoggedIn } = useAuth();

  if (!shouldShowNavbar) {
    return null; // Don't show any navbar on excluded routes
  }

  return isLoggedIn ? <Navbar /> : <OfflineNavbar />;
};