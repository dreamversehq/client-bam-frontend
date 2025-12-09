
import BalanceCard from "./components/BalanceCard";
import TransactionsTable from "./components/TransactionsTable";
import { RecentDeposits, LastLogin } from "./components/DashboardWidgets";
import { Plus } from "lucide-react";

export default function DashboardPage() {

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back! Here's an overview of your account.</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="inline-flex items-center justify-center rounded-full text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-pink-600 text-white hover:bg-pink-700 hover:shadow-lg hover:shadow-pink-200 h-11 px-6 shadow-md gap-2">
             <Plus className="w-4 h-4" />
             New Deposit
           </button>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-full">
           <BalanceCard balance={2950} />
        </div>
        <div className="flex flex-col gap-4 h-full">
           <RecentDeposits amount={500} date="2025-12-08" />
           <LastLogin date="2025-12-08 10:30" location="Lagos, NG" />
        </div>
      </section>

      {/* Transactions Section */}
      <section className="bg-white rounded-xl shadow-sm border border-border/60 overflow-hidden">
        <div className="px-6 py-5 border-b border-border/40 flex items-center justify-between bg-gray-50/30">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
            <p className="text-xs text-gray-500 mt-0.5">Your latest financial activities</p>
          </div>
          <button className="text-sm font-medium text-pink-600 hover:text-pink-700 hover:underline">
            View All
          </button>
        </div>
        <div className="p-0">
          <TransactionsTable
            transactions={[
              { id: "1", amount: 500, date: "2025-12-08", type: "credit" },
              { id: "2", amount: 200, date: "2025-12-07", type: "credit" },
              { id: "3", amount: 300, date: "2025-12-07", type: "credit" },
              { id: "4", amount: 1500, date: "2025-12-06", type: "credit" },
              { id: "5", amount: 450, date: "2025-12-05", type: "credit" },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
