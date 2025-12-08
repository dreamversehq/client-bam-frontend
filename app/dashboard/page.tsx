
import BalanceCard from "./components/BalanceCard";
import TransactionsTable from "./components/TransactionsTable";
import { RecentDeposits, LastLogin } from "./components/DashboardWidgets";

export default function DashboardPage() {

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-pink-500">Dashboard</h1>
      {/* Dashboard widgets row */}
      <div className="flex flex-col md:flex-row gap-4">
        <RecentDeposits amount={500} date="2025-12-08" />
        <LastLogin date="2025-12-08 10:30" location="Lagos, NG" />
        {/* Future: Add <TotalUsers /> here for admin view */}
      </div>
      <BalanceCard balance={1000} />
      <TransactionsTable transactions={[
        { id: "1", amount: 500, date: "2025-12-08", type: "credit" },
        { id: "2", amount: 200, date: "2025-12-07", type: "debit" },
      ]} />
    </div>
  );
}
