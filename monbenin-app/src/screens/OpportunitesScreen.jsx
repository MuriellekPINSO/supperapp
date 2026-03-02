import { greenDark, green, bg, card, textMuted, border } from "../theme";
import { Sparkles, Calendar, CheckCircle, ArrowLeft } from "lucide-react";

export default function OpportunitesScreen({ goTo }) {
    const opps = [
        { tag: "Bourse", title: "Bourse d'excellence WAEMU — Master", desc: "Bourses CEDEAO pour étudiants. Frais de scolarité + allocation mensuelle.", deadline: "30 Mars 2026", eligible: true },
        { tag: "Emploi Public", title: "Concours INFOSEC — Analyste Économique", desc: "12 postes à la Direction Générale du Budget. Bac+3 requis.", deadline: "15 Avril 2026", eligible: true },
        { tag: "Aide Entreprise", title: "APIEX — Financement PME Jeunes", desc: "Subvention jusqu'à 5 000 000 FCFA pour entrepreneurs 25-40 ans.", deadline: "Permanent", eligible: true },
    ];
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", background: bg }}>
            <div style={{ background: `linear-gradient(135deg, ${greenDark}, #005F3A)`, padding: "48px 20px 16px", flexShrink: 0 }}>
                <div onClick={() => goTo("home")} style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, cursor: "pointer", marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
                    <ArrowLeft size={14} /> Accueil
                </div>
                <div style={{ fontWeight: 800, color: "#fff", fontSize: 20 }}>Opportunités</div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
                <div style={{ margin: "12px 14px", background: "rgba(0,168,107,0.1)", borderRadius: 12, padding: "10px 14px", fontSize: 13, color: greenDark, animation: "fadeIn 0.4s ease-out", display: "flex", alignItems: "center", gap: 6 }}>
                    <Sparkles size={16} /> <strong>3 opportunités</strong> correspondent à votre profil (économiste, 33 ans, Cotonou)
                </div>
                {opps.map((o, i) => (
                    <div key={o.title} style={{ background: card, borderRadius: 14, padding: 14, margin: "0 14px 10px", border: `1px solid ${border}`, animation: `slideUp 0.4s ease-out ${i * 0.1}s both`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                        <span style={{ background: bg, color: textMuted, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{o.tag}</span>
                        <div style={{ fontWeight: 800, fontSize: 14, marginTop: 6 }}>{o.title}</div>
                        <div style={{ fontSize: 12, color: textMuted, marginTop: 4, lineHeight: 1.5 }}>{o.desc}</div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                            <span style={{ fontSize: 12, color: textMuted, display: "flex", alignItems: "center", gap: 4 }}>
                                <Calendar size={14} /> {o.deadline}
                            </span>
                            <span style={{ background: "rgba(0,168,107,0.1)", color: greenDark, fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20, display: "flex", alignItems: "center", gap: 4 }}>
                                <CheckCircle size={14} /> Éligible
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
