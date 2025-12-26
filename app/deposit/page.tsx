"use client";
import * as React from "react";
import { NumericFormat } from 'react-number-format';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Toast from "@/components/UI/Toast";
import ClientDashboardShell from "@/app/dashboard/components/ClientDashboardShell";
import { authApi, transactionApi } from "@/utils/api";
import { useRouter, useSearchParams } from "next/navigation";

// Component that uses searchParams - wrapped in Suspense
function DepositContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Paystack can return 'reference' or 'trxref'
  const reference = searchParams.get("reference") || searchParams.get("trxref");
  
  const [amount, setAmount] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState("");
  const [balance, setBalance] = React.useState(0);
  const [toast, setToast] = React.useState<{ open: boolean; message: string; type: "success" | "error" | "info" }>({ open: false, message: "", type: "info" });

  // Handle Paystack Callback
  React.useEffect(() => {
    // Debug log to see what params we have
    console.log("[DepositPage] Current Search Params:", searchParams.toString());
    
    if (reference) {
      console.log("[DepositPage] Payment return detected. Reference:", reference);
      
      // Fire and forget verification - Background only
      console.log("[DepositPage] Triggering background verification...");
      transactionApi.verifyDeposit(reference)
        .then((res) => console.log("[DepositPage] Verification response (background):", res))
        .catch((err) => console.error("[DepositPage] Verification error (background):", err));

      setToast({ open: true, message: "Payment successful! Redirecting to dashboard...", type: "success" });
      
      // Redirect to dashboard without waiting for verification
      console.log("[DepositPage] Redirecting to dashboard...");
      const timer = setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [reference, router, searchParams]);

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
    // Remove grouping separators and parse to float (handles values like "10,000.00")
    const parsed = parseFloat((amount || '').toString().replace(/,/g, ''));
    const amt = parsed;
    console.log('[DepositPage] parsed amount:', { amount, parsed, amt });
    if (isNaN(amt) || amt <= 0) {
      setToast({ open: true, message: "Please enter a valid amount greater than 0", type: "error" });
      return;
    }

    setLoading(true);
    try {
      // Pass current URL as callback URL to ensure Paystack redirects back here
      const callbackUrl = window.location.href.split('?')[0]; // Remove any existing query params
      const response = await transactionApi.initiateDeposit(amt, callbackUrl);
      console.log('RESPONSE', response)
      if (response.authorizationUrl) {
        console.log("Redirecting to Paystack:", response.authorizationUrl);
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
                {/* <Input
                  id="amount"
                  type="number"
                  min="100"
                  placeholder="Enter deposit amount"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  required
                /> */}
                <NumericFormat
                  id="amount"
                  customInput={Input}
                  thousandSeparator="," 
                  decimalScale={2}
                  fixedDecimalScale={true}
                  allowNegative={false}
                  placeholder="Enter deposit amount"
                  value={amount}
                  onValueChange={(values) => {
                    // values.formattedValue -> e.g. "1,234.00"
                    // values.floatValue -> numeric e.g. 1234
                    setAmount(values.formattedValue || '');
                  }}
                  isAllowed={(values) => {
                    // Prevent values that are zero or negative
                    const { floatValue } = values;
                    if (floatValue === undefined) return true; // allow typing
                    return floatValue >= 0;
                  }}
                  inputMode="numeric"
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

// Main page component with Suspense boundary
export default function DepositPage() {
  return (
    <React.Suspense fallback={
      <ClientDashboardShell>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Deposit Funds</h1>
            <p className="text-sm text-gray-500">Loading...</p>
          </div>
        </div>
      </ClientDashboardShell>
    }>
      <DepositContent />
    </React.Suspense>
  );
}
