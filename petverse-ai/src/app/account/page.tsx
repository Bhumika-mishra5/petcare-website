"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, User, RefreshCw } from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    else router.push("/login");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const switchAccount = () => {
    // simply clear token and go to login to allow new login
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="glass-card p-8 rounded-3xl w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-brand-900">Account</h2>
        {user && (
          <div className="mb-6">
            <p className="text-lg font-medium text-brand-800 flex items-center justify-center gap-2">
              <User size={20} /> {user.name || user.email}
            </p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 mb-4 rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
        >
          <LogOut size={18} /> Logout
        </button>
        <button
          onClick={switchAccount}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-500/10 text-brand-700 hover:bg-brand-500/20 transition-colors"
        >
          <RefreshCw size={18} /> Switch Account
        </button>
        <div className="mt-6">
          <Link href="/dashboard" className="text-sm text-brand-600 hover:underline">← Back to Dashboard</Link>
        </div>
      </div>
    </main>
  );
}
