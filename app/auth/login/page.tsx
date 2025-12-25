"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authApi } from "@/utils/api";

import Toast from "@/components/UI/Toast";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [toast, setToast] = React.useState<{ open: boolean; message: string; type: "success" | "error" | "info" }>({ open: false, message: "", type: "info" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.login({ email, password });
      setToast({ open: true, message: "Login successful!", type: "success" });
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed. Please check your credentials.";
      setToast({ open: true, message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth logic
    setToast({ open: true, message: "Google OAuth not implemented", type: "info" });
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
            <CardTitle className="text-2xl text-center">Sign in to your account</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>
              <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
              <div className="flex items-center justify-center">
                <span className="text-xs text-muted-foreground">or</span>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2 border-pink-500 text-pink-500 hover:bg-pink-50"
                onClick={handleGoogleLogin}
              >
                <FcGoogle className="w-5 h-5" /> Sign in with Google
              </Button>
            </form>
            <div className="mt-6 text-center">
              <span className="text-sm text-muted-foreground">Don't have an account? </span>
              <Link href="/auth/register" className="text-pink-500 hover:underline font-medium">Register</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
