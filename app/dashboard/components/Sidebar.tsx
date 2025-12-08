"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Banknote, Settings as SettingsIcon, Menu } from "lucide-react";
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

export default function Sidebar() {
  const pathname = usePathname();
  // Mobile drawer state
  const [open, setOpen] = React.useState(false);

  // Sidebar content
  const sidebarNav = (
    <nav className="flex-1 py-6 px-4 space-y-2">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              "flex items-center gap-3 px-4 py-2 rounded-md text-base font-medium transition-colors",
              isActive
                ? "bg-muted text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
            aria-current={isActive ? "page" : undefined}
            onClick={() => setOpen(false)}
          >
            <link.icon className="w-5 h-5" />
            {link.name}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile: Hamburger + Drawer */}
      <div className="md:hidden p-2">
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Open sidebar menu">
              <Menu className="w-6 h-6" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="p-0">
            <div className="h-full w-64 bg-background border-r border-border flex flex-col">
              <div className="flex justify-end p-2">
                <DrawerClose asChild>
                  <Button variant="ghost" size="icon" aria-label="Close sidebar menu">
                    <span className="sr-only">Close</span>
                    ×
                  </Button>
                </DrawerClose>
              </div>
              {sidebarNav}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      {/* Desktop: Static sidebar */}
      <aside className="h-full w-full md:w-64 bg-background border-r border-border flex-col hidden md:flex">
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
