"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Mic, Volume2, VolumeX, Sparkles, Image as ImageIcon, Paperclip, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import api from "@/lib/api";

export default function AIFloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm Mishri. I'm now powered by **Multimodal AI**. You can ask me questions or even upload photos of your pet for analysis! 🦊✨" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, loading]);

  const speak = (text: string) => {
    if (!window.speechSynthesis || !autoSpeak) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[*#]/g, ''));
    utterance.pitch = 1.2;
    utterance.rate = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async (overrideMessage?: string) => {
    const messageToSend = overrideMessage || input;
    if ((!messageToSend.trim() && !selectedImage) || loading) return;
    
    const userMsg = { role: "user", content: messageToSend || "Check this image out!" };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = messageToSend;
    const currentImage = selectedImage;
    
    setInput("");
    setSelectedImage(null);
    setImagePreview(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("message", currentInput);
      if (currentImage) formData.append("file", currentImage);
      formData.append("history", JSON.stringify(messages.slice(-3)));

      const res = await api.post("/chat", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      const assistantMsg = { role: "assistant", content: res.data.message };
      setMessages(prev => [...prev, assistantMsg]);
      speak(res.data.message);
      
      // Parse Actions
      const actionMatch = res.data.message.match(/\[ACTION: (.*?)\]/);
      if (actionMatch) {
        const action = actionMatch[1];
        if (action.startsWith("NAVIGATE ")) {
          const path = action.replace("NAVIGATE ", "");
          setTimeout(() => router.push(path), 2000);
        } else if (action.startsWith("ADD_TO_CART ")) {
          console.log("Agent added to cart:", action.replace("ADD_TO_CART ", ""));
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "I'm having a small brain freeze! Check your connection or API quota." }]);
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please try Chrome.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      window.speechSynthesis.cancel(); // Stop speaking when user starts talking
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      // Auto-send
      if (transcript.trim().length > 0) {
        handleSend(transcript);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech error", event.error);
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="fixed bottom-8 right-8 z-[1000]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.9, y: 40, filter: "blur(10px)" }}
            className="absolute bottom-24 right-0 w-[380px] h-[600px] bg-white/95 backdrop-blur-xl rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden border border-white/20"
          >
            {/* Gemini-Style Header */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 p-8 text-white relative">
              <div className="absolute top-0 left-0 w-full h-full bg-black/10" />
              <div className="relative flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                    <Sparkles size={24} className="text-white animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg tracking-tight">Mishri AI</h3>
                    <p className="text-[10px] opacity-80 uppercase tracking-[0.2em] font-black">Multimodal Genius</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setAutoSpeak(!autoSpeak)} className="p-2 hover:bg-white/20 rounded-xl transition-all">
                    {autoSpeak ? <Volume2 size={20} /> : <VolumeX size={20} />}
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-xl transition-all">
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/50">
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i} 
                  className={`${msg.role === "user" 
                    ? "bg-brand-600 text-white ml-auto rounded-3xl rounded-tr-sm shadow-lg shadow-brand-600/20" 
                    : "bg-white text-brand-900 mr-auto rounded-3xl rounded-tl-sm border border-brand-500/10 shadow-sm"} 
                    p-5 max-w-[90%] text-sm leading-relaxed prose prose-sm prose-slate`}
                >
                  <div className="font-black text-[9px] uppercase tracking-widest mb-2 opacity-50 flex items-center gap-2">
                    {msg.role === "user" ? "You" : <><Sparkles size={10} /> Mishri Intelligence</>}
                  </div>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </motion.div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-brand-500 p-2">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Generating insights...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-slate-100">
              {imagePreview && (
                <div className="mb-4 relative w-20 h-20 group">
                  <img src={imagePreview} className="w-full h-full object-cover rounded-2xl border-2 border-brand-500" />
                  <button 
                    onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              <div className="relative flex items-center gap-3 bg-slate-100/50 rounded-[2rem] p-3 border border-slate-200 focus-within:border-brand-500 focus-within:bg-white transition-all shadow-inner">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-slate-400 hover:text-brand-600 transition-colors"
                >
                  <ImageIcon size={20} />
                </button>
                <button 
                  onClick={startListening}
                  className={`p-2 rounded-full transition-all ${isListening ? "bg-red-500 text-white animate-pulse" : "text-slate-400 hover:text-brand-600"}`}
                >
                  <Mic size={20} />
                </button>
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask or upload photo..." 
                  className="flex-1 bg-transparent text-sm py-2 focus:outline-none text-brand-900 font-medium"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={loading || (!input.trim() && !selectedImage)}
                  className="w-10 h-10 bg-brand-600 text-white rounded-full flex items-center justify-center hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/30 disabled:opacity-50 disabled:shadow-none"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-20 h-20 rounded-[2rem] bg-gradient-to-tr from-brand-700 to-brand-400 text-white flex items-center justify-center shadow-[0_15px_35px_rgba(74,124,68,0.4)] relative z-10 overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? <X size={32} /> : <Sparkles size={32} className="animate-pulse" />}
        {!isOpen && (
          <span className="absolute top-4 right-4 w-3 h-3 bg-pink-500 border-2 border-white rounded-full animate-ping" />
        )}
      </motion.button>
    </div>
  );
}
