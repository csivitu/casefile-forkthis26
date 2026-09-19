import { useState, useRef } from "react";
import {
  CASE,
  SUSPECTS,
  EVIDENCE,
  TIMELINE,
  type Suspect,
  type Evidence,
  type TimelineEvent,
} from "./data";

// ─── Suspect portraits (SVG bust silhouettes, obscured faces) ─────────────────
const PORTRAITS: Record<string, React.ReactNode> = {
  S01: ( // Alex Morgan — Security Officer — broader shoulders, uniform collar, cap
    <svg viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {/* sepia photo background */}
      <rect width="160" height="200" fill="#D6C4A8"/>
      {/* vignette border */}
      <rect x="0" y="0" width="160" height="200" fill="none" stroke="#8A6A44" strokeWidth="6" opacity="0.3"/>
      {/* torso/uniform */}
      <path d="M30 200 Q30 155 45 145 L55 138 L80 150 L105 138 L115 145 Q130 155 130 200Z" fill="#3A2D1E"/>
      {/* collar/lapels */}
      <path d="M55 138 L70 158 L80 150 L90 158 L105 138 L95 132 L80 142 L65 132Z" fill="#2B211B"/>
      {/* neck */}
      <rect x="70" y="110" width="20" height="28" rx="6" fill="#5A3A28"/>
      {/* cap brim */}
      <ellipse cx="80" cy="75" rx="42" ry="8" fill="#2B211B"/>
      {/* cap top */}
      <path d="M48 75 Q50 52 80 50 Q110 52 112 75Z" fill="#2B211B"/>
      {/* obscured face oval */}
      <ellipse cx="80" cy="95" rx="28" ry="32" fill="#1A1208"/>
      {/* grain overlay suggestion */}
      <ellipse cx="80" cy="100" rx="55" ry="70" fill="none" stroke="#8A6A44" strokeWidth="1" opacity="0.15"/>
    </svg>
  ),
  S02: ( // Daniel Reed — Research Assistant — younger, open collar, slight build
    <svg viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <rect width="160" height="200" fill="#D6C4A8"/>
      <rect x="0" y="0" width="160" height="200" fill="none" stroke="#8A6A44" strokeWidth="6" opacity="0.3"/>
      {/* torso/jacket */}
      <path d="M38 200 Q35 158 50 148 L62 140 L80 152 L98 140 L110 148 Q125 158 122 200Z" fill="#4A3A28"/>
      {/* shirt/open collar */}
      <path d="M62 140 L73 162 L80 152 L87 162 L98 140 L90 133 L80 143 L70 133Z" fill="#E8DCC4" opacity="0.7"/>
      {/* neck */}
      <rect x="72" y="112" width="16" height="26" rx="6" fill="#5A3A28"/>
      {/* hair — slightly longer sides */}
      <path d="M50 88 Q52 60 80 58 Q108 60 110 88 L107 90 Q108 70 80 68 Q52 70 53 90Z" fill="#2B211B"/>
      {/* obscured face */}
      <ellipse cx="80" cy="96" rx="26" ry="30" fill="#1A1208"/>
      <ellipse cx="80" cy="100" rx="50" ry="65" fill="none" stroke="#8A6A44" strokeWidth="1" opacity="0.15"/>
    </svg>
  ),
  S03: ( // Sarah Cole — Lab Manager — blouse with high collar, hair up
    <svg viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <rect width="160" height="200" fill="#D6C4A8"/>
      <rect x="0" y="0" width="160" height="200" fill="none" stroke="#8A6A44" strokeWidth="6" opacity="0.3"/>
      {/* torso/blouse */}
      <path d="M35 200 Q33 160 48 150 L60 142 L80 155 L100 142 L112 150 Q127 160 125 200Z" fill="#5A4A38"/>
      {/* high collar */}
      <path d="M68 142 L75 152 L80 155 L85 152 L92 142 L86 135 L80 140 L74 135Z" fill="#C8B898"/>
      {/* neck */}
      <rect x="72" y="112" width="16" height="26" rx="5" fill="#5A3A28"/>
      {/* hair up / bun */}
      <ellipse cx="80" cy="68" rx="28" ry="22" fill="#2B211B"/>
      <ellipse cx="80" cy="58" rx="10" ry="9" fill="#2B211B"/>
      {/* obscured face */}
      <ellipse cx="80" cy="95" rx="24" ry="28" fill="#1A1208"/>
      <ellipse cx="80" cy="100" rx="50" ry="65" fill="none" stroke="#8A6A44" strokeWidth="1" opacity="0.15"/>
    </svg>
  ),
  S04: ( // Michael Stone — Technician — stockier, work jacket, no tie
    <svg viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <rect width="160" height="200" fill="#D6C4A8"/>
      <rect x="0" y="0" width="160" height="200" fill="none" stroke="#8A6A44" strokeWidth="6" opacity="0.3"/>
      {/* broader torso */}
      <path d="M25 200 Q25 153 42 142 L58 133 L80 147 L102 133 L118 142 Q135 153 135 200Z" fill="#3A3028"/>
      {/* work jacket collar */}
      <path d="M58 133 L70 155 L80 147 L90 155 L102 133 L94 126 L80 138 L66 126Z" fill="#2E2820"/>
      {/* neck, stockier */}
      <rect x="69" y="108" width="22" height="26" rx="5" fill="#5A3A28"/>
      {/* short cropped hair */}
      <path d="M52 88 Q53 63 80 61 Q107 63 108 88 Q108 74 80 72 Q52 74 52 88Z" fill="#2B211B"/>
      {/* obscured face */}
      <ellipse cx="80" cy="96" rx="27" ry="30" fill="#1A1208"/>
      <ellipse cx="80" cy="100" rx="55" ry="68" fill="none" stroke="#8A6A44" strokeWidth="1" opacity="0.15"/>
    </svg>
  ),
  S05: ( // Emily Carter — Researcher — lighter jacket, hair down
    <svg viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <rect width="160" height="200" fill="#D6C4A8"/>
      <rect x="0" y="0" width="160" height="200" fill="none" stroke="#8A6A44" strokeWidth="6" opacity="0.3"/>
      {/* torso/jacket */}
      <path d="M38 200 Q36 158 50 148 L62 140 L80 153 L98 140 L110 148 Q124 158 122 200Z" fill="#6A5A48"/>
      {/* lapels */}
      <path d="M62 140 L72 158 L80 153 L88 158 L98 140 L90 132 L80 142 L70 132Z" fill="#4A3828"/>
      {/* neck */}
      <rect x="72" y="112" width="16" height="26" rx="6" fill="#5A3A28"/>
      {/* hair down — sides */}
      <path d="M50 90 Q46 115 48 145 L55 140 Q52 115 54 90Z" fill="#2B211B"/>
      <path d="M110 90 Q114 115 112 145 L105 140 Q108 115 106 90Z" fill="#2B211B"/>
      {/* hair top */}
      <path d="M52 88 Q53 62 80 60 Q107 62 108 88 L106 90 Q108 68 80 66 Q52 68 54 90Z" fill="#2B211B"/>
      {/* obscured face */}
      <ellipse cx="80" cy="95" rx="25" ry="29" fill="#1A1208"/>
      <ellipse cx="80" cy="100" rx="50" ry="65" fill="none" stroke="#8A6A44" strokeWidth="1" opacity="0.15"/>
    </svg>
  ),
};

