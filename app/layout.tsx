'use client'; // Add this if you're using hooks like usePathname
import { usePathname } from 'next/navigation';
import OfflineNavbar from './components/offlineNavbar'; // Corrected import path
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
        {shouldShowNavbar && <OfflineNavbar />}
        <main>{children}</main>
      </body>
    </html>
  );
}