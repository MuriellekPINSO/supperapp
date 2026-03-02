import { useState } from "react";
import { green, greenDark, bg, card, textMuted, border } from "../theme";
import { CheckCircle2, ArrowLeft, Home } from "lucide-react";

export default function SimpleServiceScreen({ goTo, back, title, icon, description, actionLabel, successTitle, successDesc, successRef }) {
    const [done, setDone] = useState(false);
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", background: bg }}>
            <div style={{ background: `linear-gradient(135deg, ${greenDark}, #005F3A)`, padding: "48px 20px 20px", flexShrink: 0 }}>
                <div onClick={() => goTo(back)} style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, cursor: "pointer", marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
                    <ArrowLeft size={14} /> Retour
                </div>
                <div style={{ fontWeight: 800, color: "#fff", fontSize: 20 }}>{title}</div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 14, paddingBottom: 30 }}>
                <div style={{ background: card, borderRadius: 16, padding: 20, border: `1px solid ${border}`, marginBottom: 14, animation: "scaleIn 0.4s ease-out", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                    <div style={{ fontSize: 36, textAlign: "center", marginBottom: 10, color: greenDark }}>{icon}</div>
                    <div style={{ fontSize: 14, lineHeight: 1.6, color: "#333" }}>{description}</div>
                </div>
                {done ? (
                    <div style={{ background: "#F0FBF4", borderRadius: 14, padding: 16, border: `1px solid ${green}`, textAlign: "center", animation: "scaleIn 0.4s ease-out" }}>
                        <CheckCircle2 size={36} color={green} style={{ margin: "0 auto" }} />
                        <div style={{ fontWeight: 800, fontSize: 15, marginTop: 8 }}>{successTitle}</div>
                        <div style={{ fontSize: 13, color: textMuted, marginTop: 6 }}>{successDesc}</div>
                        <div style={{ fontFamily: "monospace", fontSize: 12, color: greenDark, marginTop: 10, background: bg, padding: "6px 12px", borderRadius: 8 }}>{successRef}</div>
                    </div>
                ) : (
                    <button onClick={() => setDone(true)} style={{ width: "100%", background: `linear-gradient(135deg, ${green}, ${greenDark})`, color: "#fff", border: "none", borderRadius: 13, padding: "14px", fontWeight: 800, fontSize: 15, cursor: "pointer", boxShadow: `0 4px 16px rgba(0,168,107,0.3)`, transition: "transform 0.2s" }}>{actionLabel}</button>
                )}
                {done && (
                    <button onClick={() => goTo("home")} style={{ width: "100%", background: card, color: "#333", border: `1.5px solid ${border}`, borderRadius: 13, padding: "12px", fontWeight: 600, fontSize: 14, cursor: "pointer", marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        <Home size={16} /> Retour à l'accueil
                    </button>
                )}
            </div>
        </div>
    );
}
