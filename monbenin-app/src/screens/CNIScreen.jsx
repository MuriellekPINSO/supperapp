import { green, greenDark, greenLight, bg, card, textMuted, border, yellow } from "../theme";
import { IdCard, Smartphone, QrCode, Download, ChevronRight, AlertTriangle, ShieldCheck } from "lucide-react";

export default function CNIScreen({ goTo }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", background: bg }}>
            <div style={{ background: `linear-gradient(135deg, ${greenDark}, #005F3A)`, padding: "48px 20px 16px", flexShrink: 0 }}>
                <div onClick={() => goTo("docs")} style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, cursor: "pointer", marginBottom: 6 }}>← Documents</div>
                <div style={{ fontWeight: 800, color: "#fff", fontSize: 20 }}>Carte d'Identité</div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", paddingBottom: 20 }}>
                <div style={{ margin: 14, background: `linear-gradient(135deg,${greenDark},${green})`, borderRadius: 18, padding: 20, position: "relative", animation: "scaleIn 0.4s ease-out", boxShadow: "0 8px 32px rgba(0,122,77,0.3)" }}>
                    <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 4 }}>
                        <IdCard size={12} /> République du Bénin
                    </div>
                    <div style={{ color: "#fff", fontWeight: 800, fontSize: 16, marginTop: 4 }}>Carte Nationale d'Identité</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
                        {[["Nom & Prénoms", "ADÉCHINA Koffi"], ["Naissance", "14/08/1992"], ["N° CNI", "BJ-CNI-2021-456789"], ["NPI", "204-987-654-1"], ["Délivré le", "12/04/2021"], ["Expiration", "10/04/2026"]].map(([l, v]) => (
                            <div key={l}><div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>{l}</div><div style={{ color: "#fff", fontWeight: 700, fontSize: 13, marginTop: 2 }}>{v}</div></div>
                        ))}
                    </div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", padding: "4px 12px", borderRadius: 20, color: "#fff", fontSize: 12, marginTop: 12 }}>
                        <ShieldCheck size={14} /> Vérifié & Certifié
                    </div>
                    <div style={{ position: "absolute", right: 16, bottom: 16, width: 56, height: 56, background: "rgba(255,255,255,0.15)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(10px)", color: "#fff" }}>
                        <Smartphone size={26} />
                    </div>
                </div>
                <div style={{ margin: "0 14px 12px", background: "#FFF8E1", borderRadius: 12, padding: 13, borderLeft: `3px solid ${yellow}`, animation: "fadeIn 0.5s ease-out 0.2s both", display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <AlertTriangle size={20} color="#F59E0B" style={{ flexShrink: 0, marginTop: 1 }} />
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>Expire dans 43 jours</div>
                        <div style={{ fontSize: 12, color: textMuted, marginTop: 4 }}>Renouvelez avant le 10 Avril 2026 pour éviter toute interruption.</div>
                    </div>
                </div>
                <div style={{ padding: "0 14px", animation: "slideUp 0.5s ease-out 0.3s both" }}>
                    <button onClick={() => goTo("renew")} style={{ width: "100%", background: `linear-gradient(135deg, ${green}, ${greenDark})`, color: "#fff", border: "none", borderRadius: 13, padding: "14px", fontWeight: 800, fontSize: 15, cursor: "pointer", marginBottom: 8, boxShadow: `0 4px 16px rgba(0,168,107,0.3)`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        <IdCard size={18} /> Renouveler ma CNI
                    </button>
                    <button style={{ width: "100%", background: card, color: "#333", border: `1.5px solid ${border}`, borderRadius: 13, padding: "12px", fontWeight: 600, fontSize: 14, cursor: "pointer", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        <QrCode size={18} /> Partager le QR code
                    </button>
                    <button style={{ width: "100%", background: card, color: "#333", border: `1.5px solid ${border}`, borderRadius: 13, padding: "12px", fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        <Download size={18} /> Télécharger en PDF
                    </button>
                </div>
            </div>
        </div>
    );
}
