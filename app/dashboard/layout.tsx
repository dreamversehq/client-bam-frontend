
import Sidebar from "./components/Sidebar";
import TopNavBar from "@/UI/TopNavBar";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mock user and balance for demonstration
  const user = { name: "Jane Doe", avatarUrl: undefined };
  const balance = 1000;
  const handleLogout = () => {
    // TODO: Implement logout logic
    alert("Logged out!");
  };
  return (
    <div className="flex min-h-screen">
      <div className="w-64 hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <TopNavBar user={user} balance={balance} onLogout={handleLogout} />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
