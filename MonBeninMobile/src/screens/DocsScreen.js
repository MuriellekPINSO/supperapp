import React, { useEffect, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "../ThemeContext";
import { shadows } from "../theme";
import { IdCard, FileText, MapPin, Car, Shield, GraduationCap, BookOpen, Heart, Lock, ChevronRight, FolderOpen } from "lucide-react-native";

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

export default function DocsScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const { colors, isDark } = useAppTheme();

    const groups = [
        {
            label: "Identité & Civil", icon: IdCard, items: [
                { Icon: IdCard, title: "Carte Nationale d'Identité", sub: "N° BJ-CNI-2021-456789", status: "⚠ expire 43j", statusColor: colors.amber, statusBg: colors.amberSoft, screen: "CNI" },
                { Icon: FileText, title: "Acte de Naissance", sub: "N°2187/1992 · Mairie Cotonou", status: "✓ certifié", statusColor: colors.primary, statusBg: colors.primarySoft },
                { Icon: MapPin, title: "Certificat de résidence", sub: "Cotonou, Littoral · 2024", status: "✓ valide", statusColor: colors.primary, statusBg: colors.primarySoft },
            ]
        },
        {
            label: "Mobilité", icon: Car, items: [
                { Icon: Car, title: "Permis de conduire", sub: "Cat. B · N° PB-2019-00341", status: "✓ 2029", statusColor: colors.primary, statusBg: colors.primarySoft },
                { Icon: Shield, title: "Assurance Toyota", sub: "NSIA Bénin · AB 1234 BJ", status: "⚠ 16j", statusColor: colors.amber, statusBg: colors.amberSoft, screen: "Assurance" },
            ]
        },
        {
            label: "Formation", icon: GraduationCap, items: [
                { Icon: GraduationCap, title: "Licence Économie", sub: "UAC · 2019 · Mention Bien", status: "✓", statusColor: colors.primary, statusBg: colors.primarySoft },
                { Icon: BookOpen, title: "Baccalauréat C", sub: "Lycée Béhanzin · 2015", status: "✓", statusColor: colors.primary, statusBg: colors.primarySoft },
            ]
        },
        {
            label: "Santé & Social", icon: Heart, items: [
                { Icon: Heart, title: "Bilan santé 2025", sub: "CHNU · Janvier 2025", status: "78/100", statusColor: colors.primary, statusBg: colors.primarySoft, screen: "Sante" },
                { Icon: Lock, title: "CNSS", sub: "N° 0045-BJ-9871234", status: "✓ actif", statusColor: colors.primary, statusBg: colors.primarySoft, screen: "CNSS" },
            ]
        },
    ];

    const headerGradient = isDark ? [colors.primaryDeep, colors.bgDark] : [colors.primaryDark, colors.primary];

    return (
        <View style={[s.container, { backgroundColor: colors.bgDark }]}>
            <LinearGradient colors={headerGradient} start={{ x: 0, y: 0 }} end={{ x: 0.5, y: 1 }} style={[s.header, { paddingTop: insets.top + 14 }]}>
                <View style={s.headerRow}><FolderOpen size={22} color="#fff" /><Text style={s.headerTitle}>Mes Documents</Text></View>
                <Text style={s.headerSub}>{groups.reduce((acc, g) => acc + g.items.length, 0)} documents · 2 à renouveler</Text>
            </LinearGradient>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {groups.map((g, gi) => (
                    <FadeInView key={g.label} delay={gi * 120}>
                        <View style={s.groupHeader}>
                            <g.icon size={14} color={colors.textMuted} />
                            <Text style={[s.groupLabel, { color: colors.textMuted }]}>{g.label}</Text>
                            <View style={[s.groupCount, { backgroundColor: colors.glass }]}><Text style={[s.groupCountText, { color: colors.textSecondary }]}>{g.items.length}</Text></View>
                        </View>
                        <View style={[s.groupCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                            {g.items.map((item, i) => (
                                <TouchableOpacity key={item.title} onPress={() => item.screen && navigation.navigate(item.screen)} disabled={!item.screen} style={[s.item, i < g.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]} activeOpacity={0.7}>
                                    <View style={[s.itemIcon, { backgroundColor: colors.primarySoft }]}><item.Icon size={18} color={colors.primary} /></View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[s.itemTitle, { color: colors.textPrimary }]}>{item.title}</Text>
                                        <Text style={[s.itemSub, { color: colors.textMuted }]}>{item.sub}</Text>
                                    </View>
                                    <View style={[s.statusBadge, { backgroundColor: item.statusBg }]}><Text style={[s.itemStatus, { color: item.statusColor }]}>{item.status}</Text></View>
                                    {item.screen && <ChevronRight size={16} color={colors.textMuted} />}
                                </TouchableOpacity>
                            ))}
                        </View>
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
    headerSub: { color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 6 },
    groupHeader: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 16, paddingTop: 18, paddingBottom: 8 },
    groupLabel: { fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, flex: 1 },
    groupCount: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
    groupCountText: { fontSize: 11, fontWeight: "600" },
    groupCard: { marginHorizontal: 16, borderRadius: 18, borderWidth: 1, overflow: "hidden", ...shadows.card },
    item: { padding: 14, flexDirection: "row", alignItems: "center", gap: 12 },
    itemIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
    itemTitle: { fontWeight: "700", fontSize: 14, letterSpacing: -0.2 },
    itemSub: { fontSize: 12, marginTop: 2 },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
    itemStatus: { fontSize: 11, fontWeight: "700" },
});
