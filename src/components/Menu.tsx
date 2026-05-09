import { motion } from "motion/react";
import { Flame } from "lucide-react";
import takoyakiMascot from "../assets/images/takoyaki-mascot.gif";

import imgBakso from "../assets/images/bakso.png";
import imgCrabstick from "../assets/images/crabstick.png";
import imgKatsuobushi from "../assets/images/katsuobushi.png";
import imgSausMayo from "../assets/images/sausmayo.png";
import imgSosis from "../assets/images/sosis.png";
import imgKeju from "../assets/images/keju.png";

const ITEMS = [
  {
    id: 1,
    name: "Bakso",
    sub: "Gurih kenyal nikmat",
    img: imgBakso,
    color: "#C0571A",
    bg: "#FFF3EC",
    tag: "Topping",
    spicy: false,
  },
  {
    id: 2,
    name: "Crabstick",
    sub: "Seafood lembut manis",
    img: imgCrabstick,
    color: "#D4472A",
    bg: "#FFF1EE",
    tag: "Topping",
    spicy: false,
  },
  {
    id: 3,
    name: "Katsuobushi",
    sub: "Bonito tipis harum",
    img: imgKatsuobushi,
    color: "#8B6914",
    bg: "#FFFBEC",
    tag: "Topping",
    spicy: false,
  },
  {
    id: 4,
    name: "Saus & Mayones",
    sub: "Pedas creamy nendang",
    img: imgSausMayo,
    color: "#B91C1C",
    bg: "#FFF0F0",
    tag: "Condiment",
    spicy: true,
  },
  {
    id: 5,
    name: "Sosis",
    sub: "Potongan besar gurih",
    img: imgSosis,
    color: "#B5451B",
    bg: "#FFF0EB",
    tag: "Topping",
    spicy: false,
  },
  {
    id: 6,
    name: "Keju",
    sub: "Lumer meleleh gurih",
    img: imgKeju,
    color: "#D4A017",
    bg: "#FFFBEA",
    tag: "Topping",
    spicy: false,
  },
];

// Duplikat untuk seamless loop (3x agar loop dari 0 → -33.33% selalu seamless)
const TRACK_A = [...ITEMS, ...ITEMS, ...ITEMS];

// ── CSS keyframes injected once ────────────────────────────────────────────
const MARQUEE_STYLES = `
  @keyframes marquee-ltr {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-33.3333%); }
  }
  @keyframes marquee-rtl {
    0%   { transform: translateX(-33.3333%); }
    100% { transform: translateX(0); }
  }
`;

// ── Satu kartu item ────────────────────────────────────────────────────────
function ItemCard({ item }: { item: typeof ITEMS[0] }) {
  return (
    <div
      className="shrink-0 flex flex-col items-center justify-center gap-3 px-8 md:px-12 py-8 md:py-10 rounded-[2rem] mx-3 md:mx-4 shadow-sm border border-black/5 select-none"
      style={{ background: item.bg, minWidth: 200 }}
    >
      {/* Tag */}
      <span
        className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full"
        style={{ background: item.color + "22", color: item.color }}
      >
        {item.spicy && <Flame size={9} className="inline mr-0.5 -mt-0.5" />}
        {item.tag}
      </span>

      {/* Foto topping */}
      <motion.div
        animate={{ rotate: [-4, 4, -4], y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: item.id * 0.3 }}
      >
        <img
          src={item.img}
          alt={item.name}
          className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-md"
          draggable={false}
        />
      </motion.div>

      {/* Nama */}
      <div className="text-center">
        <p className="font-display font-bold text-zinc-900 text-sm md:text-base leading-tight">
          {item.name}
        </p>
        <p className="text-zinc-400 text-xs mt-0.5">{item.sub}</p>
      </div>
    </div>
  );
}

