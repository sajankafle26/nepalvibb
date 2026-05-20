"use client";

import { usePathname } from 'next/navigation';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingUI from "@/components/layout/FloatingUI";
import AuthProvider from "@/components/providers/AuthProvider";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <AuthProvider>
      {!isAdminPage && <Navbar />}
      {children}
      {!isAdminPage && <Footer />}
      {!isAdminPage && pathname !== '/plan-your-trip' && <FloatingUI />}
    </AuthProvider>
  );
}
