import React, { useEffect, useRef } from "react";
import { View, Text, ScrollView, StyleSheet, Animated, TouchableOpacity, Pressable, Switch } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "../ThemeContext";
import { useAuth } from "../AuthContext";
import { shadows } from "../theme";
import { User, Calendar, MapPin, Phone, Mail, Bell, Lock, Globe, ChevronRight, Shield, LogOut, Settings, CreditCard, Sun, Moon } from "lucide-react-native";

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

export default function ProfilScreen() {
    const insets = useSafeAreaInsets();
    const { colors, isDark, toggleTheme } = useAppTheme();
    const { logout } = useAuth();
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ]).start();
    }, []);

    const personalInfo = [
        { Icon: Calendar, t: "Naissance", s2: "14/08/1992 · Cotonou", color: colors.secondary },
        { Icon: MapPin, t: "Adresse", s2: "Fidjrossè, Cotonou", color: colors.secondary },
        { Icon: Phone, t: "Téléphone", s2: "+229 97 XX XX XX", color: colors.primary },
        { Icon: Mail, t: "Email", s2: "k.adechina@email.com", color: colors.secondary },
    ];

    const settings = [
        { Icon: Bell, t: "Notifications", s2: "Activées", color: colors.amber },
        { Icon: Lock, t: "Sécurité", s2: "Empreinte digitale", color: colors.primary },
        { Icon: Globe, t: "Langue", s2: "Français", color: colors.secondary },
        { Icon: CreditCard, t: "Paiement", s2: "MTN MoMo", color: colors.amber },
        { Icon: Settings, t: "Préférences", s2: "Personnaliser", color: colors.secondary },
    ];

    const headerGrad = isDark ? [colors.primaryDeep, colors.bgDark] : [colors.primaryDark, colors.primary];

    return (
        <View style={[s.container, { backgroundColor: colors.bgDark }]}>
            <LinearGradient colors={headerGrad} start={{ x: 0, y: 0 }} end={{ x: 0.5, y: 1 }} style={[s.header, { paddingTop: insets.top + 20 }]}>
                <Animated.View style={{ alignItems: "center", opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
                    <View style={s.avatarRing}>
                        <LinearGradient colors={["#00B074", "#00E08E"]} style={s.avatar}><User size={32} color="#fff" /></LinearGradient>
                    </View>
                    <Text style={s.name}>Koffi Adéchina Emmanuel</Text>
                    <View style={s.npiBadge}><Shield size={12} color="#00E08E" /><Text style={s.npiText}>NPI · BJ-204-987-654-1</Text></View>
                    <View style={s.statsRow}>
                        <View style={s.statItem}><Text style={s.statValue}>9</Text><Text style={s.statLabel}>Documents</Text></View>
                        <View style={s.statDivider} />
                        <View style={s.statItem}><Text style={s.statValue}>78</Text><Text style={s.statLabel}>Score Santé</Text></View>
                        <View style={s.statDivider} />
                        <View style={s.statItem}><Text style={[s.statValue, { color: "#00E08E" }]}>✓</Text><Text style={s.statLabel}>Vérifié</Text></View>
                    </View>
                </Animated.View>
            </LinearGradient>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Theme toggle */}
                <FadeInView delay={100}>
                    <Text style={[s.sectionLabel, { color: colors.textMuted }]}>Apparence</Text>
                    <View style={[s.section, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                        <View style={s.themeRow}>
                            <View style={[s.rowIcon, { backgroundColor: colors.glass }]}>
                                {isDark ? <Moon size={18} color={colors.textMuted} /> : <Sun size={18} color={colors.textMuted} />}
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[s.rowTitle, { color: colors.textPrimary }]}>{isDark ? "Mode sombre" : "Mode clair"}</Text>
                                <Text style={[s.rowSub, { color: colors.textMuted }]}>{isDark ? "Fond sombre activé" : "Fond clair activé"}</Text>
                            </View>
                            <Switch
                                value={isDark}
                                onValueChange={toggleTheme}
                                trackColor={{ false: "#D1D5DB", true: colors.primary }}
                                thumbColor="#fff"
                                ios_backgroundColor="#D1D5DB"
                            />
                        </View>
                    </View>
                </FadeInView>

                {/* Personal Info */}
                <FadeInView delay={200}>
                    <Text style={[s.sectionLabel, { color: colors.textMuted }]}>Informations personnelles</Text>
                    <View style={[s.section, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                        {personalInfo.map((item, i, arr) => (
                            <View key={item.t} style={[s.row, i < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                                <View style={[s.rowIcon, { backgroundColor: colors.glass }]}><item.Icon size={18} color={colors.textMuted} /></View>
                                <View style={{ flex: 1 }}><Text style={[s.rowTitle, { color: colors.textPrimary }]}>{item.t}</Text><Text style={[s.rowSub, { color: colors.textMuted }]}>{item.s2}</Text></View>
                            </View>
                        ))}
                    </View>
                </FadeInView>

                {/* Settings */}
                <FadeInView delay={400}>
                    <Text style={[s.sectionLabel, { color: colors.textMuted }]}>Paramètres</Text>
                    <View style={[s.section, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                        {settings.map((item, i, arr) => (
                            <Pressable key={item.t} style={({ pressed }) => [s.row, i < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }, pressed && { backgroundColor: colors.glass }]}>
                                {({ pressed }) => (
                                    <>
                                        <View style={[s.rowIcon, { backgroundColor: pressed ? colors.primarySoft : colors.glass }]}><item.Icon size={18} color={pressed ? colors.primary : colors.textMuted} /></View>
                                        <View style={{ flex: 1 }}><Text style={[s.rowTitle, { color: colors.textPrimary }]}>{item.t}</Text><Text style={[s.rowSub, { color: colors.textMuted }]}>{item.s2}</Text></View>
                                        <ChevronRight size={16} color={colors.textMuted} />
                                    </>
                                )}
                            </Pressable>
                        ))}
                    </View>
                </FadeInView>

                {/* Logout */}
                <FadeInView delay={600}>
                    <TouchableOpacity onPress={logout} style={[s.logoutBtn, { backgroundColor: colors.redSoft, borderColor: "rgba(239,68,68,0.2)" }]} activeOpacity={0.7}>
                        <LogOut size={18} color={colors.red} /><Text style={[s.logoutText, { color: colors.red }]}>Se déconnecter</Text>
                    </TouchableOpacity>
                    <Text style={[s.version, { color: colors.textMuted }]}>Super App v2.0 · SDK 54</Text>
                </FadeInView>
            </ScrollView>
        </View>
    );
}

const s = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 20, paddingBottom: 24 },
    avatarRing: { width: 80, height: 80, borderRadius: 40, padding: 3, borderWidth: 2, borderColor: "rgba(0,224,142,0.3)", marginBottom: 14 },
    avatar: { flex: 1, borderRadius: 37, alignItems: "center", justifyContent: "center" },
    name: { fontWeight: "800", color: "#fff", fontSize: 20, letterSpacing: -0.5 },
    npiBadge: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(255,255,255,0.12)", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, marginTop: 8 },
    npiText: { color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: "500" },
    statsRow: { flexDirection: "row", alignItems: "center", marginTop: 18, backgroundColor: "rgba(255,255,255,0.08)", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", borderRadius: 16, paddingVertical: 12, paddingHorizontal: 20, gap: 16 },
    statItem: { alignItems: "center", flex: 1 },
    statValue: { fontSize: 18, fontWeight: "800", color: "#fff" },
    statLabel: { fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2, fontWeight: "500" },
    statDivider: { width: 1, height: 24, backgroundColor: "rgba(255,255,255,0.12)" },
    sectionLabel: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 8, fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1 },
    section: { marginHorizontal: 16, borderRadius: 18, borderWidth: 1, overflow: "hidden", ...shadows.card },
    themeRow: { padding: 14, flexDirection: "row", gap: 12, alignItems: "center" },
    row: { padding: 14, flexDirection: "row", gap: 12, alignItems: "center" },
    rowIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
    rowTitle: { fontWeight: "700", fontSize: 14, letterSpacing: -0.2 },
    rowSub: { fontSize: 12, marginTop: 2 },
    logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginHorizontal: 16, marginTop: 20, borderWidth: 1, borderRadius: 16, padding: 14 },
    logoutText: { fontWeight: "700", fontSize: 14 },
    version: { textAlign: "center", fontSize: 11, marginTop: 16 },
});
