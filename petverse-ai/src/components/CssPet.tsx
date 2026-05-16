"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export default function CssPet() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Calculate eye pupil positions
  const eyeX = (mousePos.x - 0.5) * 15;
  const eyeY = (mousePos.y - 0.5) * 15;

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center perspective-1000">
      <motion.div 
        animate={{ 
          rotateY: (mousePos.x - 0.5) * 30,
          rotateX: -(mousePos.y - 0.5) * 30
        }}
        className="relative w-64 h-64 bg-gradient-to-br from-[#3d2b1f] to-[#1a130e] rounded-[40%_40%_30%_30%] shadow-2xl flex flex-col items-center justify-center border-4 border-white/10 backdrop-blur-sm"
      >
        {/* Ears */}
        <div className="absolute -top-10 -left-4 w-20 h-24 bg-[#1a130e] rounded-[100%_0%_100%_0%] -rotate-12 border-l-8 border-[#3d2b1f]" />
        <div className="absolute -top-10 -right-4 w-20 h-24 bg-[#1a130e] rounded-[0%_100%_0%_100%] rotate-12 border-r-8 border-[#3d2b1f]" />
        
        {/* Inner Ears */}
        <div className="absolute -top-4 -left-1 w-12 h-16 bg-[#5c4033]/40 rounded-[100%_0%_100%_0%] -rotate-12" />
        <div className="absolute -top-4 -right-1 w-12 h-16 bg-[#5c4033]/40 rounded-[0%_100%_0%_100%] rotate-12" />


        {/* Eyes Container */}
        <div className="flex gap-10 mt-8">
          {/* Left Eye */}
          <div className="w-12 h-12 bg-white rounded-full relative overflow-hidden shadow-inner">
            <motion.div 
              animate={{ x: eyeX, y: eyeY }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-slate-900 rounded-full"
            >
              <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-80" />
            </motion.div>
          </div>
          
          {/* Right Eye */}
          <div className="w-12 h-12 bg-white rounded-full relative overflow-hidden shadow-inner">
            <motion.div 
              animate={{ x: eyeX, y: eyeY }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-slate-900 rounded-full"
            >
              <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-80" />
            </motion.div>
          </div>
        </div>

        {/* Nose & Snout */}
        <div className="mt-6 w-24 h-16 bg-white/20 rounded-full relative flex items-center justify-center">
          <div className="w-6 h-4 bg-slate-900 rounded-full shadow-lg" />
          {/* Mouth */}
          <div className="absolute bottom-2 w-8 h-4 border-b-2 border-slate-900/40 rounded-full" />
        </div>

        {/* Cheeks */}
        <div className="absolute bottom-16 left-8 w-8 h-4 bg-[#8b5a2b]/20 rounded-full blur-sm" />
        <div className="absolute bottom-16 right-8 w-8 h-4 bg-[#8b5a2b]/20 rounded-full blur-sm" />

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-[40%_40%_30%_30%] bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
      </motion.div>

      {/* Shadow below */}
      <motion.div 
        animate={{ 
          scale: 1 + (mousePos.y - 0.5) * 0.2,
          opacity: 0.2 + (mousePos.y - 0.5) * 0.1
        }}
        className="absolute bottom-10 w-48 h-8 bg-black/20 rounded-full blur-xl -z-10" 
      />
    </div>
  );
}
