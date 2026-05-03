import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Clock, Store, ExternalLink, X, Satellite } from "lucide-react";
import { IMAGES } from "../constants";
import streetViewImg from "../assets/images/street-view.jpeg";

const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d247.90196607719034!2d106.83371936995681!3d-6.206681001484099!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sid!2sid!4v1777288119140!5m2!1sid!2sid";

const GMAPS_LINK = "https://www.google.com/maps/place/6%C2%B012'24.1%22S+106%C2%B050'00.2%22E/@-6.2067107,106.8335962,21z/data=!4m4!3m3!8m2!3d-6.206692!4d106.833393?entry=ttu&g_ep=EgoyMDI2MDQyMi4wIKXMDSoASAFQAw%3D%3D";

// Tambahkan di constants.ts: STREET_VIEW: "/images/street-view.png"
const STREET_VIEW_IMG = (IMAGES as any).STREET_VIEW ?? null;

// ── Animasi radar mencari lokasi ──
function RadarLoader({ onDone }: { onDone: () => void }) {
  const called = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!called.current) {
        called.current = true;
        onDone();
      }
    }, 2400);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.div
      className="flex flex-col items-center gap-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
    >
      {/* Radar */}
      <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
        {/* Pulse rings */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border-2 border-brand-red/50"
            initial={{ width: 48, height: 48, opacity: 0.8 }}
            animate={{ width: 200, height: 200, opacity: 0 }}
            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.6, ease: "easeOut" }}
          />
        ))}

        {/* Lingkaran border radar */}
        <div
          className="absolute inset-0 rounded-full"
          style={{ border: "2px solid rgba(220,38,38,0.25)" }}
        />

        {/* Sweep */}
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "conic-gradient(from 270deg, rgba(220,38,38,0) 0%, rgba(220,38,38,0) 60%, rgba(220,38,38,0.5) 85%, rgba(220,38,38,0.7) 100%)",
            }}
          />
        </motion.div>

        {/* Crosshair lines */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="absolute w-full h-px bg-brand-red" />
          <div className="absolute w-px h-full bg-brand-red" />
        </div>

        {/* Pin tengah */}
        <motion.div
          className="relative z-10 w-14 h-14 bg-brand-red rounded-full flex items-center justify-center"
          style={{ boxShadow: "0 0 28px rgba(220,38,38,0.8)" }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          <MapPin size={24} className="text-white fill-white" />
        </motion.div>
      </div>

      {/* Teks */}
      <div className="text-center space-y-2">
        <motion.p
          className="text-white font-bold text-xl tracking-wide"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          Memuat Gambar...
        </motion.p>
        <p className="text-white/40 text-xs font-mono tracking-[0.2em]">
          -6.2067° S &nbsp;·&nbsp; 106.8334° E
        </p>
      </div>
    </motion.div>
  );
}

type Stage = "idle" | "loading" | "street";

export default function Location() {
  const [stage, setStage] = useState<Stage>("idle");

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
      <div className="bg-creamy-darker rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-xl border border-creamy-darker">

        {/* ── Left panel ── */}
        <div className="w-full md:w-2/5 p-8 md:p-14 flex flex-col justify-center">
          <div className="relative w-16 h-16 mb-8">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Store size={32} className="text-brand-red opacity-20" />
              <Store size={32} className="text-brand-red absolute" />
            </div>
          </div>

          <h2 className="font-display text-4xl font-bold text-brand-red mb-6">Cari Gerobak Kami</h2>
          <p className="text-lg text-zinc-700 mb-10 leading-relaxed">
            Gerobak kayu kami parkir di sudut jalan depan teh solo Halimun. Ikuti aroma wangi mentega dan saus takoyaki!
          </p>

          <div className="space-y-8 text-zinc-900">
            <div className="flex gap-5 items-start">
              <div className="p-2 bg-brand-green/10 rounded-lg text-brand-green">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="font-bold text-lg">Lokasi Saat Ini</h4>
                <p className="text-zinc-600 mt-1">Jl. Halimun Raya,<br />(Depan Teh Solo Halimun)</p>
                <a
                  href={GMAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-2 text-brand-red font-semibold text-sm hover:underline"
                >
                  Buka di Google Maps <ExternalLink size={14} />
                </a>
              </div>
            </div>

            <div className="flex gap-5 items-start">
              <div className="p-2 bg-brand-yellow/20 rounded-lg">
                <Clock size={24} className="text-zinc-900" />
              </div>
              <div>
                <h4 className="font-bold text-lg">Jam Operasional</h4>
                <p className="text-zinc-600 mt-1">
                  Selasa – Minggu: 16.00 – 22.00<br />
                  <span className="text-brand-red font-medium text-sm">Senin Libur</span>
                </p>
              </div>
            </div>
          </div>

          {STREET_VIEW_IMG && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => setStage("loading")}
              className="mt-10 flex items-center gap-3 bg-zinc-900 text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-lg hover:bg-zinc-800 transition-colors w-max"
            >
              <Satellite size={18} />
              Lihat Gerobak
            </motion.button>
          )}
        </div>

        {/* ── Right panel: Google Maps iframe ── */}
        <div className="w-full md:w-3/5 h-[360px] md:h-auto relative overflow-hidden">
          <iframe
            title="Lokasi Takoyaki FF"
            src={MAP_EMBED_URL}
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: 360 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          />
          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-creamy-darker to-transparent pointer-events-none hidden md:block" />
        </div>
      </div>

      {/* ══ Overlay ══ */}
      <AnimatePresence>
        {stage !== "idle" && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{ background: "rgba(10,10,14,0.97)" }}
          >
            {/* Tombol tutup */}
            <button
              onClick={() => setStage("idle")}
              className="absolute top-6 right-6 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* Loading radar */}
            <AnimatePresence>
              {stage === "loading" && (
                <RadarLoader key="radar" onDone={() => setStage("street")} />
              )}
            </AnimatePresence>

            {/* Street view foto */}
            <AnimatePresence>
              {stage === "street" && STREET_VIEW_IMG && (
                <motion.div
                  key="street"
                  className="absolute inset-0"
                  initial={{ scale: 3, opacity: 0, filter: "blur(20px)" }}
                  animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 1.0, ease: "easeOut" }}
                >
                  <img
                    src={streetViewImg}
                    alt="Gerobak Takoyaki FF"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring", damping: 14 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md rounded-2xl px-8 py-5 text-center shadow-2xl min-w-[260px]"
                  >
                    <div className="flex items-center gap-2 justify-center mb-1">
                      <MapPin size={16} className="text-brand-red fill-brand-red" />
                      <span className="font-bold text-zinc-900">Takoyaki FF</span>
                    </div>
                    <p className="text-zinc-500 text-sm">Jl. Halimun Raya · Buka 16.00–22.00</p>
                    <a
                      href={GMAPS_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-brand-red font-semibold text-sm hover:underline"
                    >
                      Buka di Google Maps <ExternalLink size={13} />
                    </a>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
