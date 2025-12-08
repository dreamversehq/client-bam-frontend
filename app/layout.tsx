
import { ReactNode } from "react";
import "./globals.css";
import Sidebar from "./dashboard/components/Sidebar";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        <div className="flex min-h-screen">
          {/* Sidebar fixed on the left */}
          <aside className="hidden md:block fixed inset-y-0 left-0 w-64 z-30 bg-background border-r border-border">
            <Sidebar />
          </aside>
          {/* Main content area, scrollable, with left margin for sidebar */}
          <main className="flex-1 ml-0 md:ml-64 p-6 overflow-auto min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
