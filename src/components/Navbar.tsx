import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Megaphone, X } from "lucide-react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";

// ── Banner pengumuman dari Firebase ────────────────────────────────────────
function AnnouncementBanner() {
  const [text, setText] = useState<string>("");
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const unsub = onValue(ref(db, "gerobak/pengumuman"), (s) => {
      const val: string = s.val() ?? "";
      setText(val);
      // Pengumuman baru → munculkan lagi walau sudah di-dismiss
      if (val) setDismissed(false);
    });
    return () => unsub();
  }, []);

  return (
    <AnimatePresence>
      {text && !dismissed && (
        <motion.div
          key="announcement"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-brand-yellow overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-2.5 flex items-center gap-3">
            <Megaphone size={15} className="shrink-0 text-zinc-800" />
            <p className="text-xs md:text-sm font-semibold text-zinc-900 flex-1 leading-snug">
              {text}
            </p>
            <button
              onClick={() => setDismissed(true)}
              className="text-zinc-600 hover:text-zinc-900 transition-colors shrink-0 p-1"
              aria-label="Tutup pengumuman"
            >
              <X size={15} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Navbar ─────────────────────────────────────────────────────────────────
export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <AnnouncementBanner />
      <div className="bg-[#FFFDF5]/80 backdrop-blur-md border-b-2 border-creamy-dark shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-16 flex justify-between items-center">
          <div className="flex items-center gap-2 md:gap-3">
            <img
              src="/images/Takoyaki-FF-LOGO.png"
              alt="Takoyaki FF Logo"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
            />
            <span className="text-xl md:text-2xl font-black text-brand-red-dark tracking-tighter font-display">
              Takoyaki FF
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
