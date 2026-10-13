/**
 * QuickCartIntro.jsx
 * -----------------------------------------------------------------------------
 * Full-screen animated delivery-rider intro / loader.
 *
 *  - The whole viewport IS the scene: sky, buildings, trees, road and rider
 *    fill the entire screen (desktop and mobile). No card, no progress bar.
 *  - Zero dependencies (React only). No Tailwind, no images, no fonts.
 *  - All art is inline SVG, all motion is CSS transform/opacity (GPU friendly).
 *  - Styles are scoped under the `qci-` prefix and injected by the component.
 *  - Honest timing: the intro only leaves when `ready` is true (after
 *    `minDuration`). It never "finishes" while your app is still loading.
 *  - Respects `prefers-reduced-motion`.
 *
 *  EXPORTS
 *  -------
 *  default  QuickCartIntro      -> the raw screen (use it anywhere you like)
 *  named    QuickCartIntroGate  -> once-per-session wrapper (sessionStorage)
 *
 *  QUICK USE (first visit only, inside Router + AuthProvider)
 *  ----------------------------------------------------------
 *    const { loading } = useAuth();            // your own "still checking" flag
 *    <QuickCartIntroGate ready={!loading}>
 *      <AppRoutes />
 *    </QuickCartIntroGate>
 *
 *  QUICK USE (as a plain loader, any time)
 *  ---------------------------------------
 *    {isLoading && <QuickCartIntro ready={!isLoading} onFinish={() => {}} />}
 *
 *  PROPS (QuickCartIntro)
 *  ----------------------
 *    ready        boolean  default true   Real "work is done" signal. The intro
 *                                         can only leave when this is true.
 *    minDuration  number   default 2800   Minimum ms on screen (so the scene
 *                                         never flashes by).
 *    maxDuration  number   default 15000  Safety valve. If `ready` is still
 *                                         false after this, the intro leaves
 *                                         and hands over to your app's own
 *                                         loader / error UI.
 *    text         string   default "Freshness is on the way..."
 *    onFinish     () => void              Called after the exit animation.
 *
 *  PROPS (QuickCartIntroGate) = all of the above, plus:
 *    storageKey      string   default "quickcart:intro-seen"
 *    inertBackground boolean  default false  Marks children `inert` while the
 *                                            intro is up (keyboard/screen-reader
 *                                            safe). Off by default so autofocus
 *                                            inside your pages keeps working.
 * -----------------------------------------------------------------------------
 */
import { useCallback, useEffect, useRef, useState } from 'react';

const SEEN_KEY = 'quickcart:intro-seen';

/* ----------------------------------------------------------------------------
 * Brand tokens (edit here to re-theme)
 * ------------------------------------------------------------------------- */
// green #16a34a / deep green #14532d / yellow #facc15 / white

/* ----------------------------------------------------------------------------
 * Styles
 * ------------------------------------------------------------------------- */
