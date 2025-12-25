"use client";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Toast from "@/components/UI/Toast";
import ClientDashboardShell from "@/app/dashboard/components/ClientDashboardShell";
import { authApi, transactionApi } from "@/utils/api";
import { useRouter, useSearchParams } from "next/navigation";

export default function DepositPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  
  const [amount, setAmount] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState("");
  const [balance, setBalance] = React.useState(0);
  const [toast, setToast] = React.useState<{ open: boolean; message: string; type: "success" | "error" | "info" }>({ open: false, message: "", type: "info" });

  // Handle Paystack Callback
  React.useEffect(() => {
    const verify = async () => {
      if (reference) {
        setLoading(true);
        try {
          await transactionApi.verifyDeposit(reference);
          setToast({ open: true, message: "Deposit verified successfully!", type: "success" });
          // Clear param and refresh balance
          router.replace('/deposit');
          const bal = await transactionApi.getBalance();
          setBalance(bal);
        } catch (error) {
          console.error("Verification failed", error);
          setToast({ open: true, message: "Deposit verification failed or already processed.", type: "info" });
        } finally {
          setLoading(false);
        }
      }
    };
    verify();
  }, [reference, router]);

  React.useEffect(() => {
    const fetchUser = async () => {
      const user = await authApi.getCurrentUser();
      if (user) {
        setUserEmail(user.email);
        // Fetch real balance
        try {
          const bal = await transactionApi.getBalance();
          setBalance(bal);
        } catch (e) {
          console.error("Failed to fetch balance", e);
          setBalance(0);
        }
      } else {
        router.push("/auth/login");
      }
    };
    fetchUser();
  }, [router]);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(amount);
    if (isNaN(amt) || amt <= 0) {
      setToast({ open: true, message: "Please enter a valid amount greater than 0", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const response = await transactionApi.initiateDeposit(amt);
      if (response.authorizationUrl) {
        window.location.href = response.authorizationUrl;
      } else {
        setToast({ open: true, message: "Failed to initialize payment", type: "error" });
        setLoading(false);
      }
    } catch (error) {
      console.error("Deposit initiation failed", error);
      setToast({ open: true, message: "Failed to initiate deposit. Please try again.", type: "error" });
      setLoading(false);
    }
  };

  return (
    <ClientDashboardShell>
      <Toast
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Deposit Funds</h1>
          <p className="text-sm text-gray-500">Add money to your account securely.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Make a Deposit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 bg-pink-50 rounded-lg border border-pink-100">
              <span className="text-pink-600 text-sm font-medium">Current Balance</span>
              <div className="text-3xl font-bold text-pink-700 mt-1">₦{(balance || 0).toLocaleString()}</div>
            </div>
            <form className="space-y-4" onSubmit={handleDeposit}>
              <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium">Amount (₦)</label>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  step="any"
                  placeholder="Enter deposit amount"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                disabled={loading}
              >
                {loading ? "Processing..." : "Proceed to Payment"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </ClientDashboardShell>
  );
}
