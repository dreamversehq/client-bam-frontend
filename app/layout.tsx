
import { ReactNode } from "react";
import "../styles/globals.css";
import Sidebar from "./dashboard/components/Sidebar";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
