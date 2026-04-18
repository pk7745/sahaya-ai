import React, { useEffect, useMemo, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";

const API_BASE =
  import.meta.env.VITE_API_BASE || "https://sahaya-ai-3ss2.onrender.com";

const VAPI_PUBLIC_KEY =
  import.meta.env.VITE_VAPI_PUBLIC_KEY || "";

const VAPI_ASSISTANT_ID =
  import.meta.env.VITE_VAPI_ASSISTANT_ID || "";

const styles = {
  app: {
    minHeight: "100vh",
    background: "#f7f7f8",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: "#111827",
    width: "100%",
    overflowX: "hidden",
  },
  shellDesktop: {
    display: "grid",
    gridTemplateColumns: "300px minmax(0, 1fr)",
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
    background: "#ffffff",
    borderRight: "1px solid #e5e7eb",
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    minWidth: 0,
  },
  sidebarMobile: {
    background: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    minWidth: 0,
  },
  brand: {
    paddingBottom: "12px",
    borderBottom: "1px solid #eef2f7",
  },
  title: {
    fontSize: "30px",
    fontWeight: "800",
    marginBottom: "8px",
    letterSpacing: "-0.03em",
  },
  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: 1.6,
  },
  sectionTitle: {
    fontSize: "14px",
    fontWeight: "800",
    marginBottom: "10px",
    color: "#111827",
  },
  pillWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  pill: {
    background: "#f9fafb",
    border: "1px solid #d1d5db",
    color: "#374151",
    padding: "7px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
  },
  card: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "14px",
  },
  quickButton: {
    width: "100%",
    textAlign: "left",
    padding: "13px 14px",
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    cursor: "pointer",
    marginBottom: "10px",
    fontSize: "14px",
    fontWeight: "700",
    color: "#111827",
  },
  small: {
    fontSize: "13px",
    color: "#6b7280",
    lineHeight: 1.6,
  },
  select: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
  },
  secondaryButton: {
    padding: "10px 14px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    background: "#fff",
    color: "#111827",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    marginRight: "8px",
    marginTop: "8px",
  },
  primaryButton: {
    padding: "10px 14px",
    borderRadius: "12px",
    border: "none",
    background: "#111827",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
    marginRight: "8px",
    marginTop: "8px",
  },
  successButton: {
    padding: "10px 14px",
    borderRadius: "12px",
    border: "none",
    background: "#16a34a",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
    marginRight: "8px",
    marginTop: "8px",
  },
  dangerSoftButton: {
    padding: "10px 14px",
    borderRadius: "12px",
    border: "1px solid #fecaca",
    background: "#fff1f2",
    color: "#991b1b",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
    marginRight: "8px",
    marginTop: "8px",
  },
  readButton: {
    padding: "11px 18px",
    borderRadius: "12px",
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "800",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
  },
  stopButton: {
    padding: "11px 18px",
    borderRadius: "12px",
    border: "none",
    background: "#dc2626",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "800",
    boxShadow: "0 4px 12px rgba(220, 38, 38, 0.25)",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    background: "#ffffff",
    minWidth: 0,
    width: "100%",
  },
  topBar: {
    padding: "18px 24px",
    borderBottom: "1px solid #e5e7eb",
    background: "#ffffff",
  },
  topBarMobile: {
    padding: "16px",
    borderBottom: "1px solid #e5e7eb",
    background: "#ffffff",
  },
  topTitle: {
    fontSize: "28px",
    fontWeight: "800",
    marginBottom: "6px",
    letterSpacing: "-0.03em",
  },
  topSubtitle: {
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: 1.6,
  },
  statusRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "12px",
  },
  statusBar: {
    fontSize: "12px",
    padding: "7px 12px",
    borderRadius: "999px",
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    fontWeight: "700",
  },
  statusOnline: {
    background: "#dcfce7",
    color: "#166534",
    border: "1px solid #bbf7d0",
  },
  statusOffline: {
    background: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #fecaca",
  },
  statusWaking: {
    background: "#fef3c7",
    color: "#92400e",
    border: "1px solid #fde68a",
  },
  statusNeutral: {
    background: "#eff6ff",
    color: "#1d4ed8",
    border: "1px solid #bfdbfe",
  },
  chat: {
    flex: 1,
    padding: "24px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    background: "#ffffff",
    minWidth: 0,
  },
  chatMobile: {
    flex: 1,
    padding: "16px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    background: "#ffffff",
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
    background: "#111827",
    color: "#fff",
    padding: "16px 18px",
    borderRadius: "18px 18px 6px 18px",
    whiteSpace: "pre-wrap",
    lineHeight: 1.75,
    fontSize: "15px",
    wordBreak: "break-word",
  },
  bubbleUserMobile: {
    maxWidth: "92%",
    background: "#111827",
    color: "#fff",
    padding: "14px 16px",
    borderRadius: "18px 18px 6px 18px",
    whiteSpace: "pre-wrap",
    lineHeight: 1.7,
    fontSize: "14px",
    wordBreak: "break-word",
  },
  bubbleBot: {
    maxWidth: "78%",
    background: "#f9fafb",
    color: "#111827",
    padding: "16px 18px",
    borderRadius: "18px 18px 18px 6px",
    border: "1px solid #e5e7eb",
    whiteSpace: "pre-wrap",
    lineHeight: 1.75,
    fontSize: "15px",
    wordBreak: "break-word",
  },
  bubbleBotMobile: {
    maxWidth: "92%",
    background: "#f9fafb",
    color: "#111827",
    padding: "14px 16px",
    borderRadius: "18px 18px 18px 6px",
    border: "1px solid #e5e7eb",
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
    borderTop: "1px solid #e5e7eb",
    background: "#ffffff",
  },
  controlsMobile: {
    padding: "16px",
    borderTop: "1px solid #e5e7eb",
    background: "#ffffff",
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
    borderRadius: "16px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
    outline: "none",
    background: "#fff",
    minWidth: 0,
    boxSizing: "border-box",
  },
  button: {
    padding: "14px 20px",
    borderRadius: "16px",
    border: "none",
    background: "#111827",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
  },
  footerRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
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
        "Namaste! I am Sahaya AI. Ask me about healthcare, education, finance, public services, nearby places, schemes, or eligibility.",
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

  const [voiceConnected, setVoiceConnected] = useState(false);
  const [voiceConnecting, setVoiceConnecting] = useState(false);
  const [liveUserTranscript, setLiveUserTranscript] = useState("Waiting for voice input...");
  const [liveAssistantTranscript, setLiveAssistantTranscript] = useState("Assistant reply will appear here...");
  const [lastVoiceEvent, setLastVoiceEvent] = useState("Voice assistant is ready.");

  const bottomRef = useRef(null);
  const vapiRef = useRef(null);
  const addedTranscriptKeysRef = useRef(new Set());

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
  }, [messages, loading, liveUserTranscript, liveAssistantTranscript]);

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

  useEffect(() => {
    const checkBackend = async () => {
      try {
        setBackendStatus("waking");
        const response = await fetchWithTimeout(`${API_BASE}/`, {}, 15000);
        setBackendStatus(response.ok ? "online" : "offline");
      } catch (error) {
        setBackendStatus("offline");
      }
    };

    checkBackend();
  }, []);

  useEffect(() => {
    if (!VAPI_PUBLIC_KEY || !VAPI_ASSISTANT_ID) {
      setLastVoiceEvent("Vapi credentials are missing.");
      return;
    }

    try {
      const vapi = new Vapi(VAPI_PUBLIC_KEY);
      vapiRef.current = vapi;
      setLastVoiceEvent("Vapi initialized successfully.");

      const pushUniqueMessage = (role, content, keyHint) => {
        const text = (content || "").trim();
        if (!text) return;

        const key = `${role}:${keyHint || text}`;
        if (addedTranscriptKeysRef.current.has(key)) return;
        addedTranscriptKeysRef.current.add(key);

        setMessages((prev) => [...prev, { role, content: text }]);
      };

      vapi.on("call-start", () => {
        setVoiceConnected(true);
        setVoiceConnecting(false);
        setLastVoiceEvent("Voice call started.");
      });

      vapi.on("call-end", () => {
        setVoiceConnected(false);
        setVoiceConnecting(false);
        setLastVoiceEvent("Voice call ended.");
      });

      vapi.on("speech-start", () => {
        setLastVoiceEvent("Assistant is speaking.");
      });

      vapi.on("speech-end", () => {
        setLastVoiceEvent("Assistant finished speaking.");
      });

      vapi.on("message", (msg) => {
        try {
          if (!msg) return;

          if (msg.type === "transcript") {
            const transcriptText = (msg.transcript || "").trim();
            const transcriptRole = msg.role || "assistant";
            const transcriptType = msg.transcriptType || "";

            if (transcriptRole === "user") {
              setLiveUserTranscript(transcriptText || "Waiting for voice input...");
              if (transcriptType === "final" && transcriptText) {
                setInput(transcriptText);
                pushUniqueMessage("user", transcriptText, msg.timestamp || msg.id || transcriptText);
              }
            }

            if (transcriptRole === "assistant") {
              setLiveAssistantTranscript(
                transcriptText || "Assistant reply will appear here..."
              );
              if (transcriptType === "final" && transcriptText) {
                pushUniqueMessage(
                  "assistant",
                  transcriptText,
                  msg.timestamp || msg.id || transcriptText
                );
              }
            }
          }

          if (msg.type === "conversation-update") {
            const userText = msg.conversation?.transcript?.user;
            const assistantText = msg.conversation?.transcript?.assistant;

            if (userText) {
              setLiveUserTranscript(userText);
            }
            if (assistantText) {
              setLiveAssistantTranscript(assistantText);
            }
          }

          if (msg.type === "function-call" || msg.type === "tool-calls") {
            setLastVoiceEvent("Assistant is using tools.");
          }
        } catch (err) {
          console.error("Vapi message handling error:", err);
          setLastVoiceEvent("Voice message handling issue occurred.");
        }
      });

      vapi.on("error", (error) => {
        console.error("Vapi error:", error);
        setVoiceConnected(false);
        setVoiceConnecting(false);
        setLastVoiceEvent("Voice service had an issue. You can still continue using text chat.");
      });

      return () => {
        try {
          vapi.stop();
        } catch (e) {
          console.error("Vapi cleanup stop error:", e);
        }
      };
    } catch (error) {
      console.error("Vapi initialization failed:", error);
      setLastVoiceEvent("Vapi initialization failed.");
    }
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
    } catch (error) {
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
      setLastVoiceEvent("Vapi is not initialized.");
      return;
    }

    try {
      setVoiceConnecting(true);
      setLastVoiceEvent("Connecting voice assistant...");
      addedTranscriptKeysRef.current.clear();
      await vapiRef.current.start(VAPI_ASSISTANT_ID);
    } catch (error) {
      console.error("Failed to start Vapi:", error);
      setVoiceConnecting(false);
      setVoiceConnected(false);
      setLastVoiceEvent("Could not start voice assistant.");
    }
  };

  const stopVoice = async () => {
    try {
      await vapiRef.current?.stop();
      setVoiceConnected(false);
      setVoiceConnecting(false);
      setLastVoiceEvent("Voice assistant stopped.");
    } catch (error) {
      console.error("Failed to stop Vapi:", error);
      setLastVoiceEvent("Could not stop voice assistant cleanly.");
    }
  };

  const sendMessage = async (prefill) => {
    const text = (prefill ?? input).trim();
    if (!text || loading) return;

    const userMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

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

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantText },
      ]);

      setBackendStatus("online");

      if (autoRead) {
        setTimeout(() => speak(assistantText), 250);
      }
    } catch (error) {
      setBackendStatus("offline");

      const errorMessage =
        error.name === "AbortError"
          ? "Server took too long to respond. Please try again."
          : "I could not connect to the backend. Please make sure the backend is live and the API URL is correct.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorMessage,
        },
      ]);
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
          "Namaste! I am Sahaya AI. Ask me about healthcare, education, finance, public services, nearby places, schemes, or eligibility.",
      },
    ]);
    setInput("");
    setLiveUserTranscript("Waiting for voice input...");
    setLiveAssistantTranscript("Assistant reply will appear here...");
    setLastVoiceEvent("Chat reset complete.");
    addedTranscriptKeysRef.current.clear();
  };

  return (
    <div style={styles.app}>
      <div style={isMobile ? styles.shellMobile : styles.shellDesktop}>
        <aside style={isMobile ? styles.sidebarMobile : styles.sidebar}>
          <div style={styles.brand}>
            <div style={styles.title}>Sahaya AI</div>
            <div style={styles.subtitle}>
              Multilingual government assistance assistant for healthcare,
              education, finance, public services, schemes, rewards, nearby help,
              text chat, live voice interaction, and read-aloud support.
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.sectionTitle}>Status</div>
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
                {voiceConnected
                  ? "Voice connected"
                  : voiceConnecting
                  ? "Connecting voice..."
                  : "Voice ready"}
              </div>
            </div>
          </div>

          <div>
            <div style={styles.sectionTitle}>Capabilities</div>
            <div style={styles.pillWrap}>
              {[
                "Government schemes",
                "Eligibility guidance",
                "Nearby places",
                "Rewards and badges",
                "Live voice",
                "Live transcript",
                "Read answer",
                "Stop reading",
                "Read draft",
              ].map((item) => (
                <span key={item} style={styles.pill}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div style={styles.sectionTitle}>Quick prompts</div>

            <button
              style={styles.quickButton}
              onClick={() => sendMessage("I need hospital help near Bangalore")}
            >
              Healthcare Help
            </button>

            <button
              style={styles.quickButton}
              onClick={() =>
                sendMessage("I am a low income student and need scholarship help")
              }
            >
              Education Scheme
            </button>

            <button
              style={styles.quickButton}
              onClick={() => sendMessage("How can I open a bank account?")}
            >
              Finance Support
            </button>

            <button
              style={styles.quickButton}
              onClick={() => sendMessage("Where is the nearest ration office?")}
            >
              Public Services
            </button>
          </div>

          <div style={styles.card}>
            <div style={styles.sectionTitle}>Voice controls</div>

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

            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap" }}>
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

            <div style={{ marginTop: 12 }} />

            <div style={styles.sectionTitle}>Live user transcript</div>
            <div style={styles.card}>{liveUserTranscript}</div>

            <div style={{ height: 10 }} />

            <div style={styles.sectionTitle}>Live assistant transcript</div>
            <div style={styles.card}>{liveAssistantTranscript}</div>

            <div style={{ height: 10 }} />

            <div style={styles.sectionTitle}>Voice status</div>
            <div style={styles.card}>{lastVoiceEvent}</div>
          </div>

          <div>
            <button style={styles.secondaryButton} onClick={clearChat}>
              Reset Chat
            </button>
          </div>
        </aside>

        <main style={styles.main}>
          <div style={isMobile ? styles.topBarMobile : styles.topBar}>
            <div style={styles.topTitle}>Citizen Support Workspace</div>
            <div style={styles.topSubtitle}>
              Ask Sahaya about schemes, eligibility, hospitals, banks, police,
              ration offices, and more.
            </div>
          </div>

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
                  Sahaya is thinking...
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
                placeholder="Message Sahaya AI..."
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
