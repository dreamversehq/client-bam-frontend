"use client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import * as React from "react";

interface TopNavBarProps {
  user?: {
    name: string;
    avatarUrl?: string;
  };
  balance: number;
  onLogout: () => void;
}

export default function TopNavBar({ user, balance, onLogout }: TopNavBarProps) {
  return (
    <header className="w-full flex items-center justify-between px-4 py-3 border-b border-border bg-white">
      <div className="flex items-center gap-4">
        <Avatar className="border-2 border-pink-500">
          {user?.avatarUrl ? (
            <AvatarImage src={user.avatarUrl} alt={user.name} />
          ) : (
            <AvatarFallback className="bg-pink-500 text-white">
              {user?.name?.[0] ?? "U"}
            </AvatarFallback>
          )}
        </Avatar>
        <span className="font-semibold text-gray-900">{user?.name ?? "User"}</span>
      </div>
      <div className="flex items-center gap-6">
        <div className="bg-pink-100 text-pink-700 px-4 py-1 rounded-full font-medium">
          Balance: <span className="text-pink-500">₦{balance.toLocaleString()}</span>
        </div>
        <Button
          variant="outline"
          className="border-pink-500 text-pink-500 hover:bg-pink-50 hover:text-pink-700"
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5 mr-2" /> Logout
        </Button>
      </div>
    </header>
  );
}