// ── Marquee row — smooth CSS animation ────────────────────────────────────
function MarqueeRow({
  items,
  direction = 1,
  speed = 35,
}: {
  items: typeof ITEMS;
  direction?: 1 | -1;
  speed?: number;
}) {
  const animName = direction === 1 ? "marquee-ltr" : "marquee-rtl";

  return (
    <div className="overflow-hidden w-full">
      <div
        className="flex"
        style={{
          animation: `${animName} ${speed}s linear infinite`,
          willChange: "transform",
        }}
      >
        {items.map((item, i) => (
          <ItemCard key={`${item.id}-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
}

// ── Takoyaki ball dekorasi ─────────────────────────────────────────────────
function TakoBall({ size = 40, delay = 0 }: { size?: number; delay?: number }) {
  return (
    <motion.div
      animate={{ y: [0, -8, 0], rotate: [0, 10, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
        <defs>
          <radialGradient id="tgCream" cx="35%" cy="30%">
            <stop offset="0%" stopColor="#F5E6C0" />
            <stop offset="60%" stopColor="#E8D0A0" />
            <stop offset="100%" stopColor="#C8A870" />
          </radialGradient>
          <clipPath id="ballClip">
            <circle cx="26" cy="26" r="22" />
          </clipPath>
        </defs>

        {/* Bola krem */}
        <circle cx="26" cy="26" r="22" fill="url(#tgCream)" />

        {/* Semua topping di-clip dalam bola */}
        <g clipPath="url(#ballClip)">
          {/* Kilap */}
          <ellipse cx="20" cy="18" rx="6" ry="4" fill="white" fillOpacity="0.25" />

          {/* Gurita — tengah atas */}
          <ellipse cx="26" cy="14" rx="5" ry="3" fill="#9B5EBF" opacity="0.85" />
          <circle cx="23.5" cy="14" r="1" fill="#6B3A8A" />
          <circle cx="28.5" cy="14" r="1" fill="#6B3A8A" />

          {/* Daun bawang — kiri tengah */}
          <rect x="7" y="23" width="9" height="2" rx="1" fill="#4CAF50" opacity="0.9" transform="rotate(-10 7 23)" />
          <rect x="6" y="27" width="8" height="1.5" rx="0.75" fill="#66BB6A" opacity="0.85" transform="rotate(5 6 27)" />

          {/* Sosis — kanan tengah */}
          <rect x="33" y="22" width="10" height="4" rx="2" fill="#E8A050" opacity="0.9" transform="rotate(8 33 22)" />

          {/* Gurita — bawah kiri */}
          <ellipse cx="18" cy="36" rx="4" ry="2.5" fill="#9B5EBF" opacity="0.75" />
          <circle cx="16" cy="36" r="0.8" fill="#6B3A8A" />
          <circle cx="20" cy="36" r="0.8" fill="#6B3A8A" />

          {/* Daun bawang — bawah kanan */}
          <rect x="28" y="36" width="10" height="2" rx="1" fill="#4CAF50" opacity="0.85" transform="rotate(-8 28 36)" />

          {/* Sosis — kiri bawah */}
          <rect x="10" y="33" width="8" height="3.5" rx="1.5" fill="#E8A050" opacity="0.85" transform="rotate(-15 10 33)" />
        </g>
      </svg>
    </motion.div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function Menu() {
  return (
    <section className="py-16 md:py-20 overflow-hidden">
      {/* Inject CSS keyframes */}
      <style>{MARQUEE_STYLES}</style>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-10 md:mb-14 text-center">
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-5">
          <motion.img
            src={takoyakiMascot}
            alt="takoyaki"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0 }}
            className="w-24 h-24 md:w-36 md:h-36 object-contain"
          />
          <motion.img
            src={takoyakiMascot}
            alt="takoyaki"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            className="w-32 h-32 md:w-48 md:h-48 object-contain"
          />
          <motion.img
            src={takoyakiMascot}
            alt="takoyaki"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            className="w-24 h-24 md:w-36 md:h-36 object-contain"
          />
        </div>
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-brand-red leading-tight">
          Topping
        </h2>
        <p className="text-zinc-500 mt-3 text-sm md:text-base max-w-sm mx-auto">
          Semua bisa dikombinasikan sesukamu — minta langsung ke abangnya!
        </p>
      </div>

      {/* Legend topping */}
      <div className="flex items-center justify-center gap-3 md:gap-6 mb-10 flex-wrap px-4">
        {[
          { label: "Sosis", shape: "circle", color: "#E8C47A" },
          { label: "Crabstick", shape: "rectangle", color: "#E87A7A" },
          { label: "Katsuobushi", shape: "rectangle", color: "#C8A870" },
          { label: "Bakso", shape: "circle", color: "#838383" },
          { label: "Saus", shape: "triangle", color: "#b00000" },
          { label: "Mayones", shape: "triangle", color: "#fefefe" },
        ].map((t) => (
          <span key={t.label} className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-zinc-600 font-medium">
            <span
              className="inline-block w-3 h-3 md:w-3.5 md:h-3.5"
              style={{
                backgroundColor: t.color,
                borderRadius: t.shape === "circle" ? "50%" : "3px",
                border: t.color === "#fefefe" ? "1px solid #ddd" : undefined,
              }}
            />
            {t.label}
          </span>
        ))}
      </div>

      {/* Marquee row — smooth CSS infinite scroll */}
      <div className="mb-4">
        <MarqueeRow items={TRACK_A} direction={1} speed={40} />
      </div>

      {/* CTA */}
      <div className="text-center mt-10 md:mt-14 px-4">
        <p className="text-zinc-400 text-sm">
          🔥 Semua takoyaki disajikan panas langsung dari panggangan
        </p>
      </div>
    </section>
  );
}
