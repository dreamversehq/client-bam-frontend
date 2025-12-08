"use client";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { usePaystack } from "../../hooks/usePaystack";

import Toast from "@/UI/Toast";


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
    <>
      <Toast
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Deposit Funds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 text-center">
              <span className="text-gray-500 text-sm">Current Balance</span>
              <div className="text-3xl font-bold text-pink-500 mt-1 mb-2">₦{balance.toLocaleString()}</div>
            </div>
            <form className="space-y-4" onSubmit={handleDeposit}>
              <Input
                type="number"
                min="1"
                step="any"
                placeholder="Enter deposit amount"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="text-lg"
                required
              />
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <Button
                type="submit"
                className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-lg font-semibold py-3"
              >
                Deposit
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
