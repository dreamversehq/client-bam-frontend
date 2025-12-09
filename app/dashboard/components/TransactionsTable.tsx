import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

type Transaction = { id: string; amount: number; date: string; type: "credit" | "debit" };

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-NG', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
};

const TransactionsTable = ({ transactions }: { transactions: Transaction[] }) => {
  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b border-gray-100">
            <TableHead className="w-[100px] font-medium text-gray-500 text-xs uppercase tracking-wider pl-6">Type</TableHead>
            <TableHead className="font-medium text-gray-500 text-xs uppercase tracking-wider">Transaction ID</TableHead>
            <TableHead className="font-medium text-gray-500 text-xs uppercase tracking-wider">Date</TableHead>
            <TableHead className="text-right font-medium text-gray-500 text-xs uppercase tracking-wider pr-6">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id} className="hover:bg-gray-50/50 border-b border-gray-50 transition-colors">
              <TableCell className="pl-6 py-4">
                <div className={cn(
                  "flex items-center gap-2 w-fit px-2.5 py-1 rounded-full text-xs font-medium border",
                  tx.type === "credit" 
                    ? "bg-green-50 text-green-700 border-green-100" 
                    : "bg-red-50 text-red-700 border-red-100"
                )}>
                  {tx.type === "credit" ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                  {tx.type === "credit" ? "Credit" : "Debit"}
                </div>
              </TableCell>
              <TableCell className="font-medium text-gray-900 text-sm">#{tx.id}</TableCell>
              <TableCell className="text-gray-500 text-sm">{formatDate(tx.date)}</TableCell>
              <TableCell className="text-right pr-6">
                <span className={cn(
                  "font-semibold text-sm",
                  tx.type === "credit" ? "text-green-600" : "text-gray-900"
                )}>
                  {tx.type === "credit" ? "+" : "-"}₦{tx.amount.toLocaleString()}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionsTable;
