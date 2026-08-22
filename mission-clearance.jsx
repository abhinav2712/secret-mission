import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Lock,
  Delete,
  Play,
  Pause,
  RotateCcw,
  Check,
  Volume2,
  VolumeX,
  Sparkles,
  Gift,
  Target,
  ChevronRight,
  Heart,
  X,
  Eye,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   MISSION_CONFIG — everything you might want to change lives here.
   ═══════════════════════════════════════════════════════════════ */
const MISSION_CONFIG = {
  // May(5) · September(9) · September(9) · left hand(1)
  accessCode: "5991",

  agentName: "BIRTHDAY GIRL",

  hints: [
    { label: "DIGIT 01", text: "The month we officially met." },
    { label: "DIGIT 02", text: "The month our anniversary falls in." },
    { label: "DIGIT 03", text: "The month we got Kuchikoo." },
    { label: "DIGIT 04", text: "Which hand is my til on? Left = 1, right = 2." },
  ],

  // How many of the three files she may open.
  picksAllowed: 2,

  // File 03 — target price challenge.
  targetAmount: 2750,
  tolerance: 50,
  challengeSeconds: 420, // 7:00
};
/* ═══════════════════════════════════════════════════════════════ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

.mc-root {
  --bg: #100715;
  --panel: #1B0E25;
  --panel-2: #241033;
  --line: #3B2150;
  --line-hot: #58306F;
  --rose: #FF5FA2;
  --gold: #F2C879;
  --lilac: #BE8CFF;
  --ink: #F7EAF3;
  --muted: #A184B4;
  --display: 'Bodoni Moda', Georgia, serif;
  --mono: 'IBM Plex Mono', ui-monospace, monospace;
  --body: 'Jost', system-ui, sans-serif;

  min-height: 100vh; min-height: 100dvh; width: 100%;
  background: var(--bg); color: var(--ink);
  font-family: var(--body); font-weight: 300;
  position: relative; overflow-x: hidden;
  -webkit-font-smoothing: antialiased; -webkit-tap-highlight-color: transparent;
}

/* ── ambient night sky ───────────────────────────── */
.mc-field {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background:
    radial-gradient(70rem 44rem at 50% -12%, rgba(255,95,162,0.16), transparent 62%),
    radial-gradient(52rem 40rem at 8% 104%, rgba(190,140,255,0.13), transparent 66%),
    radial-gradient(40rem 30rem at 100% 40%, rgba(242,200,121,0.06), transparent 70%);
}
.mc-stars {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-image:
    radial-gradient(1.4px 1.4px at 12% 18%, rgba(255,255,255,.55), transparent),
    radial-gradient(1.2px 1.2px at 78% 12%, rgba(255,214,236,.5), transparent),
    radial-gradient(1px 1px at 32% 62%, rgba(255,255,255,.4), transparent),
    radial-gradient(1.6px 1.6px at 88% 72%, rgba(242,200,121,.45), transparent),
    radial-gradient(1px 1px at 58% 36%, rgba(255,255,255,.35), transparent),
    radial-gradient(1.2px 1.2px at 22% 88%, rgba(190,140,255,.5), transparent),
    radial-gradient(1px 1px at 68% 92%, rgba(255,255,255,.3), transparent);
  animation: mc-twinkle 6s ease-in-out infinite;
}
@keyframes mc-twinkle { 0%,100% { opacity: .85 } 50% { opacity: .35 } }

.mc-shell { position: relative; z-index: 2; max-width: 1140px; margin: 0 auto; padding: 0 18px 76px; }

/* ── ticker ──────────────────────────────────────── */
.mc-ticker {
  position: relative; z-index: 3; height: 32px; overflow: hidden;
  display: flex; align-items: center; border-bottom: 1px solid var(--line);
  background: linear-gradient(90deg, rgba(255,95,162,0.10), rgba(190,140,255,0.08));
}
.mc-ticker-track { display: flex; white-space: nowrap; animation: mc-marquee 38s linear infinite; }
.mc-ticker span { font-family: var(--mono); font-size: 10px; letter-spacing: .34em; color: var(--gold); opacity: .7; padding-right: 34px; }
@keyframes mc-marquee { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }

/* ── plate ───────────────────────────────────────── */
.mc-plate {
  position: relative; border-radius: 3px;
  background: linear-gradient(158deg, var(--panel), var(--panel-2));
  border: 1px solid var(--line);
}
.mc-plate::before, .mc-plate::after {
  content: ''; position: absolute; width: 14px; height: 14px;
  border: 1px solid var(--accent, var(--gold)); opacity: .8; z-index: 2;
}
.mc-plate::before { top: -1px; left: -1px; border-right: 0; border-bottom: 0; }
.mc-plate::after  { bottom: -1px; right: -1px; border-left: 0; border-top: 0; }

.mc-eyebrow { font-family: var(--mono); font-size: 10px; letter-spacing: .3em; color: var(--muted); text-transform: uppercase; }

