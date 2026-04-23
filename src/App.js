import React, { useEffect, useMemo, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";

const API_BASE =
  import.meta.env.VITE_API_BASE || "https://sahaya-ai-3ss2.onrender.com";

const VAPI_PUBLIC_KEY =
  import.meta.env.VITE_VAPI_PUBLIC_KEY || "";

const VAPI_ASSISTANT_ID =
  import.meta.env.VITE_VAPI_ASSISTANT_ID || "";

const makeSvgDataUri = (svg) =>
  `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;

const hospitalArt = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0ea5e9"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
  </defs>
  <rect width="800" height="500" fill="url(#g)"/>
  <circle cx="670" cy="90" r="65" fill="rgba(255,255,255,0.12)"/>
  <rect x="210" y="150" width="380" height="250" rx="18" fill="#e2e8f0"/>
  <rect x="350" y="95" width="100" height="90" rx="16" fill="#bfdbfe"/>
  <rect x="375" y="110" width="50" height="18" rx="4" fill="#ef4444"/>
  <rect x="391" y="94" width="18" height="50" rx="4" fill="#ef4444"/>
  <rect x="250" y="200" width="70" height="70" rx="8" fill="#93c5fd"/>
  <rect x="365" y="200" width="70" height="70" rx="8" fill="#93c5fd"/>
  <rect x="480" y="200" width="70" height="70" rx="8" fill="#93c5fd"/>
  <rect x="360" y="300" width="80" height="100" rx="10" fill="#1e293b"/>
  <rect x="70" y="390" width="660" height="18" rx="9" fill="rgba(255,255,255,0.14)"/>
</svg>
`);

const educationArt = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </linearGradient>
  </defs>
  <rect width="800" height="500" fill="url(#g)"/>
  <circle cx="120" cy="90" r="55" fill="rgba(255,255,255,0.10)"/>
  <rect x="170" y="260" width="460" height="34" rx="10" fill="#f8fafc"/>
  <polygon points="400,115 630,210 400,305 170,210" fill="#e0e7ff"/>
  <polygon points="400,145 580,215 400,285 220,215" fill="#93c5fd"/>
  <rect x="560" y="210" width="12" height="105" rx="6" fill="#f8fafc"/>
  <circle cx="566" cy="327" r="18" fill="#f8fafc"/>
  <rect x="260" y="320" width="280" height="20" rx="10" fill="rgba(255,255,255,0.18)"/>
</svg>
`);

const servicesArt = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f766e"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
  </defs>
  <rect width="800" height="500" fill="url(#g)"/>
  <rect x="165" y="150" width="470" height="250" rx="20" fill="#e2e8f0"/>
  <rect x="220" y="110" width="360" height="70" rx="18" fill="#f8fafc"/>
  <rect x="245" y="128" width="310" height="16" rx="8" fill="#94a3b8"/>
  <rect x="235" y="215" width="330" height="18" rx="9" fill="#cbd5e1"/>
  <rect x="235" y="255" width="290" height="18" rx="9" fill="#cbd5e1"/>
  <rect x="235" y="295" width="250" height="18" rx="9" fill="#cbd5e1"/>
  <circle cx="585" cy="285" r="42" fill="#2563eb"/>
  <path d="M585 255 l9 18 20 3-14 14 3 20-18-10-18 10 3-20-14-14 20-3z" fill="#f8fafc"/>
</svg>
`);

const financeArt = makeSvgDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#059669"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
  </defs>
  <rect width="800" height="500" fill="url(#g)"/>
  <rect x="160" y="165" width="480" height="170" rx="24" fill="#f8fafc"/>
  <rect x="190" y="200" width="220" height="26" rx="13" fill="#93c5fd"/>
  <rect x="190" y="245" width="170" height="18" rx="9" fill="#cbd5e1"/>
  <circle cx="555" cy="250" r="52" fill="#22c55e"/>
  <text x="555" y="264" text-anchor="middle" font-size="54" font-family="Arial" fill="#ffffff">₹</text>
  <rect x="230" y="355" width="340" height="26" rx="13" fill="rgba(255,255,255,0.18)"/>
