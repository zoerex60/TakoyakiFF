import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { Flame, Clock, CheckCircle2, XCircle, Package } from "lucide-react";
import { ref, onValue, set } from "firebase/database";
import { db } from "../firebase";
import takoyakiImg from "../assets/images/takoyaki.png";
import mascotImg from "../assets/images/Mascot.png";

// ── Firebase hook: gerobak status ─────────────────────────────────────────
function useGerobakData() {
  const [now, setNow] = useState(new Date());
  const [override, setOverrideRaw] = useState<"open" | "closed" | null>(null);
  const [stok, setStok] = useState<number | null>(null);

  useEffect(() => {
    const unsubs = [
      onValue(ref(db, "gerobak/override"), (s) => setOverrideRaw(s.val() ?? null)),
      onValue(ref(db, "gerobak/stok"), (s) => setStok(s.val() ?? null)),
    ];
    return () => unsubs.forEach((u) => u());
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  const day = now.getDay();
  const totalMinutes = now.getHours() * 60 + now.getMinutes();
  const second = now.getSeconds();
  const isSenin = day === 1;
  const isScheduleOpen = !isSenin && totalMinutes >= 16 * 60 && totalMinutes < 22 * 60;
  const isOpen = override === "open" ? true : override === "closed" ? false : isScheduleOpen;

  let countdownLabel = "";
  let countdownSecs = 0;

  if (!override) {
    if (isSenin) {
      countdownSecs = ((24 * 60 - totalMinutes) + 16 * 60) * 60 - second;
      countdownLabel = "Buka lagi Selasa";
    } else if (!isScheduleOpen && totalMinutes < 16 * 60) {
      countdownSecs = (16 * 60 - totalMinutes) * 60 - second;
      countdownLabel = "Buka dalam";
    } else if (!isScheduleOpen && totalMinutes >= 22 * 60) {
      countdownSecs = ((24 * 60 - totalMinutes) + 16 * 60) * 60 - second;
      countdownLabel = "Buka besok";
    } else {
      countdownSecs = (22 * 60 - totalMinutes) * 60 - second;
      countdownLabel = "Tutup dalam";
    }
  }

  const h = Math.floor(countdownSecs / 3600);
  const m = Math.floor((countdownSecs % 3600) / 60);
  const s = countdownSecs % 60;
  const countdown =
    countdownSecs > 0
      ? `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      : "";

  return { isOpen, isSenin, override, countdown, countdownLabel, stok };
}

// ── Stok Badge ─────────────────────────────────────────────────────────────
function StokBadge({ stok }: { stok: number | null }) {
  if (stok === null) return null;
  const isCritical = stok <= 5;
  const isLow = stok <= 10;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center gap-2 rounded-2xl px-4 py-3 border text-sm font-bold shadow-sm w-max ${
        isCritical
          ? "bg-red-50 border-red-200 text-red-700"
          : isLow
          ? "bg-orange-50 border-orange-200 text-orange-700"
          : "bg-green-50 border-green-200 text-green-700"
      }`}
    >
      <Package size={16} />
      Sisa <span className="text-lg leading-none">{stok}</span> porsi
      {isCritical && (
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          🔥
        </motion.span>
      )}
    </motion.div>
  );
}

// ── Full-screen admin overlay ──────────────────────────────────────────────
const ADMIN_PASSWORD = "Sayaakanlawan321";
const SESSION_KEY = "adminAuthed";

