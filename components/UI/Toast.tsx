"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  open: boolean;
  onClose: () => void;
}

const toastColors = {
  success: "bg-pink-500 text-white border-pink-500",
  error: "bg-red-500 text-white border-red-500",
  info: "bg-gray-800 text-white border-gray-800",
};

export default function Toast({ message, type = "info", open, onClose }: ToastProps) {
  React.useEffect(() => {
    if (open) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed top-6 right-6 z-50 px-6 py-3 rounded-lg shadow-lg border-2 flex items-center gap-2 transition-all animate-in fade-in slide-in-from-top-4",
        toastColors[type]
      )}
      role="alert"
    >
      {type === "success" && (
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
      )}
      {type === "error" && (
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
      )}
      {type === "info" && (
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01" /></svg>
      )}
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-white/80 hover:text-white focus:outline-none"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
}
