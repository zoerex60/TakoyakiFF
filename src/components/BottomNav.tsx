import { Utensils, MapPin, BookOpen } from "lucide-react";
import { motion } from "motion/react";

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/90 backdrop-blur-md rounded-full border-2 border-brand-red/10 shadow-2xl z-50 flex justify-around items-center px-4 py-2">
      <motion.a 
        whileTap={{ scale: 0.9 }}
        href="#" 
        aria-label="Menu"
        className="flex flex-col items-center p-4 bg-brand-red text-white rounded-full shadow-lg"
      >
        <Utensils size={20} />
      </motion.a>
      
      <motion.a 
        whileTap={{ scale: 0.9 }}
        href="#" 
        aria-label="Location"
        className="flex flex-col items-center p-4 text-zinc-400 hover:text-brand-red transition-colors"
      >
        <MapPin size={24} />
      </motion.a>
      
      <motion.a 
        whileTap={{ scale: 0.9 }}
        href="#" 
        aria-label="Story"
        className="flex flex-col items-center p-4 text-zinc-400 hover:text-brand-red transition-colors"
      >
        <BookOpen size={24} />
      </motion.a>
    </nav>
  );
}
