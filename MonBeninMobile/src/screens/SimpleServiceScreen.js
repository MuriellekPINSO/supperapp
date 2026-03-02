import React, { useState, useRef, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "../ThemeContext";
import { shadows } from "../theme";
import { CheckCircle2, ArrowLeft, Home, Sparkles } from "lucide-react-native";

export default function SimpleServiceScreen({ navigation, route }) {
    const { title, Icon, description, actionLabel, successTitle, successDesc, successRef } = route.params;
    const insets = useSafeAreaInsets();
    const { colors, isDark } = useAppTheme();
    const [done, setDone] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const successScale = useRef(new Animated.Value(0.5)).current;
    const successFade = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
        ]).start();
    }, []);

    const handleAction = () => {
        setDone(true);
        Animated.parallel([
            Animated.spring(successScale, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
            Animated.timing(successFade, { toValue: 1, duration: 400, useNativeDriver: true }),
        ]).start();
    };

    const headerGrad = isDark ? [colors.primaryDeep, colors.bgDark] : [colors.primaryDark, colors.primary];

    return (
        <View style={[s.container, { backgroundColor: colors.bgDark }]}>
            <LinearGradient colors={headerGrad} start={{ x: 0, y: 0 }} end={{ x: 0.5, y: 1 }} style={[s.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}><ArrowLeft size={16} color="rgba(255,255,255,0.7)" /><Text style={s.backText}>Retour</Text></TouchableOpacity>
                <Text style={s.headerTitle}>{title}</Text>
            </LinearGradient>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
                <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                    <View style={[s.descCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                        {Icon && <View style={s.iconWrap}><LinearGradient colors={[colors.primarySoft, "transparent"]} style={[s.iconBg, { borderColor: colors.borderActive }]}><Icon size={40} color={colors.primary} /></LinearGradient></View>}
                        <Text style={[s.descText, { color: colors.textSecondary }]}>{description}</Text>
                    </View>
                    {done ? (
                        <Animated.View style={[s.successBox, { backgroundColor: colors.primarySoft, borderColor: colors.borderActive, opacity: successFade, transform: [{ scale: successScale }] }]}>
                            <View style={[s.successIconWrap, { backgroundColor: colors.primaryGlow }]}><CheckCircle2 size={40} color={colors.primary} /></View>
                            <Text style={[s.successTitle, { color: colors.textPrimary }]}>{successTitle}</Text>
                            <Text style={[s.successDesc, { color: colors.textSecondary }]}>{successDesc}</Text>
                            <View style={[s.refBox, { backgroundColor: colors.bgCardLight, borderColor: colors.border }]}>
                                <Text style={[s.refLabel, { color: colors.textMuted }]}>Référence</Text>
                                <Text style={[s.refText, { color: colors.primaryLight }]}>{successRef}</Text>
                            </View>
                            <TouchableOpacity onPress={() => navigation.navigate("HomeTabs")} style={[s.homeBtn, { backgroundColor: colors.bgCardLight, borderColor: colors.border }]} activeOpacity={0.7}>
                                <Home size={16} color={colors.textPrimary} /><Text style={[s.homeBtnText, { color: colors.textPrimary }]}>Retour à l'accueil</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    ) : (
                        <TouchableOpacity onPress={handleAction} activeOpacity={0.85}>
                            <LinearGradient colors={[colors.primary, colors.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[s.primaryBtn, shadows.glow]}>
                                <Sparkles size={18} color="#fff" /><Text style={s.primaryBtnText}>{actionLabel}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )}
                </Animated.View>
            </ScrollView>
        </View>
    );
}

const s = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 20, paddingBottom: 20 },
    backBtn: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10 },
    backText: { color: "rgba(255,255,255,0.7)", fontSize: 14 },
    headerTitle: { fontWeight: "800", color: "#fff", fontSize: 22, letterSpacing: -0.5 },
    descCard: { borderRadius: 20, padding: 24, borderWidth: 1, marginBottom: 16, ...shadows.card },
    iconWrap: { alignItems: "center", marginBottom: 18 },
    iconBg: { width: 80, height: 80, borderRadius: 24, alignItems: "center", justifyContent: "center", borderWidth: 1 },
    descText: { fontSize: 15, lineHeight: 24, textAlign: "center" },
    successBox: { borderRadius: 20, padding: 28, borderWidth: 1, alignItems: "center" },
    successIconWrap: { width: 70, height: 70, borderRadius: 35, alignItems: "center", justifyContent: "center", marginBottom: 14 },
    successTitle: { fontWeight: "800", fontSize: 20 },
    successDesc: { fontSize: 14, marginTop: 8, textAlign: "center", lineHeight: 22 },
    refBox: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, marginTop: 16, borderWidth: 1, alignItems: "center" },
    refLabel: { fontSize: 10, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
    refText: { fontFamily: "monospace", fontSize: 14, fontWeight: "600" },
    primaryBtn: { borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
    primaryBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
    homeBtn: { borderRadius: 14, padding: 13, borderWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 14, width: "100%" },
    homeBtnText: { fontWeight: "600", fontSize: 14 },
});
