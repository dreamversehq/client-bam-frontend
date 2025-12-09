"use client";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { usePaystack } from "../../hooks/usePaystack";

import Toast from "@/UI/Toast";


import ClientDashboardShell from "../dashboard/components/ClientDashboardShell";

export default function DepositPage() {
  const { pay } = usePaystack();
  const [amount, setAmount] = React.useState("");
  const [error, setError] = React.useState("");
  const [balance, setBalance] = React.useState(1000); // Mock balance
  const [toast, setToast] = React.useState<{ open: boolean; message: string; type: "success" | "error" | "info" }>({ open: false, message: "", type: "info" });

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const amt = Number(amount);
    if (isNaN(amt) || amt <= 0) {
      setError("Please enter a valid amount greater than 0");
      setToast({ open: true, message: "Please enter a valid amount greater than 0", type: "error" });
      return;
    }
    pay(
      amt,
      undefined,
      (reference) => {
        setToast({ open: true, message: `Deposit successful! Ref: ${reference}`, type: "success" });
        setBalance((b) => b + amt);
        setAmount("");
      },
      () => {
        setToast({ open: true, message: "Deposit cancelled.", type: "info" });
      }
    );
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
              <div className="text-3xl font-bold text-pink-700 mt-1">₦{balance.toLocaleString()}</div>
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
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <Button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-700 text-white"
              >
                Proceed to Payment
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </ClientDashboardShell>
  );
}
