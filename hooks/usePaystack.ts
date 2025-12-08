
import { useCallback } from "react";

interface PaystackOptions {
  amount: number;
  email: string;
  onSuccess?: (reference: string) => void;
  onClose?: () => void;
}

export function usePaystack(defaultEmail?: string) {
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_KEY || "pk_test_xxx";

  const pay = useCallback((amount: number, email?: string, onSuccess?: (reference: string) => void, onClose?: () => void) => {
    if (typeof window === "undefined") return;
    const paystack = (window as any).PaystackPop;
    if (!paystack) {
      alert("Paystack SDK not loaded");
      return;
    }
    paystack.setup({
      key: publicKey,
      email: email || defaultEmail || "test@example.com",
      amount: Math.round(amount * 100),
      callback: function (response: { reference: string }) {
        if (onSuccess) onSuccess(response.reference);
      },
      onClose: function () {
        if (onClose) onClose();
      },
    }).openIframe();
  }, [publicKey, defaultEmail]);

  return { pay };
}
