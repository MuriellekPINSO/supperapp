import { useState, useEffect } from "react";
import { green, greenDark, bg, card, textMuted, border, yellow } from "./theme";
import HomeScreen from "./screens/HomeScreen";
import DocsScreen from "./screens/DocsScreen";
import CNIScreen from "./screens/CNIScreen";
import AIChatScreen from "./screens/AIChatScreen";
import OpportunitesScreen from "./screens/OpportunitesScreen";
import ProfilScreen from "./screens/ProfilScreen";
import FacturesScreen from "./screens/FacturesScreen";
import SimpleServiceScreen from "./screens/SimpleServiceScreen";
import BottomNav from "./components/BottomNav";
import {
  IdCard, Sparkles, CreditCard, Bell, Star,
  Shield, Lock, Heart, Hospital, FileText,
  GraduationCap, FileEdit, Lightbulb, Coins
} from "lucide-react";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => { setTimeout(() => setSplashDone(true), 1600); }, []);

  const noNavScreens = ["ai", "cni", "renew", "assurance", "permis", "sante", "cnss", "rdv", "impots", "universite", "perte"];

  const renderScreen = () => {
    switch (screen) {
      case "home": return <HomeScreen goTo={setScreen} />;
      case "docs": return <DocsScreen goTo={setScreen} />;
      case "cni": return <CNIScreen goTo={setScreen} />;
      case "ai": return <AIChatScreen goTo={setScreen} />;
      case "opportunites": return <OpportunitesScreen goTo={setScreen} />;
      case "profil": return <ProfilScreen goTo={setScreen} />;
      case "factures": return <FacturesScreen goTo={setScreen} />;
      case "assurance": return <SimpleServiceScreen goTo={setScreen} back="docs" title="Assurance Auto" icon={<Shield size={36} />} description="Votre assurance Toyota Corolla AB-1234-BJ (NSIA Bénin) expire le 15 Mars 2026 — dans 16 jours. Prime de renouvellement : 85 000 FCFA (tous risques)." actionLabel="Renouveler l'assurance" successTitle="Assurance renouvelée !" successDesc="Valide jusqu'au 15 Mars 2027. Attestation envoyée." successRef="NSIA-2026-RENEW-44321" />;
      case "cnss": return <SimpleServiceScreen goTo={setScreen} back="docs" title="CNSS — Sécurité Sociale" icon={<Lock size={36} />} description="N° 0045-BJ-9871234 · Vous êtes éligible à une allocation familiale de 45 000 FCFA pour vos 2 enfants à charge. Cliquez pour en faire la demande." actionLabel="Demander l'allocation" successTitle="Demande soumise !" successDesc="Allocation familiale CNSS 45 000 FCFA. Traitement sous 5 jours." successRef="CNSS-AF-2026-00112" />;
      case "sante": return <SimpleServiceScreen goTo={setScreen} back="docs" title="Carnet de Santé" icon={<Heart size={36} />} description="Bilan 2025 : Score 78/100. IMC 22.4 ✓, Tension 120/78 ✓, Glycémie 5.1 ✓. À surveiller : cholestérol 5.8 mmol/L (légèrement élevé). Prochain bilan recommandé dans 10 mois." actionLabel="Prendre RDV bilan" successTitle="RDV confirmé !" successDesc="Bilan santé au CNHU le 10 Mars à 9h00." successRef="RDV-SANTE-2026-00234" />;
      case "rdv": return <SimpleServiceScreen goTo={setScreen} back="home" title="Rendez-vous Médical" icon={<Hospital size={36} />} description="Prochain créneau disponible au CNHU Hubert Maga : Aujourd'hui à 15h30 ou Demain à 9h00. Votre carnet de santé numérique sera partagé automatiquement avec le médecin." actionLabel="Confirmer RDV — CNHU 15h30" successTitle="RDV confirmé !" successDesc="CNHU Hubert Maga · Aujourd'hui 15h30. Rappel SMS 1h avant." successRef="RDV-CNHU-2026-00234" />;
      case "impots": return <SimpleServiceScreen goTo={setScreen} back="home" title="Déclaration d'Impôts" icon={<FileText size={36} />} description="Déclaration 2025 pré-remplie depuis CNSS. Revenus : 2 880 000 FCFA. Impôt estimé : 144 000 FCFA. Avec déduction charges familiales (-120 000 FCFA) → Impôt final : 120 000 FCFA." actionLabel="Soumettre la déclaration" successTitle="Déclaration soumise !" successDesc="DGI Bénin · Impôt 2025 : 120 000 FCFA avec déduction famille." successRef="IMP-2025-BJ-44521" />;
      case "universite": return <SimpleServiceScreen goTo={setScreen} back="home" title="Inscription Universitaire" icon={<GraduationCap size={36} />} description="Dossier pré-rempli : Identité, Licence UAC 2019 (Mention Bien), Acte de naissance. Candidature pour Master en Sciences Économiques à l'UAC. Taux de succès estimé par l'IA : 82%." actionLabel="Soumettre le dossier" successTitle="Dossier soumis !" successDesc="Candidature Master Économie UAC. Résultats dans 3 semaines." successRef="UAC-2026-CAND-05521" />;
      case "perte": return <SimpleServiceScreen goTo={setScreen} back="home" title="Déclaration de Perte" icon={<FileEdit size={36} />} description="Déclarez officiellement la perte d'un document (CNI, Permis, Passeport...). La déclaration est publiée et opposable à tous. Elle facilite la procédure de remplacement." actionLabel="Déclarer la perte" successTitle="Déclaration enregistrée !" successDesc="Déclaration de perte publiée officiellement. Procédure de remplacement initiée." successRef="PERTE-2026-BJ-00445" />;
      case "renew": return <SimpleServiceScreen goTo={setScreen} back="cni" title="Renouvellement CNI" icon={<IdCard size={36} />} description="Dossier pré-rempli automatiquement. RDV à la Préfecture du Littoral sélectionné : Lundi 2 Mars à 14h30. Coût total : 3 500 FCFA (taxe + timbre fiscal)." actionLabel="Confirmer & Payer — 3 500 FCFA" successTitle="Dossier soumis !" successDesc="RDV confirmé le Lundi 2 Mars à 14h30 · Préfecture du Littoral." successRef="RDV-CNI-2026-00892" />;
      default: return <HomeScreen goTo={setScreen} />;
    }
  };

  const features = [
    { icon: <IdCard size={16} />, title: "Wallet citoyen", desc: "CNI, permis, diplômes, actes certifiés — vérifiables par QR code" },
    { icon: <Sparkles size={16} />, title: "IA Claude intégrée", desc: "Vraie IA qui connaît votre dossier et répond en temps réel" },
    { icon: <CreditCard size={16} />, title: "Paiements intégrés", desc: "SBEE, SONEB, Trésor via MTN/Moov Money" },
    { icon: <Bell size={16} />, title: "Services proactifs", desc: "Alertes expiration CNI, assurance, aides CNSS disponibles" },
    { icon: <Star size={16} />, title: "Opportunités ciblées", desc: "Bourses, emplois, aides filtrées selon votre profil" },
  ];

  const demoLinks = [
    { screen: "ai", icon: <Sparkles size={14} />, label: "Parler à l'IA citoyenne (vraie IA !)" },
    { screen: "cni", icon: <IdCard size={14} />, label: "Voir ma CNI + renouvellement" },
    { screen: "factures", icon: <Lightbulb size={14} />, label: "Payer mes factures" },
    { screen: "impots", icon: <FileText size={14} />, label: "Déclarer mes impôts" },
    { screen: "cnss", icon: <Coins size={14} />, label: "Demander aide CNSS" },
    { screen: "opportunites", icon: <Star size={14} />, label: "Voir mes opportunités" },
  ];

  return (
    <div style={{ display: "flex", gap: 40, padding: 30, minHeight: "100vh", alignItems: "flex-start", justifyContent: "center", flexWrap: "wrap", background: `linear-gradient(135deg, #E8F0EA 0%, ${bg} 50%, #E0EBE3 100%)`, fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Splash */}
      {!splashDone && (
        <div style={{ position: "fixed", inset: 0, background: `linear-gradient(135deg, ${greenDark}, #004D30)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ fontSize: 42, fontWeight: 900, color: "#fff", letterSpacing: -2, animation: "scaleIn 0.6s ease-out" }}>Mon<span style={{ color: yellow }}>Bénin</span></div>
          <div style={{ color: "rgba(255,255,255,0.6)", marginTop: 8, animation: "fadeIn 0.6s ease-out 0.3s both" }}>Votre portail citoyen officiel</div>
          <div style={{ width: 36, height: 36, border: "3px solid rgba(255,255,255,0.2)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", marginTop: 36 }} />
        </div>
      )}

      {/* Phone */}
      <div style={{ width: 390, height: 820, background: card, borderRadius: 44, boxShadow: "0 30px 80px rgba(0,0,0,0.18), 0 0 0 8px #1A2E1E, 0 0 0 10px rgba(0,0,0,0.1)", overflow: "hidden", position: "relative", flexShrink: 0 }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 120, height: 30, background: "#1A2E1E", borderRadius: "0 0 18px 18px", zIndex: 100 }}>
          <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", width: 60, height: 5, background: "rgba(255,255,255,0.3)", borderRadius: 3 }} />
        </div>
        <div style={{ position: "absolute", inset: 0 }}>
          {renderScreen()}
        </div>
        {!noNavScreens.includes(screen) && <BottomNav current={screen} goTo={setScreen} />}
      </div>

      {/* Info panel */}
      <div style={{ maxWidth: 360, padding: "20px 0", animation: "fadeIn 0.6s ease-out 0.5s both" }}>
        <div style={{ display: "inline-block", background: `linear-gradient(135deg, ${green}, ${greenDark})`, color: "#fff", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 14, letterSpacing: 0.5 }}>DÉMO INTERACTIVE</div>
        <h1 style={{ fontWeight: 900, fontSize: 36, lineHeight: 1.2, letterSpacing: -1, color: "#1A2E1E" }}>Mon<span style={{ color: green }}>Bénin</span></h1>
        <p style={{ color: textMuted, marginTop: 10, lineHeight: 1.7, fontSize: 14 }}>Super App citoyenne du Bénin — tous vos documents, services et démarches administratives en un seul endroit, avec une IA réelle intégrée.</p>

        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          {features.map(f => (
            <div key={f.title} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: greenDark, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>{f.icon}</div>
              <div><div style={{ fontWeight: 700, fontSize: 14, color: "#1A2E1E" }}>{f.title}</div><div style={{ fontSize: 13, color: textMuted, marginTop: 2 }}>{f.desc}</div></div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20, background: card, borderRadius: 14, padding: 16, border: `1px solid ${border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: textMuted, marginBottom: 12 }}>Naviguer dans la démo</div>
          {demoLinks.map(l => (
            <div key={l.screen} onClick={() => setScreen(l.screen)} style={{ color: greenDark, fontWeight: 600, fontSize: 13, cursor: "pointer", marginBottom: 8, padding: "4px 0", transition: "all 0.2s", borderRadius: 6, display: "flex", alignItems: "center", gap: 6 }}>
              {l.icon} {l.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
