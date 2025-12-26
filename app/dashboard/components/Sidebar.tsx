"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Banknote, Settings as SettingsIcon, Menu, HelpCircle } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";

const navLinks = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Deposit",
    href: "/deposit",
    icon: Banknote,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: SettingsIcon,
  },
];

type SidebarProps = {
  open?: boolean;
  setOpen?: (v: boolean) => void;
};

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname();
  // Support email (build-time env var). Falls back to kata@dreamverse.ng
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'kata@dreamverse.ng';
  
  // Sidebar content
  const sidebarNav = (
    <div className="flex flex-col h-full bg-white border-r border-gray-100">
      {/* Logo Area */}
      <div className="h-20 flex items-center px-8">
        <div className="flex items-center gap-2.5 font-bold text-2xl text-gray-900 tracking-tight">
          <div className="w-9 h-9 bg-pink-600 rounded-xl flex items-center justify-center text-white shadow-pink-200 shadow-lg">
            B
          </div>
          <span>Bam</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-8 px-4 space-y-1.5">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-pink-50 text-pink-700 shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
              aria-current={isActive ? "page" : undefined}
              onClick={() => setOpen && setOpen(false)}
            >
              <link.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-pink-600" : "text-gray-400 group-hover:text-gray-600")} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-100">
        {/* Use a mailto: deep-link so clicking opens the user's email client. Keep styles identical. */}
        <a
          href={`mailto:${supportEmail}`}
          className="bg-gray-50 rounded-2xl p-5 relative overflow-hidden group hover:bg-gray-100 transition-colors block"
          aria-label={`Contact support at ${supportEmail}`}
        >
          <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-pink-100 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
          <div className="relative z-10 flex items-start gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm text-pink-600">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Need help?</p>
              <p className="text-xs text-gray-500 mt-0.5">Contact our support team</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile: Drawer only if props provided */}
      {typeof open === "boolean" && typeof setOpen === "function" ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="p-0 h-[85vh]">
             {/* We wrap sidebarNav in a div to ensure it takes full height of drawer content */}
             <div className="h-full">
                {sidebarNav}
             </div>
          </DrawerContent>
        </Drawer>
      ) : null}
      
      {/* Desktop: Static sidebar */}
      <aside className="hidden md:flex h-full w-64 flex-col fixed inset-y-0 z-50">
        {sidebarNav}
      </aside>
    </>
  );
}

// export const Sidebar = () => {
//   return (
//     <aside className="w-64 bg-pink-500 text-white flex flex-col p-4">
//       <h2 className="text-2xl font-bold mb-6">DepositStore</h2>
//       <nav className="flex flex-col gap-4">
//         <Link href="/dashboard" className="hover:underline">Dashboard</Link>
//         <Link href="/deposit" className="hover:underline">Deposit</Link>
//         <Link href="/settings" className="hover:underline">Settings</Link>
//       </nav>
//     </aside>
//   );
// };
