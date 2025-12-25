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
              <div className="text-lg font-bold text-gray-900">{formatDate(date)}</div>
              {location && <div className="text-xs font-medium text-gray-400">{location}</div>}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// To add: TotalUsers widget for admin view in future