const CSS = `
.qci{
  --qci-green:#16a34a; --qci-green-d:#14532d; --qci-green-m:#15803d;
  --qci-yellow:#facc15; --qci-ink:#14532d;
  position:fixed; inset:0; z-index:9999; overflow:hidden;
  font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
  color:var(--qci-ink);
  background:
    radial-gradient(900px 480px at 85% -8%, rgba(250,204,21,.28), transparent 62%),
    linear-gradient(180deg,#d9f7e4 0%,#f0fdf4 52%,#fefce8 100%);
  opacity:1;
  transition:opacity .5s ease .28s;
}
.qci.is-leaving{opacity:0; pointer-events:none}

/* --- full-screen scene ---------------------------------------------------- */
.qci-scene{
  --road-h:clamp(84px,17vh,190px);
  position:absolute; inset:0; overflow:hidden; isolation:isolate;
  animation:qci-fade .8s ease both;
}
.qci-scene::after{ /* soft sky fade so the brand + title stay readable */
  content:""; position:absolute; left:0; right:0; top:0; height:48%; z-index:6; pointer-events:none;
  background:linear-gradient(180deg,rgba(240,253,244,.88),rgba(240,253,244,0));
}
.qci-sun{position:absolute; right:12%; top:8%; width:clamp(80px,10vw,160px); aspect-ratio:1; border-radius:50%;
  background:radial-gradient(circle,#fef08a 0%,#fde047 45%,rgba(253,224,71,0) 70%); opacity:.85; z-index:0}

.qci-layer{position:absolute; left:0; display:flex; width:max-content; will-change:transform;
  animation:qci-scroll var(--d) linear infinite}
.qci-layer svg{flex:none; height:100%; width:auto; display:block}
.qci-clouds{top:15%; height:14%; --d:120s; z-index:1; opacity:.9}
.qci-far{bottom:var(--road-h); height:68%; --d:96s; z-index:1; filter:blur(1.1px); opacity:.9}
.qci-haze{position:absolute; left:0; right:0; bottom:var(--road-h); height:46%; z-index:1; pointer-events:none;
  background:linear-gradient(180deg,rgba(240,253,244,0),rgba(240,253,244,.55))}
.qci-mid{bottom:var(--road-h); height:58%; --d:70s; z-index:2}
.qci-near{bottom:calc(var(--road-h) - 2px); height:30%; --d:10s; z-index:4}

/* --- tall / portrait screens: scale the city by width so it stays readable - */
@media (max-aspect-ratio:4/5){
  .qci-far{height:48%}
  .qci-mid{height:39%}
  .qci-near{height:24%}
  .qci-haze{height:30%}
  .qci-clouds{top:21%; height:10%}
}

/* --- road ----------------------------------------------------------------- */
.qci-road{position:absolute; left:0; right:0; bottom:0; height:var(--road-h); z-index:3;
  background:
    linear-gradient(180deg,rgba(255,255,255,.10),rgba(255,255,255,0) 40%),
    repeating-linear-gradient(90deg,rgba(255,255,255,.025) 0 3px,rgba(0,0,0,.03) 3px 6px),
    linear-gradient(180deg,#4b5563 0%,#374151 18%,#1f2937 100%)}
.qci-road::before{content:""; position:absolute; left:0; right:0; top:0; height:6px; background:#e5e7eb}
.qci-dashes{position:absolute; left:0; top:54%; height:clamp(5px,.9vh,9px); width:calc(100% + 340px); border-radius:3px;
  background:repeating-linear-gradient(90deg,var(--qci-yellow) 0 70px,transparent 70px 170px);
  animation:qci-road .44s linear infinite}
.qci-edge{position:absolute; left:0; bottom:10px; height:3px; width:calc(100% + 240px);
  background:repeating-linear-gradient(90deg,rgba(255,255,255,.55) 0 36px,transparent 36px 120px);
  animation:qci-edge .3s linear infinite}

/* --- rider ---------------------------------------------------------------- */
.qci-rider{
  position:absolute; z-index:5; left:50%; bottom:calc(var(--road-h)*.56);
  width:clamp(250px,28vw,470px);
  transform:translateX(-50%);
  transition:transform .75s cubic-bezier(.55,0,.9,.45);
}
.qci.is-leaving .qci-rider{transform:translateX(calc(-50% + 95vw))}
.qci-rider svg{display:block; width:100%; height:auto; overflow:visible}
.qci-bob{animation:qci-bob .52s ease-in-out infinite alternate}
.qci-bag{transform-box:fill-box; transform-origin:50% 100%; animation:qci-wobble 1.05s ease-in-out infinite alternate}
.qci-wheel{transform-box:fill-box; transform-origin:center; animation:qci-spin .46s linear infinite}
.qci-shadow{transform-box:fill-box; transform-origin:center; animation:qci-shadow .52s ease-in-out infinite alternate}
.qci-sl{animation:qci-streak .9s ease-out infinite; opacity:0}
.qci-sl.b{animation-delay:.3s} .qci-sl.c{animation-delay:.6s}

/* --- brand + title (over the sky) ----------------------------------------- */
.qci-top{
  position:absolute; z-index:8; left:0; right:0;
  top:max(clamp(24px,6vh,64px),env(safe-area-inset-top));
  display:flex; flex-direction:column; align-items:center; gap:clamp(12px,2.4vh,26px);
  padding:0 24px; text-align:center;
  animation:qci-fade .8s ease .2s both;
}
.qci-brand{display:flex; align-items:center; gap:12px}
.qci-brand svg{width:clamp(38px,4.4vw,52px); height:auto; aspect-ratio:1; flex:none; filter:drop-shadow(0 6px 10px rgba(22,163,74,.28))}
.qci-word{font-size:clamp(24px,3vw,36px); font-weight:800; letter-spacing:-.02em; line-height:1}
.qci-word b{color:var(--qci-green); font-weight:800}
.qci-title{margin:0; font-size:clamp(20px,2.7vw,34px); font-weight:700; letter-spacing:-.01em; line-height:1.2}
.qci-dots span{display:inline-block; animation:qci-dot 1.2s ease-in-out infinite}
.qci-dots span:nth-child(2){animation-delay:.18s} .qci-dots span:nth-child(3){animation-delay:.36s}

/* --- keyframes ------------------------------------------------------------ */
@keyframes qci-scroll{to{transform:translate3d(-33.3333%,0,0)}}
@keyframes qci-road{to{transform:translate3d(-170px,0,0)}}
@keyframes qci-edge{to{transform:translate3d(-120px,0,0)}}
@keyframes qci-spin{to{transform:rotate(360deg)}}
@keyframes qci-bob{from{transform:translateY(0)} to{transform:translateY(-3px)}}
@keyframes qci-wobble{from{transform:rotate(-1.2deg)} to{transform:rotate(1.2deg)}}
@keyframes qci-shadow{from{transform:scaleX(1);opacity:.2} to{transform:scaleX(.94);opacity:.15}}
@keyframes qci-streak{0%{opacity:0;transform:translateX(16px)} 35%{opacity:.75} 100%{opacity:0;transform:translateX(-34px)}}
@keyframes qci-dot{0%,60%,100%{opacity:.25;transform:translateY(0)} 30%{opacity:1;transform:translateY(-2px)}}
@keyframes qci-fade{from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none}}

/* --- short landscape screens ---------------------------------------------- */
@media (max-height:500px){
  .qci-brand{display:none}
  .qci-near{height:30%}
}

/* --- reduced motion: still, calm, fully readable -------------------------- */
@media (prefers-reduced-motion:reduce){
  .qci *,.qci{animation:none !important}
  .qci-sl{opacity:.5}
  .qci-dots span{opacity:1}
  .qci-rider,.qci.is-leaving .qci-rider{transition:none; transform:translateX(-50%)}
  .qci{transition:opacity .3s ease}
}
`;

/* ----------------------------------------------------------------------------
 * SVG art
 * ------------------------------------------------------------------------- */

