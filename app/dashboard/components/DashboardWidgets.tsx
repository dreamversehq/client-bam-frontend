"use client";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RecentDepositsProps {
  amount: number;
  date: string;
}

export function RecentDeposits({ amount, date }: RecentDepositsProps) {
  return (
    <Card className={cn("bg-white shadow rounded-xl p-4 flex flex-col items-start justify-center")}> 
      <CardContent className="p-0">
        <div className="text-xs text-gray-500 mb-1">Recent Deposit</div>
        <div className="text-lg font-bold text-pink-500 mb-1">₦{amount.toLocaleString()}</div>
        <div className="text-xs text-gray-400">{date}</div>
      </CardContent>
    </Card>
  );
}

interface LastLoginProps {
  date: string;
  location?: string;
}

export function LastLogin({ date, location }: LastLoginProps) {
  return (
    <Card className={cn("bg-white shadow rounded-xl p-4 flex flex-col items-start justify-center")}> 
      <CardContent className="p-0">
        <div className="text-xs text-gray-500 mb-1">Last Login</div>
        <div className="text-lg font-bold text-pink-500 mb-1">{date}</div>
        {location && <div className="text-xs text-gray-400">{location}</div>}
      </CardContent>
    </Card>
  );
}

// To add: TotalUsers widget for admin view in future
