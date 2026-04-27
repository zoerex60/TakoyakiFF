import { motion } from "motion/react";
import { ArrowRight, Flame, Fish, ShoppingBag } from "lucide-react";
import { IMAGES } from "../constants";

export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 pt-12 pb-16 flex flex-col-reverse md:flex-row items-center gap-10">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex flex-col gap-6 relative z-10"
      >
        <div className="inline-flex items-center gap-2 bg-brand-yellow text-zinc-900 px-4 py-2 rounded-full w-max font-bold text-sm shadow-sm ring-1 ring-black/5">
          <Flame size={18} className="fill-current" />
          Baru Diangkat dari Wajan!
        </div>
        
        <h1 className="font-display text-5xl md:text-6xl font-extrabold text-brand-red leading-tight">
          Takoyaki FF:<br />
          <span className="text-zinc-900">Rasa Otentik Tako di Pinggir Jalan</span>
        </h1>
        
        <p className="text-lg text-zinc-600 max-w-md">
          Rasakan sensasi garing di luar, lumer di dalam. Dibuat langsung di tempat dengan resep terbaik dan potongan gurita super besar!
        </p>
        
        <div className="flex flex-wrap items-center gap-4 mt-4">
          <button className="btn-primary group">
            Pesan Sekarang
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </button>
          <button className="btn-secondary">
            Lihat Menu
          </button>
        </div>

      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="flex-1 relative w-full aspect-square md:aspect-auto md:h-[550px]"
      >
        <div className="absolute inset-0 bg-brand-yellow/10 rounded-[3rem] transform rotate-3 scale-105"></div>
        <img 
          src={IMAGES.HERO} 
          alt="Sizzling Takoyaki" 
          className="w-full h-full object-cover rounded-[3rem] shadow-2xl relative z-10 border-4 border-white"
        />
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute -bottom-8 -left-8 z-20 w-32 h-32 bg-white rounded-full p-2 shadow-lg border-2 border-brand-red/10"
        >
          <img 
            src="/images/Mascot.png" 
            alt="Takoyaki Mascot" 
            className="w-full h-full object-cover rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