function LogoMark() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="qci-lg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#22c55e" />
          <stop offset="1" stopColor="#15803d" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill="url(#qci-lg)" />
      <path d="M9 12h3.6l2.9 12.2H27l2.9-8.6H13.6" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="17" cy="29.5" r="2.2" fill="#fff" />
      <circle cx="26" cy="29.5" r="2.2" fill="#fff" />
      <circle cx="31" cy="9" r="4.4" fill="#facc15" />
    </svg>
  );
}

function Wheel({ cx, cy }) {
  return (
    <g>
      <g className="qci-wheel">
        <circle cx={cx} cy={cy} r="34" fill="#0b1220" />
        <circle cx={cx} cy={cy} r="32" fill="none" stroke="#1f2937" strokeWidth="4" strokeDasharray="4 4.2" />
        <circle cx={cx} cy={cy} r="28" fill="#111827" />
        <circle cx={cx} cy={cy} r="25" fill="url(#qci-rim)" />
        <circle cx={cx} cy={cy} r="21.5" fill="none" stroke="#94a3b8" strokeWidth="1.2" />
        {[0, 72, 144, 216, 288].map((a) => (
          <path key={a} d={`M${cx - 3.4} ${cy - 6} L${cx - 2.2} ${cy - 22} L${cx + 2.2} ${cy - 22} L${cx + 3.4} ${cy - 6} Z`} fill="url(#qci-spoke)" transform={`rotate(${a} ${cx} ${cy})`} />
        ))}
        <circle cx={cx} cy={cy} r="12.5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.2" opacity=".85" />
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <circle key={a} cx={cx} cy={cy - 8} r="1.5" fill="#64748b" transform={`rotate(${a} ${cx} ${cy})`} />
        ))}
        <circle cx={cx} cy={cy} r="5" fill="#475569" />
        <circle cx={cx} cy={cy} r="2" fill="#e2e8f0" />
        <rect x={cx - 1.6} y={cy - 31} width="3.2" height="5" rx="1" fill="#facc15" />
      </g>
      {/* static sidewall highlight so the tire reads as rubber, not a flat disc */}
      <path d={`M${cx - 31} ${cy - 12} A 33 33 0 0 1 ${cx - 10} ${cy - 31.5}`} fill="none" stroke="#fff" strokeOpacity=".22" strokeWidth="2.6" strokeLinecap="round" />
    </g>
  );
}

