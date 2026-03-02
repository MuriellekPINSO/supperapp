import { useState } from "react";
import { green, greenDark, bg, card, textMuted, border } from "../theme";
import { Lightbulb, Droplets, Landmark, CheckCircle2, Home, Smartphone, CreditCard, ArrowLeft } from "lucide-react";

export default function FacturesScreen({ goTo }) {
    const [selected, setSelected] = useState(0);
    const [done, setDone] = useState(false);
    const bills = [
        { icon: <Lightbulb size={22} color="#F59E0B" />, name: "SBEE - Électricité", sub: "Janvier 2026 · Réf: 00142876", amount: "28 400" },
        { icon: <Droplets size={22} color="#3B82F6" />, name: "SONEB - Eau", sub: "Janvier 2026 · Réf: WB-08743", amount: "14 200" },
        { icon: <Landmark size={22} color="#8B5CF6" />, name: "Quittance Trésor", sub: "Patente 2026 · Réf: TP-2026-1145", amount: "45 000" },
    ];
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", background: bg }}>
            <div style={{ background: `linear-gradient(135deg, ${greenDark}, #005F3A)`, padding: "48px 20px 16px", flexShrink: 0 }}>
                <div onClick={() => goTo("home")} style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, cursor: "pointer", marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
                    <ArrowLeft size={14} /> Accueil
                </div>
                <div style={{ fontWeight: 800, color: "#fff", fontSize: 20 }}>Paiement de Factures</div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", paddingBottom: 20 }}>
                <div style={{ background: card, margin: 14, borderRadius: 16, border: `1px solid ${border}`, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                    {bills.map((b, i) => (
                        <div key={b.name} onClick={() => setSelected(i)} style={{ padding: "13px 14px", display: "flex", alignItems: "center", gap: 11, borderBottom: i < bills.length - 1 ? `1px solid ${border}` : "none", background: selected === i ? "rgba(0,168,107,0.06)" : "transparent", cursor: "pointer", transition: "background 0.2s" }}>
                            {b.icon}
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: 13 }}>{b.name}</div>
                                <div style={{ fontSize: 12, color: textMuted }}>{b.sub}</div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontWeight: 800, fontSize: 15 }}>{b.amount}</div>
                                <div style={{ fontSize: 11, color: textMuted }}>FCFA</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ textAlign: "center", marginBottom: 10, animation: "fadeIn 0.3s ease-out" }}>
                    <span style={{ fontSize: 32, fontWeight: 800 }}>{bills[selected].amount} </span>
                    <span style={{ fontSize: 20, color: green, fontWeight: 800 }}>FCFA</span>
                    <div style={{ fontSize: 13, color: textMuted }}>{bills[selected].name}</div>
                </div>
                <div style={{ padding: "0 14px" }}>
                    <select style={{ width: "100%", background: card, border: `1.5px solid ${border}`, borderRadius: 12, padding: "12px 14px", fontSize: 14, marginBottom: 12, outline: "none", fontFamily: "inherit" }}>
                        <option>MTN Mobile Money</option>
                        <option>Moov Money</option>
                        <option>Carte bancaire</option>
                    </select>
                    {done ? (
                        <div style={{ background: "#F0FBF4", borderRadius: 14, padding: 16, border: `1px solid ${green}`, textAlign: "center", animation: "scaleIn 0.4s ease-out" }}>
                            <CheckCircle2 size={32} color={green} style={{ margin: "0 auto" }} />
                            <div style={{ fontWeight: 800, fontSize: 15, marginTop: 6 }}>Paiement effectué !</div>
                            <div style={{ fontSize: 13, color: textMuted, marginTop: 4 }}>{bills[selected].name} — {bills[selected].amount} FCFA payé. Reçu par SMS.</div>
                            <div style={{ fontFamily: "monospace", fontSize: 11, color: greenDark, marginTop: 8, background: bg, padding: "5px 10px", borderRadius: 8 }}>PAY-2026-BJ-887654</div>
                        </div>
                    ) : (
                        <button onClick={() => setDone(true)} style={{ width: "100%", background: `linear-gradient(135deg, ${green}, ${greenDark})`, color: "#fff", border: "none", borderRadius: 13, padding: "14px", fontWeight: 800, fontSize: 15, cursor: "pointer", boxShadow: `0 4px 16px rgba(0,168,107,0.3)` }}>Payer maintenant</button>
                    )}
                    {done && (
                        <button onClick={() => goTo("home")} style={{ width: "100%", background: card, color: "#333", border: `1.5px solid ${border}`, borderRadius: 13, padding: "12px", fontWeight: 600, fontSize: 14, cursor: "pointer", marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                            <Home size={16} /> Retour à l'accueil
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
