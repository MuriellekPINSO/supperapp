import { useState, useRef, useEffect } from "react";
import { green, greenDark, greenLight, bg, card, textMuted, border, PROFILE } from "../theme";
import { ArrowLeft, Sparkles, Send } from "lucide-react";

export default function AIChatScreen({ goTo }) {
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Bonjour Koffi ! Je suis votre assistant citoyen IA.\n\nJe connais votre dossier : CNI expire dans **43 jours**, allocation CNSS de **45 000 FCFA** disponible, assurance auto expire dans **16 jours**.\n\nComment puis-je vous aider ?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const send = async (text) => {
        const msg = text || input.trim();
        if (!msg || loading) return;
        setInput("");
        setError(null);

        const newMessages = [...messages, { role: "user", content: msg }];
        setMessages(newMessages);
        setLoading(true);

        try {
            const geminiMessages = newMessages.map(m => ({
                role: m.role === "assistant" ? "model" : "user",
                parts: [{ text: m.content }]
            }));
            const API_KEY = "AIzaSyAZKXx5XWOhp6Wn22q6pT5488yGNac6Gos";
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        systemInstruction: { parts: [{ text: PROFILE }] },
                        contents: geminiMessages,
                        generationConfig: {
                            maxOutputTokens: 1000,
                            temperature: 0.7
                        }
                    })
                }
            );
            const data = await res.json();
            if (data.error) throw new Error(data.error.message);
            const reply = data.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("") || "Désolé, réessayez.";
            setMessages(prev => [...prev, { role: "assistant", content: reply }]);
        } catch (e) {
            setError("Erreur : " + e.message);
            setMessages(prev => prev.slice(0, -1));
        }
        setLoading(false);
    };

    const formatMsg = (text) => {
        return text.split("\n").map((line, i) => {
            const parts = line.split(/\*\*(.*?)\*\*/g);
            return (
                <span key={i}>
                    {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
                    {i < text.split("\n").length - 1 && <br />}
                </span>
            );
        });
    };

    const suggestions = [
        "Comment renouveler ma CNI ?",
        "Quelles aides CNSS ai-je droit ?",
        "Comment payer ma facture SBEE ?",
        "Déclarer mes impôts 2025",
        "Prendre RDV au CNHU",
        "Mon assurance auto expire bientôt",
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", background: bg }}>
            <div style={{ background: `linear-gradient(135deg, ${greenDark}, #005F3A)`, padding: "44px 16px 12px", flexShrink: 0 }}>
                <div onClick={() => goTo("home")} style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, cursor: "pointer", marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
                    <ArrowLeft size={14} /> Accueil
                </div>
                <div style={{ fontWeight: 800, color: "#fff", fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 8, height: 8, background: greenLight, borderRadius: "50%", display: "inline-block", animation: "pulseGlow 2s infinite" }} />
                    <Sparkles size={18} /> Assistant IA Citoyen
                </div>
                <div style={{ display: "flex", gap: 7, overflowX: "auto", marginTop: 10, paddingBottom: 2 }}>
                    {suggestions.map(s => (
                        <button key={s} onClick={() => send(s)} disabled={loading} style={{ whiteSpace: "nowrap", background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 20, padding: "5px 12px", fontSize: 12, cursor: "pointer", flexShrink: 0, fontFamily: "inherit", backdropFilter: "blur(10px)", transition: "all 0.2s" }}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 0" }}>
                {messages.map((m, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 12, animation: `${m.role === "user" ? "slideInRight" : "slideInLeft"} 0.3s ease-out` }}>
                        <div>
                            {m.role === "assistant" && (
                                <div style={{ fontSize: 11, color: textMuted, marginBottom: 3, paddingLeft: 4, display: "flex", alignItems: "center", gap: 4 }}>
                                    <Sparkles size={12} /> IA MonBénin
                                </div>
                            )}
                            <div style={{
                                maxWidth: 260,
                                background: m.role === "user" ? `linear-gradient(135deg, ${green}, ${greenDark})` : card,
                                color: m.role === "user" ? "#fff" : "#1A2E1E",
                                border: m.role === "assistant" ? `1px solid ${border}` : "none",
                                borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                                padding: "10px 14px",
                                fontSize: 14,
                                lineHeight: 1.55,
                                boxShadow: m.role === "user" ? "0 4px 12px rgba(0,168,107,0.2)" : "0 2px 8px rgba(0,0,0,0.04)"
                            }}>
                                {formatMsg(m.content)}
                            </div>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 12, animation: "fadeIn 0.3s ease-out" }}>
                        <div>
                            <div style={{ fontSize: 11, color: textMuted, marginBottom: 3, paddingLeft: 4, display: "flex", alignItems: "center", gap: 4 }}>
                                <Sparkles size={12} /> IA MonBénin
                            </div>
                            <div style={{ background: card, border: `1px solid ${border}`, borderRadius: "18px 18px 18px 4px", padding: "12px 16px", display: "flex", gap: 5, alignItems: "center" }}>
                                {[0, 1, 2].map(d => (
                                    <span key={d} style={{ width: 8, height: 8, background: green, borderRadius: "50%", display: "inline-block", animation: `bounce 0.8s ease ${d * 0.15}s infinite` }} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div style={{ background: "#FDECEA", border: "1px solid #E63946", borderRadius: 12, padding: "10px 14px", marginBottom: 12, fontSize: 13, color: "#C0392B", animation: "fadeIn 0.3s ease-out" }}>
                        {error}
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            <div style={{ padding: "10px 14px 82px", background: card, borderTop: `1px solid ${border}`, display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && send()}
                    placeholder="Posez votre question..."
                    disabled={loading}
                    style={{ flex: 1, background: bg, border: "none", borderRadius: 20, padding: "10px 16px", fontSize: 14, outline: "none", fontFamily: "inherit" }}
                />
                <button onClick={() => send()} disabled={loading || !input.trim()} style={{ width: 38, height: 38, borderRadius: "50%", background: loading ? "#ccc" : `linear-gradient(135deg, ${green}, ${greenDark})`, color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: loading ? "none" : "0 4px 12px rgba(0,168,107,0.3)", transition: "all 0.2s" }}>
                    {loading ? <span style={{ fontSize: 14 }}>…</span> : <Send size={16} />}
                </button>
            </div>
        </div>
    );
}