// ─── Blueprint floor plan backgrounds ────────────────────────────────────────
const BLUEPRINTS: Record<string, React.ReactNode> = {
  "South Corridor": (
    <svg viewBox="0 0 300 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {/* long corridor */}
      <rect x="10" y="30" width="280" height="60" stroke="#4A3024" strokeWidth="1.5" fill="none"/>
      {/* centre line */}
      <line x1="10" y1="60" x2="290" y2="60" stroke="#4A3024" strokeWidth="0.5" strokeDasharray="8 5"/>
      {/* door openings */}
      <path d="M50 30 L50 20 A20 20 0 0 1 70 30" stroke="#4A3024" strokeWidth="1" fill="none"/>
      <path d="M110 90 L110 100 A20 20 0 0 0 130 90" stroke="#4A3024" strokeWidth="1" fill="none"/>
      <path d="M190 30 L190 20 A20 20 0 0 1 210 30" stroke="#4A3024" strokeWidth="1" fill="none"/>
      <path d="M240 90 L240 100 A20 20 0 0 0 260 90" stroke="#4A3024" strokeWidth="1" fill="none"/>
      {/* wall hatching */}
      {[12,18,24,30,36,42,48,54,60,66].map(x => (
        <line key={x} x1={x} y1="30" x2={x-5} y2="22" stroke="#4A3024" strokeWidth="0.5"/>
      ))}
      {[260,266,272,278,284].map(x => (
        <line key={x} x1={x} y1="30" x2={x-5} y2="22" stroke="#4A3024" strokeWidth="0.5"/>
      ))}
      {/* label */}
      <text x="145" y="16" fontFamily="Courier Prime, monospace" fontSize="9" fill="#4A3024" textAnchor="middle" letterSpacing="2">SOUTH CORRIDOR</text>
    </svg>
  ),
  "Security Office": (
    <svg viewBox="0 0 300 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {/* main room */}
      <rect x="20" y="20" width="160" height="120" stroke="#4A3024" strokeWidth="1.5" fill="none"/>
      {/* desk */}
      <rect x="50" y="50" width="80" height="40" stroke="#4A3024" strokeWidth="1" fill="none"/>
      <rect x="55" y="85" width="20" height="10" stroke="#4A3024" strokeWidth="0.8" fill="none"/>
      {/* chair arc */}
      <path d="M75 90 A25 15 0 0 0 125 90" stroke="#4A3024" strokeWidth="0.8" fill="none"/>
      {/* door */}
      <line x1="20" y1="110" x2="20" y2="140" stroke="#4A3024" strokeWidth="1.5"/>
      <path d="M20 110 A30 30 0 0 1 50 110" stroke="#4A3024" strokeWidth="1" fill="none"/>
      {/* monitor on desk */}
      <rect x="80" y="54" width="22" height="14" stroke="#4A3024" strokeWidth="0.8" fill="none"/>
      <line x1="91" y1="68" x2="91" y2="74" stroke="#4A3024" strokeWidth="0.8"/>
      {/* terminal */}
      <rect x="165" y="30" width="110" height="80" stroke="#4A3024" strokeWidth="1" strokeDasharray="4 3" fill="none"/>
      <text x="220" y="74" fontFamily="Courier Prime, monospace" fontSize="7" fill="#4A3024" textAnchor="middle">TERMINAL</text>
      {/* wall hatching */}
      {[22,28,34,40,46].map(y => (
        <line key={y} x1="20" y1={y} x2="12" y2={y-6} stroke="#4A3024" strokeWidth="0.5"/>
      ))}
      <text x="100" y="158" fontFamily="Courier Prime, monospace" fontSize="9" fill="#4A3024" textAnchor="middle" letterSpacing="2">SECURITY OFFICE</text>
    </svg>
  ),
  "Storage Room": (
    <svg viewBox="0 0 300 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {/* main room */}
      <rect x="30" y="20" width="140" height="130" stroke="#4A3024" strokeWidth="1.5" fill="none"/>
      {/* shelving units */}
      <rect x="40" y="30" width="16" height="80" stroke="#4A3024" strokeWidth="1" fill="none"/>
      <line x1="40" y1="50" x2="56" y2="50" stroke="#4A3024" strokeWidth="0.7"/>
      <line x1="40" y1="70" x2="56" y2="70" stroke="#4A3024" strokeWidth="0.7"/>
      <line x1="40" y1="90" x2="56" y2="90" stroke="#4A3024" strokeWidth="0.7"/>
      <rect x="62" y="30" width="16" height="80" stroke="#4A3024" strokeWidth="1" fill="none"/>
      <line x1="62" y1="50" x2="78" y2="50" stroke="#4A3024" strokeWidth="0.7"/>
      <line x1="62" y1="70" x2="78" y2="70" stroke="#4A3024" strokeWidth="0.7"/>
      <line x1="62" y1="90" x2="78" y2="90" stroke="#4A3024" strokeWidth="0.7"/>
      <rect x="84" y="30" width="16" height="80" stroke="#4A3024" strokeWidth="1" fill="none"/>
      <line x1="84" y1="50" x2="100" y2="50" stroke="#4A3024" strokeWidth="0.7"/>
      <line x1="84" y1="70" x2="100" y2="70" stroke="#4A3024" strokeWidth="0.7"/>
      <line x1="84" y1="90" x2="100" y2="90" stroke="#4A3024" strokeWidth="0.7"/>
      {/* vault indicator adjacent */}
      <rect x="200" y="40" width="80" height="80" stroke="#4A3024" strokeWidth="1.5" strokeDasharray="5 3" fill="none"/>
      <text x="240" y="78" fontFamily="Courier Prime, monospace" fontSize="7" fill="#4A3024" textAnchor="middle">PROTOTYPE</text>
      <text x="240" y="88" fontFamily="Courier Prime, monospace" fontSize="7" fill="#4A3024" textAnchor="middle">VAULT</text>
      {/* door */}
      <line x1="30" y1="120" x2="30" y2="150" stroke="#4A3024" strokeWidth="1.5"/>
      <path d="M30 120 A30 30 0 0 1 60 120" stroke="#4A3024" strokeWidth="1" fill="none"/>
      <text x="100" y="168" fontFamily="Courier Prime, monospace" fontSize="9" fill="#4A3024" textAnchor="middle" letterSpacing="2">STORAGE ROOM</text>
    </svg>
  ),
  "Main Entrance": (
    <svg viewBox="0 0 300 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {/* entrance hall */}
      <rect x="80" y="10" width="140" height="80" stroke="#4A3024" strokeWidth="1.5" fill="none"/>
      {/* double doors */}
      <line x1="125" y1="90" x2="125" y2="90" stroke="#4A3024" strokeWidth="1.5"/>
      <line x1="175" y1="90" x2="175" y2="90" stroke="#4A3024" strokeWidth="1.5"/>
      <path d="M125 90 A25 25 0 0 0 150 65" stroke="#4A3024" strokeWidth="1" fill="none"/>
      <path d="M175 90 A25 25 0 0 1 150 65" stroke="#4A3024" strokeWidth="1" fill="none"/>
      <line x1="125" y1="90" x2="175" y2="90" stroke="#4A3024" strokeWidth="1.5"/>
      {/* guard post */}
      <rect x="90" y="20" width="35" height="30" stroke="#4A3024" strokeWidth="1" fill="none"/>
      <text x="107" y="38" fontFamily="Courier Prime, monospace" fontSize="6" fill="#4A3024" textAnchor="middle">GUARD</text>
      {/* badge reader */}
      <rect x="168" y="22" width="12" height="18" rx="2" stroke="#4A3024" strokeWidth="0.8" fill="none"/>
      {/* corridor connecting */}
      <rect x="100" y="90" width="100" height="50" stroke="#4A3024" strokeWidth="1.5" fill="none"/>
      <line x1="150" y1="90" x2="150" y2="140" stroke="#4A3024" strokeWidth="0.5" strokeDasharray="6 4"/>
      {/* steps outside */}
      <line x1="90" y1="8" x2="210" y2="8" stroke="#4A3024" strokeWidth="1"/>
      <line x1="85" y1="4" x2="215" y2="4" stroke="#4A3024" strokeWidth="0.7"/>
      <text x="150" y="165" fontFamily="Courier Prime, monospace" fontSize="9" fill="#4A3024" textAnchor="middle" letterSpacing="2">MAIN ENTRANCE</text>
    </svg>
  ),
  "Laboratory": (
    <svg viewBox="0 0 300 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {/* main lab room */}
      <rect x="20" y="15" width="200" height="130" stroke="#4A3024" strokeWidth="1.5" fill="none"/>
      {/* lab benches */}
      <rect x="30" y="25" width="80" height="25" stroke="#4A3024" strokeWidth="1" fill="none"/>
      <rect x="30" y="60" width="80" height="25" stroke="#4A3024" strokeWidth="1" fill="none"/>
      {/* equipment on benches */}
      <rect x="35" y="28" width="12" height="18" stroke="#4A3024" strokeWidth="0.7" fill="none"/>
      <rect x="52" y="28" width="8" height="18" stroke="#4A3024" strokeWidth="0.7" fill="none"/>
      <circle cx="75" cy="37" r="6" stroke="#4A3024" strokeWidth="0.7" fill="none"/>
      <rect x="35" y="63" width="20" height="18" stroke="#4A3024" strokeWidth="0.7" fill="none"/>
      <rect x="60" y="63" width="14" height="18" stroke="#4A3024" strokeWidth="0.7" fill="none"/>
      {/* spectrometer */}
      <rect x="130" y="25" width="70" height="35" stroke="#4A3024" strokeWidth="1" fill="none"/>
      <text x="165" y="46" fontFamily="Courier Prime, monospace" fontSize="6" fill="#4A3024" textAnchor="middle">SPECTROMETER</text>
      {/* secondary exit (no reader) */}
      <line x1="220" y1="60" x2="220" y2="100" stroke="#4A3024" strokeWidth="1.5"/>
      <text x="240" y="82" fontFamily="Courier Prime, monospace" fontSize="6" fill="#4A3024">EXIT*</text>
      {/* door */}
      <path d="M20 115 A30 30 0 0 1 50 115" stroke="#4A3024" strokeWidth="1" fill="none"/>
      <line x1="20" y1="115" x2="20" y2="145" stroke="#4A3024" strokeWidth="1.5"/>
      <text x="120" y="162" fontFamily="Courier Prime, monospace" fontSize="9" fill="#4A3024" textAnchor="middle" letterSpacing="2">LABORATORY</text>
    </svg>
  ),
  "Prototype Vault": (
    <svg viewBox="0 0 300 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {/* vault room */}
      <rect x="80" y="20" width="140" height="120" stroke="#4A3024" strokeWidth="2" fill="none"/>
      {/* inner vault door */}
      <rect x="115" y="50" width="70" height="60" stroke="#4A3024" strokeWidth="1.5" fill="none"/>
      {/* vault door details */}
      <circle cx="150" cy="80" r="20" stroke="#4A3024" strokeWidth="1" fill="none"/>
      <circle cx="150" cy="80" r="10" stroke="#4A3024" strokeWidth="0.8" fill="none"/>
      <line x1="150" y1="60" x2="150" y2="70" stroke="#4A3024" strokeWidth="0.8"/>
      <line x1="150" y1="90" x2="150" y2="100" stroke="#4A3024" strokeWidth="0.8"/>
      <line x1="130" y1="80" x2="140" y2="80" stroke="#4A3024" strokeWidth="0.8"/>
      <line x1="160" y1="80" x2="170" y2="80" stroke="#4A3024" strokeWidth="0.8"/>
      {/* keypad */}
      <rect x="195" y="70" width="14" height="20" rx="2" stroke="#4A3024" strokeWidth="0.8" fill="none"/>
      <text x="202" y="83" fontFamily="Courier Prime, monospace" fontSize="5" fill="#4A3024" textAnchor="middle">KEY</text>
      {/* approach corridor */}
      <rect x="20" y="55" width="60" height="50" stroke="#4A3024" strokeWidth="1" fill="none"/>
      <line x1="80" y1="80" x2="115" y2="80" stroke="#4A3024" strokeWidth="0.5" strokeDasharray="5 4"/>
      <text x="150" y="162" fontFamily="Courier Prime, monospace" fontSize="9" fill="#4A3024" textAnchor="middle" letterSpacing="2">PROTOTYPE VAULT</text>
    </svg>
  ),
  "East Corridor": (
    <svg viewBox="0 0 300 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <rect x="10" y="28" width="280" height="60" stroke="#4A3024" strokeWidth="1.5" fill="none"/>
      <line x1="10" y1="58" x2="290" y2="58" stroke="#4A3024" strokeWidth="0.5" strokeDasharray="8 5"/>
      <path d="M60 28 L60 18 A20 20 0 0 1 80 28" stroke="#4A3024" strokeWidth="1" fill="none"/>
      <path d="M160 88 L160 98 A20 20 0 0 0 180 88" stroke="#4A3024" strokeWidth="1" fill="none"/>
      <path d="M220 28 L220 18 A20 20 0 0 1 240 28" stroke="#4A3024" strokeWidth="1" fill="none"/>
      {[12,18,24,30,36,42,48,54].map(x => (
        <line key={x} x1={x} y1="28" x2={x-5} y2="20" stroke="#4A3024" strokeWidth="0.5"/>
      ))}
      <text x="145" y="14" fontFamily="Courier Prime, monospace" fontSize="9" fill="#4A3024" textAnchor="middle" letterSpacing="2">EAST CORRIDOR</text>
    </svg>
  ),
};

