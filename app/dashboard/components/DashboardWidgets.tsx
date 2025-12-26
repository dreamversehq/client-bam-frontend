"use client";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CalendarClock, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-NG', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
};

const timeAgo = (dateString: string) => {
  const now = new Date();
  const then = new Date(dateString);
  const diff = Math.floor((now.getTime() - then.getTime()) / 1000); // seconds

  if (isNaN(diff) || diff < 0) return 'just now';

  const units: { limit: number; name: string; inSeconds: number }[] = [
    { limit: 60, name: 'second', inSeconds: 1 },
    { limit: 3600, name: 'minute', inSeconds: 60 },
    { limit: 86400, name: 'hour', inSeconds: 3600 },
    { limit: 604800, name: 'day', inSeconds: 86400 },
    { limit: 2629800, name: 'week', inSeconds: 604800 }, // approx month
    { limit: 31557600, name: 'month', inSeconds: 2629800 },
    { limit: Infinity, name: 'year', inSeconds: 31557600 },
  ];

  for (let i = 0; i < units.length; i++) {
    const u = units[i];
    if (diff < u.limit) {
      const value = Math.floor(diff / u.inSeconds) || 1;
      return `${value} ${u.name}${value > 1 ? 's' : ''} ago`;
    }
  }

  return formatDate(dateString);
};

interface RecentDepositsProps {
  amount: number;
  date: string;
  isLoading?: boolean;
}

export function RecentDeposits({ amount, date, isLoading = false }: RecentDepositsProps) {
  return (
    <Card className={cn("bg-white shadow-sm border border-gray-100 rounded-xl p-5 flex flex-col justify-center h-full hover:shadow-md transition-shadow")}> 
      <CardContent className="p-0">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-pink-50 rounded-lg">
            <CalendarClock className="w-4 h-4 text-pink-500" />
          </div>
          <span className="text-sm font-medium text-gray-500">Last Deposit</span>
        </div>
        <div className="flex flex-col gap-1">
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-32 mb-1" />
              <Skeleton className="h-4 w-24" />
            </>
          ) : (
            <>
              <div className="text-2xl font-bold text-gray-900">₦{amount.toLocaleString()}</div>
              <div className="text-xs font-medium text-gray-400">{formatDate(date)}</div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface LastLoginProps {
  date: string;
  location?: string;
  isLoading?: boolean;
}

export function LastLogin({ date, location, isLoading = false }: LastLoginProps) {
  return (
    <Card className={cn("bg-white shadow-sm border border-gray-100 rounded-xl p-5 flex flex-col justify-center h-full hover:shadow-md transition-shadow")}> 
      <CardContent className="p-0">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <MapPin className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-sm font-medium text-gray-500">Last Login</span>
        </div>
        <div className="flex flex-col gap-1">
          {isLoading ? (
            <>
              <Skeleton className="h-6 w-32 mb-1" />
              <Skeleton className="h-4 w-24" />
            </>
          ) : (
            <>
              <div className="text-lg font-bold text-gray-900">{timeAgo(date)}</div>
              <div className="text-xs font-medium text-gray-400">{formatDate(date)}{location ? ` • ${location}` : ''}</div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// To add: TotalUsers widget for admin view in future