function Rider() {
  return (
    <svg viewBox="-50 0 410 262" role="img" aria-label="QuickCart delivery rider on a scooter">
      <defs>
        <linearGradient id="qci-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3ddc84" />
          <stop offset=".45" stopColor="#16a34a" />
          <stop offset="1" stopColor="#0e6b30" />
        </linearGradient>
        <linearGradient id="qci-jacket" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#34d27b" />
          <stop offset=".55" stopColor="#16a34a" />
          <stop offset="1" stopColor="#0f7a35" />
        </linearGradient>
        <linearGradient id="qci-bagg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fef08a" />
          <stop offset=".5" stopColor="#facc15" />
          <stop offset="1" stopColor="#d9a406" />
        </linearGradient>
        <linearGradient id="qci-skin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f8d3ae" />
          <stop offset="1" stopColor="#e2ad82" />
        </linearGradient>
        <radialGradient id="qci-helmet" cx=".35" cy=".3" r=".9">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".7" stopColor="#eef2f7" />
          <stop offset="1" stopColor="#cbd5e1" />
        </radialGradient>
        <radialGradient id="qci-rim" cx=".38" cy=".32" r=".85">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".6" stopColor="#e2e8f0" />
          <stop offset="1" stopColor="#94a3b8" />
        </radialGradient>
        <linearGradient id="qci-spoke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#94a3b8" />
          <stop offset=".5" stopColor="#e2e8f0" />
          <stop offset="1" stopColor="#64748b" />
        </linearGradient>
        <linearGradient id="qci-beam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fef9c3" stopOpacity=".5" />
          <stop offset="1" stopColor="#fef9c3" stopOpacity="0" />
        </linearGradient>
        <filter id="qci-blur" x="-20%" y="-300%" width="140%" height="700%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* soft contact shadow */}
      <ellipse className="qci-shadow" cx="178" cy="256" rx="158" ry="7" fill="#022c22" opacity=".42" filter="url(#qci-blur)" />

      {/* speed streaks */}
      <g stroke="#16a34a" strokeWidth="3" strokeLinecap="round">
        <line className="qci-sl" x1="-44" y1="118" x2="-12" y2="118" />
        <line className="qci-sl b" x1="-36" y1="150" x2="-4" y2="150" />
        <line className="qci-sl c" x1="-46" y1="184" x2="-20" y2="184" />
      </g>

      <g className="qci-bob">
        {/* headlight beam */}
        <path d="M296 104 L362 74 L362 140 Z" fill="url(#qci-beam)" />

        {/* wheels */}
        <Wheel cx={80} cy={220} />
        <Wheel cx={286} cy={220} />

        {/* rear shock + rack */}
        <path d="M66 196 l8 -6 l-8 -6 l8 -6 l-8 -6" fill="none" stroke="#475569" strokeWidth="3" strokeLinejoin="round" />
        <rect x="18" y="146" width="76" height="7" rx="3" fill="#334155" />
        <rect x="18" y="146" width="76" height="2" rx="1" fill="#64748b" />

        {/* delivery bag (behind rider) */}
        <g className="qci-bag">
          <path d="M62 60 L83 28" stroke="#d6a45f" strokeWidth="10" strokeLinecap="round" />
          <path d="M62 60 L83 28" stroke="#f0cd8f" strokeWidth="3" strokeLinecap="round" opacity=".7" transform="translate(-2 -1)" />
          <path d="M70 46 l5 3 M75 38 l5 3" stroke="#b9823a" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="30" cy="48" rx="8" ry="15" fill="#15803d" transform="rotate(-24 30 48)" />
          <ellipse cx="43" cy="44" rx="8" ry="16" fill="#4ade80" transform="rotate(8 43 44)" />
          <ellipse cx="53" cy="49" rx="6" ry="12" fill="#22c55e" transform="rotate(26 53 49)" />
          <path d="M43 32 L43 56" stroke="#15803d" strokeWidth="1.2" opacity=".6" />
          <path d="M10 66 Q10 58 18 58 L84 58 Q93 58 93 66 L97 142 Q97 150 90 150 L14 150 Q7 150 7 142 Z" fill="url(#qci-bagg)" />
          <path d="M84 58 Q93 58 93 66 L97 142 Q97 150 90 150 L78 150 L82 66 Q82 58 76 58 Z" fill="#a16207" opacity=".22" />
          <rect x="11.5" y="62" width="81" height="84" rx="7" fill="none" stroke="#a16207" strokeWidth="1.2" strokeDasharray="3 3" opacity=".45" />
          <path d="M10 88 L94 88" stroke="#a16207" strokeWidth="2" opacity=".55" />
          <rect x="43" y="84" width="16" height="8" rx="4" fill="#a16207" opacity=".85" />
          <rect x="15" y="98" width="74" height="38" rx="9" fill="#14532d" />
          <rect x="15" y="98" width="74" height="15" rx="9" fill="#fff" opacity=".07" />
          <text x="50" y="122.5" textAnchor="middle" fontSize="13" fontWeight="800" fontFamily="ui-sans-serif,system-ui,sans-serif" letterSpacing="-.2">
            <tspan fill="#ffffff">Quick</tspan>
            <tspan fill="#facc15">Cart</tspan>
          </text>
          <rect x="9" y="140" width="86" height="3.5" rx="1.7" fill="#fff" opacity=".55" />
          <path d="M10 66 L8 138" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity=".35" />
        </g>

        {/* scooter body */}
        <path d="M42 212 C40 172 70 146 120 146 L160 152 L162 200 L128 206 C120 190 104 184 80 184 C58 184 46 196 42 212 Z" fill="url(#qci-body)" />
        <path d="M70 198 C90 188 112 190 126 201" fill="none" stroke="#0b5a28" strokeWidth="2" strokeLinecap="round" opacity=".55" />
        <path d="M56 170 C72 156 98 151 126 156" fill="none" stroke="#bbf7d0" strokeWidth="3.5" strokeLinecap="round" opacity=".6" />
        <path d="M41 190 q-5 6 -3 15 l8 1 q-2 -9 2 -15 Z" fill="#ef4444" />
        <path d="M41 192 q-2 3 -1.5 6" fill="none" stroke="#fecaca" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M66 146 C88 130 140 130 160 140 L162 152 L64 156 Z" fill="#1f2937" />
        <path d="M72 142 C96 134 132 134 156 142" fill="none" stroke="#4b5563" strokeWidth="1.5" strokeDasharray="3 3" />
        <path d="M80 136 C104 129 130 130 150 136" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".18" />
        <rect x="118" y="198" width="118" height="14" rx="6" fill="#14532d" />
        <rect x="124" y="203" width="100" height="3" rx="1.5" fill="#facc15" opacity=".9" />
        {[132, 148, 164, 180, 196, 212].map((x) => (
          <rect key={x} x={x} y="199.5" width="6" height="1.6" rx=".8" fill="#052e16" opacity=".6" />
        ))}

        {/* fork, fender, leg shield */}
        <line x1="246" y1="104" x2="286" y2="220" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
        <line x1="244.5" y1="106" x2="284" y2="218" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" opacity=".7" />
        <path d="M254 198 C262 168 312 166 324 198 L314 201 C306 183 272 183 264 201 Z" fill="url(#qci-body)" />
        <path d="M262 184 C272 172 300 170 314 184" fill="none" stroke="#bbf7d0" strokeWidth="2" strokeLinecap="round" opacity=".55" />
        <path d="M206 208 C214 176 222 140 232 108 L256 112 C254 146 256 178 258 208 Z" fill="url(#qci-body)" />
        <path d="M222 190 C228 160 234 136 240 116" fill="none" stroke="#bbf7d0" strokeWidth="3" strokeLinecap="round" opacity=".55" />
        <path d="M248 120 C249 150 250 180 252 206" fill="none" stroke="#0b5a28" strokeWidth="3" strokeLinecap="round" opacity=".35" />

        {/* handlebar, dash, headlight, mirror */}
        <line x1="246" y1="104" x2="242" y2="80" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
        <ellipse cx="248" cy="71" rx="9" ry="5.5" fill="#111827" />
        <ellipse cx="248" cy="70" rx="5.5" ry="2.6" fill="#4ade80" opacity=".8" />
        <path d="M252 96 Q272 90 275 106 Q272 120 252 114 Z" fill="#fefce8" stroke="#a16207" strokeWidth="2" />
        <circle cx="266" cy="105" r="6" fill="#fff" />
        <circle cx="270" cy="105" r="10" fill="#fde047" opacity=".5" />
        <circle cx="256" cy="121" r="2.6" fill="#fb923c" />
        <line x1="236" y1="78" x2="230" y2="58" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="228" cy="54" rx="7" ry="5" fill="#64748b" />
        <ellipse cx="226.5" cy="53" rx="3.4" ry="2" fill="#e2e8f0" opacity=".8" />

        {/* rider: legs */}
        <path d="M116 142 L170 146" stroke="#1f2937" strokeWidth="22" strokeLinecap="round" />
        <path d="M170 146 L186 190" stroke="#1f2937" strokeWidth="18" strokeLinecap="round" />
        <path d="M118 135 L168 139" stroke="#475569" strokeWidth="3" strokeLinecap="round" opacity=".55" />
        <path d="M176 142 L190 180" stroke="#475569" strokeWidth="2.6" strokeLinecap="round" opacity=".45" />
        <circle cx="173" cy="146" r="3" fill="#374151" opacity=".9" />
        <rect x="177" y="180" width="18" height="6" rx="3" fill="#e2e8f0" />
        <path d="M172 184 L196 184 Q214 186 219 194 L219 198 L170 198 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
        <path d="M184 186 l8 -1 M188 189 l8 -1" stroke="#94a3b8" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M200 187 Q212 188 217 194" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" />
        <rect x="170" y="195" width="49" height="4" rx="2" fill="#0f172a" opacity=".85" />

        {/* rider: torso (jacket) */}
        <path d="M98 152 C90 114 104 78 134 66 L162 76 C164 104 154 130 146 152 Z" fill="url(#qci-jacket)" />
        <path d="M146 152 C156 130 166 104 162 76 L148 71 C152 100 148 128 134 152 Z" fill="#0b5a28" opacity=".28" />
        <path d="M106 142 q8 -10 12 -26 M122 148 q6 -12 8 -28" fill="none" stroke="#0b5a28" strokeWidth="2" strokeLinecap="round" opacity=".35" />
        <path d="M112 100 C116 86 124 76 134 70" fill="none" stroke="#bbf7d0" strokeWidth="3" strokeLinecap="round" opacity=".5" />
        <path d="M98 122 L156 106" stroke="#a16207" strokeWidth="8" strokeLinecap="round" opacity=".35" transform="translate(0 1.5)" />
        <path d="M98 122 L156 106" stroke="#facc15" strokeWidth="7" strokeLinecap="round" />
        <path d="M98 122 L156 106" stroke="#fffbeb" strokeWidth="2" strokeLinecap="round" opacity=".85" />
        <path d="M128 66 C132 80 152 82 164 76 L160 68 C150 74 138 72 132 62 Z" fill="#14532d" />
        <path d="M126 152 L150 150" stroke="#14532d" strokeWidth="5" strokeLinecap="round" opacity=".55" />

        {/* rider: arm + glove */}
        <path d="M148 84 L188 112" stroke="#0f7a35" strokeWidth="16" strokeLinecap="round" />
        <path d="M148 80 L186 106" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" opacity=".55" />
        <path d="M188 112 L236 82" stroke="#16a34a" strokeWidth="14" strokeLinecap="round" />
        <path d="M190 106 L232 79" stroke="#86efac" strokeWidth="2.6" strokeLinecap="round" opacity=".5" />
        <path d="M226 87 L234 82" stroke="#14532d" strokeWidth="15" strokeLinecap="butt" />
        <circle cx="241" cy="80" r="8.5" fill="#111827" />
        <path d="M236 74 q8 -4 14 0 M237 80 q8 -3 15 1" fill="none" stroke="#374151" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M236 82 L254 77" stroke="#111827" strokeWidth="6" strokeLinecap="round" />
        <path d="M241 74 q4 -3 7 0" fill="none" stroke="#6b7280" strokeWidth="1.4" strokeLinecap="round" opacity=".7" />

        {/* rider: head */}
        <rect x="141" y="58" width="11" height="14" rx="4" fill="#d9a77c" />
        <ellipse cx="152" cy="50" rx="16.5" ry="17.5" fill="url(#qci-skin)" />
        <path d="M140 60 C146 70 160 68 166 58 C163 66 150 70 142 62 Z" fill="#c8895c" opacity=".35" />
        <circle cx="140" cy="54" r="3.4" fill="#e0a982" />
        <path d="M139 52 q2 2 0 4" fill="none" stroke="#b9774d" strokeWidth="1" strokeLinecap="round" />
        <ellipse cx="160" cy="48.5" rx="2.6" ry="2.1" fill="#fff" />
        <circle cx="160.8" cy="48.7" r="1.6" fill="#1f2937" />
        <path d="M163 53 q3 2 0 5" fill="none" stroke="#cc916a" strokeWidth="1.6" strokeLinecap="round" />
        <ellipse cx="157" cy="55.5" rx="4" ry="2.4" fill="#f59e8f" opacity=".45" />
        <path d="M153 60 Q160 65.5 166 59" fill="none" stroke="#9a3412" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M156 42.5 q4.5 -3 9 -.5" fill="none" stroke="#6b3d1c" strokeWidth="2.2" strokeLinecap="round" />
        {/* helmet */}
        <path d="M131 52 C128 24 152 17 168 27 C176 33 179 41 178 47 L160 43 C150 41 141 46 136 58 Z" fill="url(#qci-helmet)" stroke="#d5dde8" strokeWidth="1.2" />
        <path d="M159 43 L181 46.5 Q183 49.5 179 50.5 L157.5 47 Z" fill="#14532d" />
        <path d="M138 28 C152 20 168 26 176 38" fill="none" stroke="#16a34a" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M150 22 C156 21 162 23 166 27" fill="none" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
        <path d="M137 40 C140 31 148 26 157 25" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".95" />
        <path d="M142 34 l7 -3 M146 38 l7 -3" stroke="#cbd5e1" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M141 58 L151 68" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" />
        <rect x="149.5" y="66" width="4.5" height="3.4" rx="1" fill="#94a3b8" transform="rotate(30 151 68)" />
      </g>
    </svg>
  );
}

