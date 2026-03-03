import React, { useRef, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "../ThemeContext";
import { shadows } from "../theme";
import { IdCard, QrCode, ArrowLeft, AlertTriangle, ShieldCheck, Clock, MapPin, RefreshCw } from "lucide-react-native";

export default function CNIScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const { colors, isDark } = useAppTheme();
    const cardScale = useRef(new Animated.Value(0.9)).current;
    const cardFade = useRef(new Animated.Value(0)).current;
    const contentFade = useRef(new Animated.Value(0)).current;
    const contentSlide = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.parallel([
                Animated.spring(cardScale, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true }),
                Animated.timing(cardFade, { toValue: 1, duration: 500, useNativeDriver: true }),
            ]),
            Animated.parallel([
                Animated.timing(contentFade, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.spring(contentSlide, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
            ]),
        ]).start();
    }, []);

    const fields = [["Nom complet", "ADÉCHINA Koffi Emmanuel"], ["Date de naissance", "14/08/1992"], ["N° CNI", "BJ-CNI-2021-456789"], ["NPI", "204-987-654-1"], ["Délivré le", "12/04/2021"], ["Expiration", "10/04/2026"]];
    const headerGrad = isDark ? [colors.primaryDeep, colors.bgDark] : [colors.primaryDark, colors.primary];

    return (
        <View style={[s.container, { backgroundColor: colors.bgDark }]}>
            <LinearGradient colors={headerGrad} start={{ x: 0, y: 0 }} end={{ x: 0.5, y: 1 }} style={[s.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}><ArrowLeft size={16} color="rgba(255,255,255,0.7)" /><Text style={s.backText}>Retour</Text></TouchableOpacity>
                <View style={s.headerRow}><IdCard size={22} color="#fff" /><Text style={s.headerTitle}>Carte d'Identité</Text></View>
            </LinearGradient>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                <Animated.View style={{ opacity: cardFade, transform: [{ scale: cardScale }] }}>
                    <LinearGradient colors={[colors.primaryDark, colors.primaryDeep]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.cniCard}>
                        <View style={s.cniDecor1} /><View style={s.cniDecor2} />
                        <View style={s.cniTop}>
                            <View style={s.cniFlag}><Text style={s.cniFlagText}>🇧🇯</Text></View>
                            <View><Text style={s.cniCountry}>RÉPUBLIQUE DU BÉNIN</Text><Text style={s.cniTitle}>Carte Nationale d'Identité</Text></View>
                        </View>
                        <View style={s.fieldsGrid}>{fields.map(([l, v]) => <View key={l} style={s.field}><Text style={s.fieldLabel}>{l}</Text><Text style={s.fieldValue}>{v}</Text></View>)}</View>
                        <View style={s.cniBottom}>
                            <View style={s.verifiedBadge}><ShieldCheck size={14} color="#00E08E" /><Text style={s.verifiedText}>Vérifié & Certifié</Text></View>
                            <View style={s.qrPlaceholder}><QrCode size={24} color="rgba(255,255,255,0.3)" /></View>
                        </View>
                    </LinearGradient>
                </Animated.View>
                <Animated.View style={{ opacity: contentFade, transform: [{ translateY: contentSlide }] }}>
                    <View style={[s.warningBox, { backgroundColor: colors.amberSoft, borderColor: "rgba(245,158,11,0.2)" }]}>
                        <View style={s.warningIcon}><AlertTriangle size={20} color={colors.amber} /></View>
                        <View style={{ flex: 1 }}><Text style={[s.warningTitle, { color: colors.amber }]}>Expire dans 43 jours</Text><Text style={[s.warningSub, { color: colors.textSecondary }]}>Renouvelez avant le 10 Avril 2026 pour éviter toute interruption.</Text></View>
                    </View>
                    <View style={s.infoRow}>
                        {[{ icon: Clock, color: colors.secondary, label: "Délivrance", value: "5 ans" }, { icon: MapPin, color: colors.primary, label: "Lieu", value: "Cotonou" }, { icon: RefreshCw, color: colors.amber, label: "Coût", value: "3 500 F" }].map(info => (
                            <View key={info.label} style={[s.infoCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                                <info.icon size={18} color={colors.textMuted} /><Text style={[s.infoLabel, { color: colors.textMuted }]}>{info.label}</Text><Text style={[s.infoValue, { color: colors.textPrimary }]}>{info.value}</Text>
                            </View>
                        ))}
                    </View>
                    <View style={{ paddingHorizontal: 16 }}>
                        <TouchableOpacity onPress={() => navigation.navigate("Renew")} activeOpacity={0.85}>
                            <LinearGradient colors={[colors.primary, colors.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[s.primaryBtn, shadows.glow]}>
                                <IdCard size={18} color="#fff" /><Text style={s.primaryBtnText}>Renouveler ma CNI</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity style={[s.secondaryBtn, { backgroundColor: colors.bgCard, borderColor: colors.border }]} activeOpacity={0.7}>
                            <QrCode size={18} color={colors.textPrimary} /><Text style={[s.secondaryBtnText, { color: colors.textPrimary }]}>Afficher le QR code</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

const s = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 20, paddingBottom: 18 },
    backBtn: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10 },
    backText: { color: "rgba(255,255,255,0.7)", fontSize: 14 },
    headerRow: { flexDirection: "row", alignItems: "center", gap: 10 },
    headerTitle: { fontWeight: "800", color: "#fff", fontSize: 22, letterSpacing: -0.5 },
    cniCard: { margin: 16, borderRadius: 22, padding: 22, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", ...shadows.elevated },
    cniDecor1: { position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: 50, backgroundColor: "rgba(255,255,255,0.03)" },
    cniDecor2: { position: "absolute", bottom: -20, left: -20, width: 80, height: 80, borderRadius: 40, backgroundColor: "rgba(255,255,255,0.02)" },
    cniTop: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 18 },
    cniFlag: { width: 36, height: 36, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.1)", alignItems: "center", justifyContent: "center" },
    cniFlagText: { fontSize: 20 },
    cniCountry: { color: "rgba(255,255,255,0.5)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", fontWeight: "600" },
    cniTitle: { color: "#fff", fontWeight: "800", fontSize: 16, marginTop: 2 },
    fieldsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
    field: { width: "45%" },
    fieldLabel: { color: "rgba(255,255,255,0.4)", fontSize: 10, textTransform: "uppercase", letterSpacing: 1, fontWeight: "600" },
    fieldValue: { color: "#fff", fontWeight: "700", fontSize: 13, marginTop: 3 },
    cniBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 18, paddingTop: 14, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.08)" },
    verifiedBadge: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(0,224,142,0.1)", borderWidth: 1, borderColor: "rgba(0,224,142,0.2)", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
    verifiedText: { color: "#00E08E", fontSize: 12, fontWeight: "600" },
    qrPlaceholder: { width: 44, height: 44, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.05)", alignItems: "center", justifyContent: "center" },
    warningBox: { marginHorizontal: 16, marginBottom: 16, borderRadius: 16, padding: 16, borderWidth: 1, flexDirection: "row", gap: 12, alignItems: "flex-start" },
    warningIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(245,158,11,0.15)", alignItems: "center", justifyContent: "center" },
    warningTitle: { fontWeight: "700", fontSize: 14 },
    warningSub: { fontSize: 13, marginTop: 4, lineHeight: 20 },
    infoRow: { flexDirection: "row", paddingHorizontal: 16, gap: 10, marginBottom: 18 },
    infoCard: { flex: 1, borderRadius: 14, padding: 14, alignItems: "center", gap: 6, borderWidth: 1 },
    infoLabel: { fontSize: 11, fontWeight: "500" },
    infoValue: { fontSize: 14, fontWeight: "800" },
    primaryBtn: { borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10 },
    primaryBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
    secondaryBtn: { borderRadius: 14, padding: 14, borderWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
    secondaryBtnText: { fontWeight: "600", fontSize: 14 },
});