</svg>
`);

const DEPARTMENT_CARDS = [
  {
    title: "Hospital Care",
    subtitle: "Real-time triage, emergency routing, hospital navigation, and staff summaries.",
    art: hospitalArt,
    quickPrompt: "I need hospital help near Bangalore",
  },
  {
    title: "Education Support",
    subtitle: "Scholarships, low-income student guidance, and education support in simple language.",
    art: educationArt,
    quickPrompt: "I am a low income student and need scholarship help",
  },
  {
    title: "Public Services",
    subtitle: "Ration cards, certificates, service centers, and citizen assistance.",
    art: servicesArt,
    quickPrompt: "Where is the nearest ration office?",
  },
  {
    title: "Finance & Schemes",
    subtitle: "Bank account help, finance guidance, pensions, and scheme awareness.",
    art: financeArt,
    quickPrompt: "How can I open a zero balance bank account?",
  },
];

const styles = {
  app: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #050d18 0%, #091427 34%, #0d1b32 100%)",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: "#e5eefc",
    width: "100%",
    overflowX: "hidden",
  },
  shellDesktop: {
    display: "grid",
    gridTemplateColumns: "340px minmax(0, 1fr)",
    minHeight: "100vh",
    width: "100%",
    maxWidth: "100vw",
    overflowX: "hidden",
  },
  shellMobile: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    width: "100%",
    maxWidth: "100vw",
    overflowX: "hidden",
  },
  sidebar: {
    background: "rgba(7,16,31,0.88)",
    backdropFilter: "blur(16px)",
    borderRight: "1px solid rgba(148,163,184,0.12)",
    padding: "22px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    minWidth: 0,
    boxShadow: "18px 0 40px rgba(0,0,0,0.22)",
  },
  sidebarMobile: {
    background: "rgba(7,16,31,0.92)",
    backdropFilter: "blur(16px)",
    borderBottom: "1px solid rgba(148,163,184,0.12)",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    minWidth: 0,
  },
  brand: {
    paddingBottom: "14px",
    borderBottom: "1px solid rgba(148,163,184,0.14)",
  },
  title: {
    fontSize: "32px",
    fontWeight: "900",
    marginBottom: "8px",
    letterSpacing: "-0.04em",
    color: "#f8fbff",
  },
  subtitle: {
    fontSize: "13.5px",
    color: "#93a5bf",
    lineHeight: 1.7,
  },
  sectionTitle: {
    fontSize: "12px",
    fontWeight: "900",
    marginBottom: "10px",
    color: "#dbeafe",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  pillWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  pill: {
    background: "rgba(59,130,246,0.10)",
    border: "1px solid rgba(96,165,250,0.20)",
    color: "#dbeafe",
    padding: "7px 11px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
  },
  card: {
    background: "linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.82) 100%)",
    border: "1px solid rgba(148,163,184,0.16)",
    borderRadius: "20px",
    padding: "14px",
    boxShadow: "0 14px 30px rgba(0,0,0,0.20)",
  },
  transcriptCard: {
    background: "rgba(15,23,42,0.82)",
    border: "1px solid rgba(148,163,184,0.14)",
    borderRadius: "14px",
    padding: "12px 13px",
    fontSize: "13px",
    color: "#e2e8f0",
    lineHeight: 1.6,
    minHeight: "52px",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  quickButton: {
    width: "100%",
    textAlign: "left",
    padding: "13px 14px",
    borderRadius: "16px",
    border: "1px solid rgba(148,163,184,0.16)",
    background: "linear-gradient(180deg, rgba(30,41,59,0.90) 0%, rgba(15,23,42,0.95) 100%)",
    cursor: "pointer",
    marginBottom: "10px",
    fontSize: "14px",
    fontWeight: "700",
    color: "#f8fbff",
  },
  small: {
    fontSize: "13px",
    color: "#9fb0c8",
    lineHeight: 1.6,
  },
  select: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "14px",
    border: "1px solid rgba(148,163,184,0.18)",
    fontSize: "14px",
    background: "#0f172a",
    color: "#e5eefc",
    outline: "none",
    boxSizing: "border-box",
  },
  secondaryButton: {
    padding: "10px 14px",
    borderRadius: "14px",
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(15,23,42,0.85)",
    color: "#e5eefc",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
    marginRight: "8px",
    marginTop: "8px",
  },
  successButton: {
    padding: "10px 14px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(180deg, #22c55e 0%, #16a34a 100%)",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "800",
    marginRight: "8px",
    marginTop: "8px",
    boxShadow: "0 10px 22px rgba(34,197,94,0.25)",
  },
  dangerSoftButton: {
    padding: "10px 14px",
    borderRadius: "14px",
    border: "1px solid rgba(254,202,202,0.24)",
    background: "linear-gradient(180deg, rgba(127,29,29,0.30) 0%, rgba(153,27,27,0.18) 100%)",
    color: "#fecaca",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "800",
    marginRight: "8px",
    marginTop: "8px",
  },
  readButton: {
    padding: "11px 18px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "800",
  },
  stopButton: {
    padding: "11px 18px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(180deg, #ef4444 0%, #dc2626 100%)",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "800",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    background: "transparent",
    minWidth: 0,
    width: "100%",
  },
  topBar: {
    padding: "22px 28px",
    borderBottom: "1px solid rgba(148,163,184,0.12)",
    background: "rgba(6,14,28,0.65)",
    backdropFilter: "blur(14px)",
  },
  topBarMobile: {
    padding: "16px",
    borderBottom: "1px solid rgba(148,163,184,0.12)",
    background: "rgba(6,14,28,0.70)",
    backdropFilter: "blur(14px)",
  },
  topTitle: {
    fontSize: "30px",
    fontWeight: "900",
    marginBottom: "6px",
    letterSpacing: "-0.04em",
    color: "#f8fbff",
  },
  topSubtitle: {
    fontSize: "14px",
    color: "#9fb0c8",
    lineHeight: 1.6,
  },
  statusBar: {
    fontSize: "12px",
    padding: "7px 12px",
    borderRadius: "999px",
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    fontWeight: "800",
  },
  statusOnline: {
    background: "rgba(34,197,94,0.15)",
    color: "#86efac",
    border: "1px solid rgba(34,197,94,0.24)",
  },
  statusOffline: {
    background: "rgba(239,68,68,0.14)",
    color: "#fca5a5",
    border: "1px solid rgba(239,68,68,0.24)",
  },
  statusWaking: {
    background: "rgba(245,158,11,0.14)",
    color: "#fcd34d",
    border: "1px solid rgba(245,158,11,0.24)",
  },
  statusNeutral: {
    background: "rgba(59,130,246,0.14)",
    color: "#93c5fd",
    border: "1px solid rgba(59,130,246,0.24)",
  },
  navTabs: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "16px",
  },
  navTab: {
    padding: "10px 14px",
    borderRadius: "14px",
    border: "1px solid rgba(148,163,184,0.16)",
    background: "rgba(15,23,42,0.72)",
    color: "#dbeafe",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
  },
  navTabActive: {
    padding: "10px 14px",
    borderRadius: "14px",
    border: "1px solid rgba(96,165,250,0.22)",
    background: "linear-gradient(180deg, rgba(37,99,235,0.32) 0%, rgba(30,64,175,0.32) 100%)",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "800",
    fontSize: "14px",
  },
  chat: {
    flex: 1,
    padding: "28px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    background:
      "radial-gradient(circle at top, rgba(59,130,246,0.08), transparent 26%)",
    minWidth: 0,
  },
  chatMobile: {
    flex: 1,
    padding: "16px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    background:
      "radial-gradient(circle at top, rgba(59,130,246,0.08), transparent 26%)",
    minWidth: 0,
  },
  bubbleWrapUser: {
    display: "flex",
    justifyContent: "flex-end",
  },
  bubbleWrapBot: {
    display: "flex",
    justifyContent: "flex-start",
  },
  bubbleUser: {
    maxWidth: "78%",
    background: "linear-gradient(180deg, #1d4ed8 0%, #1e3a8a 100%)",
    color: "#fff",
    padding: "16px 18px",
    borderRadius: "22px 22px 8px 22px",
    whiteSpace: "pre-wrap",
    lineHeight: 1.75,
    fontSize: "15px",
    wordBreak: "break-word",
    boxShadow: "0 14px 30px rgba(30,64,175,0.24)",
  },
  bubbleUserMobile: {
    maxWidth: "92%",
    background: "linear-gradient(180deg, #1d4ed8 0%, #1e3a8a 100%)",
    color: "#fff",
    padding: "14px 16px",
    borderRadius: "20px 20px 8px 20px",
    whiteSpace: "pre-wrap",
    lineHeight: 1.7,
    fontSize: "14px",
    wordBreak: "break-word",
  },
  bubbleBot: {
    maxWidth: "78%",
    background: "rgba(15,23,42,0.88)",
    color: "#e5eefc",
    padding: "16px 18px",
    borderRadius: "22px 22px 22px 8px",
    border: "1px solid rgba(148,163,184,0.14)",
    whiteSpace: "pre-wrap",
    lineHeight: 1.75,
    fontSize: "15px",
    wordBreak: "break-word",
    boxShadow: "0 12px 26px rgba(0,0,0,0.18)",
  },
  bubbleBotMobile: {
    maxWidth: "92%",
    background: "rgba(15,23,42,0.92)",
    color: "#e5eefc",
    padding: "14px 16px",
    borderRadius: "20px 20px 20px 8px",
    border: "1px solid rgba(148,163,184,0.14)",
    whiteSpace: "pre-wrap",
    lineHeight: 1.7,
    fontSize: "14px",
    wordBreak: "break-word",
  },
  answerActions: {
    marginTop: "14px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  controls: {
    padding: "18px 24px 24px",
    borderTop: "1px solid rgba(148,163,184,0.12)",
    background: "rgba(6,14,28,0.72)",
    backdropFilter: "blur(14px)",
  },
  controlsMobile: {
    padding: "16px",
    borderTop: "1px solid rgba(148,163,184,0.12)",
    background: "rgba(6,14,28,0.76)",
    backdropFilter: "blur(14px)",
  },
  inputRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "12px",
  },
  inputRowMobile: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "12px",
  },
  input: {
    flex: 1,
    padding: "16px 18px",
    borderRadius: "18px",
    border: "1px solid rgba(148,163,184,0.16)",
    fontSize: "15px",
    outline: "none",
    background: "rgba(15,23,42,0.88)",
    color: "#f8fbff",
    minWidth: 0,
    boxSizing: "border-box",
  },
  button: {
    padding: "14px 20px",
    borderRadius: "18px",
    border: "none",
    background: "linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "800",
    boxShadow: "0 12px 24px rgba(37,99,235,0.24)",
  },
  footerRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  sectionPanel: {
    background: "rgba(15,23,42,0.72)",
    border: "1px solid rgba(148,163,184,0.14)",
    borderRadius: "22px",
    padding: "18px",
    boxShadow: "0 14px 28px rgba(0,0,0,0.16)",
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
    marginBottom: "18px",
  },
  statCard: {
    background: "linear-gradient(180deg, rgba(30,41,59,0.92) 0%, rgba(15,23,42,0.92) 100%)",
    border: "1px solid rgba(148,163,184,0.14)",
    borderRadius: "18px",
    padding: "16px",
  },
  statLabel: {
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#93a5bf",
    marginBottom: "6px",
    fontWeight: "800",
  },
  statValue: {
    fontSize: "26px",
    fontWeight: "900",
    color: "#f8fbff",
  },
  listCard: {
    background: "rgba(15,23,42,0.88)",
    border: "1px solid rgba(148,163,184,0.14)",
    borderRadius: "16px",
    padding: "14px",
    marginBottom: "10px",
    color: "#e5eefc",
  },

  // NEW START PAGE
  startPageWrap: {
    padding: "32px 28px 40px",
    display: "flex",
    flexDirection: "column",
    gap: "28px",
  },
  heroGraphic: {
    position: "relative",
    overflow: "hidden",
    borderRadius: "30px",
    minHeight: "340px",
    background:
      "linear-gradient(135deg, rgba(37,99,235,0.30) 0%, rgba(14,165,233,0.16) 35%, rgba(15,23,42,0.82) 100%)",
    border: "1px solid rgba(148,163,184,0.14)",
    boxShadow: "0 22px 48px rgba(0,0,0,0.28)",
    padding: "36px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  heroOrb1: {
    position: "absolute",
    width: "420px",
    height: "420px",
    right: "-120px",
    top: "-140px",
    borderRadius: "999px",
    background: "radial-gradient(circle, rgba(59,130,246,0.28) 0%, rgba(59,130,246,0.03) 70%, transparent 100%)",
  },
  heroOrb2: {
    position: "absolute",
    width: "320px",
    height: "320px",
    left: "-80px",
    bottom: "-120px",
    borderRadius: "999px",
    background: "radial-gradient(circle, rgba(16,185,129,0.18) 0%, rgba(16,185,129,0.02) 70%, transparent 100%)",
  },
  heroMiniBadge: {
    display: "inline-flex",
    alignItems: "center",
    width: "fit-content",
    gap: "8px",
    padding: "9px 14px",
    borderRadius: "999px",
    background: "rgba(15,23,42,0.62)",
    border: "1px solid rgba(148,163,184,0.14)",
    color: "#bfdbfe",
    fontWeight: "800",
    fontSize: "12px",
    marginBottom: "18px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    position: "relative",
    zIndex: 1,
  },
  heroBigTitle: {
    fontSize: "54px",
    lineHeight: 1.02,
    letterSpacing: "-0.05em",
    fontWeight: "950",
    color: "#ffffff",
    maxWidth: "860px",
    marginBottom: "14px",
    position: "relative",
    zIndex: 1,
  },
  heroBigText: {
    fontSize: "16px",
    lineHeight: 1.85,
    color: "#d1d9e6",
    maxWidth: "780px",
    marginBottom: "22px",
    position: "relative",
    zIndex: 1,
  },
  heroActionRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    position: "relative",
    zIndex: 1,
  },
  heroPrimaryAction: {
    padding: "14px 18px",
    borderRadius: "16px",
    border: "none",
    background: "linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "800",
    fontSize: "15px",
    boxShadow: "0 14px 26px rgba(37,99,235,0.24)",
  },
  heroSecondaryAction: {
    padding: "14px 18px",
    borderRadius: "16px",
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(15,23,42,0.72)",
    color: "#e5eefc",
    cursor: "pointer",
    fontWeight: "800",
    fontSize: "15px",
  },
  departmentsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "18px",
  },
  deptCard: {
    position: "relative",
    minHeight: "280px",
    overflow: "hidden",
    borderRadius: "24px",
    border: "1px solid rgba(148,163,184,0.14)",
    boxShadow: "0 18px 36px rgba(0,0,0,0.20)",
    cursor: "pointer",
    display: "flex",
    alignItems: "flex-end",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  deptOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(2,6,23,0.05) 0%, rgba(2,6,23,0.20) 35%, rgba(2,6,23,0.86) 100%)",
  },
  deptContent: {
    position: "relative",
    zIndex: 1,
    padding: "18px",
    width: "100%",
  },
  deptTitle: {
    fontSize: "22px",
    fontWeight: "900",
    color: "#ffffff",
    marginBottom: "8px",
    letterSpacing: "-0.03em",
  },
  deptText: {
    fontSize: "13px",
    lineHeight: 1.7,
    color: "#d8e3f3",
    marginBottom: "14px",
  },
  deptButton: {
    padding: "10px 14px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(15,23,42,0.72)",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "800",
    fontSize: "13px",
  },
};

function extractMapLinks(text) {
  const regex = /https?:\/\/www\.google\.com\/maps\?q=[^\s]+/g;
  return text.match(regex) || [];
}

function cleanTextForSpeech(text) {
  return text.replace(/https?:\/\/\S+/g, "").replace(/\s+/g, " ").trim();
}

function detectSpeechLang(text, fallback = "en-IN") {
  if (!text) return fallback;
  if (/[\u0C80-\u0CFF]/.test(text)) return "kn-IN";
  if (/[\u0900-\u097F]/.test(text)) return "hi-IN";
  if (/[\u0B80-\u0BFF]/.test(text)) return "ta-IN";
  if (/[\u0C00-\u0C7F]/.test(text)) return "te-IN";
  return fallback || "en-IN";
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 30000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return response;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Namaste! I am Sahaya HealthOS. Ask me about hospitals, symptoms, public support, nearby services, schemes, or hospital navigation.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoRead, setAutoRead] = useState(false);
  const [voiceLang, setVoiceLang] = useState("en-IN");
  const [speechVoices, setSpeechVoices] = useState([]);
  const [backendStatus, setBackendStatus] = useState("checking");
  const [speechStatus, setSpeechStatus] = useState("Ready to read replies");
  const [isMobile, setIsMobile] = useState(false);
  const [activeView, setActiveView] = useState("home");
  const [dashboard, setDashboard] = useState(null);

  const [voiceConnected, setVoiceConnected] = useState(false);
  const [voiceConnecting, setVoiceConnecting] = useState(false);
  const [liveUserTranscript, setLiveUserTranscript] = useState("Waiting for voice input...");
  const [liveAssistantTranscript, setLiveAssistantTranscript] = useState("Assistant reply will appear here...");
  const [lastVoiceEvent, setLastVoiceEvent] = useState("Voice ready");

  const bottomRef = useRef(null);
  const vapiRef = useRef(null);
  const lastFinalUserRef = useRef("");
  const lastFinalAssistantRef = useRef("");

  const statusStyle = useMemo(
    () => ({
      online: styles.statusOnline,
      offline: styles.statusOffline,
      waking: styles.statusWaking,
      checking: styles.statusWaking,
    }),
    []
  );

  const statusLabel = {
    online: "Backend online",
    offline: "Backend offline",
    waking: "Waking up server...",
    checking: "Checking backend...",
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, liveUserTranscript, liveAssistantTranscript, activeView]);

  useEffect(() => {
    const loadVoices = () => {
      if ("speechSynthesis" in window) {
        const voices = window.speechSynthesis.getVoices();
        setSpeechVoices(voices || []);
      }
    };

    loadVoices();

    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await fetchWithTimeout(`${API_BASE}/dashboard`, {}, 15000);
      if (!response.ok) return;
      const data = await response.json();
      setDashboard(data);
    } catch (error) {
      console.error("Dashboard fetch failed:", error);
    }
  };

  useEffect(() => {
    const checkBackend = async () => {
      try {
        setBackendStatus("waking");
        const response = await fetchWithTimeout(`${API_BASE}/`, {}, 15000);
        setBackendStatus(response.ok ? "online" : "offline");
      } catch {
        setBackendStatus("offline");
      }
    };

    checkBackend();
    loadDashboard();

    const interval = setInterval(loadDashboard, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!VAPI_PUBLIC_KEY || !VAPI_ASSISTANT_ID) {
      setLastVoiceEvent("Voice setup is incomplete. Add Vapi environment values.");
      return;
    }

    let vapi;

    try {
      vapi = new Vapi(VAPI_PUBLIC_KEY);
      vapiRef.current = vapi;
      setLastVoiceEvent("Voice ready");

      const appendUniqueChatMessage = (role, content) => {
        const text = String(content || "").trim();
        if (!text) return;

        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last && last.role === role && last.content.trim() === text) {
            return prev;
          }
          return [...prev, { role, content: text }];
        });
      };

      vapi.on("call-start", () => {
        setVoiceConnected(true);
        setVoiceConnecting(false);
        setLastVoiceEvent("Listening...");
        setLiveUserTranscript("Listening...");
        setLiveAssistantTranscript("Assistant reply will appear here...");
      });

      vapi.on("call-end", () => {
        setVoiceConnected(false);
        setVoiceConnecting(false);
        setTimeout(() => setLastVoiceEvent("Voice ready"), 500);
      });

      vapi.on("speech-start", () => {
        setLastVoiceEvent("Assistant speaking...");
      });

      vapi.on("speech-end", () => {
        setLastVoiceEvent("Voice ready");
      });

      vapi.on("message", (msg) => {
        if (!msg) return;

        const type = msg.type || "";

        if (type === "transcript") {
          const role = msg.role || "assistant";
          const transcriptText = String(msg.transcript || "").trim();
          const transcriptType = msg.transcriptType || "";

          if (role === "user") {
            if (transcriptText) setLiveUserTranscript(transcriptText);

            if (transcriptType === "final" && transcriptText) {
              setInput(transcriptText);
              if (lastFinalUserRef.current !== transcriptText) {
                lastFinalUserRef.current = transcriptText;
                appendUniqueChatMessage("user", transcriptText);
                setActiveView("assistant");
              }
            }
          }

          if (role === "assistant") {
            if (transcriptText) setLiveAssistantTranscript(transcriptText);

            if (transcriptType === "final" && transcriptText) {
              if (lastFinalAssistantRef.current !== transcriptText) {
                lastFinalAssistantRef.current = transcriptText;
                appendUniqueChatMessage("assistant", transcriptText);
                setActiveView("assistant");
              }
            }
          }

          return;
        }

        if (type === "conversation-update") {
          const conversation = msg.conversation || {};
          const maybeUser =
            conversation?.transcript?.user ||
            conversation?.userTranscript ||
            "";
          const maybeAssistant =
            conversation?.transcript?.assistant ||
            conversation?.assistantTranscript ||
            "";

          if (String(maybeUser).trim()) {
            setLiveUserTranscript(String(maybeUser).trim());
          }

          if (String(maybeAssistant).trim()) {
            setLiveAssistantTranscript(String(maybeAssistant).trim());
          }

          return;
        }

        if (type === "function-call" || type === "tool-calls") {
          setLastVoiceEvent("Assistant is using tools...");
          return;
        }

        if (type === "status-update" && msg.status) {
          setLastVoiceEvent(String(msg.status));
        }
      });

      vapi.on("error", (error) => {
        console.error("Vapi error:", error);
        setVoiceConnected(false);
        setVoiceConnecting(false);
        setLastVoiceEvent("Voice ready");
      });
    } catch (error) {
      console.error("Vapi initialization failed:", error);
      setLastVoiceEvent("Voice ready");
    }

    return () => {
      try {
        vapi?.stop();
      } catch {
        // ignore cleanup stop errors
      }
    };
  }, []);

  const getBestVoice = (langCode) => {
    if (!speechVoices?.length) return null;

    return (
      speechVoices.find((v) => v.lang === langCode) ||
      speechVoices.find((v) => v.lang?.startsWith(langCode.split("-")[0])) ||
      speechVoices.find((v) => v.lang === "en-IN") ||
      speechVoices[0] ||
      null
    );
  };

  const speak = (text) => {
    try {
      if (!("speechSynthesis" in window)) {
        setSpeechStatus("Speech synthesis is not supported in this browser.");
        return;
      }

      const cleaned = cleanTextForSpeech(text);
      if (!cleaned) return;

      window.speechSynthesis.cancel();

      const detectedLang = detectSpeechLang(cleaned, voiceLang);
      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.lang = detectedLang;
      utterance.rate = 1;

      const matchedVoice = getBestVoice(detectedLang);
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => {
        setSpeechStatus(`Reading in ${detectedLang}`);
      };

      utterance.onend = () => {
        setSpeechStatus("Finished reading");
      };

      utterance.onerror = () => {
        setSpeechStatus(
          "This device/browser could not read that language aloud properly."
        );
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      setSpeechStatus("Could not read the response aloud.");
    }
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeechStatus("Reading stopped");
    }
  };

  const startVoice = async () => {
    if (!vapiRef.current) {
      setLastVoiceEvent("Voice assistant is not ready yet.");
      return;
    }

    try {
      setVoiceConnecting(true);
      setLastVoiceEvent("Connecting voice...");
      lastFinalUserRef.current = "";
      lastFinalAssistantRef.current = "";
      setLiveUserTranscript("Listening...");
      setLiveAssistantTranscript("Assistant reply will appear here...");
      await vapiRef.current.start(VAPI_ASSISTANT_ID);
      setActiveView("voice");
    } catch (error) {
      console.error("Failed to start Vapi:", error);
      setVoiceConnecting(false);
      setVoiceConnected(false);
      setLastVoiceEvent("Voice ready");
    }
  };

  const stopVoice = async () => {
    try {
      await vapiRef.current?.stop();
      setVoiceConnected(false);
      setVoiceConnecting(false);
      setLastVoiceEvent("Voice ready");
    } catch {
      setLastVoiceEvent("Voice ready");
    }
  };

  const sendMessage = async (prefill) => {
    const text = (prefill ?? input).trim();
    if (!text || loading) return;

    const userMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setActiveView("assistant");

    try {
      const response = await fetchWithTimeout(
        `${API_BASE}/ask`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: text }),
        },
        45000
      );

      if (!response.ok) {
        throw new Error("Backend request failed");
      }

      const data = await response.json();
      const assistantText =
        data?.response || "I could not generate a response right now.";

      setMessages((prev) => [...prev, { role: "assistant", content: assistantText }]);
      setBackendStatus("online");
      loadDashboard();

      if (autoRead) {
        setTimeout(() => speak(assistantText), 250);
      }
    } catch (error) {
      setBackendStatus("offline");

      const errorMessage =
        error.name === "AbortError"
          ? "Server took too long to respond. Please try again."
          : "I could not connect to the backend. Please make sure the backend is live and the API URL is correct.";

      setMessages((prev) => [...prev, { role: "assistant", content: errorMessage }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    stopSpeaking();
    setMessages([
      {
        role: "assistant",
        content:
          "Namaste! I am Sahaya HealthOS. Ask me about hospitals, symptoms, public support, nearby services, schemes, or hospital navigation.",
      },
    ]);
    setInput("");
    setLiveUserTranscript("Waiting for voice input...");
    setLiveAssistantTranscript("Assistant reply will appear here...");
    setLastVoiceEvent("Voice ready");
    lastFinalUserRef.current = "";
    lastFinalAssistantRef.current = "";
    setActiveView("home");
  };

  const voiceBadge = useMemo(() => {
    if (voiceConnected) return "Voice connected";
    if (voiceConnecting) return "Connecting voice...";
    return "Voice ready";
  }, [voiceConnected, voiceConnecting]);

  const handleDepartmentEnter = (card) => {
    setActiveView("assistant");
    sendMessage(card.quickPrompt);
  };

  const renderHome = () => (
    <div style={styles.startPageWrap}>
      <div style={styles.heroGraphic}>
        <div style={styles.heroOrb1} />
        <div style={styles.heroOrb2} />

        <div style={styles.heroMiniBadge}>Intelligent Citizen + Hospital System</div>
        <div style={styles.heroBigTitle}>
          Advanced healthcare, education, finance, and public service help — inside one premium AI platform.
        </div>
        <div style={styles.heroBigText}>
          Sahaya HealthOS combines live patient triage, multilingual voice support, hospital navigation,
          staff assistance, low-literacy communication, education support, public services, and scheme guidance
          in one real-time operating experience.
        </div>

        <div style={styles.heroActionRow}>
          <button
            style={styles.heroPrimaryAction}
            onClick={() => setActiveView("assistant")}
          >
            Enter Main System
          </button>

          <button
            style={styles.heroSecondaryAction}
            onClick={() => setActiveView("dashboard")}
          >
            Open Operations Dashboard
          </button>
        </div>
      </div>

      <div>
        <div style={{ ...styles.sectionTitle, marginBottom: 14 }}>Explore Departments</div>
        <div style={styles.departmentsGrid}>
          {DEPARTMENT_CARDS.map((card) => (
            <div
              key={card.title}
              style={{
                ...styles.deptCard,
                backgroundImage: card.art,
              }}
              onClick={() => handleDepartmentEnter(card)}
            >
              <div style={styles.deptOverlay} />
              <div style={styles.deptContent}>
                <div style={styles.deptTitle}>{card.title}</div>
                <div style={styles.deptText}>{card.subtitle}</div>
                <button style={styles.deptButton}>Open Section</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div style={styles.sectionPanel}>
      <div style={{ ...styles.sectionTitle, marginBottom: 14 }}>Hospital Operations Dashboard</div>

      <div style={styles.statGrid}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total Patients</div>
          <div style={styles.statValue}>{dashboard?.total_patients ?? 0}</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statLabel}>High Priority</div>
          <div style={styles.statValue}>{dashboard?.high_priority_cases ?? 0}</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statLabel}>Medium Priority</div>
          <div style={styles.statValue}>{dashboard?.medium_priority_cases ?? 0}</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statLabel}>Low Priority</div>
          <div style={styles.statValue}>{dashboard?.low_priority_cases ?? 0}</div>
        </div>
      </div>

      <div style={{ ...styles.sectionTitle, marginTop: 12 }}>Digital Twin Insight</div>
      <div style={styles.listCard}>
        {dashboard?.digital_twin_note || "Waiting for hospital intelligence..."}
      </div>

      <div style={{ ...styles.sectionTitle, marginTop: 12 }}>Department Load</div>
      {Object.entries(dashboard?.department_load || {}).map(([key, value]) => (
        <div key={key} style={styles.listCard}>
          <strong style={{ textTransform: "capitalize" }}>{key}</strong>: {value}
        </div>
      ))}

      <div style={{ ...styles.sectionTitle, marginTop: 12 }}>Queue Preview</div>
      {(dashboard?.queue_preview || []).length === 0 ? (
        <div style={styles.listCard}>No patients in the live queue right now.</div>
      ) : (
        (dashboard?.queue_preview || []).map((item) => (
          <div key={item.id} style={styles.listCard}>
            <div><strong>Patient #{item.id}</strong></div>
            <div>Urgency: {item.urgency}</div>
            <div>Department: {item.department}</div>
            <div>Issue: {item.query}</div>
          </div>
        ))
      )}
    </div>
  );

  const renderVoice = () => (
    <div style={styles.sectionPanel}>
      <div style={{ ...styles.sectionTitle, marginBottom: 14 }}>Live Voice Control Center</div>

      <div style={{ marginBottom: 14, display: "flex", flexWrap: "wrap" }}>
        <button
          style={styles.successButton}
          onClick={startVoice}
          disabled={voiceConnected || voiceConnecting}
        >
          {voiceConnecting ? "Connecting..." : "🎤 Start Voice"}
        </button>

        <button
          style={styles.dangerSoftButton}
          onClick={stopVoice}
          disabled={!voiceConnected && !voiceConnecting}
        >
          🛑 Stop Voice
        </button>

        <button style={styles.secondaryButton} onClick={stopSpeaking}>
          ⏹ Stop Reading
        </button>
      </div>

      <div style={{ ...styles.sectionTitle, marginBottom: 8 }}>Live user transcript</div>
      <div style={styles.transcriptCard}>{liveUserTranscript}</div>

      <div style={{ ...styles.sectionTitle, marginTop: 14, marginBottom: 8 }}>Live assistant transcript</div>
      <div style={styles.transcriptCard}>{liveAssistantTranscript}</div>

      <div style={{ ...styles.sectionTitle, marginTop: 14, marginBottom: 8 }}>Voice status</div>
      <div style={styles.transcriptCard}>{lastVoiceEvent}</div>
    </div>
  );

  const renderAssistant = () => (
    <>
      <div style={isMobile ? styles.chatMobile : styles.chat}>
        {messages.map((message, index) => {
          const mapLinks =
            message.role === "assistant"
              ? extractMapLinks(message.content)
              : [];

          return (
            <div
              key={index}
              style={
                message.role === "user"
                  ? styles.bubbleWrapUser
                  : styles.bubbleWrapBot
              }
            >
              <div
                style={
                  message.role === "user"
                    ? isMobile
                      ? styles.bubbleUserMobile
                      : styles.bubbleUser
                    : isMobile
                    ? styles.bubbleBotMobile
                    : styles.bubbleBot
                }
              >
                {message.content}

                {message.role === "assistant" && (
                  <div style={styles.answerActions}>
                    <button
                      style={styles.readButton}
                      onClick={() => speak(message.content)}
                    >
                      🔊 Read Answer
                    </button>

                    <button
                      style={styles.stopButton}
                      onClick={stopSpeaking}
                    >
                      ⏹ Stop Reading
                    </button>

                    {mapLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        style={{ textDecoration: "none" }}
                      >
                        <button style={styles.secondaryButton}>
                          📍 Open Map {idx + 1}
                        </button>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div style={styles.bubbleWrapBot}>
            <div style={isMobile ? styles.bubbleBotMobile : styles.bubbleBot}>
              Sahaya HealthOS is thinking...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div style={isMobile ? styles.controlsMobile : styles.controls}>
        <div style={isMobile ? styles.inputRowMobile : styles.inputRow}>
          <input
            style={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="Describe symptoms, hospital need, or public support issue..."
          />
          <button
            style={styles.button}
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
          >
            Send
          </button>
        </div>

        <div style={styles.footerRow}>
          <button
            style={styles.secondaryButton}
            onClick={() => input && speak(input)}
          >
            🔊 Read Draft
          </button>

          <button
            style={styles.secondaryButton}
            onClick={stopSpeaking}
          >
            ⏹ Stop Draft/Answer Reading
          </button>

          <button
            style={styles.secondaryButton}
            onClick={() =>
              sendMessage("I am a low income student and need scholarship help")
            }
          >
            Try Scholarship Demo
          </button>

          <button
            style={styles.secondaryButton}
            onClick={() => sendMessage("I need hospital help near Bangalore")}
          >
            Try Hospital Demo
          </button>

          <button
            style={styles.secondaryButton}
            onClick={() => sendMessage("I have chest pain and dizziness")}
          >
            Try Emergency Triage
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div style={styles.app}>
      <div style={isMobile ? styles.shellMobile : styles.shellDesktop}>
        <aside style={isMobile ? styles.sidebarMobile : styles.sidebar}>
          <div style={styles.brand}>
            <div style={styles.title}>Sahaya HealthOS</div>
            <div style={styles.subtitle}>
              Premium real-time hospital coordination for patients, staff,
              hospital operations, and low-literacy users with multilingual AI assistance.
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.sectionTitle}>System Status</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <div style={{ ...styles.statusBar, ...statusStyle[backendStatus] }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background:
                      backendStatus === "online"
                        ? "#16a34a"
                        : backendStatus === "offline"
                        ? "#dc2626"
                        : "#ca8a04",
                    display: "inline-block",
                  }}
                />
                {statusLabel[backendStatus]}
              </div>

              <div
                style={{
                  ...styles.statusBar,
                  ...(voiceConnected
                    ? styles.statusOnline
                    : voiceConnecting
                    ? styles.statusWaking
                    : styles.statusNeutral),
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: voiceConnected
                      ? "#16a34a"
                      : voiceConnecting
                      ? "#ca8a04"
                      : "#2563eb",
                    display: "inline-block",
                  }}
                />
                {voiceBadge}
              </div>
            </div>
          </div>

          <div>
            <div style={styles.sectionTitle}>Capabilities</div>
            <div style={styles.pillWrap}>
              {[
                "AI triage",
                "Live queue",
                "Staff assist",
                "Digital twin",
                "Voice support",
                "Low literacy mode",
                "Nearby routing",
                "Scheme guidance",
              ].map((item) => (
                <span key={item} style={styles.pill}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div style={styles.sectionTitle}>Quick Actions</div>

            <button
              style={styles.quickButton}
              onClick={() => {
                setActiveView("assistant");
                sendMessage("I need hospital help near Bangalore");
              }}
            >
              Healthcare Help
            </button>

            <button
              style={styles.quickButton}
              onClick={() => {
                setActiveView("assistant");
                sendMessage("I have chest pain and breathing problem");
              }}
            >
              Emergency Triage
            </button>

            <button
              style={styles.quickButton}
              onClick={() => {
                setActiveView("assistant");
                sendMessage("I am a low income student and need scholarship help");
              }}
            >
              Education Scheme
            </button>

            <button
              style={styles.quickButton}
              onClick={() => setActiveView("dashboard")}
            >
              View Operations Dashboard
            </button>
          </div>

          <div style={styles.card}>
            <div style={styles.sectionTitle}>Voice Settings</div>

            <label style={styles.small}>
              <input
                type="checkbox"
                checked={autoRead}
                onChange={(e) => setAutoRead(e.target.checked)}
                style={{ marginRight: 8 }}
              />
              Auto read text responses
            </label>

            <div style={{ marginTop: 12 }}>
              <select
                value={voiceLang}
                onChange={(e) => setVoiceLang(e.target.value)}
                style={styles.select}
              >
                <option value="en-IN">English (India)</option>
                <option value="hi-IN">Hindi</option>
                <option value="kn-IN">Kannada</option>
                <option value="ta-IN">Tamil</option>
                <option value="te-IN">Telugu</option>
              </select>
            </div>
          </div>

          <div>
            <button style={styles.secondaryButton} onClick={clearChat}>
              Reset System
            </button>
          </div>
        </aside>

        <main style={styles.main}>
          <div style={isMobile ? styles.topBarMobile : styles.topBar}>
            <div style={styles.topTitle}>Sahaya HealthOS RT</div>
            <div style={styles.topSubtitle}>
              Real-time AI hospital coordination with patient triage, department routing,
              queue balancing, staff summaries, live communication, and operations intelligence.
            </div>

            <div style={styles.navTabs}>
              <button
                style={activeView === "home" ? styles.navTabActive : styles.navTab}
                onClick={() => setActiveView("home")}
              >
                Home
              </button>
              <button
                style={activeView === "assistant" ? styles.navTabActive : styles.navTab}
                onClick={() => setActiveView("assistant")}
              >
                Assistant
              </button>
              <button
                style={activeView === "voice" ? styles.navTabActive : styles.navTab}
                onClick={() => setActiveView("voice")}
              >
                Voice
              </button>
              <button
                style={activeView === "dashboard" ? styles.navTabActive : styles.navTab}
                onClick={() => setActiveView("dashboard")}
              >
                Dashboard
              </button>
            </div>
          </div>

          {activeView === "home" && renderHome()}
          {activeView === "assistant" && renderAssistant()}
          {activeView === "voice" && (
            <div style={isMobile ? styles.chatMobile : styles.chat}>{renderVoice()}</div>
          )}
          {activeView === "dashboard" && (
            <div style={isMobile ? styles.chatMobile : styles.chat}>{renderDashboard()}</div>
          )}
        </main>
      </div>
    </div>
  );
}
