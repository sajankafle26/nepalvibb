"use client";

import { Poppins } from "next/font/google";
import "./globals.css";
import { usePathname } from 'next/navigation';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingUI from "@/components/layout/FloatingUI";
import AuthProvider from "@/components/providers/AuthProvider";

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <html lang="no" className="scroll-smooth">
      <body className={`${poppins.variable} font-sans bg-white text-gray-900 antialiased`}>
        <AuthProvider>
          {!isAdminPage && <Navbar />}
          {children}
          {!isAdminPage && <Footer />}
          {!isAdminPage && pathname !== '/plan-your-trip' && <FloatingUI />}
        </AuthProvider>
      </body>
    </html>
  );
}
