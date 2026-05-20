"use client";

import { Sora, Inter } from "next/font/google";
import "./globals.css";
import { usePathname } from 'next/navigation';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingUI from "@/components/layout/FloatingUI";
import AuthProvider from "@/components/providers/AuthProvider";

const sora = Sora({ 
  subsets: ["latin"],
  weight: ['400', '600', '700', '800'],
  variable: '--font-sora',
});

const inter = Inter({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <html lang="no" className="scroll-smooth">
      <body className={`${sora.variable} ${inter.variable} font-sans bg-white text-gray-900 antialiased`}>
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
