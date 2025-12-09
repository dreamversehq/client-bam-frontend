
import Sidebar from "./components/Sidebar";
import ClientDashboardShell from "./components/ClientDashboardShell";
import React from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <ClientDashboardShell>{children}</ClientDashboardShell>;
}
