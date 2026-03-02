import { green, greenDark, bg, card, textMuted, border } from "../theme";
import {
    IdCard, FileText, MapPin, Car, Shield, ClipboardList,
    GraduationCap, BookOpen, Heart, Lock, ChevronRight
} from "lucide-react";

export default function DocsScreen({ goTo }) {
    const groups = [
        {
            label: "Identité & Civil", items: [
                { icon: <IdCard size={18} />, title: "Carte Nationale d'Identité", sub: "N° BJ-CNI-2021-456789", status: "⚠ expire 43j", statusColor: "#FF6B35", screen: "cni" },
                { icon: <FileText size={18} />, title: "Acte de Naissance", sub: "N°2187/1992 · Mairie Cotonou", status: "✓ certifié", statusColor: green },
                { icon: <MapPin size={18} />, title: "Certificat de résidence", sub: "Cotonou, Littoral · 2024", status: "✓ valide", statusColor: green },
            ]
        },
        {
            label: "Mobilité", items: [
                { icon: <Car size={18} />, title: "Permis de conduire", sub: "Cat. B · N° PB-2019-00341", status: "✓ valide 2029", statusColor: green, screen: "permis" },
                { icon: <Shield size={18} />, title: "Assurance Toyota Corolla", sub: "NSIA Bénin · AB 1234 BJ", status: "⚠ 16j restants", statusColor: "#FF6B35", screen: "assurance" },
                { icon: <ClipboardList size={18} />, title: "Carte grise", sub: "Toyota Corolla 2018 · Gris", status: "✓ valide", statusColor: green },
            ]
        },
        {
            label: "Formation", items: [
                { icon: <GraduationCap size={18} />, title: "Licence en Économie", sub: "UAC · 2019 · Mention Bien", status: "✓ reconnu", statusColor: green },
                { icon: <BookOpen size={18} />, title: "Baccalauréat C", sub: "Lycée Béhanzin · 2015", status: "✓ certifié", statusColor: green },
            ]
        },
        {
            label: "Santé & Social", items: [
                { icon: <Heart size={18} />, title: "Bilan santé 2025", sub: "CHNU · 12 Janvier 2025", status: "Score 78/100", statusColor: green, screen: "sante" },
                { icon: <Lock size={18} />, title: "Numéro CNSS", sub: "N° 0045-BJ-9871234", status: "✓ actif", statusColor: green, screen: "cnss" },
            ]
        },
    ];
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", background: bg }}>
            <div style={{ background: `linear-gradient(135deg, ${greenDark}, #005F3A)`, padding: "48px 20px 16px", flexShrink: 0 }}>
                <div onClick={() => goTo("home")} style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, cursor: "pointer", marginBottom: 6 }}>← Accueil</div>
                <div style={{ fontWeight: 800, color: "#fff", fontSize: 20 }}>Mes Documents</div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
                {groups.map((g, gi) => (
                    <div key={g.label} style={{ animation: `fadeIn 0.4s ease-out ${gi * 0.1}s both` }}>
                        <div style={{ padding: "14px 16px 6px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: textMuted }}>{g.label}</div>
                        <div style={{ background: card, margin: "0 14px", borderRadius: 16, border: `1px solid ${border}`, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                            {g.items.map((item, i) => (
                                <div key={item.title} onClick={() => item.screen && goTo(item.screen)} style={{ padding: "13px 14px", display: "flex", alignItems: "center", gap: 11, borderBottom: i < g.items.length - 1 ? `1px solid ${border}` : "none", cursor: item.screen ? "pointer" : "default", transition: "background 0.2s" }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: greenDark }}>{item.icon}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, fontSize: 13 }}>{item.title}</div>
                                        <div style={{ fontSize: 12, color: textMuted, marginTop: 1 }}>{item.sub}</div>
                                    </div>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: item.statusColor }}>{item.status}</span>
                                    {item.screen && <ChevronRight size={16} color={textMuted} />}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