/* ---- parallax tiles (each is 1200 wide; edges are seamless) --------------- */

function Clouds() {
  const Cloud = ({ x, y, s = 1 }) => (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#fff" opacity=".92">
      <ellipse cx="0" cy="0" rx="46" ry="15" />
      <ellipse cx="-20" cy="-9" rx="22" ry="15" />
      <ellipse cx="14" cy="-14" rx="26" ry="18" />
    </g>
  );
  return (
    <svg viewBox="0 0 1200 120" style={{ aspectRatio: '1200 / 120' }} aria-hidden="true" focusable="false">
      <Cloud x={150} y={60} s={1} />
      <Cloud x={520} y={34} s={0.7} />
      <Cloud x={860} y={74} s={1.15} />
      <Cloud x={1090} y={36} s={0.6} />
    </svg>
  );
}

function FarTile() {
  const b = [
    [0, 120, 90], [100, 70, 80], [190, 140, 100], [300, 95, 70], [380, 150, 110], [500, 60, 85],
    [595, 125, 95], [700, 85, 75], [785, 150, 120], [915, 105, 80], [1005, 135, 90], [1105, 90, 95],
  ];
  return (
    <svg viewBox="0 0 1200 260" style={{ aspectRatio: '1200 / 260' }} aria-hidden="true" focusable="false">
      {b.map(([x, y, w], i) => (
        <rect key={i} x={x} y={y} width={w} height={260 - y} rx="4" fill={i % 3 === 0 ? '#bbf7d0' : '#c9ecd3'} opacity=".7" />
      ))}
      {[[118, 90], [210, 160], [520, 80], [720, 105], [940, 125]].map(([x, y], i) => (
        <g key={i} fill="#fff" opacity=".7">
          <rect x={x} y={y} width="10" height="10" rx="2" />
          <rect x={x + 24} y={y} width="10" height="10" rx="2" />
          <rect x={x} y={y + 24} width="10" height="10" rx="2" />
        </g>
      ))}
    </svg>
  );
}

