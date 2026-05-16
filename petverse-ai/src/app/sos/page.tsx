"use client";

import { motion } from "framer-motion";
import { ShieldAlert, MapPin, Phone, ArrowLeft, Activity, Heart } from "lucide-react";
import Link from "next/link";

export default function SOS() {
  return (
    <main className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Pulsing Red Emergency Background Overlay */}
      <motion.div 
        animate={{ opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-red-500 pointer-events-none" 
      />
      
      <nav className="relative z-50 p-6 flex items-center justify-between pastel-header">
        <Link href="/dashboard" className="flex items-center gap-2 text-brand-700 hover:text-brand-900 font-bold transition-colors">
          <ArrowLeft size={20} /> Back to Dashboard
        </Link>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 max-w-3xl mx-auto w-full text-center">
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative mb-12"
        >
          {/* Ripples */}
          <motion.div animate={{ scale: [1, 2], opacity: [0.3, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-red-500 rounded-full" />
          <motion.div animate={{ scale: [1, 2.5], opacity: [0.2, 0] }} transition={{ duration: 2, delay: 0.5, repeat: Infinity }} className="absolute inset-0 bg-red-500 rounded-full" />
          
          <button className="relative w-48 h-48 rounded-full bg-gradient-to-br from-red-600 to-red-800 shadow-[0_15px_50px_rgba(220,38,38,0.3)] flex flex-col items-center justify-center text-white border-4 border-white/20 hover:scale-105 transition-transform group">
            <ShieldAlert size={48} className="mb-2 group-hover:animate-bounce" />
            <span className="text-3xl font-black tracking-widest">SOS</span>
          </button>
        </motion.div>

        <h1 className="text-5xl font-black text-brand-900 mb-4 tracking-tight">Emergency Mode</h1>
        <p className="text-slate-700 text-lg font-medium mb-12 max-w-md">Press the SOS button to instantly dispatch a pet ambulance and notify the nearest hospital.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-8">
          <div className="glass-card p-6 rounded-3xl border-red-500/10 bg-white/40 text-left flex items-start gap-4 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-600 shrink-0">
              <MapPin size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-brand-900 mb-1">Nearest Vet</h3>
              <p className="text-sm text-slate-600 mb-2">City Pet Hospital • 2.4 km away</p>
              <div className="w-full h-32 bg-slate-200 rounded-2xl mb-3 overflow-hidden relative border border-brand-500/10">
                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-122.4194,37.7749,12,0/400x400?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTAwMHozN2xpMW1pZ3p0M3MifQ')] bg-cover bg-center" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                   <div className="w-4 h-4 bg-red-600 rounded-full animate-ping absolute" />
                   <div className="w-4 h-4 bg-red-600 rounded-full relative" />
                </div>
              </div>
              <a href="https://www.google.com/maps/search/veterinary+hospital+near+me" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-red-600 hover:text-red-700 inline-block underline decoration-red-600/20 underline-offset-4">Navigate Now &rarr;</a>
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl border-red-500/10 bg-white/40 text-left flex items-start gap-4 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-600 shrink-0">
              <Phone size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-brand-900 mb-1">Emergency Contacts</h3>
              <div className="space-y-3 mt-4">
                <a href="tel:911" className="flex items-center justify-between p-3 bg-red-500/5 rounded-xl hover:bg-red-500/10 transition-colors">
                  <div className="flex items-center gap-3">
                     <Activity size={16} className="text-red-600" />
                     <span className="text-sm font-bold text-brand-900">Dr. Sarah (Primary Vet)</span>
                  </div>
                  <span className="text-xs text-red-600 font-bold uppercase tracking-widest">Call Now</span>
                </a>
                <a href="tel:123456789" className="flex items-center justify-between p-3 bg-red-500/5 rounded-xl hover:bg-red-500/10 transition-colors">
                  <div className="flex items-center gap-3">
                     <Heart size={16} className="text-red-600" />
                     <span className="text-sm font-bold text-brand-900">Pet Parent (Secondary)</span>
                  </div>
                  <span className="text-xs text-red-600 font-bold uppercase tracking-widest">Call Now</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500 uppercase tracking-[0.2em] font-bold">In case of extreme emergency, always dial your local emergency services.</p>

      </div>
    </main>
  );
}