function BlueprintBackground({ location }: { location: string }) {
  const bp = BLUEPRINTS[location];
  if (!bp) return null;
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        right: 0,
        width: "85%",
        maxWidth: 280,
        opacity: 0.055,
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {bp}
    </div>
  );
}

// ─── Colour tokens ───────────────────────────────────────────────────────────
const C = {
  parchment: "#E8DCC4",
  paper: "#F3E9D2",
  walnut: "#4A3024",
  leather: "#76543C",
  antique: "#A67C52",
  ink: "#2B211B",
  faded: "#6B5A4A",
  divider: "#C5B394",
  olive: "#5F7048",
  brick: "#8A4538",
};

// ─── Shared primitives ───────────────────────────────────────────────────────
function Divider() {
  return <hr style={{ borderColor: C.divider, borderTopWidth: 1, margin: "0" }} />;
}

function Tag({ children }: { children: string }) {
  return (
    <span
      style={{
        fontFamily: "'Courier Prime', monospace",
        fontSize: 11,
        color: C.antique,
        background: C.parchment,
        border: `1px solid ${C.divider}`,
        borderRadius: 2,
        padding: "1px 6px",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
}

function BackButton({ onBack, label = "Back" }: { onBack: () => void; label?: string }) {
  return (
    <button
      onClick={onBack}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: C.leather,
        fontFamily: "'Source Sans 3', sans-serif",
        fontSize: 14,
        fontWeight: 600,
        padding: 0,
        display: "flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      ← {label}
    </button>
  );
}

function PageHeader({
  title,
  subtitle,
  onBack,
  backLabel,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backLabel?: string;
}) {
  return (
    <div
      style={{
        padding: "20px 20px 16px",
        borderBottom: `1px solid ${C.divider}`,
        background: C.paper,
      }}
    >
      {onBack && (
        <div style={{ marginBottom: 10 }}>
          <BackButton onBack={onBack} label={backLabel} />
        </div>
      )}
      <h1
        style={{
          fontFamily: "'Lora', Georgia, serif",
          fontSize: 22,
          fontWeight: 600,
          color: C.walnut,
          margin: 0,
          lineHeight: 1.2,
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            margin: "4px 0 0",
            fontSize: 13,
            color: C.faded,
            fontFamily: "'Source Sans 3', sans-serif",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  fullWidth,
}: {
  children: string;
  onClick: () => void;
  fullWidth?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: C.walnut,
        color: "#F3E9D2",
        border: "none",
        borderRadius: 3,
        padding: "12px 24px",
        fontFamily: "'Source Sans 3', sans-serif",
        fontSize: 15,
        fontWeight: 600,
        cursor: "pointer",
        letterSpacing: "0.02em",
        width: fullWidth ? "100%" : "auto",
      }}
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  onClick,
}: {
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        color: C.leather,
        border: `1px solid ${C.leather}`,
        borderRadius: 3,
        padding: "9px 18px",
        fontFamily: "'Source Sans 3', sans-serif",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        letterSpacing: "0.02em",
      }}
    >
      {children}
    </button>
  );
}

function TextField({
  placeholder,
  value,
  onChange,
  multiline,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  const shared: React.CSSProperties = {
    width: "100%",
    background: C.paper,
    border: `1px solid ${C.divider}`,
    borderRadius: 3,
    padding: "10px 12px",
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: 14,
    color: C.ink,
    outline: "none",
    resize: "none",
  };
  if (multiline)
    return (
      <textarea
        rows={4}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={shared}
      />
    );
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={shared}
    />
  );
}

function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div style={{ padding: "12px 20px", background: C.paper, borderBottom: `1px solid ${C.divider}` }}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          background: C.parchment,
          border: `1px solid ${C.divider}`,
          borderRadius: 3,
          padding: "9px 12px",
          fontFamily: "'Source Sans 3', sans-serif",
          fontSize: 14,
          color: C.ink,
          outline: "none",
        }}
      />
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: "12px 20px" }}>
      <div
        style={{
          fontFamily: "'Courier Prime', monospace",
          fontSize: 11,
          color: C.antique,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 15, color: C.ink, lineHeight: 1.5 }}>
        {value}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          padding: "10px 20px 8px",
          fontFamily: "'Courier Prime', monospace",
          fontSize: 11,
          color: C.antique,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          background: C.parchment,
          borderBottom: `1px solid ${C.divider}`,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div style={{ padding: "40px 20px", textAlign: "center", color: C.faded, fontFamily: "'Source Sans 3', sans-serif", fontSize: 14 }}>
      {message}
    </div>
  );
}

