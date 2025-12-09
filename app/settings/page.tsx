"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import Toast from "@/UI/Toast";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

import ClientDashboardShell from "../dashboard/components/ClientDashboardShell";

export default function SettingsPage() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [toast, setToast] = React.useState<{ open: boolean; message: string; type: "success" | "error" | "info" }>({ open: false, message: "", type: "info" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (password && password !== confirmPassword) {
      setError("Passwords do not match");
      setToast({ open: true, message: "Passwords do not match", type: "error" });
      return;
    }
    setLoading(true);
    // TODO: Implement update logic
    setTimeout(() => {
      setLoading(false);
      setSuccess("Profile updated successfully!");
      setToast({ open: true, message: "Profile updated successfully! (mock)", type: "success" });
    }, 1000);
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
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500">Manage your account preferences and security.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    placeholder="Your Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2 pt-4 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-900">Security</h3>
                <p className="text-xs text-gray-500 mb-4">Update your password to keep your account secure.</p>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">{error}</div>}
              {success && <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md">{success}</div>}
              
              <div className="flex justify-end">
                <Button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white min-w-[120px]" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ClientDashboardShell>
  );
}
