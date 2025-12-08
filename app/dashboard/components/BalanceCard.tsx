import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const BalanceCard = ({ balance }: { balance: number }) => {
  return (
    <Card className={cn(
      "bg-white shadow-lg rounded-2xl border-0 flex flex-col items-center justify-center p-8"
    )}>
      <CardContent className="flex flex-col items-center justify-center">
        <span className="text-lg text-gray-500 mb-2">Current Balance</span>
        <span className="text-4xl md:text-5xl font-extrabold text-pink-500">
          ₦{balance.toLocaleString()}
        </span>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;
