import { greenDark, green, bg, card, textMuted, border } from "../theme";
import { User, Calendar, MapPin, Phone, Mail, Bell, Lock, Globe, ChevronRight } from "lucide-react";

export default function ProfilScreen({ goTo }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", background: bg }}>
            <div style={{ background: `linear-gradient(135deg, ${greenDark}, #005F3A)`, padding: "48px 20px 20px", textAlign: "center", flexShrink: 0 }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#00D484,#FFC107)", margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
                    <User size={28} color="#fff" />
                </div>
                <div style={{ fontWeight: 800, color: "#fff", fontSize: 18 }}>Koffi Adéchina Emmanuel</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "monospace" }}>NPI · BJ-204-987-654-1</div>
                <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 10, flexWrap: "wrap" }}>
                    {["✓ CNI active", "✓ CNSS affilié", "⚠ Assurance"].map(s => (
                        <span key={s} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: 11, padding: "3px 10px", borderRadius: 20, backdropFilter: "blur(10px)" }}>{s}</span>
                    ))}
                </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
                <div style={{ background: card, margin: "14px 14px 10px", borderRadius: 16, border: `1px solid ${border}`, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", animation: "fadeIn 0.4s ease-out" }}>
                    {[
                        [<Calendar size={18} />, "Date de naissance", "14 Août 1992 · Cotonou"],
                        [<MapPin size={18} />, "Adresse", "Fidjrossè, Cotonou"],
                        [<Phone size={18} />, "Téléphone", "+229 97 XX XX XX"],
                        [<Mail size={18} />, "Email", "k.adechina@email.com"]
                    ].map(([ic, t, s], i) => (
                        <div key={t} style={{ padding: "12px 14px", display: "flex", gap: 12, borderBottom: i < 3 ? `1px solid ${border}` : "none", alignItems: "center" }}>
                            <div style={{ color: greenDark }}>{ic}</div>
                            <div><div style={{ fontWeight: 700, fontSize: 13 }}>{t}</div><div style={{ fontSize: 12, color: textMuted }}>{s}</div></div>
                        </div>
                    ))}
                </div>
                <div style={{ background: card, margin: "0 14px", borderRadius: 16, border: `1px solid ${border}`, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", animation: "fadeIn 0.4s ease-out 0.1s both" }}>
                    {[
                        [<Bell size={18} />, "Notifications", "Toutes activées"],
                        [<Lock size={18} />, "Sécurité", "Empreinte activée"],
                        [<Globe size={18} />, "Langue", "Français"]
                    ].map(([ic, t, s], i) => (
                        <div key={t} style={{ padding: "12px 14px", display: "flex", gap: 12, borderBottom: i < 2 ? `1px solid ${border}` : "none", alignItems: "center" }}>
                            <div style={{ color: greenDark }}>{ic}</div>
                            <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 13 }}>{t}</div><div style={{ fontSize: 12, color: textMuted }}>{s}</div></div>
                            <ChevronRight size={16} color={textMuted} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