async function hashPassword(pw: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pw));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function AdminOverlay({ onClose }: { onClose: () => void }) {
  const [authed, setAuthed] = useState(false);
  const [input, setInput] = useState("");
  const [wrong, setWrong] = useState(false);
  const [shake, setShake] = useState(false);

  const [override, setOverrideState] = useState<"open" | "closed" | null>(null);
  const [stok, setStokState] = useState<number | null>(null);
  const [pengumumanInput, setPengumumanInput] = useState("");
  const [stokInput, setStokInput] = useState("");
  const [stokSaved, setStokSaved] = useState(false);
  const [pengumumanSaved, setPengumumanSaved] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        const expected = await hashPassword(ADMIN_PASSWORD);
        if (stored === expected) setAuthed(true);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (!authed) return;
    const unsubs = [
      onValue(ref(db, "gerobak/override"), (s) => setOverrideState(s.val() ?? null)),
      onValue(ref(db, "gerobak/stok"), (s) => setStokState(s.val() ?? null)),
      onValue(ref(db, "gerobak/pengumuman"), (s) => setPengumumanInput(s.val() ?? "")),
    ];
    return () => unsubs.forEach((u) => u());
  }, [authed]);

  const handleLogin = async () => {
    const hash = await hashPassword(input);
    const expected = await hashPassword(ADMIN_PASSWORD);
    if (hash === expected) {
      localStorage.setItem(SESSION_KEY, expected);
      setAuthed(true);
    } else {
      setWrong(true);
      setShake(true);
      setInput("");
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleSetStok = (val: number | null) => {
    set(ref(db, "gerobak/stok"), val);
    setStokInput("");
    setStokSaved(true);
    setTimeout(() => setStokSaved(false), 2000);
  };

  const handleSavePengumuman = () => {
    set(ref(db, "gerobak/pengumuman"), pengumumanInput || null);
    setPengumumanSaved(true);
    setTimeout(() => setPengumumanSaved(false), 2000);
  };

  return (
    <motion.div
      key="admin-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-zinc-950/95 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-6 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        className="w-full max-w-sm bg-zinc-900 rounded-3xl p-6 flex flex-col gap-5 shadow-2xl mt-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-white font-black text-lg">Admin Panel</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white text-sm transition-colors">Tutup</button>
        </div>

        {!authed ? (
          <motion.div animate={shake ? { x: [-8, 8, -6, 6, 0] } : {}} className="flex flex-col gap-3">
            <input
              type="password"
              value={input}
              onChange={(e) => { setInput(e.target.value); setWrong(false); }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="Password admin..."
              autoFocus
              className="bg-zinc-800 text-white rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-red placeholder:text-zinc-600"
            />
            {wrong && <p className="text-red-400 text-xs px-1">Password salah.</p>}
            <button onClick={handleLogin} className="bg-brand-red text-white font-bold py-3 rounded-xl text-sm hover:bg-red-700 transition-colors">
              Masuk
            </button>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Status */}
            <div className="bg-zinc-800 rounded-2xl p-4 flex flex-col gap-3">
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Status Gerobak</p>
              <div className="flex gap-2">
                {([
                  { label: "Buka", val: "open" as const, cls: "bg-green-500 text-white" },
                  { label: "Tutup", val: "closed" as const, cls: "bg-red-500 text-white" },
                  { label: "Auto", val: null, cls: "bg-zinc-600 text-white" },
                ] as const).map((btn) => (
                  <button
                    key={btn.label}
                    onClick={() => set(ref(db, "gerobak/override"), btn.val)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${
                      override === btn.val ? btn.cls : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stok */}
            <div className="bg-zinc-800 rounded-2xl p-4 flex flex-col gap-3">
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider">
                Sisa Stok {stok !== null && <span className="text-white ml-1">{stok} porsi</span>}
              </p>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  value={stokInput}
                  onChange={(e) => setStokInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && stokInput !== "" && handleSetStok(Number(stokInput))}
                  placeholder="Jumlah..."
                  className="flex-1 bg-zinc-700 text-white text-sm rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-brand-red placeholder:text-zinc-600"
                />
                <button
                  onClick={() => stokInput !== "" && handleSetStok(Number(stokInput))}
                  className={`px-4 rounded-xl text-xs font-bold transition-colors ${stokSaved ? "bg-green-500 text-white" : "bg-brand-red text-white"}`}
                >
                  {stokSaved ? "✓" : "Set"}
                </button>
                <button onClick={() => handleSetStok(null)} className="px-3 rounded-xl text-xs font-bold bg-zinc-700 text-zinc-300 hover:bg-zinc-600">
                  Clear
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {[5, 10, 15, 20, 30].map((n) => (
                  <button
                    key={n}
                    onClick={() => handleSetStok(n)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      stok === n ? "bg-brand-red text-white" : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Pengumuman */}
            <div className="bg-zinc-800 rounded-2xl p-4 flex flex-col gap-3">
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Pengumuman</p>
              <textarea
                value={pengumumanInput}
                onChange={(e) => setPengumumanInput(e.target.value)}
                placeholder="Pesan banner atas..."
                rows={2}
                className="bg-zinc-700 text-white text-sm rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-brand-red placeholder:text-zinc-600 resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSavePengumuman}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors ${pengumumanSaved ? "bg-green-500 text-white" : "bg-brand-red text-white"}`}
                >
                  {pengumumanSaved ? "✓ Tersimpan!" : "Simpan & Tampilkan"}
                </button>
                <button
                  onClick={() => { set(ref(db, "gerobak/pengumuman"), null); setPengumumanInput(""); }}
                  className="px-4 rounded-xl text-xs font-bold bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
                >
                  Hapus
                </button>
              </div>
            </div>

            <button
              onClick={() => { localStorage.removeItem(SESSION_KEY); setAuthed(false); }}
              className="text-zinc-600 hover:text-zinc-400 text-xs font-medium transition-colors text-center"
            >
              Keluar dari sesi admin
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ── Status widget ──────────────────────────────────────────────────────────
function StatusGerobak({ onOpenAdmin }: { onOpenAdmin: () => void }) {
  const { isOpen, isSenin, override, countdown, countdownLabel, stok } = useGerobakData();
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTap = () => {
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    if (tapCount.current >= 5) {
      tapCount.current = 0;
      onOpenAdmin();
    } else {
      tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 1500);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-max">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        onClick={handleTap}
        className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 shadow-md border border-black/5 select-none cursor-pointer"
      >
        {isOpen ? (
          <CheckCircle2 size={28} className="text-green-500 shrink-0" />
        ) : (
          <XCircle size={28} className="text-zinc-400 shrink-0" />
        )}
        <div>
          <div className="flex items-center gap-2">
            <span className={`font-black text-lg leading-none ${isOpen ? "text-green-600" : "text-zinc-500"}`}>
              {isOpen ? "Buka Sekarang" : isSenin && !override ? "Hari Libur" : "Sedang Tutup"}
            </span>
            {isOpen && (
              <motion.span
                className="w-2 h-2 rounded-full bg-green-500"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <Clock size={12} className="text-zinc-400" />
            <span className="text-xs text-zinc-500 font-mono">
              {countdownLabel}{countdown ? " " : ""}
              <span className="font-bold text-zinc-700">{countdown}</span>
            </span>
          </div>
        </div>
      </motion.div>

      <StokBadge stok={stok} />
    </div>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────────
export default function Hero() {
  const { scrollY } = useScroll();
  const imgY = useTransform(scrollY, [0, 400], [0, 60]);
  const imgOpacity = useTransform(scrollY, [0, 350], [1, 0.4]);
  const textY = useTransform(scrollY, [0, 400], [0, -30]);

  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <>
      <AnimatePresence>
        {showAdmin && <AdminOverlay onClose={() => setShowAdmin(false)} />}
      </AnimatePresence>
      <section className="max-w-7xl mx-auto px-4 md:px-6 pt-12 pb-16 flex flex-col-reverse md:flex-row items-center gap-10">
        <motion.div
          style={{ y: textY }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 flex flex-col gap-6 relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-brand-yellow text-zinc-900 px-4 py-2 rounded-full w-max font-bold text-sm shadow-sm ring-1 ring-black/5"
          >
            <Flame size={18} className="fill-current" />
            Baru Diangkat dari Wajan!
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="font-display text-5xl md:text-6xl font-extrabold text-brand-red leading-tight"
          >
            Takoyaki FF:<br />
            <span className="text-zinc-900">Rasa Otentik Tako di Pinggir Jalan</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-lg text-zinc-600 max-w-md"
          >
            Rasakan sensasi garing di luar, lumer di dalam. Dibuat langsung di tempat dengan resep terbaik dan potongan gurita super besar!
          </motion.p>

          <StatusGerobak onOpenAdmin={() => setShowAdmin(true)} />
        </motion.div>

        <motion.div
          style={{ y: imgY, opacity: imgOpacity }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1 relative w-full aspect-square md:aspect-auto md:h-[550px]"
        >
          <motion.div
            animate={{ rotate: [3, 3.8, 3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-brand-yellow/10 rounded-[3rem] scale-105"
          />
          <img
            src={takoyakiImg}
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
              src={mascotImg}
              alt="Takoyaki Mascot"
              className="w-full h-full object-cover rounded-full"
            />
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
