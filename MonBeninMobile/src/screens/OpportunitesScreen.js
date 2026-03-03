import React, { useEffect, useRef } from "react";
import { View, Text, ScrollView, StyleSheet, Animated, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "../ThemeContext";
import { shadows } from "../theme";
import { Sparkles, Calendar, CheckCircle, ChevronRight, TrendingUp, Award, Briefcase, GraduationCap } from "lucide-react-native";

function FadeInView({ delay = 0, children, style }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 10, delay, useNativeDriver: true }),
        ]).start();
    }, []);
    return <Animated.View style={[style, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>{children}</Animated.View>;
}

export default function OpportunitesScreen() {
    const insets = useSafeAreaInsets();
    const { colors, isDark } = useAppTheme();

    const opps = [
        { Icon: GraduationCap, tag: "Bourse", tagColor: colors.primary, tagBg: colors.primarySoft, title: "Bourse WAEMU — Master", desc: "Bourses CEDEAO pour études supérieures. Frais de scolarité + allocation mensuelle couverts.", deadline: "30 Mars 2026", match: 92 },
        { Icon: Briefcase, tag: "Emploi", tagColor: colors.secondary, tagBg: colors.secondarySoft, title: "INFOSEC — Analyste Éco.", desc: "12 postes ouverts à la DG Budget. Bac+3 minimum requis. Contrat CDI.", deadline: "15 Avril 2026", match: 85 },
        { Icon: TrendingUp, tag: "PME", tagColor: colors.amber, tagBg: colors.amberSoft, title: "APIEX — Financement Jeunes", desc: "Subvention jusqu'à 5M FCFA pour les jeunes entrepreneurs béninois.", deadline: "Permanent", match: 78 },
    ];

    const headerGrad = isDark ? [colors.primaryDeep, colors.bgDark] : [colors.primaryDark, colors.primary];

    return (
        <View style={[s.container, { backgroundColor: colors.bgDark }]}>
            <LinearGradient colors={headerGrad} start={{ x: 0, y: 0 }} end={{ x: 0.5, y: 1 }} style={[s.header, { paddingTop: insets.top + 14 }]}>
                <View style={s.headerRow}><Award size={22} color="#fff" /><Text style={s.headerTitle}>Opportunités</Text></View>
                <Text style={s.headerSub}>Trouvées pour votre profil</Text>
            </LinearGradient>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                <FadeInView delay={100}>
                    <View style={[s.matchBox, { borderColor: colors.borderActive }]}>
                        <View style={[s.matchIcon, { backgroundColor: isDark ? "rgba(0,224,142,0.12)" : "rgba(0,168,107,0.08)" }]}><Sparkles size={18} color={colors.primaryLight} /></View>
                        <View style={{ flex: 1 }}>
                            <Text style={[s.matchTitle, { color: colors.textPrimary }]}><Text style={{ color: colors.primaryLight, fontWeight: "800" }}>3 opportunités</Text> correspondent à votre profil</Text>
                            <Text style={[s.matchSub, { color: colors.textMuted }]}>Basé sur vos qualifications et votre localisation</Text>
                        </View>
                    </View>
                </FadeInView>
                {opps.map((o, i) => (
                    <FadeInView key={o.title} delay={200 + i * 120}>
                        <TouchableOpacity style={[s.oppCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]} activeOpacity={0.8}>
                            <View style={s.oppHeader}>
                                <View style={[s.tag, { backgroundColor: colors.glass }]}><o.Icon size={12} color={colors.textMuted} /><Text style={[s.tagText, { color: colors.textSecondary }]}>{o.tag}</Text></View>
                                <View style={s.matchBadge}><Text style={[s.matchPercent, { color: colors.primaryLight }]}>{o.match}%</Text><Text style={[s.matchLabel, { color: colors.textMuted }]}>match</Text></View>
                            </View>
                            <Text style={[s.oppTitle, { color: colors.textPrimary }]}>{o.title}</Text>
                            <Text style={[s.oppDesc, { color: colors.textSecondary }]}>{o.desc}</Text>
                            <View style={[s.oppFooter, { borderTopColor: colors.border }]}>
                                <View style={s.deadlineWrap}><Calendar size={14} color={colors.textMuted} /><Text style={[s.oppDeadline, { color: colors.textMuted }]}>{o.deadline}</Text></View>
                                <View style={[s.eligibleBadge, { backgroundColor: colors.primarySoft }]}><CheckCircle size={14} color={colors.primary} /><Text style={[s.eligibleText, { color: colors.primary }]}>Éligible</Text></View>
                            </View>
                            <TouchableOpacity style={[s.applyBtn, { backgroundColor: colors.primarySoft, borderColor: colors.borderActive }]} activeOpacity={0.7}>
                                <Text style={[s.applyBtnText, { color: colors.primary }]}>Voir les détails</Text><ChevronRight size={16} color={colors.primary} />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </FadeInView>
                ))}
            </ScrollView>
        </View>
    );
}

const s = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 20, paddingBottom: 20 },
    headerRow: { flexDirection: "row", alignItems: "center", gap: 10 },
    headerTitle: { fontWeight: "800", color: "#fff", fontSize: 22, letterSpacing: -0.5 },
    headerSub: { color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 4 },
    matchBox: { margin: 16, borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1 },
    matchIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
    matchTitle: { fontSize: 14, fontWeight: "500" },
    matchSub: { fontSize: 12, marginTop: 3 },
    oppCard: { borderRadius: 20, padding: 18, marginHorizontal: 16, marginBottom: 12, borderWidth: 1, ...shadows.card },
    oppHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
    tag: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    tagText: { fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
    matchBadge: { flexDirection: "row", alignItems: "baseline", gap: 3 },
    matchPercent: { fontSize: 18, fontWeight: "800" },
    matchLabel: { fontSize: 11, fontWeight: "500" },
    oppTitle: { fontWeight: "800", fontSize: 16, letterSpacing: -0.3 },
    oppDesc: { fontSize: 13, marginTop: 6, lineHeight: 20 },
    oppFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 14, paddingTop: 14, borderTopWidth: 1 },
    deadlineWrap: { flexDirection: "row", alignItems: "center", gap: 5 },
    oppDeadline: { fontSize: 12, fontWeight: "500" },
    eligibleBadge: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
    eligibleText: { fontSize: 12, fontWeight: "700" },
    applyBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 14, borderWidth: 1, borderRadius: 14, paddingVertical: 11 },
    applyBtnText: { fontWeight: "700", fontSize: 14 },
});