/* ── hero ────────────────────────────────────────── */
.mc-hero { padding: 44px 0 22px; text-align: center; }
.mc-stamp {
  display: inline-flex; align-items: center; gap: 8px;
  border: 1px solid var(--rose); color: var(--rose);
  font-family: var(--mono); font-size: 10px; letter-spacing: .28em;
  padding: 6px 13px; transform: rotate(-1.4deg);
  background: rgba(255,95,162,.09); box-shadow: 0 0 26px -8px var(--rose);
}
.mc-title { font-family: var(--display); font-weight: 600; text-transform: uppercase; line-height: .9; margin: 20px 0 0; font-size: clamp(32px,8.4vw,72px); }
.mc-title em {
  display: block; font-style: italic; font-weight: 400; text-transform: none;
  font-size: clamp(40px,11vw,96px); padding-bottom: .08em;
  background: linear-gradient(96deg, var(--rose), var(--gold) 55%, var(--lilac));
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.mc-sub { color: var(--muted); font-family: var(--mono); font-size: 11.5px; letter-spacing: .18em; margin-top: 16px; }

.mc-lockgrid { display: grid; grid-template-columns: minmax(0,1fr); gap: 16px; margin-top: 30px; }
@media (min-width: 900px) { .mc-lockgrid { grid-template-columns: 1.05fr 1fr; } }

/* ── keypad ──────────────────────────────────────── */
.mc-pad { padding: 26px 18px 28px; }
.mc-slots { display: flex; justify-content: center; gap: 9px; margin: 20px 0 26px; }
.mc-slot {
  width: clamp(50px,15vw,62px); height: 76px; border: 1px solid var(--line-hot); background: #150A1D;
  display: grid; place-items: center; font-family: var(--display); font-size: 36px; font-weight: 600; color: var(--gold);
  box-shadow: inset 0 0 22px rgba(0,0,0,.55);
  transition: border-color .18s ease, box-shadow .18s ease, color .18s ease;
}
.mc-slot.filled { border-color: var(--rose); box-shadow: inset 0 0 22px rgba(0,0,0,.55), 0 0 24px -4px var(--rose); }
.mc-slot .dot { width: 7px; height: 7px; background: var(--line-hot); border-radius: 50%; }
.mc-slot.err { border-color: var(--rose); color: var(--rose); }

.mc-keys { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; max-width: 300px; margin: 0 auto; }
.mc-key {
  appearance: none; cursor: pointer; border: 1px solid var(--line-hot); border-radius: 2px;
  background: linear-gradient(180deg,#2A1439,#190C22); color: var(--ink);
  font-family: var(--display); font-weight: 600; font-size: 23px; height: 60px; display: grid; place-items: center;
  transition: transform .09s ease, border-color .16s ease, color .16s ease, box-shadow .16s ease;
}
.mc-key:hover { border-color: var(--rose); color: var(--rose); }
.mc-key:active { transform: scale(.94); box-shadow: inset 0 0 26px rgba(255,95,162,.3); }
.mc-key:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }
.mc-key.util { font-family: var(--mono); font-size: 11px; letter-spacing: .16em; color: var(--muted); }
.mc-key.util:hover { color: var(--gold); border-color: var(--gold); }
.mc-key[disabled] { opacity: .35; cursor: not-allowed; }

.mc-status { text-align: center; margin-top: 20px; min-height: 18px; font-family: var(--mono); font-size: 11px; letter-spacing: .2em; color: var(--muted); }
.mc-status.bad { color: var(--rose); }
.mc-status.good { color: var(--gold); }
.shake { animation: mc-shake .4s cubic-bezier(.36,.07,.19,.97); }
@keyframes mc-shake { 10%,90% { transform: translateX(-2px) } 20%,80% { transform: translateX(4px) } 30%,50%,70% { transform: translateX(-7px) } 40%,60% { transform: translateX(7px) } }

/* ── hints ───────────────────────────────────────── */
.mc-hints { padding: 24px 20px; display: flex; flex-direction: column; }
.mc-hint { display: flex; gap: 14px; padding: 13px 0; border-bottom: 1px dashed var(--line); }
.mc-hint:last-of-type { border-bottom: 0; }
.mc-hint-idx { font-family: var(--mono); font-size: 10px; letter-spacing: .2em; color: var(--gold); padding-top: 4px; white-space: nowrap; }
.mc-hint-txt { font-size: 15.5px; line-height: 1.45; color: #E3D0E2; }
.mc-note { margin-top: auto; padding-top: 16px; font-family: var(--mono); font-size: 10.5px; line-height: 1.75; color: var(--muted); }

/* ── granted overlay ─────────────────────────────── */
.mc-granted { position: fixed; inset: 0; z-index: 60; display: grid; place-items: center; background: rgba(12,5,16,.95); animation: mc-fade .3s ease both; text-align: center; padding: 20px; }
@keyframes mc-fade { from { opacity: 0 } to { opacity: 1 } }
.mc-granted h2 {
  font-family: var(--display); font-style: italic; font-weight: 400; font-size: clamp(34px,10vw,74px); margin: 0;
  background: linear-gradient(96deg, var(--rose), var(--gold) 60%, var(--lilac));
  -webkit-background-clip: text; background-clip: text; color: transparent;
  animation: mc-pop .55s cubic-bezier(.2,.9,.3,1.4) both;
}
.mc-granted p { font-family: var(--mono); font-size: 11px; letter-spacing: .3em; color: var(--muted); margin-top: 14px; }
@keyframes mc-pop { from { opacity: 0; transform: scale(.85) } to { opacity: 1; transform: none } }
.mc-ring { position: absolute; width: 190px; height: 190px; border: 1px solid var(--rose); border-radius: 50%; animation: mc-ring 1.6s ease-out infinite; }
.mc-ring.d2 { animation-delay: .38s; border-color: var(--gold) }
.mc-ring.d3 { animation-delay: .76s; border-color: var(--lilac) }
@keyframes mc-ring { from { transform: scale(.3); opacity: .85 } to { transform: scale(3.6); opacity: 0 } }

/* ── clearance header ────────────────────────────── */
.mc-head { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 16px; padding: 34px 0 20px; border-bottom: 1px solid var(--line); }
.mc-head h1 { font-family: var(--display); font-weight: 600; text-transform: uppercase; font-size: clamp(24px,5.4vw,42px); line-height: 1.02; margin: 10px 0 0; }
.mc-head h1 em {
  display: block; font-style: italic; font-weight: 400; text-transform: none; font-size: clamp(30px,7vw,56px);
  background: linear-gradient(96deg, var(--rose), var(--gold));
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.mc-meta { font-family: var(--mono); font-size: 10.5px; letter-spacing: .18em; color: var(--muted); text-align: right; line-height: 1.9; }
.mc-live { display: inline-flex; align-items: center; gap: 8px; color: var(--gold); }
.mc-blip { width: 7px; height: 7px; border-radius: 50%; background: var(--rose); animation: mc-blip 1.7s ease-in-out infinite; }
@keyframes mc-blip { 0%,100% { opacity: 1; box-shadow: 0 0 0 0 rgba(255,95,162,.5) } 50% { opacity: .35; box-shadow: 0 0 0 8px rgba(255,95,162,0) } }

/* ── quota ───────────────────────────────────────── */
.mc-quota {
  margin-top: 22px; padding: 15px 18px; border: 1px dashed var(--line-hot); border-radius: 3px;
  background: rgba(255,95,162,.05); display: flex; flex-wrap: wrap; gap: 10px; justify-content: space-between; align-items: center;
}
.mc-quota-txt { font-size: 15px; color: #E3D0E2; }
.mc-quota-txt b { font-weight: 500; font-family: var(--display); font-style: italic; font-size: 18px; color: var(--gold); }
.mc-pips { display: flex; gap: 7px; align-items: center; font-family: var(--mono); font-size: 10px; letter-spacing: .2em; color: var(--muted); }
.mc-pip { width: 9px; height: 9px; border: 1px solid var(--rose); border-radius: 50%; transition: background .3s ease, box-shadow .3s ease; }
.mc-pip.used { background: var(--rose); box-shadow: 0 0 12px -2px var(--rose); }

/* ══ 3D SHELF ════════════════════════════════════ */
.mc-shelf {
  perspective: 1500px; perspective-origin: 50% 42%;
  display: grid; gap: 22px; margin-top: 26px; padding: 26px 0 10px;
}
@media (min-width: 820px) { .mc-shelf { grid-template-columns: repeat(3,1fr); gap: 26px; } }

.mc-tilewrap { transform-style: preserve-3d; }
.mc-tile {
  position: relative; width: 100%; min-height: 300px; border: 0; cursor: pointer; padding: 0;
  background: transparent; transform-style: preserve-3d;
  transition: transform .55s cubic-bezier(.2,.8,.25,1), opacity .45s ease, filter .45s ease;
  transform: rotateX(7deg) translateZ(0);
  display: block;
}
@media (min-width: 820px) {
  .mc-tile { transform: rotateY(var(--ry,0deg)) rotateX(4deg) translateZ(var(--tz,0px)); }
  .mc-tile:hover:not([disabled]) { transform: rotateY(0deg) rotateX(0deg) translateZ(70px) scale(1.01); }
}
.mc-tile:hover:not([disabled]) { }
.mc-tile:focus-visible { outline: 2px solid var(--gold); outline-offset: 6px; }
.mc-tile[disabled] { cursor: not-allowed; filter: grayscale(.75) brightness(.6); }
.mc-tile.zooming { transform: translateZ(420px) scale(1.1); opacity: 0; }
.mc-tile.receding { transform: translateZ(-260px) scale(.86); opacity: .18; filter: blur(3px); }

.mc-face-front {
  position: relative; border-radius: 4px; min-height: 300px; overflow: hidden;
  background: linear-gradient(165deg,#2A1339,#180B21 72%);
  border: 1px solid var(--line);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 15px; padding: 30px 22px; text-align: center;
  box-shadow: 0 34px 60px -34px rgba(0,0,0,.95), 0 0 0 1px rgba(255,255,255,.02) inset;
}
.mc-tile.opened .mc-face-front { border-color: var(--accent); box-shadow: 0 34px 60px -30px var(--accent); }
.mc-face-front::after {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(115deg, transparent 35%, rgba(255,255,255,.10) 47%, transparent 60%);
  transform: translateX(-120%); animation: mc-sheen 5s ease-in-out infinite;
}
@keyframes mc-sheen { 0%,72% { transform: translateX(-120%) } 100% { transform: translateX(120%) } }
.mc-corner { position: absolute; width: 14px; height: 14px; border: 1px solid var(--accent); opacity: .75; }
.mc-corner.tl { top: 8px; left: 8px; border-right: 0; border-bottom: 0; }
.mc-corner.br { bottom: 8px; right: 8px; border-left: 0; border-top: 0; }

.mc-wax {
  width: 88px; height: 88px; border-radius: 50%; display: grid; place-items: center; color: #2A0B1B;
  background: radial-gradient(circle at 34% 30%, #FF9BC8, var(--accent) 46%, #6E1943 100%);
  box-shadow: 0 14px 34px -12px var(--accent), inset 0 -4px 12px rgba(0,0,0,.35);
  border: 2px solid rgba(255,255,255,.22); transform: rotate(-6deg) translateZ(30px);
  transition: transform .4s cubic-bezier(.2,.8,.3,1.3);
}
.mc-tile:hover:not([disabled]) .mc-wax { transform: rotate(-11deg) translateZ(60px) scale(1.07); }
.mc-tile.opened .mc-wax { background: radial-gradient(circle at 34% 30%, rgba(255,255,255,.2), rgba(255,255,255,.06)); border-color: var(--accent); color: var(--accent); }

.mc-tile-op { font-family: var(--mono); font-size: 9.5px; letter-spacing: .28em; color: var(--muted); transform: translateZ(20px); }
.mc-tile-title { font-family: var(--display); font-style: italic; font-weight: 400; font-size: 29px; line-height: 1.1; color: var(--ink); transform: translateZ(20px); }
.mc-tile-cta {
  font-family: var(--mono); font-size: 10px; letter-spacing: .24em; color: var(--accent);
  border-top: 1px solid var(--line); padding-top: 13px; width: 100%; transform: translateZ(20px);
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
}
.mc-tile[disabled] .mc-tile-cta { color: var(--muted); }

/* ══ ZOOM + FLIP MODAL ═══════════════════════════ */
.mc-modal {
  position: fixed; inset: 0; z-index: 80; display: grid; place-items: center; padding: 16px;
  background: rgba(9,4,13,.9); -webkit-backdrop-filter: blur(9px); backdrop-filter: blur(9px);
  perspective: 2000px; animation: mc-fade .35s ease both;
}
.mc-modal-close {
  position: absolute; top: 14px; right: 14px; z-index: 3;
  appearance: none; background: rgba(255,255,255,.05); border: 1px solid var(--line-hot); color: var(--ink);
  font-family: var(--mono); font-size: 10px; letter-spacing: .2em; padding: 10px 13px; cursor: pointer;
  display: inline-flex; align-items: center; gap: 8px; transition: color .16s ease, border-color .16s ease;
}
.mc-modal-close:hover { color: var(--rose); border-color: var(--rose); }

.mc-flipwrap { animation: mc-zoomin .55s cubic-bezier(.2,.85,.3,1.05) both; transform-style: preserve-3d; }
@keyframes mc-zoomin { from { transform: scale(.55) translateZ(-500px) rotateX(14deg); opacity: 0 } to { transform: none; opacity: 1 } }

.mc-flip {
  position: relative; width: min(430px, 92vw); height: min(660px, 82vh);
  transform-style: preserve-3d; transition: transform 1.05s cubic-bezier(.34,.86,.28,1);
}
.mc-flip.flipped { transform: rotateY(180deg); }
.mc-face {
  position: absolute; inset: 0; border-radius: 5px; overflow: hidden;
  -webkit-backface-visibility: hidden; backface-visibility: hidden;
  border: 1px solid var(--line); box-shadow: 0 50px 90px -40px var(--accent);
}
.mc-face.front {
  background: linear-gradient(165deg,#2A1339,#180B21 72%);
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18px; padding: 34px 26px; text-align: center;
}
.mc-face.back { transform: rotateY(180deg); background: linear-gradient(158deg, var(--panel), var(--panel-2)); display: flex; flex-direction: column; }
.mc-back-scroll { overflow-y: auto; padding: 24px 22px 24px; display: flex; flex-direction: column; gap: 14px; height: 100%; -webkit-overflow-scrolling: touch; }

.mc-card-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
.mc-badge {
  font-family: var(--mono); font-size: 9.5px; letter-spacing: .18em; padding: 5px 9px;
  border: 1px solid var(--accent); color: var(--accent);
  background: color-mix(in srgb, var(--accent) 12%, transparent); white-space: nowrap;
}
.mc-op { font-family: var(--mono); font-size: 9.5px; letter-spacing: .24em; color: var(--muted); }
.mc-h3 { font-family: var(--display); font-style: italic; font-weight: 400; font-size: 31px; line-height: 1.04; margin: 2px 0 0; }
.mc-body p { margin: 0; font-size: 15px; line-height: 1.55; color: #DCC8DB; }
.mc-icon { color: var(--accent); }

.mc-rule { border-top: 1px solid var(--line); padding-top: 12px; font-family: var(--mono); font-size: 11.5px; line-height: 1.8; color: var(--muted); }
.mc-rule b { color: var(--ink); font-weight: 500; }
.mc-amount { font-family: var(--display); font-weight: 600; font-size: 44px; line-height: 1; color: var(--accent); }
.mc-range { font-family: var(--mono); font-size: 10.5px; letter-spacing: .16em; color: var(--muted); margin-top: 7px; }

.mc-claim {
  margin-top: auto; appearance: none; cursor: pointer; width: 100%;
  border: 1px solid var(--accent); background: transparent; color: var(--accent);
  font-family: var(--mono); font-size: 11px; letter-spacing: .22em; padding: 14px 12px;
  display: flex; align-items: center; justify-content: center; gap: 9px;
  transition: background .18s ease, color .18s ease, box-shadow .18s ease, transform .09s ease;
}
.mc-claim:hover { background: var(--accent); color: #16081E; box-shadow: 0 0 32px -8px var(--accent); }
.mc-claim:active { transform: scale(.985); }
.mc-claim:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
.mc-claim.done { background: color-mix(in srgb, var(--accent) 16%, transparent); cursor: default; letter-spacing: .16em; }
.mc-claim.done:hover { box-shadow: none; color: var(--accent); background: color-mix(in srgb, var(--accent) 16%, transparent); }

/* redacted clue */
.mc-redact { position: relative; border: 1px dashed var(--line-hot); padding: 14px; background: #150A1D; }
.mc-redact-body { font-size: 14.5px; line-height: 1.55; color: #DCC8DB; font-style: italic; transition: filter .55s ease, opacity .55s ease; }
.mc-redact-body.hidden { filter: blur(7px); opacity: .45; user-select: none; }
.mc-decrypt {
  position: absolute; inset: 0; display: grid; place-items: center; border: 0; cursor: pointer;
  background: rgba(21,10,29,.55); font-family: var(--mono); font-size: 10px; letter-spacing: .22em; color: var(--accent);
  transition: background .2s ease;
}
.mc-decrypt:hover { background: rgba(21,10,29,.25); }

/* timer */
.mc-timer { border-top: 1px solid var(--line); padding-top: 15px; }
.mc-clock { display: flex; align-items: center; gap: 14px; }
.mc-clock-face { font-family: var(--display); font-weight: 600; font-size: 46px; line-height: 1; font-variant-numeric: tabular-nums; color: var(--ink); transition: color .3s ease; }
.mc-clock-face.warn { color: var(--gold); }
.mc-clock-face.crit { color: var(--rose); animation: mc-throb 1s ease-in-out infinite; }
@keyframes mc-throb { 50% { opacity: .4 } }
.mc-dial { transform: rotate(-90deg); flex-shrink: 0; }
.mc-dial circle { fill: none; stroke-width: 4; stroke-linecap: round; }
.mc-controls { display: grid; grid-template-columns: 2fr 1fr; gap: 8px; margin-top: 13px; }
.mc-btn {
  appearance: none; cursor: pointer; border: 1px solid var(--line-hot); background: #1D0F27; color: var(--ink);
  font-family: var(--mono); font-size: 10.5px; letter-spacing: .18em; padding: 11px 8px;
  display: flex; align-items: center; justify-content: center; gap: 7px;
  transition: border-color .16s ease, color .16s ease, background .16s ease, transform .09s ease;
}
.mc-btn:hover { border-color: var(--accent); color: var(--accent); }
.mc-btn:active { transform: scale(.97); }
.mc-btn.go { border-color: var(--accent); color: var(--accent); background: color-mix(in srgb, var(--accent) 14%, transparent); }
.mc-btn[disabled] { opacity: .4; cursor: not-allowed; }

/* sparks */
.mc-spark { position: absolute; z-index: 5; pointer-events: none; width: 6px; height: 6px; border-radius: 50%; animation: mc-spark 1.1s ease-out forwards; }
@keyframes mc-spark {
  from { transform: translate(0,0) scale(1); opacity: 1 }
  to { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0 }
}

/* footer */
.mc-foot {
  margin-top: 30px; padding-top: 18px; border-top: 1px solid var(--line);
  display: flex; flex-wrap: wrap; gap: 14px; justify-content: space-between; align-items: center;
  font-family: var(--mono); font-size: 10px; letter-spacing: .2em; color: var(--muted);
}
.mc-ghost {
  appearance: none; background: transparent; border: 1px solid var(--line); color: var(--muted);
  font-family: var(--mono); font-size: 10px; letter-spacing: .18em; padding: 9px 13px; cursor: pointer;
  display: inline-flex; align-items: center; gap: 8px; transition: color .16s ease, border-color .16s ease;
}
.mc-ghost:hover { color: var(--gold); border-color: var(--gold); }
.mc-ghost:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }

.mc-confetti { position: fixed; inset: 0; z-index: 90; pointer-events: none; }

@media (prefers-reduced-motion: reduce) {
  .mc-root *, .mc-root *::before, .mc-root *::after {
    animation-duration: .001ms !important; animation-iteration-count: 1 !important; transition-duration: .001ms !important;
  }
}
`;

/* ── audio ───────────────────────────────────────── */
function useAudio(muted) {
  const ctxRef = useRef(null);
  const ctx = () => {
    if (typeof window === "undefined") return null;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctxRef.current) ctxRef.current = new AC();
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return ctxRef.current;
  };
  return useCallback(
    (kind) => {
      if (muted) return;
      const ac = ctx();
      if (!ac) return;
      const now = ac.currentTime;
      const tone = (f, s, d, type = "sine", vol = 0.15) => {
        const osc = ac.createOscillator();
        const g = ac.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(f, now + s);
        g.gain.setValueAtTime(0.0001, now + s);
        g.gain.exponentialRampToValueAtTime(vol, now + s + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, now + s + d);
        osc.connect(g).connect(ac.destination);
        osc.start(now + s);
        osc.stop(now + s + d + 0.02);
      };
      if (kind === "key") tone(1046.5, 0, 0.05, "triangle", 0.05);
      if (kind === "denied") { tone(180, 0, 0.18, "sawtooth", 0.1); tone(130, 0.16, 0.24, "sawtooth", 0.1); }
      if (kind === "granted") {
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.1, 0.4, "triangle", 0.14));
        tone(1318.5, 0.42, 1.0, "sine", 0.11);
      }
      if (kind === "seal") { tone(392, 0, 0.13, "triangle", 0.11); tone(587.33, 0.12, 0.22, "triangle", 0.12); tone(880, 0.28, 0.55, "sine", 0.1); }
      if (kind === "whoosh") { tone(320, 0, 0.35, "sine", 0.07); tone(640, 0.05, 0.3, "sine", 0.05); }
      if (kind === "tick") tone(1400, 0, 0.06, "triangle", 0.09);
      if (kind === "buzz") [0, 0.22, 0.44].forEach((s) => tone(240, s, 0.16, "square", 0.13));
      if (kind === "claim") { tone(659.25, 0, 0.09, "triangle", 0.11); tone(987.77, 0.08, 0.18, "triangle", 0.11); }
    },
    [muted]
  );
}

const reduceMotion = () =>
  typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ── confetti ────────────────────────────────────── */
function Confetti({ run }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!run || reduceMotion()) return;
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth, H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.width = W + "px"; cv.style.height = H + "px";
    ctx.scale(dpr, dpr);
    const colors = ["#FF5FA2", "#F2C879", "#BE8CFF", "#FFFFFF", "#FF87BC"];
    const bits = Array.from({ length: 110 }, () => ({
      x: W / 2 + (Math.random() - 0.5) * 160, y: H / 2 + (Math.random() - 0.5) * 60,
      vx: (Math.random() - 0.5) * 8.5, vy: Math.random() * -9.5 - 2,
      w: 2 + Math.random() * 5, h: 4 + Math.random() * 9,
      rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.32,
      c: colors[(Math.random() * colors.length) | 0], life: 1,
    }));
    let raf;
    const start = performance.now();
    const loop = (t) => {
      const el = t - start;
      ctx.clearRect(0, 0, W, H);
      bits.forEach((b) => {
        b.vy += 0.23; b.vx *= 0.99; b.x += b.vx; b.y += b.vy; b.rot += b.vr;
        b.life = Math.max(0, 1 - el / 2800);
        ctx.save(); ctx.globalAlpha = b.life; ctx.translate(b.x, b.y); ctx.rotate(b.rot);
        ctx.fillStyle = b.c; ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h); ctx.restore();
      });
      if (el < 3000) raf = requestAnimationFrame(loop);
      else ctx.clearRect(0, 0, W, H);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [run]);
  if (!run) return null;
  return <canvas ref={ref} className="mc-confetti" aria-hidden="true" />;
}

/* ── keypad ──────────────────────────────────────── */
function Keypad({ onSolved, beep }) {
  const CODE = String(MISSION_CONFIG.accessCode);
  const LEN = CODE.length;
  const [entry, setEntry] = useState("");
  const [state, setState] = useState("idle");
  const [attempts, setAttempts] = useState(0);
  const t1 = useRef(null), t2 = useRef(null);

  useEffect(() => () => { clearTimeout(t1.current); clearTimeout(t2.current); }, []);

  const press = (d) => {
    if (state === "checking" || entry.length >= LEN) return;
    beep("key");
    const next = entry + d;
    setState("idle");
    setEntry(next);
    if (next.length === LEN) {
      setState("checking");
      t1.current = setTimeout(() => {
        if (next === CODE) { beep("granted"); onSolved(); }
        else {
          beep("denied"); setState("denied"); setAttempts((a) => a + 1);
          t2.current = setTimeout(() => { setEntry(""); setState("idle"); }, 950);
        }
      }, 430);
    }
  };
  const back = () => { if (state === "checking") return; beep("key"); setState("idle"); setEntry((e) => e.slice(0, -1)); };
  const clear = () => { if (state === "checking") return; beep("key"); setState("idle"); setEntry(""); };

  useEffect(() => {
    const onKey = (e) => {
      if (/^[0-9]$/.test(e.key)) press(e.key);
      else if (e.key === "Backspace") back();
      else if (e.key === "Escape") clear();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const left = LEN - entry.length;
  const msg = state === "checking" ? "VERIFYING…"
    : state === "denied" ? `NOT QUITE — ATTEMPT ${attempts}`
    : entry.length === 0 ? `AWAITING ${LEN}-DIGIT CODE`
    : `${left} DIGIT${left === 1 ? "" : "S"} TO GO`;

  return (
    <section className="mc-plate mc-pad" style={{ "--accent": "#FF5FA2" }} aria-label="Security keypad">
      <div className="mc-eyebrow" style={{ textAlign: "center" }}>Clearance terminal</div>
      <div className={`mc-slots ${state === "denied" ? "shake" : ""}`}>
        {Array.from({ length: LEN }).map((_, i) => (
          <div key={i} className={`mc-slot ${entry[i] ? "filled" : ""} ${state === "denied" ? "err" : ""}`} aria-label={`Digit ${i + 1}`}>
            {entry[i] ? entry[i] : <span className="dot" />}
          </div>
        ))}
      </div>
      <div className="mc-keys">
        {["1","2","3","4","5","6","7","8","9"].map((d) => (
          <button key={d} className="mc-key" onClick={() => press(d)} disabled={state === "checking"}>{d}</button>
        ))}
        <button className="mc-key util" onClick={clear} disabled={state === "checking"}>CLR</button>
        <button className="mc-key" onClick={() => press("0")} disabled={state === "checking"}>0</button>
        <button className="mc-key util" onClick={back} disabled={state === "checking"} aria-label="Delete last digit"><Delete size={17} /></button>
      </div>
      <div className={`mc-status ${state === "denied" ? "bad" : state === "checking" ? "good" : ""}`} role="status" aria-live="polite">{msg}</div>
    </section>
  );
}

/* ── countdown (state lives in App so it survives closing the file) ── */
function useCountdown(beep) {
  const TOTAL = MISSION_CONFIG.challengeSeconds * 1000;
  const [remaining, setRemaining] = useState(TOTAL);
  const [running, setRunning] = useState(false);
  const endRef = useRef(0);
  const flags = useRef({ warned: false, done: false });

  useEffect(() => {
    if (!running) return;
    endRef.current = Date.now() + remaining;
    const id = setInterval(() => {
      const leftMs = Math.max(0, endRef.current - Date.now());
      setRemaining(leftMs);
      if (leftMs <= 60000 && !flags.current.warned) { flags.current.warned = true; beep("tick"); }
      if (leftMs === 0 && !flags.current.done) { flags.current.done = true; beep("buzz"); setRunning(false); }
    }, 100);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  return {
    total: TOTAL, remaining, running,
    toggle: () => { beep("key"); if (remaining > 0) setRunning((r) => !r); },
    reset: () => { beep("key"); setRunning(false); flags.current = { warned: false, done: false }; setRemaining(TOTAL); },
  };
}

const pad = (n) => String(n).padStart(2, "0");

function Countdown({ clock }) {
  const { total, remaining, running, toggle, reset } = clock;
  const secs = Math.ceil(remaining / 1000);
  const R = 26, C = 2 * Math.PI * R;
  const pct = remaining / total;
  const tone = remaining === 0 ? "crit" : remaining <= 60000 ? "warn" : "";
  const stroke = remaining === 0 ? "#FF5FA2" : remaining <= 60000 ? "#F2C879" : "#BE8CFF";
  return (
    <div className="mc-timer">
      <div className="mc-eyebrow" style={{ marginBottom: 10 }}>
        {remaining === 0 ? "Time up · to the counter" : running ? "Clock running" : "Clock ready"}
      </div>
      <div className="mc-clock">
        <svg className="mc-dial" width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r={R} stroke="#3B2150" />
          <circle cx="32" cy="32" r={R} stroke={stroke} strokeDasharray={C} strokeDashoffset={C * (1 - pct)}
            style={{ transition: "stroke-dashoffset .18s linear, stroke .3s ease" }} />
        </svg>
        <div className={`mc-clock-face ${tone}`} role="timer">{pad(Math.floor(secs / 60))}:{pad(secs % 60)}</div>
      </div>
      <div className="mc-controls">
        <button className={`mc-btn ${running ? "" : "go"}`} onClick={toggle} disabled={remaining === 0}>
          {running ? <Pause size={14} /> : <Play size={14} />}
          {running ? "PAUSE" : remaining === total ? "START" : "RESUME"}
        </button>
        <button className="mc-btn" onClick={reset}><RotateCcw size={14} />RESET</button>
      </div>
    </div>
  );
}

/* ── sealed tile on the 3D shelf ─────────────────── */
function FileTile({ file, index, state, onOpen }) {
  const tilt = [10, 0, -10][index] + "deg";
  const push = [-30, 20, -30][index] + "px";
  const isOpened = state === "opened";
  const locked = state === "locked";
  const Icon = file.icon;
  return (
    <div className="mc-tilewrap">
      <button
        className={`mc-tile ${state}`}
        style={{ "--accent": file.accent, "--ry": tilt, "--tz": push }}
        onClick={() => onOpen(file.id)}
        disabled={locked}
        aria-label={locked ? `${file.title}, sealed` : `Open ${file.title}`}
      >
        <span className="mc-face-front">
          <span className="mc-corner tl" aria-hidden="true" />
          <span className="mc-corner br" aria-hidden="true" />
          <span className="mc-wax" aria-hidden="true">
            {isOpened ? <Icon size={30} strokeWidth={1.6} /> : <Lock size={30} strokeWidth={1.6} />}
          </span>
          <span className="mc-tile-op">{file.op}</span>
          <span className="mc-tile-title">{file.title}</span>
          <span className="mc-tile-cta">
            {isOpened ? <><Eye size={12} /> OPEN AGAIN</> : locked ? "SEALED · NO PICKS LEFT" : "TAP TO BREAK SEAL"}
          </span>
        </span>
      </button>
    </div>
  );
}

/* ── zoomed 3D file: flips from seal to contents ─── */
function FileModal({ file, onClose, claimed, onClaim, children }) {
  const [flipped, setFlipped] = useState(false);
  const [sparks, setSparks] = useState([]);
  const Icon = file.icon;

  useEffect(() => {
    const instant = reduceMotion();
    const t = setTimeout(() => setFlipped(true), instant ? 0 : 620);
    if (!instant) {
      setSparks(Array.from({ length: 16 }, (_, i) => ({
        i, left: 18 + Math.random() * 64, top: 26 + Math.random() * 40,
        dx: (Math.random() - 0.5) * 260 + "px", dy: -80 - Math.random() * 200 + "px",
        c: ["#F2C879", "#FF5FA2", "#BE8CFF", "#FFFFFF"][i % 4],
      })));
      setTimeout(() => setSparks([]), 1400);
    }
    return () => clearTimeout(t);
  }, [file.id]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="mc-modal" style={{ "--accent": file.accent }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} role="dialog" aria-modal="true" aria-label={file.title}>
      <button className="mc-modal-close" onClick={onClose}><X size={13} /> CLOSE FILE</button>

      {sparks.map((s) => (
        <span key={s.i} className="mc-spark" style={{ left: s.left + "%", top: s.top + "%", background: s.c, "--dx": s.dx, "--dy": s.dy }} />
      ))}

      <div className="mc-flipwrap">
        <div className={`mc-flip ${flipped ? "flipped" : ""}`}>
          <div className="mc-face front">
            <span className="mc-corner tl" aria-hidden="true" />
            <span className="mc-corner br" aria-hidden="true" />
            <span className="mc-wax" aria-hidden="true"><Lock size={34} strokeWidth={1.6} /></span>
            <span className="mc-tile-op">{file.op}</span>
            <span className="mc-tile-title" style={{ fontSize: 34 }}>{file.title}</span>
            <span className="mc-tile-cta">BREAKING SEAL…</span>
          </div>

          <div className="mc-face back">
            <div className="mc-back-scroll">
              <div className="mc-card-top">
                <div>
                  <div className="mc-op">{file.op}</div>
                  <div style={{ marginTop: 8 }}><Icon size={22} className="mc-icon" strokeWidth={1.6} /></div>
                </div>
                <div className="mc-badge">{file.badge}</div>
              </div>
              <h3 className="mc-h3">{file.title}</h3>
              <div className="mc-body" style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
                {children}
                <button className={`mc-claim ${claimed ? "done" : ""}`} onClick={onClaim} disabled={claimed}>
                  {claimed ? <Check size={15} /> : <ChevronRight size={15} />}
                  {claimed ? "CLAIMED" : file.claimLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── app ─────────────────────────────────────────── */
export default function MissionClearance() {
  const [stage, setStage] = useState("locked");
  const [muted, setMuted] = useState(false);
  const [opened, setOpened] = useState([]);
  const [claimed, setClaimed] = useState({});
  const [active, setActive] = useState(null);
  const [zooming, setZooming] = useState(null);
  const [decrypted, setDecrypted] = useState(false);
  const beep = useAudio(muted);
  const clock = useCountdown(beep);

  const MAX = MISSION_CONFIG.picksAllowed;
  const picksLeft = MAX - opened.length;
  const { targetAmount: T, tolerance: TOL } = MISSION_CONFIG;
  const money = (n) => "₹" + n.toLocaleString("en-IN");
  const stamp = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();

  const FILES = [
    { id: "glow", accent: "#FF5FA2", op: "FILE 01", badge: "LEVEL 1 CLEARANCE", title: "Operation Glow Up", icon: Sparkles, claimLabel: "CLAIM MISSION" },
    { id: "frozen", accent: "#F2C879", op: "FILE 02 · TOP SECRET", badge: "IN TRANSIT / EN ROUTE", title: "Project Frozen Time", icon: Gift, claimLabel: "TRACK PACKAGE" },
    { id: "target", accent: "#BE8CFF", op: "FILE 03", badge: "HIGH STAKES", title: "Operation Target Price", icon: Target, claimLabel: "ACCEPT CHALLENGE" },
  ];

  const tileState = (id) =>
    zooming === id ? "zooming" : zooming ? "receding" : opened.includes(id) ? "opened" : picksLeft > 0 ? "sealed" : "locked";

  const openFile = (id) => {
    const isNew = !opened.includes(id);
    if (isNew && picksLeft <= 0) return;
    beep(isNew ? "seal" : "whoosh");
    setZooming(id);
    setTimeout(() => {
      if (isNew) setOpened((o) => (o.includes(id) ? o : [...o, id]));
      setActive(id);
      setZooming(null);
    }, reduceMotion() ? 0 : 480);
  };

  const closeFile = () => { beep("key"); setActive(null); };

  const bodyFor = (id) => {
    if (id === "glow")
      return (
        <>
          <p>Full makeup kit upgrade. Pick your high-end foundation, palette or brush set — funded in full.</p>
          <div className="mc-rule">
            BUDGET · <b>UNCAPPED</b><br />
            EXPIRY · <b>NONE</b><br />
            ESCORT · <b>PROVIDED ON REQUEST</b>
          </div>
        </>
      );
    if (id === "frozen")
      return (
        <>
          <p>A high-value device is already moving through secure courier. Contents stay withheld until handover.</p>
          <div className="mc-redact">
            <div className={`mc-redact-body ${decrypted ? "" : "hidden"}`}>
              “Captures memories instantly in your hands, with a retro aesthetic. Arrival expected soon.”
            </div>
            {!decrypted && (
              <button className="mc-decrypt" onClick={() => { beep("key"); setDecrypted(true); }}>TAP TO DECRYPT</button>
            )}
          </div>
          <div className="mc-rule">
            STATUS · <b>EN ROUTE</b><br />
            HANDOVER · <b>IN PERSON ONLY</b>
          </div>
        </>
      );
    return (
      <>
        <p>The exact price match challenge. Seven minutes on the clock.</p>
        <div>
          <div className="mc-eyebrow">Target at checkout</div>
          <div className="mc-amount">{money(T)}</div>
          <div className="mc-range">ACCEPTED · {money(T - TOL)} — {money(T + TOL)}</div>
        </div>
        <div className="mc-rule">
          Fill the basket in <b>7 minutes</b>. The checkout total has to land between <b>{money(T - TOL)}</b> and{" "}
          <b>{money(T + TOL)}</b>. Hit <b>exactly {money(T)}</b> and a bonus item unlocks.
        </div>
        <Countdown clock={clock} />
      </>
    );
  };

  const activeFile = FILES.find((f) => f.id === active);

  return (
    <div className="mc-root">
      <style>{CSS}</style>
      <div className="mc-field" aria-hidden="true" />
      <div className="mc-stars" aria-hidden="true" />

      <div className="mc-ticker" aria-hidden="true">
        <div className="mc-ticker-track">
          {[0, 1].map((k) => (
            <React.Fragment key={k}>
              <span>CLASSIFIED · FOR THE BIRTHDAY GIRL ONLY</span>
              <span>THREE SEALS · TWO PICKS</span>
              <span>HANDLE WITH GLITTER</span>
              <span>FILE {stamp}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <Confetti run={stage !== "locked"} />

      {stage === "granted" && (
        <div className="mc-granted">
          <div className="mc-ring" aria-hidden="true" />
          <div className="mc-ring d2" aria-hidden="true" />
          <div className="mc-ring d3" aria-hidden="true" />
          <div>
            <h2>Access granted</h2>
            <p>THREE SEALED FILES RECOVERED</p>
          </div>
        </div>
      )}

      {activeFile && (
        <FileModal
          file={activeFile}
          onClose={closeFile}
          claimed={!!claimed[activeFile.id]}
          onClaim={() => { beep("claim"); setClaimed((c) => ({ ...c, [activeFile.id]: true })); }}
        >
          {bodyFor(activeFile.id)}
        </FileModal>
      )}

      <main className="mc-shell">
        {stage === "locked" ? (
          <>
            <header className="mc-hero">
              <div className="mc-stamp"><Lock size={12} /> TOP SECRET</div>
              <h1 className="mc-title">Birthday Mission<em>Clearance</em></h1>
              <p className="mc-sub">FOUR DIGITS · THREE SEALED FILES · FILE {stamp}</p>
            </header>

            <div className="mc-lockgrid">
              <Keypad onSolved={() => { setStage("granted"); setTimeout(() => setStage("open"), 2000); }} beep={beep} />
              <section className="mc-plate mc-hints" style={{ "--accent": "#BE8CFF" }}>
                <div className="mc-eyebrow">Your clues</div>
                <div style={{ marginTop: 4 }}>
                  {MISSION_CONFIG.hints.map((h, i) => (
                    <div className="mc-hint" key={i}>
                      <div className="mc-hint-idx">{h.label}</div>
                      <div className="mc-hint-txt">{h.text}</div>
                    </div>
                  ))}
                </div>
                <div className="mc-note">
                  Months count as their number — January is 1, December is 12. Enter the four digits in order.
                  A keyboard works too: numbers to type, backspace to fix, escape to wipe.
                </div>
              </section>
            </div>

            <div className="mc-foot">
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><Heart size={12} /> SEALED WITH LOVE</span>
              <button className="mc-ghost" onClick={() => setMuted((m) => !m)}>
                {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}{muted ? "SOUND OFF" : "SOUND ON"}
              </button>
            </div>
          </>
        ) : (
          <>
            <header className="mc-head">
              <div>
                <div className="mc-live mc-eyebrow"><span className="mc-blip" /> Clearance granted</div>
                <h1>Happy birthday,<em>{MISSION_CONFIG.agentName}</em></h1>
              </div>
              <div className="mc-meta">
                THREE FILES RECOVERED<br />{MAX} MAY BE OPENED<br />FILE {stamp}
              </div>
            </header>

            <div className="mc-quota">
              <div className="mc-quota-txt">
                {picksLeft > 0 ? (
                  <>Break the wax on <b>any {picksLeft}</b> {picksLeft === 1 ? "more file" : "files"}. Choose carefully — the third stays sealed.</>
                ) : (
                  <>Both picks spent. The last file keeps its secret.</>
                )}
              </div>
              <div className="mc-pips">
                PICKS
                {Array.from({ length: MAX }).map((_, i) => (
                  <span key={i} className={`mc-pip ${i < opened.length ? "used" : ""}`} />
                ))}
              </div>
            </div>

            <div className="mc-shelf">
              {FILES.map((f, i) => (
                <FileTile key={f.id} file={f} index={i} state={tileState(f.id)} onOpen={openFile} />
              ))}
            </div>

            <div className="mc-foot">
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><Heart size={12} /> SEALED WITH LOVE</span>
              <span style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button className="mc-ghost" onClick={() => setMuted((m) => !m)}>
                  {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}{muted ? "SOUND OFF" : "SOUND ON"}
                </button>
                <button className="mc-ghost" onClick={() => { setStage("locked"); setOpened([]); setClaimed({}); setActive(null); setDecrypted(false); }}>
                  <Lock size={13} /> RESEAL EVERYTHING
                </button>
              </span>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
