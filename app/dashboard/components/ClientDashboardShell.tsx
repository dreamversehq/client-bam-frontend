"use client";
import TopNavBar from "@/components/UI/TopNavBar";
import * as React from "react";
import Sidebar from "./Sidebar";
import { authApi, transactionApi } from "@/utils/api";
import { User } from "@/types";
import { useRouter } from "next/navigation";

export default function ClientDashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);
  const [balance, setBalance] = React.useState(0);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await authApi.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          // Fetch balance separately to ensure it's up to date
          try {
            const bal = await transactionApi.getBalance();
            setBalance(bal);
          } catch (e) {
            console.error("Failed to fetch balance", e);
            setBalance(currentUser.balance || 0);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    await authApi.logout();
    router.push("/auth/login");
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Sidebar - Desktop (Fixed) */}
      <Sidebar />
      
      {/* Sidebar - Mobile (Drawer) */}
      <div className="md:hidden">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      {/* Main Content Area */}
      <div className="md:pl-64 flex flex-col min-h-screen transition-all duration-300">
        <TopNavBar
          user={user ? { 
            name: `${user.firstName} ${user.lastName}`, 
            avatarUrl: user.avatar || undefined,
            firstName: user.firstName,
            lastName: user.lastName
          } : undefined}
          balance={balance}
          isLoading={isLoading}
          onLogout={handleLogout}
          onSidebarToggle={() => setSidebarOpen(true)}
          onUserUpdate={handleUserUpdate}
        />
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}