// ─── Screen: Home ─────────────────────────────────────────────────────────────
function HomeScreen({ onOpen }: { onOpen: () => void }) {
  return (
    <div style={{ height: "100%", background: C.parchment, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div
        style={{
          background: C.walnut,
          padding: "36px 24px 28px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontFamily: "'Courier Prime', monospace",
            fontSize: 11,
            color: C.antique,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          Casefile
        </div>
        <h1
          style={{
            fontFamily: "'Lora', Georgia, serif",
            fontSize: 28,
            fontWeight: 600,
            color: "#F3E9D2",
            margin: 0,
            lineHeight: 1.15,
          }}
        >
          The Missing Prototype
        </h1>
        <div
          style={{
            marginTop: 8,
            fontFamily: "'Courier Prime', monospace",
            fontSize: 12,
            color: C.antique,
            letterSpacing: "0.06em",
          }}
        >
          CASE #{CASE.id}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px 32px" }}>
        {/* Status */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 20,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: C.olive,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "'Courier Prime', monospace",
              fontSize: 12,
              color: C.olive,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Investigation Active
          </span>
        </div>

        {/* Description */}
        <p
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: 15,
            color: C.faded,
            lineHeight: 1.65,
            margin: "0 0 28px",
          }}
        >
          {CASE.description}
        </p>

        {/* Stats */}
        <div
          style={{
            background: C.paper,
            border: `1px solid ${C.divider}`,
            borderRadius: 3,
            marginBottom: 28,
          }}
        >
          {[
            { label: "Suspects", value: "5" },
            { label: "Evidence Items", value: "12" },
            { label: "Timeline Events", value: "15" },
          ].map((s, i, arr) => (
            <div key={s.label}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 16px",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: 14,
                    color: C.faded,
                  }}
                >
                  {s.label}
                </span>
                <span
                  style={{
                    fontFamily: "'Lora', Georgia, serif",
                    fontSize: 18,
                    fontWeight: 600,
                    color: C.walnut,
                  }}
                >
                  {s.value}
                </span>
              </div>
              {i < arr.length - 1 && <Divider />}
            </div>
          ))}
        </div>

        <PrimaryButton onClick={onOpen} fullWidth>
          Open Case
        </PrimaryButton>
      </div>
    </div>
  );
}

// ─── Screen: Case Overview ────────────────────────────────────────────────────
type Section = "suspects" | "evidence" | "timeline" | "investigation";

function CaseOverviewScreen({
  onBack,
  onSection,
}: {
  onBack: () => void;
  onSection: (s: Section) => void;
}) {
  const sections: { key: Section; label: string; meta: string }[] = [
    { key: "suspects", label: "Suspects", meta: `${SUSPECTS.length} individuals under investigation` },
    { key: "evidence", label: "Evidence", meta: `${EVIDENCE.length} items catalogued` },
    { key: "timeline", label: "Timeline", meta: `${TIMELINE.length} events recorded` },
    { key: "investigation", label: "Investigation", meta: "Notes & conclusion" },
  ];

  return (
    <div style={{ height: "100%", background: C.parchment, display: "flex", flexDirection: "column" }}>
      <PageHeader
        title={`Case #${CASE.id}`}
        subtitle={CASE.title}
        onBack={onBack}
        backLabel="Home"
      />

      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Status band */}
        <div
          style={{
            padding: "12px 20px",
            background: C.paper,
            borderBottom: `1px solid ${C.divider}`,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.olive, display: "inline-block", flexShrink: 0 }} />
          <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: C.olive, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Investigation Active
          </span>
        </div>

        {/* Description */}
        <div style={{ padding: "20px 20px 4px" }}>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 14, color: C.faded, lineHeight: 1.6, margin: 0 }}>
            {CASE.description}
          </p>
        </div>

        {/* Section cards */}
        <div style={{ padding: "20px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
          {sections.map((sec) => (
            <button
              key={sec.key}
              onClick={() => onSection(sec.key)}
              style={{
                background: C.paper,
                border: `1px solid ${C.divider}`,
                borderRadius: 3,
                padding: "16px",
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 16, fontWeight: 600, color: C.walnut, marginBottom: 4 }}>
                  {sec.label}
                </div>
                <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 13, color: C.faded }}>
                  {sec.meta}
                </div>
              </div>
              <span style={{ color: C.antique, fontSize: 18, lineHeight: 1 }}>›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Suspects List ────────────────────────────────────────────────────
function SuspectsScreen({
  onBack,
  onSelect,
}: {
  onBack: () => void;
  onSelect: (s: Suspect) => void;
}) {
  const [query, setQuery] = useState("");
  const filtered = SUSPECTS.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.occupation.toLowerCase().includes(query.toLowerCase()) ||
      s.lastKnownLocation.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ height: "100%", background: C.parchment, display: "flex", flexDirection: "column" }}>
      <PageHeader title="Suspects" subtitle="Case #047 — The Missing Prototype" onBack={onBack} backLabel="Overview" />
      <SearchInput value={query} onChange={setQuery} placeholder="Search suspects…" />

      <div style={{ flex: 1, overflowY: "auto" }}>
        {filtered.length === 0 && <EmptyState message="No suspects match your search." />}
        {filtered.map((s, i) => (
          <div key={s.id}>
            <button
              onClick={() => onSelect(s)}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                padding: "14px 20px",
                display: "block",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 16, fontWeight: 600, color: C.walnut, marginBottom: 3 }}>
                    {s.name}
                  </div>
                  <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 13, color: C.faded, marginBottom: 3 }}>
                    {s.occupation}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: C.antique }}>Last seen:</span>
                    <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, color: C.faded }}>{s.lastKnownLocation}</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: C.antique }}>{s.id}</span>
                  <span style={{ color: C.antique, fontSize: 16 }}>›</span>
                </div>
              </div>
            </button>
            {i < filtered.length - 1 && <Divider />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Screen: Suspect Detail ───────────────────────────────────────────────────
function SuspectDetailScreen({
  suspect,
  onBack,
}: {
  suspect: Suspect;
  onBack: () => void;
}) {
  const relEvidence = EVIDENCE.filter((e) => suspect.relatedEvidence.includes(e.id));
  const portrait = PORTRAITS[suspect.id];

  return (
    <div style={{ height: "100%", background: C.parchment, display: "flex", flexDirection: "column" }}>
      <PageHeader title={suspect.name} subtitle={suspect.occupation} onBack={onBack} backLabel="Suspects" />

      {/* Portrait strip */}
      {portrait && (
        <div
          style={{
            background: C.walnut,
            padding: "16px 20px",
            borderBottom: `1px solid ${C.divider}`,
            display: "flex",
            alignItems: "flex-end",
            gap: 16,
          }}
        >
          {/* Portrait frame */}
          <div
            style={{
              width: 80,
              height: 100,
              flexShrink: 0,
              border: `2px solid ${C.antique}`,
              overflow: "hidden",
              position: "relative",
              background: "#D6C4A8",
            }}
          >
            {portrait}
            {/* Stamp overlay */}
            <div
              style={{
                position: "absolute",
                top: 4,
                right: 4,
                fontFamily: "'Courier Prime', monospace",
                fontSize: 8,
                color: C.brick,
                border: `1px solid ${C.brick}`,
                padding: "1px 3px",
                opacity: 0.7,
                letterSpacing: "0.04em",
                lineHeight: 1.2,
              }}
            >
              {suspect.id}
            </div>
          </div>
          {/* Identity caption */}
          <div style={{ paddingBottom: 4 }}>
            <div
              style={{
                fontFamily: "'Courier Prime', monospace",
                fontSize: 10,
                color: C.antique,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Identity Unconfirmed
            </div>
            <div
              style={{
                fontFamily: "'Lora', Georgia, serif",
                fontSize: 15,
                fontWeight: 600,
                color: "#F3E9D2",
                marginBottom: 2,
              }}
            >
              {suspect.name}
            </div>
            <div
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: 12,
                color: C.antique,
              }}
            >
              {suspect.occupation} · Age {suspect.age}
            </div>
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto" }}>
        <Section title="Profile">
          <DetailRow label="Suspect ID" value={suspect.id} />
          <Divider />
          <DetailRow label="Occupation" value={suspect.occupation} />
          <Divider />
          <DetailRow label="Age" value={String(suspect.age)} />
          <Divider />
          <DetailRow label="Last Known Location" value={suspect.lastKnownLocation} />
        </Section>

        <div style={{ height: 16 }} />

        <Section title="Statement">
          <div style={{ padding: "14px 20px" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 14, color: C.ink, lineHeight: 1.65, margin: 0, fontStyle: "italic" }}>
              "{suspect.statement}"
            </p>
          </div>
        </Section>

        <div style={{ height: 16 }} />

        <Section title="Alibi">
          <div style={{ padding: "14px 20px" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 14, color: C.faded, lineHeight: 1.65, margin: 0 }}>
              {suspect.alibi}
            </p>
          </div>
        </Section>

        {relEvidence.length > 0 && (
          <>
            <div style={{ height: 16 }} />
            <Section title="Related Evidence">
              {relEvidence.map((e, i) => (
                <div key={e.id}>
                  <div style={{ padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 12, color: C.antique, marginRight: 8 }}>{e.id}</span>
                      <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 14, color: C.ink }}>{e.title}</span>
                    </div>
                    <Tag>{e.type}</Tag>
                  </div>
                  {i < relEvidence.length - 1 && <Divider />}
                </div>
              ))}
            </Section>
          </>
        )}

        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

// ─── Screen: Evidence List ────────────────────────────────────────────────────
type EvidenceType = Evidence["type"] | "All";

function EvidenceScreen({
  onBack,
  onSelect,
}: {
  onBack: () => void;
  onSelect: (e: Evidence) => void;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<EvidenceType>("All");

  const types: EvidenceType[] = ["All", "CCTV", "Security Record", "Digital", "Physical", "Forensic"];

  const filtered = EVIDENCE.filter((e) => {
    const matchQ =
      e.title.toLowerCase().includes(query.toLowerCase()) ||
      e.id.toLowerCase().includes(query.toLowerCase()) ||
      e.location.toLowerCase().includes(query.toLowerCase());
    const matchF = filter === "All" || e.type === filter;
    return matchQ && matchF;
  });

  return (
    <div style={{ height: "100%", background: C.parchment, display: "flex", flexDirection: "column" }}>
      <PageHeader title="Evidence" subtitle="Case #047 — The Missing Prototype" onBack={onBack} backLabel="Overview" />
      <SearchInput value={query} onChange={setQuery} placeholder="Search evidence…" />

      {/* Filter row */}
      <div
        style={{
          padding: "10px 20px",
          background: C.paper,
          borderBottom: `1px solid ${C.divider}`,
          display: "flex",
          gap: 8,
          overflowX: "auto",
          flexShrink: 0,
        }}
      >
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            style={{
              background: filter === t ? C.walnut : C.parchment,
              color: filter === t ? "#F3E9D2" : C.faded,
              border: `1px solid ${filter === t ? C.walnut : C.divider}`,
              borderRadius: 2,
              padding: "5px 10px",
              fontFamily: "'Courier Prime', monospace",
              fontSize: 11,
              letterSpacing: "0.04em",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {filtered.length === 0 && <EmptyState message="No evidence matches your criteria." />}
        {filtered.map((e, i) => (
          <div key={e.id}>
            <button
              onClick={() => onSelect(e)}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                padding: "14px 20px",
                display: "block",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 12, color: C.antique, flexShrink: 0 }}>{e.id}</span>
                    <span style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 15, fontWeight: 600, color: C.walnut, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {e.title}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 12, color: C.faded }}>{e.time}</span>
                    <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, color: C.faded }}>{e.location}</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                  <Tag>{e.type}</Tag>
                  <span style={{ color: C.antique, fontSize: 16 }}>›</span>
                </div>
              </div>
            </button>
            {i < filtered.length - 1 && <Divider />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Screen: Evidence Detail ──────────────────────────────────────────────────
function EvidenceDetailScreen({
  evidence,
  onBack,
}: {
  evidence: Evidence;
  onBack: () => void;
}) {
  const relSuspects = SUSPECTS.filter((s) => evidence.relatedSuspects.includes(s.id));
  const relEvent = TIMELINE.find((t) => t.id === evidence.relatedEvent);

  return (
    <div style={{ height: "100%", background: C.parchment, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <BlueprintBackground location={evidence.location} />
      <PageHeader title={evidence.title} subtitle={`${evidence.id} · ${evidence.type}`} onBack={onBack} backLabel="Evidence" />

      <div style={{ flex: 1, overflowY: "auto" }}>
        <Section title="Details">
          <DetailRow label="Evidence ID" value={evidence.id} />
          <Divider />
          <DetailRow label="Classification" value={evidence.type} />
          <Divider />
          <DetailRow label="Recorded Time" value={evidence.time} />
          <Divider />
          <DetailRow label="Location" value={evidence.location} />
        </Section>

        <div style={{ height: 16 }} />

        <Section title="Description">
          <div style={{ padding: "14px 20px" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 14, color: C.ink, lineHeight: 1.65, margin: 0 }}>
              {evidence.description}
            </p>
          </div>
        </Section>

        {relSuspects.length > 0 && (
          <>
            <div style={{ height: 16 }} />
            <Section title="Related Suspects">
              {relSuspects.map((s, i) => (
                <div key={s.id}>
                  <div style={{ padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 12, color: C.antique, marginRight: 8 }}>{s.id}</span>
                      <span style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 15, fontWeight: 600, color: C.walnut }}>{s.name}</span>
                    </div>
                    <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, color: C.faded }}>{s.occupation}</span>
                  </div>
                  {i < relSuspects.length - 1 && <Divider />}
                </div>
              ))}
            </Section>
          </>
        )}

        {relEvent && (
          <>
            <div style={{ height: 16 }} />
            <Section title="Related Timeline Event">
              <div style={{ padding: "12px 20px" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 12, color: C.antique, flexShrink: 0, paddingTop: 2 }}>{relEvent.time}</span>
                  <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 14, color: C.ink, lineHeight: 1.4 }}>{relEvent.title}</span>
                </div>
              </div>
            </Section>
          </>
        )}

        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

// ─── Screen: Timeline ─────────────────────────────────────────────────────────
function TimelineScreen({
  onBack,
  onSelect,
}: {
  onBack: () => void;
  onSelect: (e: TimelineEvent) => void;
}) {
  return (
    <div style={{ height: "100%", background: C.parchment, display: "flex", flexDirection: "column" }}>
      <PageHeader title="Timeline" subtitle="Case #047 — Chronological Record" onBack={onBack} backLabel="Overview" />

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px" }}>
        <div style={{ position: "relative" }}>
          {/* Vertical line */}
          <div
            style={{
              position: "absolute",
              left: 54,
              top: 8,
              bottom: 8,
              width: 1,
              background: C.divider,
            }}
          />

          {TIMELINE.map((event, i) => (
            <button
              key={event.id}
              onClick={() => onSelect(event)}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                gap: 0,
                marginBottom: i < TIMELINE.length - 1 ? 16 : 0,
                padding: 0,
              }}
            >
              {/* Time */}
              <div
                style={{
                  width: 50,
                  flexShrink: 0,
                  paddingTop: 2,
                  fontFamily: "'Courier Prime', monospace",
                  fontSize: 11,
                  color: C.antique,
                  lineHeight: 1.3,
                  textAlign: "right",
                  paddingRight: 0,
                }}
              >
                {event.time.split(" ")[0]}
                <br />
                <span style={{ fontSize: 10 }}>{event.time.split(" ")[1]}</span>
              </div>

              {/* Node */}
              <div
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: C.antique,
                  border: `2px solid ${C.parchment}`,
                  flexShrink: 0,
                  marginTop: 4,
                  marginLeft: 0,
                  position: "relative",
                  zIndex: 1,
                  marginRight: 0,
                  alignSelf: "flex-start",
                }}
              />

              {/* Content */}
              <div
                style={{
                  flex: 1,
                  background: C.paper,
                  border: `1px solid ${C.divider}`,
                  borderRadius: 3,
                  padding: "10px 12px",
                  marginLeft: 12,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    color: C.walnut,
                    marginBottom: 3,
                    lineHeight: 1.3,
                  }}
                >
                  {event.title}
                </div>
                <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, color: C.faded }}>
                  {event.location}
                  {event.peopleInvolved.length > 0 && (
                    <span> · {event.peopleInvolved.map((id) => SUSPECTS.find((s) => s.id === id)?.name).filter(Boolean).join(", ")}</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Timeline Event Detail ───────────────────────────────────────────
function EventDetailScreen({
  event,
  onBack,
}: {
  event: TimelineEvent;
  onBack: () => void;
}) {
  const people = SUSPECTS.filter((s) => event.peopleInvolved.includes(s.id));
  const relEvidence = EVIDENCE.filter((e) => event.relatedEvidence.includes(e.id));

  return (
    <div style={{ height: "100%", background: C.parchment, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <BlueprintBackground location={event.location} />
      <PageHeader title={event.title} subtitle={event.time} onBack={onBack} backLabel="Timeline" />

      <div style={{ flex: 1, overflowY: "auto" }}>
        <Section title="Event Details">
          <DetailRow label="Time" value={event.time} />
          <Divider />
          <DetailRow label="Location" value={event.location} />
        </Section>

        <div style={{ height: 16 }} />

        <Section title="Description">
          <div style={{ padding: "14px 20px" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 14, color: C.ink, lineHeight: 1.65, margin: 0 }}>
              {event.description}
            </p>
          </div>
        </Section>

        {people.length > 0 && (
          <>
            <div style={{ height: 16 }} />
            <Section title="People Involved">
              {people.map((s, i) => (
                <div key={s.id}>
                  <div style={{ padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 12, color: C.antique, marginRight: 8 }}>{s.id}</span>
                      <span style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 15, fontWeight: 600, color: C.walnut }}>{s.name}</span>
                    </div>
                    <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, color: C.faded }}>{s.occupation}</span>
                  </div>
                  {i < people.length - 1 && <Divider />}
                </div>
              ))}
            </Section>
          </>
        )}

        {relEvidence.length > 0 && (
          <>
            <div style={{ height: 16 }} />
            <Section title="Related Evidence">
              {relEvidence.map((e, i) => (
                <div key={e.id}>
                  <div style={{ padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 12, color: C.antique, marginRight: 8 }}>{e.id}</span>
                      <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 14, color: C.ink }}>{e.title}</span>
                    </div>
                    <Tag>{e.type}</Tag>
                  </div>
                  {i < relEvidence.length - 1 && <Divider />}
                </div>
              ))}
            </Section>
          </>
        )}

        {people.length === 0 && relEvidence.length === 0 && (
          <>
            <div style={{ height: 16 }} />
            <EmptyState message="No persons or evidence directly linked to this event." />
          </>
        )}

        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

// ─── Screen: Investigation ────────────────────────────────────────────────────
type Note = { id: string; text: string; timestamp: string };

function InvestigationScreen({ onBack }: { onBack: () => void }) {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "n1",
      text: "The ten-minute camera gap is suspicious. Someone with technical knowledge likely caused it intentionally.",
      timestamp: "Added today",
    },
    {
      id: "n2",
      text: "Why did Sarah Cole delete the access report? What was she trying to hide?",
      timestamp: "Added today",
    },
  ]);
  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function addNote() {
    if (!newNote.trim()) return;
    setNotes((prev) => [
      ...prev,
      { id: Date.now().toString(), text: newNote.trim(), timestamp: "Just now" },
    ]);
    setNewNote("");
  }

  function startEdit(note: Note) {
    setEditingId(note.id);
    setEditText(note.text);
  }

  function saveEdit() {
    if (!editText.trim()) return;
    setNotes((prev) => prev.map((n) => (n.id === editingId ? { ...n, text: editText.trim() } : n)));
    setEditingId(null);
    setEditText("");
  }

  function deleteNote(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  function submitConclusion() {
    if (!selected) return;
    setSubmitted(true);
  }

  return (
    <div style={{ height: "100%", background: C.parchment, display: "flex", flexDirection: "column" }}>
      <PageHeader title="Investigation" subtitle="Case #047" onBack={onBack} backLabel="Overview" />

      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* ── Notes ── */}
        <Section title="Notes">
          <div style={{ padding: "14px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
            {notes.length === 0 && (
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 13, color: C.faded, margin: 0 }}>
                No notes yet.
              </p>
            )}
            {notes.map((note) => (
              <div
                key={note.id}
                style={{
                  background: C.paper,
                  border: `1px solid ${C.divider}`,
                  borderRadius: 3,
                  padding: "12px 14px",
                }}
              >
                {editingId === note.id ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <TextField value={editText} onChange={setEditText} placeholder="Edit note…" multiline />
                    <div style={{ display: "flex", gap: 8 }}>
                      <PrimaryButton onClick={saveEdit}>Save</PrimaryButton>
                      <SecondaryButton onClick={() => setEditingId(null)}>Cancel</SecondaryButton>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 14, color: C.ink, lineHeight: 1.55, margin: "0 0 8px" }}>
                      {note.text}
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: C.antique }}>{note.timestamp}</span>
                      <div style={{ display: "flex", gap: 10 }}>
                        <button
                          onClick={() => startEdit(note)}
                          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, color: C.leather, padding: 0, fontWeight: 600 }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, color: C.brick, padding: 0, fontWeight: 600 }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Add note */}
            <div style={{ marginTop: 4 }}>
              <TextField value={newNote} onChange={setNewNote} placeholder="Add a new note…" multiline />
              <div style={{ marginTop: 8 }}>
                <SecondaryButton onClick={addNote}>Add Note</SecondaryButton>
              </div>
            </div>
          </div>
        </Section>

        <div style={{ height: 16 }} />

        {/* ── Conclusion ── */}
        <Section title="Conclusion">
          <div style={{ padding: "14px 20px" }}>
            {submitted ? (
              <div
                style={{
                  background: C.paper,
                  border: `1px solid ${C.olive}`,
                  borderRadius: 3,
                  padding: "14px 16px",
                }}
              >
                <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 11, color: C.olive, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
                  Conclusion Submitted
                </div>
                <div style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 15, fontWeight: 600, color: C.walnut }}>
                  {SUSPECTS.find((s) => s.id === selected)?.name}
                </div>
                <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 13, color: C.faded, marginTop: 2 }}>
                  {SUSPECTS.find((s) => s.id === selected)?.occupation}
                </div>
                <div style={{ marginTop: 12 }}>
                  <SecondaryButton onClick={() => { setSubmitted(false); }}>Revise</SecondaryButton>
                </div>
              </div>
            ) : (
              <div>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 14, color: C.faded, margin: "0 0 14px", lineHeight: 1.5 }}>
                  Who was responsible for the disappearance of the prototype?
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                  {SUSPECTS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelected(s.id)}
                      style={{
                        background: selected === s.id ? C.walnut : C.paper,
                        border: `1px solid ${selected === s.id ? C.walnut : C.divider}`,
                        borderRadius: 3,
                        padding: "12px 14px",
                        textAlign: "left",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 15, fontWeight: 600, color: selected === s.id ? "#F3E9D2" : C.walnut }}>
                          {s.name}
                        </div>
                        <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, color: selected === s.id ? C.antique : C.faded, marginTop: 2 }}>
                          {s.occupation}
                        </div>
                      </div>
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          border: `2px solid ${selected === s.id ? C.antique : C.divider}`,
                          background: selected === s.id ? C.antique : "transparent",
                          flexShrink: 0,
                        }}
                      />
                    </button>
                  ))}
                </div>
                <PrimaryButton onClick={submitConclusion} fullWidth>
                  Submit Conclusion
                </PrimaryButton>
              </div>
            )}
          </div>
        </Section>

        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

