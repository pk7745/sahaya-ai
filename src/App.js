import React, { useEffect, useMemo, useRef, useState } from "react";

const API_BASE = "https://sahaya-ai-3ss2.onrender.com";

const styles = {
  app: {
    minHeight: "100vh",
    background: "#f7f7f8",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: "#111827",
  },
  shell: {
    display: "grid",
    gridTemplateColumns: "290px 1fr",
    minHeight: "100vh",
  },
  sidebar: {
    background: "#ffffff",
    borderRight: "1px solid #e5e7eb",
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
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
  readButton: {
    padding: "10px 16px",
    borderRadius: "12px",
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
  },
  stopButton: {
    padding: "10px 16px",
    borderRadius: "12px",
    border: "none",
    background: "#dc2626",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
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
  if (/[\u0C80-\u0CFF]/.test(text)) return "kn-IN"; // Kannada
  if (/[\u0900-\u097F]/.test(text)) return "hi-IN"; // Hindi / Devanagari
  if (/[\u0B80-\u0BFF]/.test(text)) return "ta-IN"; // Tamil
  if (/[\u0C00-\u0C7F]/.test(text)) return "te-IN"; // Telugu
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
  const [listening, setListening] = useState(false);
  const [voiceLang, setVoiceLang] = useState("en-IN");
  const [speechVoices, setSpeechVoices] = useState([]);
  const [backendStatus, setBackendStatus] = useState("checking");
  const [speechStatus, setSpeechStatus] = useState("Ready to read replies");
  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);

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
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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

  const toggleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (!recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setListening(true);
      recognition.onend = () => setListening(false);
      recognition.onerror = () => setListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript || "";
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognitionRef.current = recognition;
    }

    if (listening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.lang = voiceLang;
      recognitionRef.current.start();
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
    setSpeechStatus("Chat reset complete");
  };

  return (
    <div style={styles.app}>
      <div style={styles.shell}>
        <aside style={styles.sidebar}>
          <div style={styles.brand}>
            <div style={styles.title}>Sahaya AI</div>
            <div style={styles.subtitle}>
              Multilingual government assistance assistant for healthcare,
              education, finance, public services, schemes, rewards, and nearby
              help.
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

              <div style={{ ...styles.statusBar, ...styles.statusWaking }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#2563eb",
                    display: "inline-block",
                  }}
                />
                {speechStatus}
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
                "Voice input",
                "Read aloud",
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
            <div style={styles.sectionTitle}>Voice settings</div>

            <label style={styles.small}>
              <input
                type="checkbox"
                checked={autoRead}
                onChange={(e) => setAutoRead(e.target.checked)}
                style={{ marginRight: 8 }}
              />
              Auto read responses
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

            <div style={{ marginTop: 12 }}>
              <button style={styles.secondaryButton} onClick={toggleVoiceInput}>
                {listening ? "🛑 Stop Mic" : "🎤 Voice Input"}
              </button>

              <button style={styles.secondaryButton} onClick={stopSpeaking}>
                ⏹ Stop Reading
              </button>
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
              Ask Sahaya about schemes, eligibility, hospitals, banks, police,
              ration offices, and more.
            </div>
          </div>

          <div style={styles.chat}>
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
                        ? styles.bubbleUser
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
                          🔊 Read
                        </button>

                        <button
                          style={styles.stopButton}
                          onClick={stopSpeaking}
                        >
                          ⏹ Stop
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
