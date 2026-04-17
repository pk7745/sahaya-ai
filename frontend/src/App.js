import React, { useEffect, useMemo, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";

const API_BASE = import.meta.env.VITE_API_BASE;
const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY;
const VAPI_ASSISTANT_ID = import.meta.env.VITE_VAPI_ASSISTANT_ID;

const styles = {
  app: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, #f8fafc 0%, #eef2ff 35%, #e2e8f0 100%)",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
    color: "#0f172a",
  },
  container: {
    maxWidth: "1220px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "340px 1fr",
    gap: "22px",
  },
  sidebar: {
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(10px)",
    borderRadius: "28px",
    padding: "22px",
    boxShadow: "0 18px 60px rgba(15, 23, 42, 0.08)",
    border: "1px solid #e2e8f0",
    height: "fit-content",
  },
  main: {
    background: "rgba(255,255,255,0.94)",
    backdropFilter: "blur(10px)",
    borderRadius: "28px",
    boxShadow: "0 18px 60px rgba(15, 23, 42, 0.08)",
    border: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    minHeight: "86vh",
    overflow: "hidden",
  },
  title: {
    fontSize: "30px",
    fontWeight: "800",
    marginBottom: "8px",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: "14px",
    color: "#475569",
    lineHeight: 1.65,
  },
  sectionTitle: {
    fontSize: "15px",
    fontWeight: "800",
    marginBottom: "10px",
    marginTop: "22px",
    color: "#0f172a",
  },
  pill: {
    display: "inline-block",
    background: "#f8fafc",
    border: "1px solid #cbd5e1",
    color: "#334155",
    padding: "7px 11px",
    borderRadius: "999px",
    fontSize: "12px",
    margin: "4px 6px 0 0",
    fontWeight: "600",
  },
  quickButton: {
    width: "100%",
    textAlign: "left",
    padding: "13px 15px",
    borderRadius: "16px",
    border: "1px solid #dbe4ee",
    background: "#ffffff",
    cursor: "pointer",
    marginBottom: "10px",
    fontSize: "14px",
    fontWeight: "600",
    boxShadow: "0 6px 18px rgba(15, 23, 42, 0.03)",
  },
  header: {
    padding: "24px",
    borderBottom: "1px solid #e2e8f0",
    background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
  },
  heroRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  heroCard: {
    flex: 1,
    minWidth: "220px",
  },
  voicePanel: {
    minWidth: "265px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "14px",
  },
  statText: {
    fontSize: "12px",
    color: "#64748b",
    marginTop: "6px",
    lineHeight: 1.5,
    wordBreak: "break-word",
  },
  chat: {
    flex: 1,
    padding: "22px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    background:
      "linear-gradient(180deg, rgba(248,250,252,0.7) 0%, rgba(255,255,255,0.95) 100%)",
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
    maxWidth: "82%",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    color: "#fff",
    padding: "15px 17px",
    borderRadius: "22px 22px 8px 22px",
    whiteSpace: "pre-wrap",
    lineHeight: 1.7,
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.18)",
  },
  bubbleBot: {
    maxWidth: "82%",
    background: "#ffffff",
    color: "#0f172a",
    padding: "15px 17px",
    borderRadius: "22px 22px 22px 8px",
    border: "1px solid #e2e8f0",
    whiteSpace: "pre-wrap",
    lineHeight: 1.7,
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.05)",
  },
  bubbleSystem: {
    maxWidth: "82%",
    background: "#fefce8",
    color: "#854d0e",
    padding: "14px 16px",
    borderRadius: "20px",
    border: "1px solid #fde68a",
    whiteSpace: "pre-wrap",
    lineHeight: 1.7,
    fontSize: "14px",
  },
  controls: {
    padding: "18px 20px 20px",
    borderTop: "1px solid #e2e8f0",
    background: "#ffffff",
  },
  inputRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "12px",
  },
  input: {
    flex: 1,
    padding: "14px 16px",
    borderRadius: "16px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
    background: "#fff",
  },
  button: {
    padding: "12px 18px",
    borderRadius: "16px",
    border: "none",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
    boxShadow: "0 10px 20px rgba(15, 23, 42, 0.12)",
  },
  secondaryButton: {
    padding: "10px 14px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    background: "#fff",
    color: "#0f172a",
    cursor: "pointer",
    fontSize: "14px",
    marginRight: "8px",
    marginTop: "8px",
    fontWeight: "600",
  },
  primaryVoiceButton: {
    padding: "12px 16px",
    borderRadius: "16px",
    border: "none",
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
    marginRight: "8px",
    marginTop: "8px",
    boxShadow: "0 10px 22px rgba(37, 99, 235, 0.2)",
  },
  dangerButton: {
    padding: "12px 16px",
    borderRadius: "16px",
    border: "1px solid #fecaca",
    background: "#fff1f2",
    color: "#991b1b",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
    marginTop: "8px",
  },
  footerRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  small: {
    fontSize: "13px",
    color: "#64748b",
  },
  statusBar: {
    fontSize: "12px",
    padding: "7px 12px",
    borderRadius: "999px",
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    marginTop: "12px",
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
    background: "#fefce8",
    color: "#854d0e",
    border: "1px solid #fde68a",
  },
  transcriptBox: {
    marginTop: "12px",
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "12px",
    minHeight: "66px",
  },
  transcriptLabel: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "700",
    marginBottom: "6px",
  },
  transcriptText: {
    fontSize: "13px",
    color: "#0f172a",
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
  },
};

