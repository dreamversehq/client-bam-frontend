"use client";

import { useEffect, useState } from "react";
import BalanceCard from "./components/BalanceCard";
import TransactionsTable from "./components/TransactionsTable";
import { RecentDeposits, LastLogin } from "./components/DashboardWidgets";
import { Plus } from "lucide-react";
import { authApi, transactionApi } from "@/utils/api";
import { User, Transaction, TransactionType, TransactionStatus } from "@/types";
import { useRouter } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await authApi.getCurrentUser();
        if (!currentUser) {
          router.push("/auth/login");
          return;
        }
        setUser(currentUser);

        // Fetch balance and transactions in parallel
        const [balanceData, txResponse] = await Promise.all([
          transactionApi.getBalance(),
          transactionApi.getTransactions(1, 20) // Fetch more to show in tabs
        ]);

        setBalance(balanceData);

        // txResponse is PaginatedResponse { data: Transaction[], pagination: ... }
        if (txResponse && Array.isArray(txResponse.data)) {
          setTransactions(txResponse.data);
        } else {
          console.warn("Unexpected transaction response format:", txResponse);
          setTransactions([]);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) return null;

  const lastDeposit = transactions.find(tx => tx.type === TransactionType.CREDIT);
  
  const pendingTransactions = transactions.filter(tx => tx.status === TransactionStatus.PENDING);
  const completedTransactions = transactions.filter(tx => tx.status === TransactionStatus.SUCCESS);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, {user.firstName}! Here's an overview of your account.</p>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={() => router.push('/deposit')}
             className="inline-flex items-center justify-center rounded-full text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-pink-600 text-white hover:bg-pink-700 hover:shadow-lg hover:shadow-pink-200 h-11 px-6 shadow-md gap-2"
           >
             <Plus className="w-4 h-4" />
             New Deposit
           </button>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-full">
           <BalanceCard balance={balance} />
        </div>
        <div className="flex flex-col gap-4 h-full">
           <RecentDeposits 
             amount={lastDeposit ? lastDeposit.amount : 0} 
             date={lastDeposit ? lastDeposit.createdAt : new Date().toISOString()} 
           />
           <LastLogin date={new Date().toISOString()} location="Lagos, NG" />
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
        
        <Tabs defaultValue="all" className="w-full">
          <div className="px-6 pt-4">
            <TabsList className="grid w-full max-w-[400px] grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending {pendingTransactions.length > 0 && `(${pendingTransactions.length})`}</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="p-0 mt-0">
            <TransactionsTable transactions={transactions} />
          </TabsContent>
          <TabsContent value="pending" className="p-0 mt-0">
            {pendingTransactions.length > 0 ? (
              <TransactionsTable transactions={pendingTransactions} />
            ) : (
              <div className="p-8 text-center text-gray-500 text-sm">No pending transactions</div>
            )}
          </TabsContent>
          <TabsContent value="completed" className="p-0 mt-0">
            <TransactionsTable transactions={completedTransactions} />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
