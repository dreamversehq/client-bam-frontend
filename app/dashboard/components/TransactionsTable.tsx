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
import { Transaction, TransactionType, TransactionStatus } from "@/types";

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
      <Table className="min-w-[600px] md:min-w-full">
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b border-gray-100">
            <TableHead className="w-[100px] font-medium text-gray-500 text-xs uppercase tracking-wider pl-6">Type</TableHead>
            <TableHead className="hidden md:table-cell font-medium text-gray-500 text-xs uppercase tracking-wider">Transaction ID</TableHead>
            <TableHead className="font-medium text-gray-500 text-xs uppercase tracking-wider">Status</TableHead>
            <TableHead className="font-medium text-gray-500 text-xs uppercase tracking-wider">Date</TableHead>
            <TableHead className="text-right font-medium text-gray-500 text-xs uppercase tracking-wider pr-6">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => {
            const isCredit = tx.type === TransactionType.CREDIT;
            return (
            <TableRow key={tx.id} className="hover:bg-gray-50/50 border-b border-gray-50 transition-colors">
              <TableCell className="pl-6 py-4 whitespace-nowrap">
                <div className={cn(
                  "flex items-center gap-2 w-fit px-2.5 py-1 rounded-full text-xs font-medium border",
                  isCredit 
                    ? "bg-green-50 text-green-700 border-green-100" 
                    : "bg-red-50 text-red-700 border-red-100"
                )}>
                  {isCredit ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                  {isCredit ? "Credit" : "Debit"}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell font-mono text-xs text-gray-500">
                {tx.reference}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  tx.status === TransactionStatus.SUCCESS ? "bg-green-100 text-green-700" :
                  tx.status === TransactionStatus.PENDING ? "bg-yellow-100 text-yellow-700" :
                  "bg-red-100 text-red-700"
                )}>
                  {tx.status}
                </span>
              </TableCell>
              <TableCell className="text-sm text-gray-600 whitespace-nowrap">
                {formatDate(tx.createdAt)}
              </TableCell>
              <TableCell className="text-right font-medium text-gray-900 pr-6 whitespace-nowrap">
                {isCredit ? '+' : '-'}₦{tx.amount.toLocaleString()}
              </TableCell>
            </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionsTable;