function extractMapLinks(text) {
  const regex = /https?:\/\/www\.google\.com\/maps\?q=[^\s]+/g;
  return text.match(regex) || [];
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 35000) {
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
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("idle");
  const [backendStatus, setBackendStatus] = useState("checking");
  const [liveUserTranscript, setLiveUserTranscript] = useState("");
  const [liveAssistantTranscript, setLiveAssistantTranscript] = useState("");
  const [lastVoiceNote, setLastVoiceNote] = useState(
    "Voice is powered by Vapi. Text chat still uses your backend directly."
  );

  const bottomRef = useRef(null);
  const vapiRef = useRef(null);
  const handledTranscriptIds = useRef(new Set());

  const statusLabel = {
    online: "Backend online",
    offline: "Backend offline",
    waking: "Waking up server...",
    checking: "Checking server...",
  };

  const statusStyle = {
    online: styles.statusOnline,
    offline: styles.statusOffline,
    waking: styles.statusWaking,
    checking: styles.statusWaking,
  };

  const voiceBadge = useMemo(() => {
    if (voiceActive) return "Vapi voice live";
    if (voiceStatus === "connecting") return "Connecting voice...";
    return "Voice ready";
  }, [voiceActive, voiceStatus]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, liveUserTranscript, liveAssistantTranscript]);

  useEffect(() => {
    setBackendStatus("waking");
    fetch(`${API_BASE}/`)
      .then((res) => {
        setBackendStatus(res.ok ? "online" : "offline");
      })
      .catch(() => setBackendStatus("offline"));
  }, []);

  useEffect(() => {
    if (!VAPI_PUBLIC_KEY || !VAPI_ASSISTANT_ID) {
      setLastVoiceNote("Missing Vapi environment variables.");
      return;
    }

    const vapi = new Vapi(VAPI_PUBLIC_KEY);
    vapiRef.current = vapi;

    const pushUniqueTranscript = (role, text, idHint) => {
      const safeText = (text || "").trim();
      if (!safeText) return;

      const key = `${role}:${idHint || safeText}`;
      if (handledTranscriptIds.current.has(key)) return;
      handledTranscriptIds.current.add(key);

      setMessages((prev) => [...prev, { role, content: safeText }]);
    };

    vapi.on("call-start", () => {
      setVoiceActive(true);
      setVoiceStatus("active");
      setLastVoiceNote("Voice conversation started.");
    });

    vapi.on("call-end", () => {
      setVoiceActive(false);
      setVoiceStatus("idle");
      setLastVoiceNote("Voice conversation ended.");
      setLiveUserTranscript("");
      setLiveAssistantTranscript("");
    });

    vapi.on("speech-start", () => {
      setLastVoiceNote("Assistant is speaking...");
    });

    vapi.on("speech-end", () => {
      setLastVoiceNote("Assistant finished speaking.");
    });

    vapi.on("message", (msg) => {
      if (!msg) return;

      if (msg.type === "transcript") {
        const transcriptText = (msg.transcript || "").trim();
        const transcriptRole = msg.role || "assistant";

        if (transcriptRole === "user") {
          setLiveUserTranscript(transcriptText);
        } else if (transcriptRole === "assistant") {
          setLiveAssistantTranscript(transcriptText);
        }

        if (transcriptText && msg.transcriptType === "final") {
          pushUniqueTranscript(
            transcriptRole,
            transcriptText,
            msg.timestamp || msg.id || transcriptText
          );
        }
      }

      if (msg.type === "function-call" || msg.type === "tool-calls") {
        setLastVoiceNote("Assistant is using a tool...");
      }
    });

    vapi.on("error", (error) => {
      console.error("Vapi error:", error);
      setVoiceActive(false);
      setVoiceStatus("error");
      setLastVoiceNote("Voice error occurred. Please try again.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Voice service had an issue. You can still continue using text chat.",
        },
      ]);
    });

    return () => {
      try {
        vapi.stop();
      } catch (e) {
        console.error("Error stopping Vapi on cleanup:", e);
      }
    };
  }, []);

  const startVapiVoice = async () => {
    try {
      if (!vapiRef.current) {
        setLastVoiceNote("Vapi is not initialized.");
        return;
      }
      setVoiceStatus("connecting");
      setLastVoiceNote("Connecting to Vapi voice assistant...");
      handledTranscriptIds.current.clear();
      await vapiRef.current.start(VAPI_ASSISTANT_ID);
    } catch (error) {
      console.error("Failed to start Vapi:", error);
      setVoiceStatus("error");
      setVoiceActive(false);
      setLastVoiceNote("Could not start voice assistant.");
    }
  };

  const stopVapiVoice = async () => {
    try {
      await vapiRef.current?.stop();
      setVoiceActive(false);
      setVoiceStatus("idle");
      setLastVoiceNote("Voice stopped.");
    } catch (error) {
      console.error("Failed to stop Vapi:", error);
    }
  };

  const sendMessage = async (prefill) => {
    const text = (prefill ?? input).trim();
    if (!text || loading) return;

    const userMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    if (backendStatus !== "online") {
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content:
            "The server is starting up. The first response may take a little longer.",
        },
      ]);
    }

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
        60000
      );

      if (!response.ok) {
        throw new Error("Backend request failed");
      }

      const data = await response.json();
      const assistantText =
        data?.response || "I could not generate a response right now.";

      setMessages((prev) =>
        prev
          .filter((m) => m.role !== "system")
          .concat({ role: "assistant", content: assistantText })
      );

      setBackendStatus("online");
    } catch (error) {
      setMessages((prev) =>
        prev.filter((m) => m.role !== "system").concat({
          role: "assistant",
          content:
            error.name === "AbortError"
              ? "The request timed out. The server may be starting up — please try again in a moment."
              : "I could not connect to the backend. Please make sure the backend is live and the API URL is correct.",
        })
      );
      setBackendStatus("offline");
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Namaste! I am Sahaya AI. Ask me about healthcare, education, finance, public services, nearby places, schemes, or eligibility.",
      },
    ]);
    setInput("");
    setLiveUserTranscript("");
    setLiveAssistantTranscript("");
    setLastVoiceNote("Chat reset complete.");
  };

  return (
    <div style={styles.app}>
      <div style={styles.container}>
        <div style={styles.sidebar}>
          <div style={styles.title}>Sahaya AI</div>
          <div style={styles.subtitle}>
            Multilingual government assistance assistant for healthcare,
            education, finance, public services, schemes, rewards, nearby help,
            and live voice conversations.
          </div>

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

          <div style={{ ...styles.statusBar, ...styles.statusWaking }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: voiceActive ? "#2563eb" : "#ca8a04",
                display: "inline-block",
              }}
            />
            {voiceBadge}
          </div>

          <div style={styles.sectionTitle}>Capabilities</div>
          <div>
            {[
              "Government schemes",
              "Eligibility guidance",
              "Nearby places",
              "Rewards and badges",
              "Text + voice support",
              "Multilingual assistance",
            ].map((item) => (
              <span key={item} style={styles.pill}>
                {item}
              </span>
            ))}
          </div>

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

          <div style={styles.sectionTitle}>Voice controls</div>
          <div style={styles.small}>
            Voice input and voice output are now handled by Vapi instead of the
            browser.
          </div>

          <div style={{ marginTop: 12 }}>
            <button
              style={styles.primaryVoiceButton}
              onClick={startVapiVoice}
              disabled={voiceActive || voiceStatus === "connecting"}
            >
              {voiceStatus === "connecting"
                ? "Connecting..."
                : "🎤 Start Voice"}
            </button>

            <button
              style={styles.dangerButton}
              onClick={stopVapiVoice}
              disabled={!voiceActive && voiceStatus !== "connecting"}
            >
              🛑 Stop Voice
            </button>
          </div>

          <div style={styles.transcriptBox}>
            <div style={styles.transcriptLabel}>Voice status</div>
            <div style={styles.transcriptText}>{lastVoiceNote}</div>
          </div>

          <div style={styles.transcriptBox}>
            <div style={styles.transcriptLabel}>Live user transcript</div>
            <div style={styles.transcriptText}>
              {liveUserTranscript || "Waiting for voice input..."}
            </div>
          </div>

          <div style={styles.transcriptBox}>
            <div style={styles.transcriptLabel}>Live assistant transcript</div>
            <div style={styles.transcriptText}>
              {liveAssistantTranscript || "Assistant reply will appear here..."}
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <button style={styles.secondaryButton} onClick={clearChat}>
              Reset Chat
            </button>
          </div>
        </div>

        <div style={styles.main}>
          <div style={styles.header}>
            <div style={styles.heroRow}>
              <div style={styles.heroCard}>
                <div style={{ ...styles.title, fontSize: 27, marginBottom: 6 }}>
                  Citizen Support Workspace
                </div>
                <div style={styles.subtitle}>
                  Ask Sahaya about schemes, eligibility, hospitals, banks,
                  police, ration offices, and more. Use text chat or talk
                  directly with the voice assistant.
                </div>
              </div>

              <div style={styles.voicePanel}>
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 6 }}>
                  Voice mode
                </div>
                <div style={styles.subtitle}>
                  Start a live call for multilingual speech input and spoken
                  responses. Text chat remains available below.
                </div>
                <div style={styles.statText}>
                  Assistant connected through environment variables.
                </div>
              </div>
            </div>
          </div>

          <div style={styles.chat}>
            {messages.map((message, index) => {
              if (message.role === "system") {
                return (
                  <div key={index} style={styles.bubbleWrapBot}>
                    <div style={styles.bubbleSystem}>{message.content}</div>
                  </div>
                );
              }

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
                        ? styles.bubbleUser
                        : styles.bubbleBot
                    }
                  >
                    {message.content}

                    {message.role === "assistant" && mapLinks.length > 0 && (
                      <div style={{ marginTop: 12 }}>
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
                <div style={styles.bubbleBot}>Sahaya is thinking...</div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div style={styles.controls}>
            <div style={styles.inputRow}>
              <input
                style={styles.input}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                placeholder="Type your question to Sahaya AI..."
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
        </div>
      </div>
    </div>
  );
}