function SceneDefs() {
  return (
    <defs>
      <linearGradient id="qci-glass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#bfdbfe" />
      </linearGradient>
      <linearGradient id="qci-glass-lit" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fef3c7" />
        <stop offset="1" stopColor="#fbbf24" />
      </linearGradient>
      <linearGradient id="qci-wall" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#ffffff" stopOpacity=".38" />
        <stop offset=".55" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="1" stopColor="#14532d" stopOpacity=".16" />
      </linearGradient>
      <linearGradient id="qci-wall-v" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity=".0" />
        <stop offset="1" stopColor="#14532d" stopOpacity=".14" />
      </linearGradient>
    </defs>
  );
}

/* a building with base colour + light/shade overlays so it has volume */
function Wall({ x, y, w, h, fill, rx = 6 }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} />
      <rect x={x} y={y} width={w} height={h} rx={rx} fill="url(#qci-wall)" />
      <rect x={x} y={y} width={w} height={h} rx={rx} fill="url(#qci-wall-v)" />
      <rect x={x} y={y} width={w} height="4" rx="2" fill="#14532d" opacity=".12" />
    </g>
  );
}

function Windows({ x, y, cols, rows, gx = 44, gy = 40, lit = [] }) {
  const out = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const on = lit.includes(r * cols + c);
      out.push(
        <g key={`${r}-${c}`}>
          <rect x={x + c * gx} y={y + r * gy} width="26" height="22" rx="4" fill={on ? 'url(#qci-glass-lit)' : 'url(#qci-glass)'} stroke="#14532d" strokeOpacity=".14" strokeWidth="1" />
          <rect x={x + c * gx + 1} y={y + r * gy + 1} width="24" height="6" rx="3" fill="#fff" opacity={on ? 0.35 : 0.55} />
        </g>
      );
    }
  return <g>{out}</g>;
}

function Tree({ x, base, r = 40, trunk = 60 }) {
  return (
    <g>
      <ellipse cx={x + r * 0.35} cy={base - 1} rx={r * 0.95} ry="5" fill="#064e3b" opacity=".2" />
      <rect x={x - 5} y={base - trunk} width="10" height={trunk} rx="3" fill="#8b6b4a" />
      <rect x={x + 1} y={base - trunk} width="4" height={trunk} rx="2" fill="#5b4330" opacity=".4" />
      <circle cx={x} cy={base - trunk - r * 0.45} r={r} fill="#16a34a" />
      <circle cx={x - r * 0.1} cy={base - trunk - r * 0.55} r={r * 0.9} fill="#22c55e" />
      <circle cx={x - r * 0.35} cy={base - trunk - r * 0.75} r={r * 0.55} fill="#4ade80" opacity=".9" />
      <circle cx={x + r * 0.45} cy={base - trunk - r * 0.15} r={r * 0.5} fill="#15803d" opacity=".75" />
      <circle cx={x - r * 0.5} cy={base - trunk - r * 0.95} r={r * 0.22} fill="#bbf7d0" opacity=".6" />
    </g>
  );
}

