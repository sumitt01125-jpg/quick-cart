import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  const [counts, setCounts] = useState({});

  // CTA card: animations start when it scrolls into view
  const ctaRef = useRef(null);
  const [ctaIn, setCtaIn] = useState(false);
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setCtaIn(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCtaIn(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const products = [
    { emoji: "🥛", name: "Fresh Milk", price: "₹65", amount: 65, tag: "Daily essential", tint: "#E3E8FF" },
    { emoji: "🍎", name: "Fresh Apples", price: "₹120", amount: 120, tag: "Fresh today", tint: "#FFD9D2" },
    { emoji: "🥚", name: "Farm Eggs", price: "₹85", amount: 85, tag: "Protein pick", tint: "#FFF1B8" },
    { emoji: "🥖", name: "Fresh Bread", price: "₹45", amount: 45, tag: "Bakery", tint: "#FFE2C2" },
  ];

  const categories = [
    { emoji: "🥬", label: "Vegetables" },
    { emoji: "🍎", label: "Fruits" },
    { emoji: "🥛", label: "Dairy" },
    { emoji: "🥖", label: "Bakery" },
    { emoji: "🍿", label: "Snacks" },
    { emoji: "🧴", label: "Personal Care" },
    { emoji: "🥤", label: "Beverages" },
    { emoji: "🧊", label: "Frozen" },
  ];

  const features = [
    {
      emoji: "⚡",
      title: "10-minute delivery",
      description: "Groceries at your door in minutes, not hours. Lightning fast, always fresh.",
      accent: "#0C831F",
      bg: "#F0FDF4",
    },
    {
      emoji: "🥬",
      title: "Farm-fresh quality",
      description: "Handpicked fruits and vegetables sourced daily from trusted local farms.",
      accent: "#F8CB46",
      bg: "#FFFBEB",
    },
    {
      emoji: "🔒",
      title: "Safe & secure",
      description: "Secure payments, COD available, and easy returns — shopping made worry-free.",
      accent: "#2563EB",
      bg: "#EFF6FF",
    },
  ];

  // Emojis that orbit around the basket in the CTA card
  const orbit = [
    { emoji: "🍎", x: "100%", y: "50%" },
    { emoji: "🥕", x: "75%", y: "93.3%" },
    { emoji: "🥦", x: "25%", y: "93.3%" },
    { emoji: "🍋", x: "0%", y: "50%" },
    { emoji: "🍅", x: "25%", y: "6.7%" },
    { emoji: "🥑", x: "75%", y: "6.7%" },
  ];

  // Backdrop buildings for the hero illustration
  const city = [
    { x: -20, y: 235, w: 62, h: 170, f: "#D1FAE5" },
    { x: 52, y: 270, w: 50, h: 140, f: "#D1FAE5" },
    { x: 340, y: 190, w: 54, h: 220, f: "#D1FAE5" },
    { x: 404, y: 140, w: 62, h: 270, f: "#C7F5DC" },
    { x: 476, y: 200, w: 48, h: 210, f: "#D1FAE5" },
    { x: 534, y: 165, w: 60, h: 245, f: "#C7F5DC" },
    { x: 604, y: 215, w: 44, h: 195, f: "#D1FAE5" },
    { x: 20, y: 300, w: 46, h: 110, f: "#A7F3D0" },
    { x: 430, y: 262, w: 46, h: 150, f: "#A7F3D0" },
    { x: 500, y: 232, w: 58, h: 180, f: "#A7F3D0" },
    { x: 572, y: 280, w: 44, h: 130, f: "#A7F3D0" },
  ];

  const addItem = (name) =>
    setCounts((prev) => ({ ...prev, [name]: (prev[name] || 0) + 1 }));

  const itemCount = Object.values(counts).reduce((a, b) => a + b, 0);
  const total = products.reduce(
    (sum, p) => sum + (counts[p.name] || 0) * p.amount,
    0
  );

  const ticker = products.map((p) => `${p.emoji}  ${p.name}  ${p.price}`);

  return (
    <div className="qc-body relative min-h-screen overflow-x-hidden bg-transparent text-slate-900">
      <style>{`
        .qc-body {
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        .qc-body h1, .qc-body h2, .qc-body h3 {
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        @keyframes qc-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes qc-pop { 0% { transform: scale(0.5); } 60% { transform: scale(1.25); } 100% { transform: scale(1); } }

        .qc-marquee { animation: qc-marquee 24s linear infinite; will-change: transform; }
        .qc-pop { animation: qc-pop 0.3s ease-out; }

        /* =========================
           CTA CARD ANIMATIONS
        ========================== */
        @keyframes qc-gradient-shift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes qc-spin { to { transform: rotate(360deg); } }
        @keyframes qc-orbit-rev {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(-360deg); }
        }
        @keyframes qc-bob { 0%, 100% { transform: translateY(-7px); } 50% { transform: translateY(7px); } }
        @keyframes qc-glow { 0%, 100% { opacity: 0.55; transform: scale(1); } 50% { opacity: 1; transform: scale(1.15); } }
        @keyframes qc-twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.7) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.15) rotate(20deg); }
        }
        @keyframes qc-shine {
          0% { transform: translateX(-130%) skewX(-20deg); }
          60%, 100% { transform: translateX(380%) skewX(-20deg); }
        }
        @keyframes qc-up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
        @keyframes qc-pop-in { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: none; } }
        @keyframes qc-rider-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes qc-rider-roll { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .qc-rider-bag { animation: qc-rider-float 3.5s ease-in-out infinite; transform-origin: 373px 170px; }
        .qc-rider-wheel { transform-box: fill-box; transform-origin: center; animation: qc-rider-roll 7s linear infinite; }

        .qc-cta-bg {
          background: linear-gradient(118deg, rgba(6,78,59,0.96) 0%, rgba(4,120,87,0.92) 38%, rgba(12,131,31,0.92) 72%, rgba(6,78,59,0.96) 100%);
          backdrop-filter: blur(18px);
          background-size: 200% 200%;
          animation: qc-gradient-shift 14s ease-in-out infinite;
        }
        .qc-dots {
          background-image: radial-gradient(rgba(255, 255, 255, 0.9) 1px, transparent 1px);
          background-size: 22px 22px;
          -webkit-mask-image: radial-gradient(ellipse at 100% 0%, #000, transparent 70%);
          mask-image: radial-gradient(ellipse at 100% 0%, #000, transparent 70%);
        }
        .qc-glow { animation: qc-glow 6s ease-in-out infinite; }
        .qc-spark { animation: qc-twinkle 3.2s ease-in-out infinite; }
        .qc-spin { animation: qc-spin 60s linear infinite; }
        .qc-orbit { animation: qc-spin 40s linear infinite; }
        .qc-orbit-rev { animation: qc-orbit-rev 40s linear infinite; }
        .qc-bob { animation: qc-bob 5s ease-in-out infinite; }
        .qc-shine { animation: qc-shine 3.4s ease-in-out infinite; }

        .qc-cta-item, .qc-cta-pop { opacity: 0; }
        .qc-in .qc-cta-item { animation: qc-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .qc-in .qc-cta-pop { animation: qc-pop-in 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s forwards; }

        @media (prefers-reduced-motion: reduce) {
          .qc-marquee { animation: none; }
          .qc-pop { animation: none; }
          .qc-cta-bg, .qc-glow, .qc-spark, .qc-spin, .qc-orbit, .qc-orbit-rev, .qc-bob, .qc-shine, .qc-rider-bag, .qc-rider-wheel { animation: none; }
          .qc-cta-item, .qc-cta-pop { opacity: 1; animation: none !important; }
          .qc-shine { display: none; }
        }
      `}</style>

      <main className="relative z-10">
        {/* =========================
            HERO
        ========================== */}
        <section className="relative flex items-center overflow-hidden bg-transparent lg:min-h-[calc(100vh-6rem)]">

          <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-14 lg:px-8 lg:pb-20 lg:pt-16">
            <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
              {/* LEFT — niche shift kiya */}
              <div className="lg:translate-x-3">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0C831F] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0C831F]" />
                  </span>
                  Now delivering in your area
                </div>

                <h1 className="text-[2.5rem] font-extrabold leading-[1.05] tracking-[-0.035em] text-slate-900 sm:text-5xl lg:text-[3.75rem] xl:text-[4rem]">
                  Fresh fruits &amp;
                  <br />
                  vegetables,
                  <br />
                  <span className="relative mt-2 inline-block">
                    <span className="relative z-10 inline-flex items-center rounded-xl bg-gradient-to-r from-[#0C831F] to-[#059669] px-3.5 py-1 text-white shadow-[0_10px_28px_-8px_rgba(12,131,31,0.55)]">
                      every day
                    </span>
                  </span>
                </h1>

                <p className="mt-5 max-w-md text-[15px] font-medium leading-7 text-slate-600 sm:text-base lg:text-[17px]">
                  Fresh vegetables, dairy, snacks and daily essentials — delivered to your doorstep faster than ever.
                </p>

                {/* CTA — Premium buttons */}
                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                  {/* Start shopping — premium green */}
                  <Link
                    to="/register"
                    className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl border border-[#0C831F] px-5 py-3 text-sm font-bold text-[#0C831F] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:px-6"
                  >
                    <span className="absolute inset-0 translate-y-full bg-[#0C831F] transition-transform duration-300 ease-out group-hover:translate-y-0" />
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-white">Start shopping</span>
                    <span className="relative z-10 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#0C831F]/10 transition-all duration-300 group-hover:bg-white group-hover:text-[#0C831F]">
                      <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                        →
                      </span>
                    </span>
                  </Link>

                  {/* Sign in — premium outline */}
                  <Link
                    to="/login"
                    className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:px-6"
                  >
                    <span className="absolute inset-0 translate-y-full bg-[#F8CB46] transition-transform duration-300 ease-out group-hover:translate-y-0" />
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-slate-900">Sign in</span>
                  </Link>
                </div>

                {/* Trust row */}
                <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-semibold text-slate-600">
                  {[
                    { icon: "🚚", label: "Free delivery" },
                    { icon: "💳", label: "COD available" },
                    { icon: "🔒", label: "Secure checkout" },
                  ].map((item) => (
                    <span key={item.label} className="flex items-center gap-2">
                      <span className="text-base">{item.icon}</span>
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* RIGHT — delivery boy illustration */}
              <div className="relative mx-auto w-full max-w-[640px] lg:translate-x-2">
                <div className="absolute -inset-x-4 top-2 -z-10 h-[94%] rounded-[3.5rem] bg-gradient-to-br from-emerald-200/70 via-teal-100/70 to-sky-200/60 blur-3xl" />

                <svg
                  viewBox="0 0 620 450"
                  role="img"
                  aria-label="Cartoon delivery boy riding a scooter with a QuickCart delivery box"
                  className="relative z-10 mx-auto w-full overflow-visible drop-shadow-[0_18px_18px_rgba(15,70,60,0.12)]"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="qc-road" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#D1FAE5" />
                      <stop offset="100%" stopColor="#BAE6FD" />
                    </linearGradient>
                    <linearGradient id="qc-bag" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#16A34A" />
                      <stop offset="100%" stopColor="#065F46" />
                    </linearGradient>
                    <linearGradient id="qc-scooter" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#FB923C" />
                      <stop offset="100%" stopColor="#EA580C" />
                    </linearGradient>
                    <pattern id="qc-win" width="18" height="26" patternUnits="userSpaceOnUse">
                      <rect x="5" y="7" width="7" height="10" rx="2" fill="#FFFFFF" opacity=".85" />
                    </pattern>
                  </defs>

                  {/* sun + clouds */}
                  <circle cx="470" cy="125" r="92" fill="#D1FAE5" opacity=".8" />
                  <circle cx="470" cy="125" r="64" fill="#ECFDF5" />
                  <g fill="#FFFFFF" opacity=".9">
                    <ellipse cx="350" cy="56" rx="44" ry="13" />
                    <ellipse cx="378" cy="45" rx="28" ry="12" />
                    <ellipse cx="120" cy="170" rx="34" ry="10" />
                    <ellipse cx="141" cy="161" rx="20" ry="9" />
                  </g>

                  {/* city backdrop */}
                  {city.map((b) => (
                    <g key={`${b.x}-${b.y}`}>
                      <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="8" fill={b.f} />
                      <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="8" fill="url(#qc-win)" />
                    </g>
                  ))}

                  {/* road */}
                  <path d="M-30 398 C110 376 230 420 340 394 S520 376 650 394" fill="none" stroke="url(#qc-road)" strokeWidth="36" strokeLinecap="round" />
                  <path d="M-10 398 C120 380 232 418 340 394 S520 378 630 392" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="12 14" strokeLinecap="round" />

                  {/* speed lines + star */}
                  <path d="M0 258h72M10 280h52M26 302h38" stroke="#34D399" strokeWidth="7" strokeLinecap="round" opacity=".75" />
                  <path d="M560 40l7 15 16 2-12 10 3 16-14-8-14 8 3-16-12-10 16-2z" fill="#6EE7B7" />

                  {/* floating badge */}
                  <g transform="translate(24 44)">
                    <rect width="150" height="55" rx="17" fill="#FFFFFF" stroke="#D1FAE5" strokeWidth="2" />
                    <circle cx="28" cy="27" r="16" fill="#DCFCE7" />
                    <path d="M21 27l5 5 10-12" fill="none" stroke="#15803D" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    <text x="52" y="24" fill="#0F172A" fontSize="12" fontWeight="800">ORDER READY</text>
                    <text x="52" y="40" fill="#15803D" fontSize="10" fontWeight="700">Rider on the way</text>
                  </g>

                  {/* ===== delivery boy + scooter ===== */}
                  <g transform="translate(10 22)">
                    {/* ground shadow */}
                    <ellipse cx="280" cy="386" rx="190" ry="9" fill="#0F172A" opacity=".14" />

                    {/* wheels */}
                    <g className="qc-rider-wheel">
                      <circle cx="150" cy="340" r="42" fill="#0F172A" />
                      <circle cx="150" cy="340" r="26" fill="#E2E8F0" />
                      <circle cx="150" cy="340" r="8" fill="#64748B" />
                      <path d="M150 316v48M126 340h48M133 323l34 34M167 323l-34 34" stroke="#94A3B8" strokeWidth="3" />
                    </g>
                    <g className="qc-rider-wheel">
                      <circle cx="410" cy="340" r="42" fill="#0F172A" />
                      <circle cx="410" cy="340" r="26" fill="#E2E8F0" />
                      <circle cx="410" cy="340" r="8" fill="#64748B" />
                      <path d="M410 316v48M386 340h48M393 323l34 34M427 323l-34 34" stroke="#94A3B8" strokeWidth="3" />
                    </g>

                    {/* delivery box on the back */}
                    <g className="qc-rider-bag">
                      <rect x="72" y="146" width="108" height="90" rx="12" fill="url(#qc-bag)" stroke="#064E3B" strokeWidth="4" />
                      <rect x="66" y="132" width="120" height="24" rx="9" fill="#064E3B" />
                      <circle cx="126" cy="186" r="19" fill="#FFFFFF" />
                      <path d="M116 186l7 7 13-15" fill="none" stroke="#15803D" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                      <text x="124" y="224" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="800">QuickCart</text>
                    </g>

                    {/* scooter body */}
                    <path d="M98 316 C94 272 138 246 200 248 L256 252 L266 316 Z" fill="url(#qc-scooter)" stroke="#C2410C" strokeWidth="4" strokeLinejoin="round" />
                    <path d="M110 298 C118 272 150 260 198 260" fill="none" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" opacity=".75" />
                    <rect x="92" y="282" width="9" height="16" rx="3" fill="#EF4444" />
                    <rect x="150" y="236" width="112" height="16" rx="8" fill="#3B2A22" />
                    <rect x="250" y="312" width="112" height="16" rx="8" fill="#C2410C" />
                    <path d="M330 316 L338 240 Q340 228 354 230 L372 234 Q382 238 380 250 L384 302 Q386 316 372 316 Z" fill="url(#qc-scooter)" stroke="#C2410C" strokeWidth="4" strokeLinejoin="round" />
                    <path d="M372 300 L410 340" stroke="#0F172A" strokeWidth="8" strokeLinecap="round" />
                    <path d="M376 322 Q410 286 446 322" fill="none" stroke="#C2410C" strokeWidth="9" strokeLinecap="round" />
                    <path d="M356 232 L352 196" stroke="#0F172A" strokeWidth="8" strokeLinecap="round" />
                    <path d="M334 194 L374 190" stroke="#0F172A" strokeWidth="8" strokeLinecap="round" />
                    <circle cx="382" cy="258" r="9" fill="#F8FAFC" stroke="#C2410C" strokeWidth="3" />

                    {/* legs + sneakers */}
                    <path d="M205 232 L286 242 L298 308" fill="none" stroke="#334155" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" />
                    <ellipse cx="312" cy="316" rx="25" ry="11" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
                    <path d="M288 323 Q312 331 337 322" fill="none" stroke="#475569" strokeWidth="4" strokeLinecap="round" />

                    {/* torso / jacket */}
                    <path d="M172 244 C164 200 178 160 212 142 C238 130 262 142 266 172 L264 240 Z" fill="#1E3A5F" stroke="#0F2742" strokeWidth="4" strokeLinejoin="round" />
                    <path d="M244 152 L250 236" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
                    <path d="M170 214 L265 208" stroke="#6EE7B7" strokeWidth="6" strokeLinecap="round" />

                    {/* arm */}
                    <path d="M246 164 L292 208 L346 197" fill="none" stroke="#0F2742" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M246 164 L292 208 L346 197" fill="none" stroke="#2C4F7C" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="351" cy="196" r="10" fill="#F3B58E" />

                    {/* neck + head */}
                    <rect x="238" y="130" width="18" height="22" rx="6" fill="#E0A07A" />
                    <circle cx="252" cy="104" r="34" fill="#F3B58E" />
                    <ellipse cx="226" cy="110" rx="6" ry="9" fill="#E0A07A" />

                    {/* face */}
                    <path d="M268 99 Q276 95 284 99" fill="none" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="276" cy="108" r="4" fill="#0F172A" />
                    <path d="M284 112 q5 3 1 7" fill="none" stroke="#C08457" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="266" cy="120" r="5" fill="#FCA5A5" opacity=".6" />
                    <path d="M266 125 Q278 135 291 123" fill="none" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round" />

                    {/* helmet */}
                    <path d="M216 104 C212 60 240 44 268 50 C296 56 306 82 298 98 L284 96 C262 92 240 98 216 104 Z" fill="#F97316" stroke="#C2410C" strokeWidth="4" strokeLinejoin="round" />
                    <path d="M236 57 C250 51 266 53 276 59" fill="none" stroke="#FED7AA" strokeWidth="4" strokeLinecap="round" />
                    <path d="M284 92 L312 98 Q318 102 310 105 L282 102 Z" fill="#E0F2FE" stroke="#C2410C" strokeWidth="3" strokeLinejoin="round" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            CATEGORY STRIP
        ========================== */}
        <section className="bg-transparent py-10">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mb-6 flex items-end justify-between">
              <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                Shop by category
              </h2>
              <span className="text-sm font-bold text-[#0C831F]">See all →</span>
            </div>

            <div className="grid grid-cols-4 gap-3 lg:grid-cols-8">
              {categories.map((cat) => (
                <div
                  key={cat.label}
                  className="group flex cursor-pointer flex-col items-center gap-2.5 rounded-2xl border border-slate-100 bg-white p-3 transition-all duration-300 hover:-translate-y-1 hover:border-[#F8CB46] hover:shadow-md"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF7E0] text-3xl transition-transform duration-300 group-hover:scale-110">
                    {cat.emoji}
                  </div>
                  <span className="text-center text-[11px] font-bold leading-tight text-slate-700">
                    {cat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================
            TICKER BAND
        ========================== */}
        <div className="overflow-hidden bg-transparent py-3.5 text-[#0C831F]">
          <div className="qc-marquee flex w-max whitespace-nowrap">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center">
                {[...ticker, ...ticker].map((item, i) => (
                  <span
                    key={`${copy}-${i}`}
                    className="flex items-center text-sm font-bold tracking-tight"
                  >
                    <span className="px-6">{item}</span>
                    <span className="text-[#F8CB46]">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* =========================
            FEATURES
        ========================== */}
        <section className="bg-transparent">
          <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
            <div className="mb-12 max-w-2xl">
              <span className="text-xs font-black uppercase tracking-widest text-[#0C831F]">
                Why QuickCart
              </span>
              <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Everything you love, delivered fast.
              </h2>
              <p className="mt-4 text-base font-medium text-slate-500">
                Built for everyday shopping — fast, fresh, and always reliable.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_-20px_rgba(15,23,42,0.25)]"
                >
                  <div
                    className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-40 blur-2xl transition-opacity duration-300 group-hover:opacity-70"
                    style={{ backgroundColor: feature.bg }}
                  />

                  <div className="relative">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl shadow-sm transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: feature.bg }}
                    >
                      {feature.emoji}
                    </div>

                    <h3 className="mt-6 text-xl font-black tracking-tight text-slate-900">
                      {feature.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-6 text-slate-500">
                      {feature.description}
                    </p>

                    <div
                      className="mt-6 h-1 w-12 rounded-full transition-all duration-300 group-hover:w-20"
                      style={{ backgroundColor: feature.accent }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================
            CTA STRIP — animated card
        ========================== */}
        <section
          ref={ctaRef}
          className={`relative isolate overflow-hidden bg-transparent py-10 pb-20 sm:py-14 ${ctaIn ? "qc-in" : ""}`}
        >
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="qc-cta-bg relative overflow-hidden rounded-[2rem] border border-white/15 px-7 py-12 text-white shadow-[0_22px_60px_-30px_rgba(6,78,59,0.45)] sm:px-12 sm:py-16 lg:px-16">

              {/* animated background layers */}
              <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <span className="qc-glow absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#C4B5FD]/35 blur-3xl" />
                <span className="qc-glow absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/15 blur-3xl" style={{ animationDelay: "2s" }} />
                <span className="qc-dots absolute inset-0 opacity-[0.18]" />

                <span className="qc-spark absolute left-[44%] top-[16%] text-lg text-[#DDD6FE]" style={{ animationDelay: "0s" }}>✦</span>
                <span className="qc-spark absolute left-[52%] bottom-[18%] text-xl text-white/80" style={{ animationDelay: "1.1s" }}>✦</span>
                <span className="qc-spark absolute right-[6%] top-[10%] text-base text-white/80" style={{ animationDelay: "0.6s" }}>✦</span>
                <span className="qc-spark absolute right-[10%] bottom-[10%] text-lg text-[#DDD6FE]" style={{ animationDelay: "1.8s" }}>✦</span>
              </div>

              {/* orbit: basket in the centre, fruits & veggies circling it */}
              <div
                className="pointer-events-none absolute right-8 top-1/2 hidden h-[240px] w-[240px] -translate-y-1/2 lg:block xl:right-16 xl:h-[320px] xl:w-[320px]"
                aria-hidden="true"
              >
                <div className="qc-cta-pop relative h-full w-full">
                  <div className="qc-spin absolute inset-0 rounded-full border border-dashed border-white/30" />
                  <div className="absolute inset-[14%] rounded-full border border-white/15" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="qc-bob flex h-28 w-28 items-center justify-center rounded-full border border-white/25 bg-white/15 text-6xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.35)] backdrop-blur-md xl:h-36 xl:w-36 xl:text-7xl">
                      🧺
                    </div>
                  </div>

                  <div className="qc-orbit absolute inset-0">
                    {orbit.map((o) => (
                      <span key={o.emoji} className="absolute" style={{ left: o.x, top: o.y }}>
                        <span className="qc-orbit-rev flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white/15 text-2xl backdrop-blur-sm xl:h-14 xl:w-14 xl:text-3xl">
                          {o.emoji}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative z-10 max-w-2xl">
                <span
                  className="qc-cta-item inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-50 backdrop-blur-sm"
                  style={{ animationDelay: "0.05s" }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C4B5FD]" /> Your everyday essentials, made easy
                </span>
                <h2
                  className="qc-cta-item mt-5 max-w-xl text-[2rem] font-extrabold leading-[1.12] tracking-[-0.035em] sm:text-4xl lg:text-[3.25rem]"
                  style={{ animationDelay: "0.15s" }}
                >
                  Good food. <span className="text-[#DDD6FE]">Great days.</span><br />Delivered to your door.
                </h2>
                <p
                  className="qc-cta-item mt-4 max-w-lg text-sm font-medium leading-6 text-white/85 sm:text-base sm:leading-7"
                  style={{ animationDelay: "0.3s" }}
                >
                  Make your daily grocery run simpler. Fresh picks, trusted essentials, and a smoother way to shop — all in one place.
                </p>

                <div className="qc-cta-item mt-9 flex flex-col gap-3.5 sm:flex-row" style={{ animationDelay: "0.45s" }}>
                  {/* Create account — premium yellow */}
                  <Link
                    to="/register"
                    className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl border border-[#C4B5FD] px-5 py-3 text-sm font-bold text-[#064E3B] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:px-6"
                  >
                    <span className="absolute inset-0 translate-y-full bg-[#C4B5FD] transition-transform duration-300 ease-out group-hover:translate-y-0" />
                    <span className="qc-shine pointer-events-none absolute inset-y-0 left-0 z-[5] w-1/3 bg-gradient-to-r from-transparent via-white/80 to-transparent" aria-hidden="true" />
                    <span className="relative z-10">Create account</span>
                    <span className="relative z-10 inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/10 transition-all duration-300 group-hover:bg-slate-900 group-hover:text-[#DDD6FE]">
                      <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                        →
                      </span>
                    </span>
                  </Link>

                  {/* Sign in — premium outline */}
                  <Link
                    to="/login"
                    className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl border border-white/40 px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:px-6"
                  >
                    <span className="absolute inset-0 translate-y-full bg-white transition-transform duration-300 ease-out group-hover:translate-y-0" />
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-[#0C831F]">Sign in</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;