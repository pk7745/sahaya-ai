import React, { useEffect, useRef, useState } from "react";

const API_BASE = "https://sahaya-ai-3ss2.onrender.com";

const styles = {
  app: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
    color: "#0f172a",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "320px 1fr",
    gap: "20px",
  },
  sidebar: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "20px",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
    border: "1px solid #e2e8f0",
    height: "fit-content",
  },
  main: {
    background: "#ffffff",
    borderRadius: "24px",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
    border: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    minHeight: "85vh",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#475569",
    lineHeight: 1.6,
  },
  sectionTitle: {
    fontSize: "15px",
    fontWeight: "700",
    marginBottom: "10px",
    marginTop: "22px",
  },
  pill: {
    display: "inline-block",
    background: "#f1f5f9",
    border: "1px solid #cbd5e1",
    color: "#334155",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    margin: "4px 6px 0 0",
  },
  quickButton: {
    width: "100%",
    textAlign: "left",
    padding: "12px 14px",
    borderRadius: "16px",
    border: "1px solid #cbd5e1",
    background: "#fff",
    cursor: "pointer",
    marginBottom: "10px",
    fontSize: "14px",
  },
  header: {
    padding: "24px",
    borderBottom: "1px solid #e2e8f0",
  },
  chat: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
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
    maxWidth: "80%",
    background: "#0f172a",
    color: "#fff",
    padding: "14px 16px",
    borderRadius: "20px",
    whiteSpace: "pre-wrap",
    lineHeight: 1.7,
  },
  bubbleBot: {
    maxWidth: "80%",
    background: "#f8fafc",
    color: "#0f172a",
    padding: "14px 16px",
    borderRadius: "20px",
    border: "1px solid #e2e8f0",
    whiteSpace: "pre-wrap",
    lineHeight: 1.7,
  },
  controls: {
    padding: "18px 20px 20px",
    borderTop: "1px solid #e2e8f0",
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
  },
  button: {
    padding: "12px 16px",
    borderRadius: "16px",
    border: "none",
    background: "#0f172a",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
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
};

function extractMapLinks(text) {
  const regex = /https?:\/\/www\.google\.com\/maps\?q=[^\s]+/g;
  return text.match(regex) || [];
}

function cleanTextForSpeech(text) {
  return text.replace(/https?:\/\/\S+/g, "").replace(/\s+/g, " ").trim();
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
  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const speak = (text) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanTextForSpeech(text));
    utterance.lang = voiceLang;
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
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
      recognition.lang = voiceLang;
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
      const response = await fetch(`${API_BASE}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: text }),
      });

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

      if (autoRead) {
        setTimeout(() => speak(assistantText), 250);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I could not connect to the backend. Please make sure the backend is live and the API URL is correct.",
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
  };

  return (
    <div style={styles.app}>
      <div style={styles.container}>
        <div style={styles.sidebar}>
          <div style={styles.title}>Sahaya AI</div>
          <div style={styles.subtitle}>
            Multilingual government assistance assistant for healthcare,
            education, finance, public services, schemes, rewards, and nearby
            help.
          </div>

          <div style={styles.sectionTitle}>Capabilities</div>
          <div>
            {[
              "Government schemes",
              "Eligibility guidance",
              "Nearby places",
              "Rewards and badges",
              "Voice input and read aloud",
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
              style={styles.input}
            >
              <option value="en-IN">English (India)</option>
              <option value="hi-IN">Hindi</option>
              <option value="kn-IN">Kannada</option>
              <option value="ta-IN">Tamil</option>
              <option value="te-IN">Telugu</option>
            </select>
          </div>

          <div style={{ marginTop: 16 }}>
            <button style={styles.secondaryButton} onClick={clearChat}>
              Reset Chat
            </button>
            <button style={styles.secondaryButton} onClick={stopSpeaking}>
              Stop Voice
            </button>
          </div>
        </div>

        <div style={styles.main}>
          <div style={styles.header}>
            <div style={{ ...styles.title, fontSize: 26, marginBottom: 6 }}>
              Citizen Support Workspace
            </div>
            <div style={styles.subtitle}>
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
                      <div style={{ marginTop: 12 }}>
                        <button
                          style={styles.secondaryButton}
                          onClick={() => speak(message.content)}
                        >
                          🔊 Listen
                        </button>
                        <button
                          style={styles.secondaryButton}
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
                placeholder="Ask Sahaya AI anything..."
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
              <button style={styles.secondaryButton} onClick={toggleVoiceInput}>
                {listening ? "🛑 Stop Mic" : "🎤 Voice Input"}
              </button>

              <button
                style={styles.secondaryButton}
                onClick={() => input && speak(input)}
              >
                🔊 Read Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