// ─── Navigation state ─────────────────────────────────────────────────────────
type Screen =
  | { name: "home" }
  | { name: "overview" }
  | { name: "suspects" }
  | { name: "suspectDetail"; suspect: Suspect }
  | { name: "evidence" }
  | { name: "evidenceDetail"; evidence: Evidence }
  | { name: "timeline" }
  | { name: "eventDetail"; event: TimelineEvent }
  | { name: "investigation" };

// ─── Transition direction helpers ────────────────────────────────────────────
const DEPTH: Record<string, number> = {
  home: 0,
  overview: 1,
  suspects: 2,
  evidence: 2,
  timeline: 2,
  investigation: 2,
  suspectDetail: 3,
  evidenceDetail: 3,
  eventDetail: 3,
};

// ─── App root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: "home" });
  const [animClass, setAnimClass] = useState("anim-fade");
  const prevDepthRef = useRef(0);

  function go(s: Screen) {
    const nextDepth = DEPTH[s.name] ?? 1;
    const prevDepth = prevDepthRef.current;
    setAnimClass(nextDepth >= prevDepth ? "anim-slide-in" : "anim-slide-back");
    prevDepthRef.current = nextDepth;
    setScreen(s);
  }

  const renderScreen = () => {
    switch (screen.name) {
      case "home":
        return <HomeScreen onOpen={() => go({ name: "overview" })} />;
      case "overview":
        return (
          <CaseOverviewScreen
            onBack={() => go({ name: "home" })}
            onSection={(sec) => go({ name: sec as Screen["name"] } as Screen)}
          />
        );
      case "suspects":
        return (
          <SuspectsScreen
            onBack={() => go({ name: "overview" })}
            onSelect={(s) => go({ name: "suspectDetail", suspect: s })}
          />
        );
      case "suspectDetail":
        return (
          <SuspectDetailScreen
            suspect={screen.suspect}
            onBack={() => go({ name: "suspects" })}
          />
        );
      case "evidence":
        return (
          <EvidenceScreen
            onBack={() => go({ name: "overview" })}
            onSelect={(e) => go({ name: "evidenceDetail", evidence: e })}
          />
        );
      case "evidenceDetail":
        return (
          <EvidenceDetailScreen
            evidence={screen.evidence}
            onBack={() => go({ name: "evidence" })}
          />
        );
      case "timeline":
        return (
          <TimelineScreen
            onBack={() => go({ name: "overview" })}
            onSelect={(e) => go({ name: "eventDetail", event: e })}
          />
        );
      case "eventDetail":
        return (
          <EventDetailScreen
            event={screen.event}
            onBack={() => go({ name: "timeline" })}
          />
        );
      case "investigation":
        return <InvestigationScreen onBack={() => go({ name: "overview" })} />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#D4C9B0",
      }}
    >
      {/* Mobile frame */}
      <div
        style={{
          width: "100%",
          maxWidth: 390,
          height: "100%",
          maxHeight: 844,
          background: C.parchment,
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 4px 32px rgba(42,33,27,0.25)",
        }}
      >
        <div key={screen.name} className={animClass} style={{ height: "100%" }}>
          {renderScreen()}
        </div>
      </div>
    </div>
  );
}
