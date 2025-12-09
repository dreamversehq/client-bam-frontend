"use client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Menu, ChevronRight } from "lucide-react";
import * as React from "react";
import { usePathname } from "next/navigation";

interface TopNavBarProps {
  user?: {
    name: string;
    avatarUrl?: string;
  };
  balance: number;
  onLogout: () => void;
  onSidebarToggle?: () => void;
}

export default function TopNavBar({ user, balance, onLogout, onSidebarToggle }: TopNavBarProps) {
  const pathname = usePathname();
  const pageName = pathname?.split("/").pop() || "Dashboard";
  const formattedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-white/80 backdrop-blur-md px-4 py-3 md:px-6">
      <div className="flex items-center justify-between w-full gap-4">
        {/* Left: Sidebar toggle (mobile) & Breadcrumb/Title placeholder */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden -ml-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-colors"
            onClick={typeof onSidebarToggle === "function" ? onSidebarToggle : undefined}
            aria-label="Open sidebar"
          >
            <Menu className="w-6 h-6" />
          </Button>
          
          {/* Mobile Logo (only visible when sidebar is hidden/mobile) */}
          <div className="md:hidden font-bold text-lg text-pink-600 flex items-center gap-2">
             <div className="w-6 h-6 bg-pink-600 rounded-md flex items-center justify-center text-white text-xs">B</div>
             <span>Bam</span>
          </div>

          {/* Desktop Breadcrumb/Title - Balances the layout */}
          <div className="hidden md:flex items-center text-sm font-medium text-gray-500">
            <span className="hover:text-gray-900 cursor-pointer transition-colors">Bam</span>
            <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
            <span className="text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">{formattedPageName}</span>
          </div>
        </div>

        {/* Right: User Profile & Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Balance Display - Moved closer to user info but kept distinct */}
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-xs text-gray-500 font-medium">Available Balance</span>
            <span className="text-sm font-bold text-gray-900">₦{balance.toLocaleString()}</span>
          </div>

          {/* Mobile Balance Badge */}
          <div className="md:hidden bg-pink-50 text-pink-700 px-3 py-1 rounded-full text-xs font-bold">
            ₦{balance.toLocaleString()}
          </div>

          <div className="h-8 w-px bg-gray-200 hidden md:block"></div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-900">{user?.name ?? "User"}</span>
            </div>
            
            <Avatar className="h-9 w-9 border border-gray-200 cursor-pointer transition-transform hover:scale-105">
              {user?.avatarUrl ? (
                <AvatarImage src={user.avatarUrl} alt={user.name} />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white font-medium">
                  {user?.name?.[0] ?? "U"}
                </AvatarFallback>
              )}
            </Avatar>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              onClick={onLogout}
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
