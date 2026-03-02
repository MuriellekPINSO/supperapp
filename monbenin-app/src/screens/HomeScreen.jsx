import { green, greenDark, greenLight, bg, card, textMuted, border, yellow } from "../theme";
import {
    Car, Coins, Lightbulb, IdCard, CreditCard, Hospital, FileText,
    GraduationCap, FileEdit, Star, Sparkles, Shield, Heart, ChevronRight
} from "lucide-react";

export default function HomeScreen({ goTo }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", background: bg }}>
            <div style={{ background: `linear-gradient(135deg, ${greenDark}, #005F3A)`, padding: "48px 20px 20px", flexShrink: 0 }}>
                <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>Bonjour, vendredi 27 fév 2026</div>
                <div style={{ fontWeight: 800, color: "#fff", fontSize: 22, marginTop: 2 }}>Koffi Adéchina</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", padding: "4px 12px", borderRadius: 20, color: "#fff", fontSize: 12, marginTop: 8 }}>
                    <span style={{ width: 7, height: 7, background: greenLight, borderRadius: "50%", display: "inline-block", animation: "pulseGlow 2s infinite" }} />
                    NPI · BJ-204-987-654-1
                </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
                {/* AI bubble */}
                <div onClick={() => goTo("ai")} style={{ margin: 14, background: "linear-gradient(135deg,#1A2E1E,#2D5A3D)", borderRadius: 18, padding: 16, cursor: "pointer", animation: "fadeIn 0.5s ease-out", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
                    <div style={{ color: greenLight, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                        <Sparkles size={14} /> IA Citoyenne · Active
                    </div>
                    <div style={{ color: "#fff", fontSize: 14, lineHeight: 1.5 }}>Votre CNI expire dans <strong>43 jours</strong>. Tapez sur l'IA pour lancer le renouvellement ou poser toute question.</div>
                    <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {["Renouveler CNI", "Parler à l'IA", "Mes alertes"].map(t => (
                            <span key={t} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", padding: "5px 12px", borderRadius: 20, fontSize: 12, border: "1px solid rgba(255,255,255,0.2)", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 4 }}>
                                {t} <ChevronRight size={12} />
                            </span>
                        ))}
                    </div>
                </div>

                {/* Alerts */}
                <div style={{ padding: "0 14px 6px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: textMuted, marginBottom: 8 }}>Alertes proactives</div>
                    {[
                        { icon: <Car size={20} />, title: "Assurance auto expire le 15 Mars", sub: "Toyota Corolla · AB 1234 BJ", badge: "16j", color: "#FFF3F0", accent: "#FF6B35", screen: "assurance" },
                        { icon: <Coins size={20} />, title: "Aide CNSS disponible pour vous", sub: "Allocation familiale · 45 000 FCFA", badge: "Nouveau", color: "#F0FBF4", accent: green, screen: "cnss" },
                        { icon: <Lightbulb size={20} />, title: "Facture SBEE disponible", sub: "Échéance: 05 Mars · 28 400 FCFA", badge: "À payer", color: "#EBF5FB", accent: "#2196F3", screen: "factures" },
                    ].map((a, i) => (
                        <div key={a.title} onClick={() => goTo(a.screen)} style={{ background: a.color, borderLeft: `3px solid ${a.accent}`, borderRadius: 12, padding: "10px 12px", marginBottom: 8, display: "flex", alignItems: "center", gap: 10, cursor: "pointer", animation: `slideInRight 0.4s ease-out ${i * 0.1}s both`, transition: "transform 0.2s, box-shadow 0.2s" }}>
                            <div style={{ color: a.accent, flexShrink: 0 }}>{a.icon}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: 13 }}>{a.title}</div>
                                <div style={{ fontSize: 12, color: textMuted }}>{a.sub}</div>
                            </div>
                            <span style={{ background: a.accent, color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10 }}>{a.badge}</span>
                        </div>
                    ))}
                </div>

                {/* Services */}
                <div style={{ padding: "4px 14px 0" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: textMuted, marginBottom: 10 }}>Services</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 9 }}>
                        {[
                            { icon: <IdCard size={22} />, name: "Mes docs", screen: "docs", hi: true },
                            { icon: <Lightbulb size={22} />, name: "Factures", screen: "factures" },
                            { icon: <Hospital size={22} />, name: "RDV médical", screen: "rdv" },
                            { icon: <FileText size={22} />, name: "Impôts", screen: "impots" },
                            { icon: <GraduationCap size={22} />, name: "Université", screen: "universite" },
                            { icon: <FileEdit size={22} />, name: "Déc. perte", screen: "perte" },
                            { icon: <Star size={22} />, name: "Opportunités", screen: "opportunites" },
                            { icon: <Sparkles size={22} />, name: "Assistant IA", screen: "ai" },
                        ].map((s, i) => (
                            <div key={s.name} onClick={() => goTo(s.screen)} style={{ background: s.hi ? `linear-gradient(135deg, ${greenDark}, ${green})` : card, border: `1px solid ${s.hi ? greenDark : border}`, borderRadius: 14, padding: "11px 4px 9px", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, cursor: "pointer", animation: `scaleIn 0.3s ease-out ${i * 0.05}s both`, transition: "transform 0.2s, box-shadow 0.2s", boxShadow: s.hi ? `0 4px 16px rgba(0,168,107,0.3)` : "0 2px 8px rgba(0,0,0,0.04)", color: s.hi ? "rgba(255,255,255,0.9)" : textMuted }}>
                                {s.icon}
                                <span style={{ fontSize: 10, fontWeight: 600, textAlign: "center", lineHeight: 1.3 }}>{s.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Document wallet */}
                <div style={{ padding: "16px 14px 0" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: textMuted, marginBottom: 10 }}>Mes Documents</div>
                    <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6 }}>
                        {[
                            { icon: <IdCard size={18} strokeWidth={2.5} />, type: "CNI", name: "Carte d'Identité", exp: "⚠ 43j", expColor: yellow, expText: "#000", bg: `linear-gradient(135deg,${greenDark},${green})`, screen: "cni" },
                            { icon: <Car size={18} strokeWidth={2.5} />, type: "Permis B", name: "Permis de Conduire", exp: "Valide 2029", expColor: "rgba(255,255,255,0.2)", expText: "#fff", bg: "linear-gradient(135deg,#1a2e50,#2d4a7a)", screen: "docs" },
                            { icon: <Heart size={18} strokeWidth={2.5} />, type: "Santé 2025", name: "Carnet de Santé", exp: "Score 78/100", expColor: "rgba(255,255,255,0.2)", expText: "#fff", bg: "linear-gradient(135deg,#005f73,#0a9396)", screen: "sante" },
                            { icon: <FileText size={18} strokeWidth={2.5} />, type: "Acte naissance", name: "Certifié RCCM", exp: "Certifié", expColor: "rgba(255,255,255,0.2)", expText: "#fff", bg: "linear-gradient(135deg,#7a5c00,#c49a00)", screen: "docs" },
                        ].map((d, i) => (
                            <div key={d.type} onClick={() => goTo(d.screen)} style={{ minWidth: 155, height: 90, background: d.bg, borderRadius: 14, padding: 13, flexShrink: 0, position: "relative", cursor: "pointer", animation: `slideInRight 0.4s ease-out ${i * 0.1}s both`, boxShadow: "0 4px 20px rgba(0,0,0,0.12)", transition: "transform 0.2s", color: "#fff" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 5, color: "rgba(255,255,255,0.6)", fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
                                    {d.icon} {d.type}
                                </div>
                                <div style={{ color: "#fff", fontWeight: 800, fontSize: 13, marginTop: 3 }}>{d.name}</div>
                                <div style={{ position: "absolute", bottom: 9, right: 9, background: d.expColor, color: d.expText, fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 8 }}>{d.exp}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
