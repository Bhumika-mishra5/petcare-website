"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, Heart, ShieldAlert, LogOut, ShoppingCart, Plus, Calendar, TrendingUp, Sparkles, ArrowRight, CheckCircle2, Bell } from "lucide-react";
import api from "@/lib/api";
import Modal from "@/components/Modal";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [newPetData, setNewPetData] = useState({ name: "", species: "", ageYears: "", breed: "", weight: "" });
  const [addingPet, setAddingPet] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (!token) {
      router.push("/login");
      return;
    }
    
    if (storedUser) setUser(JSON.parse(storedUser));

    api.get("/pets")
      .then(res => {
        const petsList = res.data.data.pets || [];
        setPets(petsList);
        if (petsList.length > 0) setSelectedPetId(petsList[0]._id);
      })
      .catch(err => console.error("Error fetching pets", err))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const generateAIReport = async (petId: string) => {
    setGeneratingReport(true);
    setAiReport(null);
    try {
      const res = await api.get(`/pets/${petId}/ai-report`);
      setAiReport(res.data.data.report);
    } catch (err) {
      console.error("Report Error", err);
      setAiReport("Failed to generate report. Please try again.");
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleAddPet = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingPet(true);
    try {
      const res = await api.post("/pets", newPetData);
      const newPet = res.data.data.pet;
      setPets((prev: any) => [...prev, newPet]);
      if (!selectedPetId) setSelectedPetId(newPet._id);
      setActiveModal(null);
      setNewPetData({ name: "", species: "", ageYears: "", breed: "", weight: "" });
    } catch (err) {
      console.error("Error adding pet", err);
      alert("Failed to add pet. Please try again.");
    } finally {
      setAddingPet(false);
    }
  };

  const currentPet = (pets as any[]).find(p => p._id === selectedPetId) || (pets[0] as any);

  const toggleGoal = async (goalId: number) => {
    if (!currentPet) return;
    const updatedGoals = currentPet.activityGoals.map((g: any) => 
      g.id === goalId ? { ...g, done: !g.done, current: !g.done ? g.goal : "0" } : g
    );
    
    try {
      await api.patch(`/pets/${currentPet._id}`, { activityGoals: updatedGoals });
      setPets((prev: any) => prev.map((p: any) => p._id === currentPet._id ? { ...p, activityGoals: updatedGoals } : p));
    } catch (err) {
      console.error("Error updating goals", err);
    }
  };

  const addVaccination = async (vaxName: string) => {
    if (!currentPet) return;
    const newVax = { name: vaxName, date: new Date().toLocaleDateString(), status: "Completed" };
    const updatedVax = [...(currentPet.vaccinations || []), newVax];
    
    try {
      await api.patch(`/pets/${currentPet._id}`, { vaccinations: updatedVax });
      setPets((prev: any) => prev.map((p: any) => p._id === currentPet._id ? { ...p, vaccinations: updatedVax } : p));
    } catch (err) {
      console.error("Error adding vaccination", err);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-brand-900">Loading PetVerse AI...</div>;
  }

  return (
    <main className="min-h-screen bg-background text-brand-900 selection:bg-brand-200">
      <nav className="fixed top-0 w-full z-50 pastel-header px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white font-bold text-xl">
              P
            </div>
            <span className="text-xl font-bold tracking-wide text-brand-900 hidden sm:block">
              PetVerse<span className="text-brand-500">.AI</span>
            </span>
          </Link>
          
          <div className="flex gap-4 items-center">
            <Link href="/marketplace" className="px-4 py-2 rounded-full bg-brand-500/10 text-brand-700 font-medium hover:bg-brand-500/20 transition-colors flex items-center gap-2">
               <ShoppingCart size={16} /> <span className="hidden sm:inline">Market</span>
            </Link>
            <Link href="/sos" className="px-4 py-2 rounded-full bg-red-500/10 text-red-600 font-medium hover:bg-red-500/20 transition-colors flex items-center gap-2">
               <ShieldAlert size={16} /> <span className="hidden sm:inline">Emergency</span>
            </Link>
            {user?.name && (
              <span className="text-sm text-brand-800 font-medium hidden sm:block">{user.name}</span>
            )}
            <button onClick={handleLogout} className="p-2 rounded-full hover:bg-brand-500/10 transition-colors text-slate-500 hover:text-brand-700">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Section: Pet Management & Health (Col 1-5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden bg-white/40">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/5 rounded-full blur-[50px] -mr-10 -mt-10" />
            <h2 className="text-4xl font-black mb-2 text-brand-900 tracking-tight">Hello, {user?.name || "User"} 👋</h2>
            <p className="text-slate-600 text-lg font-medium mb-8">Manage your pets and track health insights.</p>
            
            <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-brand-500/10 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-xs text-brand-800 tracking-widest uppercase">Your Pets</h3>
                <button 
                  onClick={() => setActiveModal('addPet')}
                  className="flex items-center gap-2 text-brand-600 text-xs font-black hover:text-brand-700 transition-colors bg-brand-500/10 px-4 py-2 rounded-xl"
                >
                  <Plus size={14} /> Add New
                </button>
              </div>
              
              {pets.length === 0 ? (
                <div className="text-center py-10 text-sm text-slate-400 border-2 border-dashed border-brand-500/10 rounded-[2rem]">
                  No pets registered yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {pets.map((pet: any) => (
                    <div 
                      key={pet._id} 
                      onClick={() => {
                        setSelectedPetId(pet._id);
                        setActiveModal('petDetail');
                      }}
                      className={`flex items-center gap-4 p-4 border rounded-[1.5rem] cursor-pointer transition-all group ${selectedPetId === pet._id ? 'bg-brand-50 border-brand-500/20' : 'bg-white border-brand-500/5 hover:border-brand-500/20'}`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all ${selectedPetId === pet._id ? 'bg-brand-600 text-white' : 'bg-brand-500/10 text-brand-700'}`}>
                        {pet.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-brand-900">{pet.name}</div>
                        <div className="text-xs text-slate-500 font-medium">{pet.species} • {pet.ageYears} years</div>
                      </div>
                      <ArrowRight size={16} className={`${selectedPetId === pet._id ? 'text-brand-600' : 'text-brand-300'} group-hover:translate-x-1 transition-all`} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="glass-card p-8 rounded-[2.5rem] bg-white/40 border-brand-500/5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-xs text-brand-800 tracking-widest uppercase">AI Health Insights</h3>
              {pets.length > 0 && (
                <button 
                  onClick={() => generateAIReport((pets[0] as any).id)}
                  disabled={generatingReport}
                  className="text-[10px] font-black uppercase tracking-[0.15em] text-white bg-brand-600 hover:bg-brand-700 transition-all px-4 py-2 rounded-xl disabled:opacity-50 shadow-lg shadow-brand-600/20"
                >
                  {generatingReport ? "Analyzing..." : "Generate AI Report"}
                </button>
              )}
            </div>
            <div className="flex items-center gap-6 p-6 bg-brand-600 rounded-[2rem] text-white mb-6 shadow-xl shadow-brand-600/20">
              <div className="w-20 h-20 rounded-full border-[6px] border-white/20 flex items-center justify-center font-black text-2xl relative">
                98%
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border-2 border-white/40" 
                />
              </div>
              <div>
                <div className="font-black text-xl mb-1">Optimal Health</div>
                <div className="text-sm text-white/80 font-medium">All pet vitals are within normal range.</div>
              </div>
            </div>

            {aiReport && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-white rounded-[2rem] border border-brand-500/10 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap shadow-inner"
              >
                <div className="flex items-center gap-2 mb-4 text-brand-600 font-black text-[10px] uppercase tracking-widest">
                  <TrendingUp size={14} /> Full AI Assessment
                </div>
                {aiReport}
                <button onClick={() => setAiReport(null)} className="block mt-6 text-brand-600 font-black hover:underline text-xs">Dismiss Report</button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Section: Highlights & Calendar (Col 6-12) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
              onClick={() => setActiveModal('vaccination')}
              className="glass-card p-6 rounded-[2rem] bg-white/40 flex items-center gap-4 text-left hover:border-amber-500/30 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                <Calendar size={24} />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Upcoming</div>
                <div className="font-black text-brand-900">Vaccination</div>
                <div className="text-xs text-slate-600 font-medium">
                  {currentPet?.vaccinations?.length > 0 ? "Check Status" : "No Records"} • {currentPet?.name}
                </div>
              </div>
            </button>
            <button 
              onClick={() => setActiveModal('dailyGoal')}
              className="glass-card p-6 rounded-[2rem] bg-white/40 flex items-center gap-4 text-left hover:border-brand-500/30 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-600 group-hover:scale-110 transition-transform">
                <Activity size={24} />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Activity</div>
                <div className="font-black text-brand-900">Daily Goal</div>
                <div className="text-xs text-slate-600 font-medium">
                  {currentPet?.activityGoals ? Math.round((currentPet.activityGoals.filter((g:any) => g.done).length / currentPet.activityGoals.length) * 100) : 0}% completed
                </div>
              </div>
            </button>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] bg-white/40 min-h-[400px] relative overflow-hidden">
             <div className="flex justify-between items-center mb-8">
               <h3 className="font-black text-2xl text-brand-900 tracking-tight">Marketplace Highlights</h3>
               <Link href="/marketplace" className="text-brand-600 font-black text-xs hover:underline">View All &rarr;</Link>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {[
                 { name: "Premium Dog Food", price: "$45", img: "🍖", tag: "Best Seller" },
                 { name: "AI Health Tracker", price: "$129", img: "🛰️", tag: "New Arrival" }
               ].map((item, i) => (
                 <div 
                   key={i} 
                   onClick={() => router.push('/marketplace')}
                   className="p-6 bg-white rounded-[2rem] border border-brand-500/5 hover:border-brand-500/20 transition-all group cursor-pointer shadow-sm hover:shadow-md"
                 >
                    <div className="h-32 bg-slate-50 rounded-2xl mb-4 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                      {item.img}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-500 mb-1 block">{item.tag}</span>
                    <div className="flex justify-between items-center">
                      <div className="font-black text-brand-900">{item.name}</div>
                      <div className="font-black text-brand-600">{item.price}</div>
                    </div>
                 </div>
               ))}
             </div>

             <div className="mt-12 p-8 bg-gradient-to-br from-brand-700 to-brand-500 rounded-[2.5rem] text-white relative overflow-hidden shadow-xl shadow-brand-600/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                <h4 className="text-2xl font-black mb-2">Need advice?</h4>
                <p className="text-white/80 font-medium mb-6 max-w-sm">Use our **Multimodal AI Assistant** in the bottom-right corner for vision-powered pet care support.</p>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                  <Sparkles size={16} /> Powered by PetVerse Intelligence
                </div>
             </div>
          </div>
        </div>

      </div>

      <Modal 
        isOpen={activeModal === 'vaccination'} 
        onClose={() => setActiveModal(null)}
        title="Upcoming Vaccinations"
      >
        <div className="space-y-6">
          <div className="p-6 bg-amber-50 rounded-3xl border border-amber-200 flex items-start gap-4">
            <div className="p-3 bg-amber-500 text-white rounded-2xl">
              <Bell size={24} />
            </div>
            <div>
              <div className="font-black text-amber-900">Rabies Booster</div>
              <div className="text-sm text-amber-700 font-medium mb-2">Due in 4 days (May 19, 2026)</div>
              <div className="text-xs text-amber-600 bg-white/50 px-3 py-1 rounded-full inline-block">Sparky • Golden Retriever</div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-black text-xs uppercase tracking-widest text-slate-400">Vaccination History</h4>
            {currentPet?.vaccinations?.length > 0 ? (
              currentPet.vaccinations.map((v: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div>
                    <div className="font-bold text-slate-800">{v.name}</div>
                    <div className="text-xs text-slate-500 font-medium">{v.date}</div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-black text-brand-600">
                    <CheckCircle2 size={14} /> {v.status}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-sm text-slate-400 italic">No vaccination records found.</div>
            )}
          </div>

          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">New Vaccination</label>
            <div className="flex gap-2">
              <input 
                id="vaxInput"
                type="text" 
                placeholder="e.g. Parvovirus"
                className="flex-1 p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500"
              />
              <button 
                onClick={() => {
                  const input = document.getElementById('vaxInput') as HTMLInputElement;
                  if (input.value) {
                    addVaccination(input.value);
                    input.value = '';
                  }
                }}
                className="px-4 py-2 bg-brand-600 text-white rounded-xl font-bold"
              >
                Add
              </button>
            </div>
          </div>

          <button 
            onClick={() => {
              alert("Appointment request sent to nearby vets! 🦊");
              setActiveModal(null);
            }}
            className="w-full py-4 bg-brand-600 text-white rounded-[1.5rem] font-black hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/20"
          >
            Schedule Appointment
          </button>
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === 'dailyGoal'} 
        onClose={() => setActiveModal(null)}
        title="Activity Goals"
      >
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
               <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-[10px] border-brand-500/20 relative mb-4">
                  <span className="text-3xl font-black text-brand-900">
                    {currentPet?.activityGoals ? Math.round((currentPet.activityGoals.filter((g:any) => g.done).length / currentPet.activityGoals.length) * 100) : 0}%
                  </span>
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle 
                      cx="64" cy="64" r="54" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="10" 
                      className="text-brand-600"
                      strokeDasharray="339.292"
                      strokeDashoffset={339.292 - (339.292 * (currentPet?.activityGoals ? (currentPet.activityGoals.filter((g:any) => g.done).length / currentPet.activityGoals.length) : 0))}
                    />
                  </svg>
               </div>
               <h4 className="text-xl font-black text-brand-900">
                 {currentPet?.activityGoals?.every((g:any) => g.done) ? "Perfect Day! 🏆" : "Keep going!"}
               </h4>
               <p className="text-slate-500 text-sm font-medium">
                 Track {currentPet?.name}'s fitness levels.
               </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Daily Tasks</h5>
              <button 
                onClick={() => setActiveModal(activeModal === 'editGoals' ? 'dailyGoal' : 'editGoals')}
                className="text-[10px] font-black uppercase tracking-widest text-brand-600 hover:text-brand-700"
              >
                {activeModal === 'editGoals' ? 'View Mode' : 'Edit Mode'}
              </button>
            </div>

            {activeModal === 'editGoals' ? (
              <div className="space-y-4">
                {currentPet?.activityGoals?.map((g: any, i: number) => (
                  <div key={i} className="p-4 bg-white border border-slate-100 rounded-2xl flex gap-3">
                    <div className="flex-1 space-y-2">
                      <input 
                        type="text" 
                        value={g.label}
                        onChange={(e) => {
                          const updated = currentPet.activityGoals.map((item: any) => item.id === g.id ? { ...item, label: e.target.value } : item);
                          setPets((prev: any) => prev.map((p: any) => p._id === currentPet._id ? { ...p, activityGoals: updated } : p));
                        }}
                        className="w-full text-sm font-bold bg-slate-50 p-2 rounded-lg border-none focus:ring-1 focus:ring-brand-500"
                      />
                      <input 
                        type="text" 
                        value={g.goal}
                        onChange={(e) => {
                          const updated = currentPet.activityGoals.map((item: any) => item.id === g.id ? { ...item, goal: e.target.value } : item);
                          setPets((prev: any) => prev.map((p: any) => p._id === currentPet._id ? { ...p, activityGoals: updated } : p));
                        }}
                        className="w-full text-xs bg-slate-50 p-2 rounded-lg border-none focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                  </div>
                ))}
                <button 
                  onClick={async () => {
                    try {
                      await api.patch(`/pets/${currentPet._id}`, { activityGoals: currentPet.activityGoals });
                      setActiveModal('dailyGoal');
                    } catch (err) {
                      console.error("Save error", err);
                    }
                  }}
                  className="w-full py-4 bg-brand-600 text-white rounded-2xl font-black text-sm"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              currentPet?.activityGoals?.map((g: any, i: number) => (
                <div 
                  key={i} 
                  onClick={() => toggleGoal(g.id)}
                  className={`p-5 rounded-[1.5rem] flex items-center justify-between border transition-all cursor-pointer ${g.done ? 'bg-brand-50 border-brand-500/10' : 'bg-slate-50 border-transparent hover:border-brand-500/10'}`}
                >
                  <div>
                    <div className={`font-bold ${g.done ? 'text-brand-900' : 'text-slate-800'}`}>{g.label}</div>
                    <div className="text-xs text-slate-500 font-medium">{g.done ? g.goal : g.current} / {g.goal}</div>
                  </div>
                  {g.done ? (
                    <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white">
                      <CheckCircle2 size={20} />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-brand-500/20 group-hover:text-brand-600 transition-colors">
                      <Plus size={20} />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-6 bg-gradient-to-br from-brand-50 to-brand-100 rounded-3xl border border-brand-200">
            <div className="flex items-center gap-3 text-brand-700 font-black text-sm mb-2">
              <Sparkles size={18} /> AI Suggestion
            </div>
            <p className="text-xs text-brand-800 leading-relaxed font-medium">
              Sparky is doing great today! A quick 5-minute session with his favorite ball will help him reach his activity goal for the day.
            </p>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === 'addPet'} 
        onClose={() => setActiveModal(null)}
        title="Register New Pet"
      >
        <form onSubmit={handleAddPet} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Pet Name</label>
              <input 
                type="text" 
                required
                value={newPetData.name}
                onChange={e => setNewPetData({...newPetData, name: e.target.value})}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand-500 transition-all font-medium"
                placeholder="e.g. Sparky"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Species</label>
                <input 
                  type="text" 
                  required
                  value={newPetData.species}
                  onChange={e => setNewPetData({...newPetData, species: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand-500 transition-all font-medium"
                  placeholder="e.g. Dog"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Age (Years)</label>
                <input 
                  type="number" 
                  required
                  value={newPetData.ageYears}
                  onChange={e => setNewPetData({...newPetData, ageYears: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand-500 transition-all font-medium"
                  placeholder="e.g. 3"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Breed</label>
              <input 
                type="text" 
                value={newPetData.breed}
                onChange={e => setNewPetData({...newPetData, breed: e.target.value})}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand-500 transition-all font-medium"
                placeholder="e.g. Golden Retriever"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Weight (kg)</label>
              <input 
                type="number" 
                step="0.1"
                value={newPetData.weight}
                onChange={e => setNewPetData({...newPetData, weight: e.target.value})}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-brand-500 transition-all font-medium"
                placeholder="e.g. 25.5"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={addingPet}
            className="w-full py-4 bg-brand-600 text-white rounded-[1.5rem] font-black hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/20 disabled:opacity-50"
          >
            {addingPet ? "Registering..." : "Register Pet"}
          </button>
        </form>
      </Modal>

      <Modal 
        isOpen={activeModal === 'petDetail'} 
        onClose={() => setActiveModal(null)}
        title="Pet Insights"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl">
            <div className="w-20 h-20 rounded-2xl bg-brand-500/10 flex items-center justify-center font-black text-brand-700 text-3xl">
              S
            </div>
            <div>
              <h4 className="text-2xl font-black text-brand-900">{currentPet?.name || "Sparky"}</h4>
              <p className="text-slate-500 font-medium">{currentPet?.species || "Dog"} • {currentPet?.ageYears || 3} Years Old</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-slate-100 rounded-2xl">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Weight</div>
              <div className="text-lg font-black text-brand-900">{currentPet?.weight || "25.5"} kg</div>
            </div>
            <div className="p-4 bg-white border border-slate-100 rounded-2xl">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Mood</div>
              <div className="text-lg font-black text-brand-900">Happy 🐶</div>
            </div>
          </div>

          <div className="p-6 bg-brand-50 rounded-3xl border border-brand-100">
             <div className="text-brand-700 font-black text-xs uppercase tracking-widest mb-2">Mishri's Note</div>
             <p className="text-sm text-brand-800 leading-relaxed">
               Sparky is looking exceptionally healthy today! Remember to track his water intake if the temperature rises above 30°C.
             </p>
          </div>

          <button 
            onClick={() => setActiveModal(null)}
            className="w-full py-4 bg-slate-900 text-white rounded-[1.5rem] font-black hover:bg-black transition-all"
          >
            Close Details
          </button>
        </div>
      </Modal>
    </main>
  );
}
