import React, { useEffect, useMemo, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";

const API_BASE =
  import.meta.env.VITE_API_BASE || "https://sahaya-ai-3ss2.onrender.com";

const VAPI_PUBLIC_KEY =
  import.meta.env.VITE_VAPI_PUBLIC_KEY || "61488fad-b9ee-4287-9917-691d2e1f202b";

const VAPI_ASSISTANT_ID =
  import.meta.env.VITE_VAPI_ASSISTANT_ID || "9f2a4ad1-c6d3-4520-a766-f8ed67dc483d";

const styles = {
  app: {
    minHeight: "100vh",
    background: "#f7f7f8",
    fontFamily: "Inter, Arial, sans-serif",
    color: "#111827",
  },
  shell: {
    display: "grid",
    gridTemplateColumns: "320px 1fr",
    minHeight: "100vh",
  },
  sidebar: {
    background: "#ffffff",
    borderRight: "1px solid #e5e7eb",
    padding: "20px 18px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  brandWrap: {
    paddingBottom: "10px",
    borderBottom: "1px solid #eef2f7",
  },
  title: {
    fontSize: "34px",
    fontWeight: "800",
    marginBottom: "8px",
    letterSpacing: "-0.03em",
    color: "#111827",
  },
  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: 1.6,
  },
  sectionTitle: {
    fontSize: "15px",
    fontWeight: "800",
    marginBottom: "10px",
    color: "#111827",
  },
  statusRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  statusBar: {
    fontSize: "12px",
    padding: "8px 12px",
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
  capabilities: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  pill: {
    background: "#f9fafb",
    border: "1px solid #d1d5db",
    color: "#374151",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
  },
  quickButton: {
    width: "100%",
    textAlign: "left",
    padding: "14px 14px",
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
    lineHeight: 1.5,
  },
  primaryVoiceButton: {
    padding: "12px 16px",
    borderRadius: "14px",
    border: "none",
    background: "#111827",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
    marginRight: "8px",
  },
  dangerButton: {
    padding: "12px 16px",
    borderRadius: "14px",
    border: "1px solid #fecaca",
    background: "#fff1f2",
    color: "#991b1b",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
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
  },
  transcriptBox: {
    marginTop: "10px",
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "12px",
    minHeight: "70px",
  },
  transcriptLabel: {
    fontSize: "12px",
    color: "#6b7280",
    fontWeight: "700",
    marginBottom: "6px",
  },
  transcriptText: {
    fontSize: "13px",
    color: "#111827",
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    background: "#ffffff",
  },
  topBar: {
    padding: "18px 24px",
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
  voiceCard: {
    marginTop: "14px",
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "14px",
  },
  chat: {
    flex: 1,
    padding: "24px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    background: "#ffffff",
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
  },
  bubbleSystem: {
    maxWidth: "78%",
    background: "#fef3c7",
    color: "#92400e",
    padding: "14px 16px",
    borderRadius: "16px",
    border: "1px solid #fde68a",
    whiteSpace: "pre-wrap",
    lineHeight: 1.7,
    fontSize: "14px",
  },
  controls: {
    padding: "18px 24px 24px",
    borderTop: "1px solid #e5e7eb",
    background: "#ffffff",
  },
  inputRow: {
    display: "flex",
    gap: "12px",
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
  },
  sendButton: {
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
    const checkBackend = async () => {
      try {
        setBackendStatus("waking");
        const response = await fetchWithTimeout(`${API_BASE}/`, {}, 20000);
        setBackendStatus(response.ok ? "online" : "offline");
      } catch (error) {
        console.error("Backend ping failed:", error);
        setBackendStatus("offline");
      }
    };

    checkBackend();
  }, []);

  useEffect(() => {
    console.log("API_BASE:", API_BASE);
    console.log("VAPI_PUBLIC_KEY:", VAPI_PUBLIC_KEY);
    console.log("VAPI_ASSISTANT_ID:", VAPI_ASSISTANT_ID);
  }, []);

  useEffect(() => {
    try {
      if (!VAPI_PUBLIC_KEY || !VAPI_ASSISTANT_ID) {
        setLastVoiceNote("Vapi credentials are missing.");
        return;
      }

      const vapi = new Vapi(VAPI_PUBLIC_KEY);
      vapiRef.current = vapi;
      setLastVoiceNote("Vapi initialized successfully.");

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
    } catch (error) {
      console.error("Vapi initialization failed:", error);
      setLastVoiceNote("Vapi initialization failed.");
    }
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
      console.error("Chat request failed:", error);
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
      <div style={styles.shell}>
        <aside style={styles.sidebar}>
          <div style={styles.brandWrap}>
            <div style={styles.title}>Sahaya AI</div>
            <div style={styles.subtitle}>
              Multilingual government assistance assistant for healthcare,
              education, finance, public services, schemes, rewards, nearby help,
              and live voice conversations.
            </div>
          </div>

          <div style={styles.statusRow}>
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
          </div>

          <div>
            <div style={styles.sectionTitle}>Capabilities</div>
            <div style={styles.capabilities}>
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

          <div>
            <div style={styles.sectionTitle}>Voice controls</div>
            <div style={styles.small}>
              Voice input and voice output are handled by Vapi instead of the browser.
            </div>

            <div style={{ marginTop: 12, display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                style={styles.primaryVoiceButton}
                onClick={startVapiVoice}
                disabled={voiceActive || voiceStatus === "connecting"}
              >
                {voiceStatus === "connecting" ? "Connecting..." : "🎤 Start Voice"}
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
          </div>

          <div>
            <button style={styles.secondaryButton} onClick={clearChat}>
              Reset Chat
            </button>
          </div>
        </aside>

        <main style={styles.main}>
          <div style={styles.topBar}>
            <div style={styles.topTitle}>Citizen Support Workspace</div>
            <div style={styles.topSubtitle}>
              Ask Sahaya about schemes, eligibility, hospitals, banks, police, ration offices, and more.
              Use text chat or talk directly with the voice assistant.
            </div>

            <div style={styles.voiceCard}>
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 6 }}>
                Voice mode
              </div>
              <div style={styles.topSubtitle}>
                Start a live call for multilingual speech input and spoken responses.
                Text chat remains available below.
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
                      <div style={{ marginTop: 12, display: "flex", gap: "8px", flexWrap: "wrap" }}>
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
                placeholder="Message Sahaya AI..."
              />
              <button
                style={styles.sendButton}
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
        </main>
      </div>
    </div>
  );
}
