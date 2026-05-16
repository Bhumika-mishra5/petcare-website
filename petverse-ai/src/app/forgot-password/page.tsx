"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would call the backend here
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-brand-500/10 rounded-full blur-[150px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10 p-6"
      >
        <div className="glass-card p-8 rounded-3xl relative">
          <Link href="/login" className="flex items-center gap-2 text-slate-500 hover:text-brand-600 mb-8 transition-colors text-sm font-medium">
            <ArrowLeft size={16} /> Back to Login
          </Link>

          <h2 className="text-3xl font-bold text-brand-900 mb-2">Reset Password</h2>
          
          {!submitted ? (
            <>
              <p className="text-slate-600 mb-8 text-sm">Enter your email and we&apos;ll send you instructions to reset your password.</p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-brand-800 text-sm font-medium mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-brand-500/5 border border-brand-500/10 rounded-xl py-3 pl-12 pr-4 text-brand-900 focus:outline-none focus:border-brand-500 transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-700 to-brand-500 text-white font-bold text-base hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  Send Reset Link <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
              <div className="w-16 h-16 bg-brand-500/10 rounded-full flex items-center justify-center text-brand-600 mx-auto mb-6">
                <Send size={32} />
              </div>
              <h3 className="text-xl font-bold text-brand-900 mb-2">Check your email</h3>
              <p className="text-slate-600 text-sm mb-8">We have sent password recovery instructions to <br/><span className="font-bold text-brand-700">{email}</span></p>
              <button onClick={() => setSubmitted(false)} className="text-brand-600 font-bold hover:underline">Didn&apos;t receive it? Try again</button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </main>
  );
}