function MidTile() {
  const stripes = [];
  for (let i = 0; i < 10; i++) stripes.push(<rect key={i} x={262 + i * 26} y={142} width="26" height="30" fill={i % 2 ? '#ffffff' : '#16a34a'} />);
  const bakeryStripes = [];
  for (let i = 0; i < 8; i++) bakeryStripes.push(<rect key={i} x={1560 + i * 26} y={152} width="26" height="28" fill={i % 2 ? '#fff7ed' : '#facc15'} />);
  return (
    <svg viewBox="0 0 2400 300" style={{ aspectRatio: '2400 / 300' }} aria-hidden="true" focusable="false">
      <SceneDefs />
      {/* ---------- first half: the fresh market street ---------- */}
      {/* apartment A */}
      <Wall x={0} y={110} w={170} h={190} fill="#e3f3e9" />
      <Windows x={22} y={130} cols={3} rows={4} gx={48} gy={42} lit={[1, 5, 9]} />
      <Tree x={206} base={300} r={40} trunk={70} />

      {/* grocery shop */}
      <Wall x={262} y={108} w={260} h={192} fill="#ffffff" rx={8} />
      <rect x="296" y="76" width="192" height="36" rx="10" fill="#14532d" />
      <text x="392" y="101" textAnchor="middle" fontSize="19" fontWeight="800" fill="#facc15" fontFamily="ui-sans-serif,system-ui,sans-serif" letterSpacing="2">FRESH MARKET</text>
      {stripes}
      <rect x="282" y="190" width="132" height="84" rx="8" fill="#dcfce7" stroke="#86efac" strokeWidth="2" />
      <rect x="432" y="196" width="66" height="104" rx="6" fill="#bbf7d0" />
      <circle cx="486" cy="250" r="3.5" fill="#14532d" />
      {/* fruit crates */}
      {[290, 346].map((x, i) => (
        <g key={x}>
          <rect x={x} y="272" width="48" height="28" rx="4" fill="#c8924f" />
          <rect x={x} y="272" width="48" height="6" rx="3" fill="#a9763a" />
          {(i ? ['#fb923c', '#fb923c', '#f97316', '#fdba74'] : ['#ef4444', '#f87171', '#ef4444', '#dc2626']).map((c, k) => (
            <circle key={k} cx={x + 9 + k * 10.5} cy={268 - (k % 2) * 4} r="6.5" fill={c} />
          ))}
        </g>
      ))}
      <rect x="402" y="278" width="24" height="22" rx="3" fill="#a3e635" />
      <ellipse cx="414" cy="278" rx="12" ry="5" fill="#65a30d" />

      {/* yellow block B */}
      <Wall x={570} y={84} w={200} h={216} fill="#fdf3b0" />
      <rect x="586" y="66" width="44" height="22" rx="4" fill="#fde68a" />
      <Windows x={592} y={110} cols={4} rows={4} gx={44} gy={44} lit={[2, 6, 13]} />
      <Tree x={812} base={300} r={34} trunk={56} />

      {/* block C */}
      <Wall x={884} y={132} w={164} h={168} fill="#d4f5df" />
      <Windows x={906} y={152} cols={3} rows={3} gx={48} gy={44} lit={[0, 4]} />
      <Tree x={1100} base={300} r={40} trunk={64} />

      {/* ---------- second half: bakery and houses (so nothing repeats on screen) ---------- */}
      {/* tall block */}
      <Wall x={1220} y={70} w={150} h={230} fill="#d6ebfb" />
      <Windows x={1242} y={92} cols={3} rows={5} gx={42} gy={40} lit={[4, 7, 12]} />
      <Tree x={1410} base={300} r={36} trunk={60} />

      {/* bakery / dairy */}
      <Wall x={1500} y={124} w={236} h={176} fill="#fffaeb" rx={8} />
      <rect x="1530" y="96" width="176" height="34" rx="10" fill="#92400e" />
      <text x="1618" y="119" textAnchor="middle" fontSize="17" fontWeight="800" fill="#fef3c7" fontFamily="ui-sans-serif,system-ui,sans-serif" letterSpacing="1.5">DAIRY &amp; BAKERY</text>
      {bakeryStripes}
      <rect x="1522" y="196" width="112" height="80" rx="8" fill="#fef3c7" stroke="#fcd34d" strokeWidth="2" />
      <ellipse cx="1556" cy="236" rx="16" ry="9" fill="#d6a45f" />
      <ellipse cx="1596" cy="236" rx="14" ry="8" fill="#c8924f" />
      <rect x="1652" y="200" width="64" height="100" rx="6" fill="#fde68a" />
      <circle cx="1704" cy="252" r="3.5" fill="#92400e" />
      {/* milk crates */}
      <g>
        <rect x="1514" y="276" width="36" height="24" rx="3" fill="#e2e8f0" />
        <rect x="1520" y="262" width="10" height="16" rx="2" fill="#ffffff" stroke="#cbd5e1" />
        <rect x="1534" y="262" width="10" height="16" rx="2" fill="#ffffff" stroke="#cbd5e1" />
      </g>

      {/* low houses */}
      <Wall x={1800} y={170} w={150} h={130} fill="#d4f5df" />
      <path d="M1790 172 L1875 118 L1960 172 Z" fill="#16a34a" opacity=".85" />
      <rect x="1830" y="200" width="34" height="32" rx="4" fill="#fff" />
      <rect x="1886" y="200" width="34" height="32" rx="4" fill="#fde68a" />
      <rect x="1850" y="248" width="40" height="52" rx="5" fill="#86efac" />
      <Tree x={1996} base={300} r={42} trunk={72} />

      <Wall x={2060} y={104} w={180} h={196} fill="#e6f7bd" />
      <Windows x={2082} y={126} cols={3} rows={4} gx={52} gy={44} lit={[0, 5, 10]} />
      <Tree x={2290} base={300} r={34} trunk={58} />
    </svg>
  );
}

