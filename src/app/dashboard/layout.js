"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Map, MessageSquare, User, LogOut, 
  Menu, X, Compass, ChevronRight 
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const menuItems = [
    { label: 'My Trips', icon: Map, href: '/dashboard' },
    { label: 'Messages', icon: MessageSquare, href: '/dashboard/messages' },
    { label: 'Profile', icon: User, href: '/dashboard/profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-80 bg-white border-r border-gray-100 flex-col sticky top-0 h-screen">
        <div className="p-10 border-b border-gray-50">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black text-primary uppercase tracking-tighter italic">Nepalvibb</span>
          </Link>
        </div>

        <nav className="flex-1 p-8 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all",
                pathname === item.href 
                  ? "bg-primary text-white shadow-xl shadow-primary/20" 
                  : "text-gray-400 hover:bg-gray-50 hover:text-primary"
              )}
            >
              <div className="flex items-center space-x-4">
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
              <ChevronRight className={cn("w-4 h-4 transition-transform", pathname === item.href ? "translate-x-0" : "-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0")} />
            </Link>
          ))}
        </nav>

        <div className="p-8 border-t border-gray-50">
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-red-400 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Compass className="w-6 h-6 text-primary" />
          <span className="font-black uppercase tracking-tighter text-primary">Nepalvibb</span>
        </Link>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-gray-50 rounded-xl text-primary">
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:p-12 pt-24 px-6 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <div className={cn(
        "lg:hidden fixed inset-y-0 left-0 w-80 bg-white z-50 transition-transform duration-300 flex flex-col",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 border-b border-gray-100">
           <span className="text-xl font-black text-primary uppercase tracking-tighter">Menu</span>
        </div>
        <nav className="flex-1 p-8 space-y-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsSidebarOpen(false)}
              className={cn(
                "flex items-center space-x-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all",
                pathname === item.href ? "bg-primary text-white" : "text-gray-400"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-red-400"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
