"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowRight, Activity, ShieldAlert, ShoppingBag, Heart } from "lucide-react";
import Link from "next/link";
import CssPet from "@/components/CssPet";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  const toggleDark = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };




    return (
    <main className="min-h-screen bg-background overflow-hidden relative selection:bg-brand-200 selection:text-brand-900">
      {/* Background Animated Gradient / Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-brand-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-accent-500/20 rounded-full blur-[150px] pointer-events-none" />

      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 pastel-header px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white font-bold text-xl shadow-[0_0_15px_rgba(74,124,68,0.3)]">
              P
            </div>
            <span className="text-xl font-bold text-brand-900 tracking-wide">
              PetVerse<span className="text-brand-500">.AI</span>
            </span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
            <Link href="/dashboard" className="hover:text-brand-700 hover:text-glow transition-all cursor-pointer">Features</Link>
            <Link href="/dashboard" className="hover:text-brand-700 hover:text-glow transition-all cursor-pointer">Health</Link>
            <Link href="/dashboard" className="hover:text-brand-700 hover:text-glow transition-all cursor-pointer">Market</Link>
            <Link href="/sos" className="text-red-600 hover:text-red-500 hover:drop-shadow-[0_0_10px_rgba(220,38,38,0.4)] transition-all cursor-pointer flex items-center gap-1">
              <ShieldAlert size={14} /> SOS
            </Link>
          </div>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-brand-900 hidden sm:block">{user.name || user.email}</span>
                <Link href="/account" className="px-4 py-2 rounded-full bg-brand-500/10 text-brand-700 font-medium hover:bg-brand-500/20 transition-colors">Account</Link>
                <button onClick={handleLogout} className="p-2 rounded-full text-red-600 hover:bg-red-500/10 transition-colors" title="Logout">
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="px-6 py-2 rounded-full bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/20 text-brand-700 font-medium transition-all backdrop-blur-md">
                Login
              </Link>
            )}
            <button onClick={toggleDark} className="p-2 rounded-full bg-brand-500/10 text-brand-700 hover:bg-brand-500/20 transition-colors" title="Toggle Dark Mode">
              {darkMode ? "🌙" : "☀️"}
            </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="z-20 relative"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-brand-500/30 text-brand-700 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            Next-Gen Pet Ecosystem
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-brand-900 leading-[1.05] tracking-tight mb-8">
            Your Pet&apos;s Life, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-700 to-brand-500">
              Reimagined.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-700 mb-12 max-w-lg leading-relaxed font-medium">
            Experience the future of pet care. Interactive 3D companions, AI health insights, and a smart marketplace—all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/dashboard" className="px-8 py-4 rounded-full bg-gradient-to-r from-brand-700 to-brand-500 text-white font-bold text-lg hover:shadow-[0_10px_30px_rgba(74,124,68,0.3)] transition-all flex items-center justify-center gap-2 group">
              Meet Your AI Pet
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/dashboard" className="px-8 py-4 rounded-full glass-card text-brand-700 border border-brand-500/20 font-semibold text-lg hover:bg-brand-500/10 transition-all flex items-center justify-center gap-2">
              Explore Features
            </Link>
          </div>

          {/* Quick Stats/Features */}
          <div className="grid grid-cols-3 gap-6 mt-16 pt-8 border-t border-brand-900/5">
            <div>
              <div className="text-3xl font-bold text-brand-900 mb-1">99%</div>
              <div className="text-sm text-slate-500">AI Accuracy</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-900 mb-1">24/7</div>
              <div className="text-sm text-slate-500">Vet Support</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-900 mb-1">50k+</div>
              <div className="text-sm text-slate-500">Happy Pets</div>
            </div>
          </div>
        </motion.div>

        {/* Right 3D Model Canvas */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative w-full aspect-square md:aspect-auto"
        >
          {/* Decorative rings behind the 3D model */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[80%] h-[80%] rounded-full border border-brand-500/20 animate-[spin_20s_linear_infinite]" />
            <div className="absolute w-[60%] h-[60%] rounded-full border border-accent-500/20 animate-[spin_15s_linear_infinite_reverse]" />
          </div>
          <div className="h-[400px] w-full">
            <CssPet />
          </div>
          
          {/* Floating UI Cards */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] left-[0%] glass-card p-4 rounded-2xl flex items-center gap-3 z-20 pointer-events-none"
          >
            <div className="w-10 h-10 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-600">
              <Activity size={20} />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Health Status</div>
              <div className="text-sm text-brand-900 font-bold">Optimal (98%)</div>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[20%] right-[0%] glass-card p-4 rounded-2xl flex items-center gap-3 z-20 pointer-events-none"
          >
            <div className="w-10 h-10 rounded-full bg-accent-500/10 flex items-center justify-center text-brand-500">
              <Heart size={20} />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Mood Analysis</div>
              <div className="text-sm text-brand-900 font-bold">Playful & Happy</div>
            </div>
          </motion.div>
        </motion.div>

      </div>

      {/* Feature Highlight Section Placeholder */}
      <div className="relative max-w-7xl mx-auto px-6 py-24 border-t border-brand-900/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-brand-900 mb-4">A Universe of Care</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Everything your pet needs, powered by intelligent AI and beautiful design.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Activity />, title: "Health Dashboard", desc: "Real-time vitals and AI-predicted wellness scores." },
            { icon: <ShoppingBag />, title: "Smart Marketplace", desc: "Personalized toy and food recommendations." },
            { icon: <ShieldAlert className="text-red-500" />, title: "SOS Emergency", desc: "Instant vet connections and ambulance dispatch." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="glass-card p-8 rounded-3xl group cursor-pointer hover:border-brand-500/30 transition-all border border-brand-500/5"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-500/5 flex items-center justify-center text-brand-600 mb-6 group-hover:scale-110 transition-transform group-hover:box-glow">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-brand-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
