import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Transaction = { id: string; amount: number; date: string; type: "credit" | "debit" };

const TransactionsTable = ({ transactions }: { transactions: Transaction[] }) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl shadow-sm bg-white">
      <Table className="min-w-[500px]">
        <TableHeader className="bg-pink-100">
          <TableRow>
            <TableHead className="font-bold text-pink-700">ID</TableHead>
            <TableHead className="font-bold text-pink-700">Amount</TableHead>
            <TableHead className="font-bold text-pink-700">Date</TableHead>
            <TableHead className="font-bold text-pink-700">Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id} className="border-t">
              <TableCell className="p-2 text-xs md:text-sm">{tx.id}</TableCell>
              <TableCell className="p-2 text-xs md:text-base font-semibold">₦{tx.amount.toLocaleString()}</TableCell>
              <TableCell className="p-2 text-xs md:text-sm">{tx.date}</TableCell>
              <TableCell
                className={
                  "p-2 text-xs md:text-base font-bold " +
                  (tx.type === "credit" ? "text-green-600" : "text-red-600")
                }
              >
                {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionsTable;