function NearTile() {
  const Lamp = ({ x }) => (
    <g>
      <rect x={x - 3} y="46" width="6" height="154" rx="3" fill="#475569" />
      <path d={`M${x} 52 q 0 -16 22 -16`} fill="none" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx={x + 26} cy="38" rx="11" ry="6" fill="#fde68a" />
    </g>
  );
  const Bush = ({ x }) => (
    <g>
      <ellipse cx={x} cy="188" rx="34" ry="20" fill="#16a34a" />
      <ellipse cx={x - 18} cy="192" rx="22" ry="14" fill="#22c55e" />
      <ellipse cx={x + 20} cy="192" rx="20" ry="13" fill="#4ade80" opacity=".9" />
    </g>
  );
  return (
    <svg viewBox="0 0 1200 200" style={{ aspectRatio: '1200 / 200' }} aria-hidden="true" focusable="false">
      <Lamp x={150} />
      <Tree x={430} base={198} r={46} trunk={92} />
      <Bush x={640} />
      <Lamp x={820} />
      <Tree x={1020} base={198} r={40} trunk={80} />
      <Bush x={1130} />
      <rect x="0" y="186" width="1200" height="14" fill="#e5e7eb" />
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={i * 100} y="186" width="2" height="14" fill="#cbd5e1" />
      ))}
    </svg>
  );
}

const Layer = ({ cls, children }) => (
  <div className={`qci-layer ${cls}`} aria-hidden="true">
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <div key={i} style={{ display: 'contents' }}>{children}</div>
    ))}
  </div>
);

/* ----------------------------------------------------------------------------
 * QuickCartIntro
 * ------------------------------------------------------------------------- */
export default function QuickCartIntro({
  ready = true,
  minDuration = 2800,
  maxDuration = 15000,
  text = 'Freshness is on the way...',
  onFinish,
}) {
  const [phase, setPhase] = useState('run'); // run -> leaving -> gone
  const live = useRef({ ready, minDuration, maxDuration, onFinish });

  useEffect(() => {
    live.current = { ready, minDuration, maxDuration, onFinish };
  });

  useEffect(() => {
    const t0 = performance.now();
    const timers = [];
    let finished = false;

    const leave = (delay) => {
      finished = true;
      timers.push(setTimeout(() => setPhase('leaving'), delay));
      timers.push(
        setTimeout(() => {
          setPhase('gone');
          live.current.onFinish?.();
        }, delay + 850)
      );
    };

    const id = setInterval(() => {
      if (finished) return;
      const { ready: rdy, minDuration: min, maxDuration: max } = live.current;
      const elapsed = performance.now() - t0;
      if (rdy && elapsed >= min) {
        clearInterval(id);
        leave(250);
      } else if (!rdy && elapsed > max) {
        // Safety valve: never trap the user. Hand over to the app's own UI.
        clearInterval(id);
        leave(0);
      }
    }, 100);

    return () => {
      clearInterval(id);
      timers.forEach(clearTimeout);
    };
  }, []);

  if (phase === 'gone') return null;

  const hasDots = /\.\.\.$/.test(text);
  const label = hasDots ? text.slice(0, -3) : text;

  return (
    <div className={`qci${phase === 'leaving' ? ' is-leaving' : ''}`} role="status" aria-live="polite" aria-label={text}>
      <style>{CSS}</style>

      <div className="qci-scene" aria-hidden="true">
        <div className="qci-sun" />
        <Layer cls="qci-clouds"><Clouds /></Layer>
        <Layer cls="qci-far"><FarTile /></Layer>
        <div className="qci-haze" />
        <Layer cls="qci-mid"><MidTile /></Layer>
        <Layer cls="qci-near"><NearTile /></Layer>
        <div className="qci-road">
          <div className="qci-dashes" />
          <div className="qci-edge" />
        </div>
        <div className="qci-rider"><Rider /></div>
      </div>

      <div className="qci-top">
        <div className="qci-brand">
          <LogoMark />
          <span className="qci-word">
            Quick<b>Cart</b>
          </span>
        </div>
        <p className="qci-title">
          {label}
          {hasDots && (
            <span className="qci-dots" aria-hidden="true">
              <span>.</span><span>.</span><span>.</span>
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * QuickCartIntroGate: show once per browser session, overlay on top of children
 * ------------------------------------------------------------------------- */
export function QuickCartIntroGate({
  children,
  ready = true,
  storageKey = SEEN_KEY,
  inertBackground = false,
  onFinish,
  ...introProps
}) {
  const [show, setShow] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return window.sessionStorage.getItem(storageKey) !== '1';
    } catch {
      return false; // storage blocked: skip the intro rather than replay it forever
    }
  });

  const handleFinish = useCallback(() => {
    try {
      window.sessionStorage.setItem(storageKey, '1');
    } catch {
      /* ignore */
    }
    setShow(false);
    onFinish?.();
  }, [storageKey, onFinish]);

  useEffect(() => {
    if (!show) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [show]);

  const content = inertBackground ? (
    <div style={{ display: 'contents' }} {...(show ? { inert: '' } : {})}>
      {children}
    </div>
  ) : (
    children
  );

  return (
    <>
      {content}
      {show && <QuickCartIntro {...introProps} ready={ready} onFinish={handleFinish} />}
    </>
  );
}