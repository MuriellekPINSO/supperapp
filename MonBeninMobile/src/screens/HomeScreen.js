import React, { useEffect, useRef } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Pressable,
    StyleSheet,
    Animated,
    Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "../ThemeContext";
import { shadows } from "../theme";
import {
    Car,
    Coins,
    Lightbulb,
    IdCard,
    Hospital,
    FileText,
    GraduationCap,
    FileEdit,
    Star,
    Sparkles,
    ChevronRight,
    Shield,
    Bell,
    Zap,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

function AnimatedCard({ children, delay = 0, style }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, delay, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 9, delay, useNativeDriver: true }),
        ]).start();
    }, []);
    return (
        <Animated.View style={[style, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            {children}
        </Animated.View>
    );
}

function PulsingDot({ color }) {
    const pulseAnim = useRef(new Animated.Value(1)).current;
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.6, duration: 1000, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
            ])
        ).start();
    }, []);
    return (
        <View style={{ width: 10, height: 10, alignItems: "center", justifyContent: "center" }}>
            <Animated.View style={{ position: "absolute", width: 10, height: 10, borderRadius: 5, backgroundColor: color, opacity: 0.3, transform: [{ scale: pulseAnim }] }} />
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color }} />
        </View>
    );
}

export default function HomeScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const { colors, isDark } = useAppTheme();
    const headerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(headerAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    }, []);

    const alerts = [
        { Icon: Car, title: "Assurance auto expire le 15 Mars", sub: "Toyota Corolla · AB 1234 BJ", badge: "16j", gradient: [colors.amber, "#F5C36A"], bgColor: colors.amberSoft, screen: "Assurance" },
        { Icon: Coins, title: "Aide CNSS disponible", sub: "Allocation familiale · 45 000 FCFA", badge: "Nouveau", gradient: [colors.primary, colors.primaryLight], bgColor: colors.primarySoft, screen: "CNSS" },
        { Icon: Lightbulb, title: "Facture SBEE disponible", sub: "Échéance: 05 Mars · 28 400 FCFA", badge: "À payer", gradient: [colors.primary, colors.primaryLight], bgColor: colors.primarySoft, screen: "Factures" },
    ];

    const services = [
        { Icon: IdCard, name: "Mes docs", screen: "Docs", color: colors.primary },
        { Icon: Lightbulb, name: "Factures", screen: "Factures", color: colors.amber },
        { Icon: Hospital, name: "RDV médical", screen: "RDV", color: colors.secondary },
        { Icon: FileText, name: "Impôts", screen: "Impots", color: colors.secondary },
        { Icon: GraduationCap, name: "Université", screen: "Universite", color: colors.secondary },
        { Icon: FileEdit, name: "Déc. perte", screen: "Perte", color: colors.secondary },
        { Icon: Star, name: "Opportunités", screen: "Opportunites", color: colors.amber },
        { Icon: Sparkles, name: "IA Citoyenne", screen: "AIChat", color: colors.primaryLight },
    ];

    const docs = [
        { Icon: IdCard, type: "CNI", name: "Carte d'Identité", exp: "⚠ 43j", gradient: [colors.primaryDark, colors.primaryDeep], urgent: true, screen: "CNI" },
        { Icon: Car, type: "Permis B", name: "Permis de Conduire", exp: "Valide 2029", gradient: ["#1C2333", "#0A0E17"], screen: "Docs" },
        { Icon: Shield, type: "Santé", name: "Carnet de Santé", exp: "78/100", gradient: ["#1A2E1E", "#0D1A11"], screen: "Sante" },
    ];

    const headerGradient = isDark
        ? [colors.primaryDeep, colors.bgDark]
        : [colors.primaryDark, colors.primary];

    return (
        <View style={[s.container, { backgroundColor: colors.bgDark }]}>
            <LinearGradient
                colors={headerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={[s.header, { paddingTop: insets.top + 16 }]}
            >
                <Animated.View style={{ opacity: headerAnim }}>
                    <View style={s.headerTop}>
                        <View style={{ flex: 1 }}>
                            <Text style={s.headerGreeting}>Bonjour 👋</Text>
                            <Text style={s.headerName}>Koffi Adéchina</Text>
                        </View>
                        <TouchableOpacity style={[s.notifBtn, { backgroundColor: "rgba(255,255,255,0.12)", borderColor: "rgba(255,255,255,0.2)" }]}>
                            <Bell size={20} color="#fff" />
                            <View style={[s.notifDot, { backgroundColor: colors.red }]} />
                        </TouchableOpacity>
                    </View>
                    <View style={[s.npiBadge, { backgroundColor: "rgba(255,255,255,0.12)", borderColor: "rgba(255,255,255,0.2)" }]}>
                        <PulsingDot color="#00E08E" />
                        <Text style={s.npiText}>NPI · BJ-204-987-654-1</Text>
                        <View style={s.npiVerified}><Text style={s.npiVerifiedText}>Vérifié</Text></View>
                    </View>
                </Animated.View>
            </LinearGradient>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* AI Card */}
                <AnimatedCard delay={200}>
                    <TouchableOpacity onPress={() => navigation.navigate("AIChat")} activeOpacity={0.85}>
                        <LinearGradient
                            colors={isDark ? ["#1A2E1E", "#0D1A11"] : ["#E8F5E9", "#F1F8E9"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={[s.aiGradient, { borderColor: isDark ? "rgba(0,224,142,0.12)" : "rgba(0,168,107,0.15)", ...shadows.elevated }]}
                        >
                            <View style={s.aiHeader}>
                                <View style={[s.aiIconWrap, { backgroundColor: isDark ? "rgba(0,224,142,0.12)" : "rgba(0,168,107,0.12)" }]}>
                                    <Sparkles size={16} color={colors.primaryLight} />
                                </View>
                                <Text style={[s.aiLabel, { color: colors.primaryLight }]}>IA CITOYENNE</Text>
                                <View style={[s.aiLiveBadge, { backgroundColor: isDark ? "rgba(0,224,142,0.1)" : "rgba(0,168,107,0.1)" }]}>
                                    <PulsingDot color={colors.primaryLight} />
                                    <Text style={[s.aiLiveText, { color: colors.primaryLight }]}>Active</Text>
                                </View>
                            </View>
                            <Text style={[s.aiText, { color: colors.textPrimary }]}>
                                Votre CNI expire dans{" "}
                                <Text style={{ color: colors.amber, fontWeight: "800" }}>43 jours</Text>.
                                Tapez ici pour lancer le renouvellement automatique.
                            </Text>
                            <View style={s.aiActions}>
                                {["Renouveler CNI", "Parler à l'IA"].map((t) => (
                                    <View key={t} style={[s.aiChip, { backgroundColor: isDark ? "rgba(0,224,142,0.1)" : "rgba(0,168,107,0.08)", borderColor: isDark ? "rgba(0,224,142,0.2)" : "rgba(0,168,107,0.2)" }]}>
                                        <Text style={[s.aiChipText, { color: colors.primary }]}>{t}</Text>
                                        <ChevronRight size={12} color={colors.primary} />
                                    </View>
                                ))}
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </AnimatedCard>

                {/* Alerts */}
                <AnimatedCard delay={350}>
                    <View style={s.sectionHeader}>
                        <Text style={[s.sectionTitle, { color: colors.textMuted }]}>Alertes proactives</Text>
                        <View style={[s.sectionBadge, { backgroundColor: colors.redSoft }]}><Text style={[s.sectionBadgeText, { color: colors.red }]}>{alerts.length}</Text></View>
                    </View>
                </AnimatedCard>
                {alerts.map((a, i) => (
                    <AnimatedCard key={a.title} delay={400 + i * 80}>
                        <TouchableOpacity onPress={() => navigation.navigate(a.screen)} style={[s.alertCard, { backgroundColor: colors.bgCard, borderColor: colors.border, borderLeftColor: a.gradient[0] }]} activeOpacity={0.7}>
                            <View style={[s.alertIconWrap, { backgroundColor: colors.glass }]}><a.Icon size={18} color={colors.textMuted} /></View>
                            <View style={{ flex: 1 }}>
                                <Text style={[s.alertTitle, { color: colors.textPrimary }]}>{a.title}</Text>
                                <Text style={[s.alertSub, { color: colors.textMuted }]}>{a.sub}</Text>
                            </View>
                            <LinearGradient colors={a.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.alertBadge}><Text style={s.alertBadgeText}>{a.badge}</Text></LinearGradient>
                        </TouchableOpacity>
                    </AnimatedCard>
                ))}

                {/* Services */}
                <AnimatedCard delay={650}>
                    <View style={s.sectionHeader}>
                        <Text style={[s.sectionTitle, { color: colors.textMuted }]}>Services</Text>
                        <Zap size={14} color={colors.textMuted} />
                    </View>
                    <View style={s.servicesGrid}>
                        {services.map((sv) => (
                            <Pressable key={sv.name} onPress={() => navigation.navigate(sv.screen)} style={({ pressed }) => [s.serviceCard, { backgroundColor: pressed ? colors.primarySoft : colors.bgCard, borderColor: pressed ? colors.borderActive : colors.border }]}>
                                {({ pressed }) => (
                                    <>
                                        <View style={[s.serviceIconWrap, { backgroundColor: pressed ? colors.primarySoft : colors.glass }]}>
                                            <sv.Icon size={20} color={pressed ? sv.color : colors.textMuted} />
                                        </View>
                                        <Text style={[s.serviceLabel, { color: pressed ? sv.color : colors.textSecondary }]} numberOfLines={1}>{sv.name}</Text>
                                    </>
                                )}
                            </Pressable>
                        ))}
                    </View>
                </AnimatedCard>

                {/* Documents */}
                <AnimatedCard delay={800}>
                    <View style={s.sectionHeader}>
                        <Text style={[s.sectionTitle, { color: colors.textMuted }]}>Mes Documents</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Documents")}><Text style={[s.seeAll, { color: colors.primary }]}>Voir tout</Text></TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                        {docs.map((d) => (
                            <TouchableOpacity key={d.type} onPress={() => navigation.navigate(d.screen)} activeOpacity={0.85}>
                                <LinearGradient colors={d.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.docCard}>
                                    <View style={s.docHeader}><d.Icon size={14} color="rgba(255,255,255,0.5)" /><Text style={s.docType}>{d.type}</Text></View>
                                    <Text style={s.docName}>{d.name}</Text>
                                    <View style={[s.docBadge, d.urgent && { backgroundColor: "rgba(245,158,11,0.25)", borderColor: "rgba(245,158,11,0.4)" }]}>
                                        <Text style={[s.docBadgeText, d.urgent && { color: "#F59E0B" }]}>{d.exp}</Text>
                                    </View>
                                    <View style={s.docCircle} />
                                </LinearGradient>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </AnimatedCard>
            </ScrollView>
        </View>
    );
}

const s = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 20, paddingBottom: 24 },
    headerTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    headerGreeting: { color: "rgba(255,255,255,0.7)", fontSize: 14, letterSpacing: 0.3 },
    headerName: { fontWeight: "800", color: "#fff", fontSize: 26, marginTop: 2, letterSpacing: -0.5 },
    notifBtn: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, alignItems: "center", justifyContent: "center" },
    notifDot: { position: "absolute", top: 10, right: 12, width: 8, height: 8, borderRadius: 4, borderWidth: 2, borderColor: "rgba(0,0,0,0.3)" },
    npiBadge: { flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 24, alignSelf: "flex-start", marginTop: 14 },
    npiText: { color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: "500" },
    npiVerified: { backgroundColor: "rgba(0,224,142,0.2)", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
    npiVerifiedText: { color: "#00E08E", fontSize: 10, fontWeight: "700" },
    aiGradient: { margin: 16, padding: 18, borderRadius: 20, borderWidth: 1 },
    aiHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
    aiIconWrap: { width: 30, height: 30, borderRadius: 10, alignItems: "center", justifyContent: "center" },
    aiLabel: { fontSize: 11, fontWeight: "800", letterSpacing: 1.5, flex: 1 },
    aiLiveBadge: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    aiLiveText: { fontSize: 11, fontWeight: "600" },
    aiText: { fontSize: 15, lineHeight: 23, fontWeight: "400" },
    aiActions: { flexDirection: "row", gap: 8, marginTop: 14 },
    aiChip: { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 22 },
    aiChipText: { fontSize: 12, fontWeight: "600" },
    sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, marginTop: 8, marginBottom: 12 },
    sectionTitle: { fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1.2 },
    sectionBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
    sectionBadgeText: { fontSize: 11, fontWeight: "700" },
    seeAll: { fontSize: 12, fontWeight: "600" },
    alertCard: { marginHorizontal: 16, marginBottom: 8, borderRadius: 16, borderWidth: 1, borderLeftWidth: 3, padding: 14, flexDirection: "row", alignItems: "center", gap: 12, ...shadows.card },
    alertIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
    alertTitle: { fontWeight: "700", fontSize: 13, letterSpacing: -0.2 },
    alertSub: { fontSize: 12, marginTop: 2 },
    alertBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
    alertBadgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },
    servicesGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 12, gap: 8, marginBottom: 8 },
    serviceCard: { width: (width - 24 - 24) / 4, borderWidth: 1, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 6, alignItems: "center", gap: 8 },
    serviceIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
    serviceLabel: { fontSize: 10, fontWeight: "600", textAlign: "center" },
    docCard: { width: 170, height: 105, borderRadius: 18, padding: 16, marginRight: 12, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", ...shadows.card },
    docHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
    docType: { color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase" },
    docName: { color: "#fff", fontWeight: "800", fontSize: 14, marginTop: 6, letterSpacing: -0.3 },
    docBadge: { position: "absolute", bottom: 12, right: 12, backgroundColor: "rgba(255,255,255,0.12)", borderWidth: 1, borderColor: "rgba(255,255,255,0.15)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
    docBadgeText: { fontSize: 10, fontWeight: "700", color: "#fff" },
    docCircle: { position: "absolute", top: -20, right: -20, width: 60, height: 60, borderRadius: 30, backgroundColor: "rgba(255,255,255,0.04)" },
});
