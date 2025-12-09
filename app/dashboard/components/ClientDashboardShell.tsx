"use client";
import TopNavBar from "@/UI/TopNavBar";
import * as React from "react";
import Sidebar from "./Sidebar";

export default function ClientDashboardShell({ children }: { children: React.ReactNode }) {
  // Mock user and balance for demonstration
  const user = { name: "Kira Dev", avatarUrl: undefined };
  const balance = 1000;
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const handleLogout = () => {
    // TODO: Implement logout logic
    alert("Logged out!");
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
          user={user}
          balance={balance}
          onLogout={handleLogout}
          onSidebarToggle={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}