"use client";
// Force re-check
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Menu, ChevronRight, Upload, Trash2, Loader2 } from "lucide-react";
import * as React from "react";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/UI/dropdown-menu";
import { userApi } from "@/utils/api";
import { User } from "@/types";
import Toast from "./Toast";
import { Skeleton } from "@/components/ui/skeleton";

interface TopNavBarProps {
  user?: {
    name: string;
    avatarUrl?: string;
    firstName?: string;
    lastName?: string;
  };
  balance: number;
  isLoading?: boolean;
  onLogout: () => void;
  onSidebarToggle?: () => void;
  onUserUpdate?: (user: User) => void;
}

export default function TopNavBar({ user, balance, isLoading = false, onLogout, onSidebarToggle, onUserUpdate }: TopNavBarProps) {
  const pathname = usePathname();
  const pageName = pathname?.split("/").pop() || "Dashboard";
  const formattedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);
  const [toast, setToast] = React.useState<{ open: boolean; message: string; type: "success" | "error" | "info" }>({ open: false, message: "", type: "info" });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setToast({ open: true, message: "Please upload an image file", type: "error" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setToast({ open: true, message: "Image size should be less than 5MB", type: "error" });
      return;
    }

    setUploading(true);
    try {
      const updatedUser = await userApi.uploadAvatar(file);
      if (onUserUpdate) onUserUpdate(updatedUser);
      setToast({ open: true, message: "Avatar updated successfully", type: "success" });
    } catch (error) {
      console.error("Failed to upload avatar", error);
      setToast({ open: true, message: "Failed to upload avatar", type: "error" });
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteAvatar = async () => {
    if (!user?.avatarUrl) return;
    
    setUploading(true);
    try {
      const updatedUser = await userApi.deleteAvatar();
      if (onUserUpdate) onUserUpdate(updatedUser);
      setToast({ open: true, message: "Avatar removed", type: "success" });
    } catch (error) {
      console.error("Failed to delete avatar", error);
      setToast({ open: true, message: "Failed to remove avatar", type: "error" });
    } finally {
      setUploading(false);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
    <Toast
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />
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
            {isLoading ? (
              <Skeleton className="h-5 w-24 bg-gray-200 mt-1" />
            ) : (
              <span className="text-sm font-bold text-gray-900">₦{balance.toLocaleString()}</span>
            )}
          </div>

          {/* Mobile Balance Badge */}
          {isLoading ? (
            <Skeleton className="md:hidden h-6 w-20 rounded-full bg-gray-200" />
          ) : (
            <div className="md:hidden bg-pink-50 text-pink-700 px-3 py-1 rounded-full text-xs font-bold">
              ₦{balance.toLocaleString()}
            </div>
          )}

          <div className="h-8 w-px bg-gray-200 hidden md:block"></div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end">
              {isLoading ? (
                <Skeleton className="h-5 w-32 bg-gray-200" />
              ) : (
                <span className="text-sm font-semibold text-gray-900">{user?.name ?? "User"}</span>
              )}
            </div>
            
            {isLoading ? (
              <Skeleton className="h-9 w-9 rounded-full bg-gray-200" />
            ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none rounded-full focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
                <Avatar className="h-9 w-9 border border-gray-200 cursor-pointer transition-transform hover:scale-105 relative">
                  {uploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-full">
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    </div>
                  )}
                  {user?.avatarUrl ? (
                    <AvatarImage src={user.avatarUrl} alt={user.name} className="object-cover" />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white font-medium">
                      {user?.firstName?.[0] || user?.name?.[0] || "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={triggerUpload} disabled={uploading}>
                  <Upload className="mr-2 h-4 w-4" />
                  <span>Change Avatar</span>
                </DropdownMenuItem>
                {user?.avatarUrl && (
                  <DropdownMenuItem onClick={handleDeleteAvatar} disabled={uploading} className="text-red-600 focus:text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Remove Avatar</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
    </header>
    </>
  );
}
