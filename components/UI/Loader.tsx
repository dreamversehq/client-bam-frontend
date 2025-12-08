"use client";
import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
  size?: number;
}

export default function Loader({ className, size = 32 }: LoaderProps) {
  return (
    <span
      className={cn(
        "inline-block animate-spin border-4 border-pink-500 border-t-transparent rounded-full",
        className
      )}
      style={{ width: size, height: size, borderWidth: size / 8 }}
      role="status"
      aria-label="Loading"
    />
  );
}
