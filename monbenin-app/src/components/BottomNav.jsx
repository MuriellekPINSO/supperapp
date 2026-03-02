import { green, greenDark, card, textMuted, border } from "../theme";
import { Home, IdCard, Sparkles, Star, User } from "lucide-react";

export default function BottomNav({ current, goTo }) {
    const tabs = [
        { id: "home", icon: <Home size={20} />, label: "Accueil" },
        { id: "docs", icon: <IdCard size={20} />, label: "Documents" },
        { id: "ai", icon: <Sparkles size={18} />, label: "IA" },
        { id: "opportunites", icon: <Star size={20} />, label: "Opps", badge: 3 },
        { id: "profil", icon: <User size={20} />, label: "Profil" },
    ];
    return (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 70, background: card, borderTop: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-around", zIndex: 50, paddingBottom: 8, backdropFilter: "blur(20px)" }}>
            {tabs.map(t => {
                const isActive = current === t.id;
                const isAI = t.id === "ai";
                return (
                    <div key={t.id} onClick={() => goTo(t.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", flex: 1, paddingTop: 8, position: "relative", transition: "all 0.2s" }}>
                        {isAI ? (
                            <div style={{ width: 40, height: 40, borderRadius: "50%", background: isActive ? `linear-gradient(135deg, ${green}, #007A4D)` : "#1A2E1E", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", marginTop: -16, boxShadow: isActive ? `0 4px 16px rgba(0,168,107,0.4)` : "0 4px 12px rgba(0,0,0,0.2)", transition: "all 0.3s" }}>
                                {t.icon}
                            </div>
                        ) : (
                            <div style={{ color: isActive ? green : textMuted, transition: "all 0.2s", transform: isActive ? "scale(1.1)" : "scale(1)" }}>
                                {t.icon}
                            </div>
                        )}
                        <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, color: isActive ? green : textMuted, transition: "all 0.2s" }}>{t.label}</span>
                        {t.badge && <span style={{ position: "absolute", top: isAI ? -8 : 4, right: "calc(50% - 20px)", background: "#E63946", color: "#fff", fontSize: 9, width: 14, height: 14, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{t.badge}</span>}
                        {isActive && !isAI && <div style={{ position: "absolute", top: 0, width: 20, height: 3, borderRadius: 2, background: green }} />}
                    </div>
                );
            })}
        </div>
    );
}
