"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Star, Filter, ArrowRight, CheckCircle2, X } from "lucide-react";
import Link from "next/link";

const PRODUCTS = [
  { id: 1, name: "Premium Organic Dog Food", price: 45.99, category: "Food", rating: 4.8, image: "🍖", desc: "Grain-free, high-protein formula for active dogs." },
  { id: 2, name: "Smart AI Pet Tracker", price: 129.00, category: "Tech", rating: 4.9, image: "🛰️", desc: "Real-time GPS tracking and activity monitoring." },
  { id: 3, name: "Orthopedic Memory Foam Bed", price: 89.50, category: "Comfort", rating: 4.7, image: "🛌", desc: "Relieves joint pain for senior pets." },
  { id: 4, name: "Interactive Laser Toy", price: 24.99, category: "Toys", rating: 4.5, image: "🎾", desc: "Automatic play sessions for bored cats." },
  { id: 5, name: "Calming Hemp Treats", price: 19.99, category: "Health", rating: 4.6, image: "🌿", desc: "Reduces anxiety during thunderstorms or travel." },
  { id: 6, name: "Self-Cleaning Litter Box", price: 399.00, category: "Tech", rating: 4.8, image: "🚽", desc: "The ultimate convenience for cat owners." },
];

export default function Marketplace() {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const filteredProducts = PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product: any) => {
    setCart([...cart, product]);
  };

  const total = cart.reduce((acc, item) => acc + item.price, 0);

  const placeOrder = () => {
    setOrderPlaced(true);
    setTimeout(() => {
      setOrderPlaced(false);
      setShowCheckout(false);
      setCart([]);
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-background text-brand-900 selection:bg-brand-200">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 pastel-header px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white font-bold text-xl">
              P
            </div>
            <span className="text-xl font-bold tracking-wide text-brand-900">
              PetVerse<span className="text-brand-500">.Market</span>
            </span>
          </Link>
          
          <button 
            onClick={() => setShowCheckout(true)}
            className="relative p-3 rounded-full bg-brand-500/10 text-brand-700 hover:bg-brand-500/20 transition-all"
          >
            <ShoppingCart size={20} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-brand-900 mb-4 tracking-tight">
            The Smart <span className="text-brand-500">Marketplace</span>
          </h1>
          <p className="text-slate-600 max-w-xl font-medium">Curated products for the modern pet parent, recommended by AI based on your pet's needs.</p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search premium food, tech, toys..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-brand-500/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-brand-500 shadow-sm transition-all"
            />
          </div>
          <button className="px-6 py-4 rounded-2xl bg-white border border-brand-500/10 flex items-center gap-2 font-bold text-brand-700 hover:bg-brand-50 transition-colors shadow-sm">
            <Filter size={18} /> Categories
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={product.id} 
              className="glass-card group p-6 rounded-[2.5rem] border-brand-500/5 hover:border-brand-500/20 transition-all hover:shadow-xl"
            >
              <div className="h-48 bg-brand-500/5 rounded-3xl mb-6 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500">
                {product.image}
              </div>
              <div className="flex justify-between items-start mb-2">
                <span className="px-3 py-1 bg-brand-500/10 text-brand-600 rounded-full text-[10px] font-bold uppercase tracking-widest">{product.category}</span>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star size={14} fill="currentColor" />
                  <span className="text-xs font-bold">{product.rating}</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-brand-900 mb-2">{product.name}</h3>
              <p className="text-slate-500 text-sm mb-6 line-clamp-2">{product.desc}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-2xl font-black text-brand-900">${product.price.toFixed(2)}</span>
                <button 
                  onClick={() => addToCart(product)}
                  className="bg-brand-600 text-white p-3 rounded-2xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/20 active:scale-95"
                >
                  <ShoppingCart size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowCheckout(false)}
              className="absolute inset-0 bg-brand-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-white rounded-[3rem] p-8 shadow-2xl"
            >
              <button 
                onClick={() => setShowCheckout(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>

              {orderPlaced ? (
                <div className="text-center py-12">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6"
                  >
                    <CheckCircle2 size={48} />
                  </motion.div>
                  <h2 className="text-3xl font-black text-brand-900 mb-2">Order Placed!</h2>
                  <p className="text-slate-600">Your pet's goodies are on their way.</p>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-black text-brand-900 mb-8">Your Cart</h2>
                  {cart.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">Your cart is empty.</div>
                  ) : (
                    <>
                      <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {cart.map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-brand-500/5 rounded-2xl">
                            <div className="flex items-center gap-4">
                              <span className="text-2xl">{item.image}</span>
                              <div className="font-bold text-brand-900">{item.name}</div>
                            </div>
                            <div className="font-black">${item.price.toFixed(2)}</div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-brand-500/10 pt-6 mb-8">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-slate-500 font-medium">Subtotal</span>
                          <span className="font-bold">${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xl">
                          <span className="text-brand-900 font-black">Total</span>
                          <span className="text-brand-600 font-black">${total.toFixed(2)}</span>
                        </div>
                      </div>
                      <button 
                        onClick={placeOrder}
                        className="w-full py-5 rounded-2xl bg-brand-600 text-white font-black text-lg hover:bg-brand-700 transition-all shadow-xl shadow-brand-600/30 flex items-center justify-center gap-3"
                      >
                        Complete Payment <ArrowRight size={20} />
                      </button>
                    </>
                  )}
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
