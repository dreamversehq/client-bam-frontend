import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Wallet } from "lucide-react";

const BalanceCard = ({ balance }: { balance: number }) => {
  return (
    <Card className={cn(
      "bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-xl rounded-2xl border-0 overflow-hidden relative h-full min-h-[200px]"
    )}>
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl"></div>

      <CardContent className="flex flex-col justify-between h-full p-6 md:p-8 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Total Balance</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mt-2">
              ₦{balance.toLocaleString()}
            </h2>
          </div>
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
            <Wallet className="w-6 h-6 text-pink-400" />
          </div>
        </div>
        
        <div className="mt-auto pt-6 flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium border border-green-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            Active
          </div>
          <span className="text-xs text-gray-500">Updated just now</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;
