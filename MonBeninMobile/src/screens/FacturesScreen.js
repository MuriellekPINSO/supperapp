import React, { useState, useRef, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "../ThemeContext";
import { shadows } from "../theme";
import { Lightbulb, Droplets, Landmark, CheckCircle2, Home, ArrowLeft, CreditCard, Wallet } from "lucide-react-native";

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

export default function FacturesScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const { colors, isDark } = useAppTheme();
    const [selected, setSelected] = useState(0);
    const [done, setDone] = useState(false);
    const successScale = useRef(new Animated.Value(0.5)).current;
    const successFade = useRef(new Animated.Value(0)).current;

    const bills = [
        { Icon: Lightbulb, color: colors.amber, bg: colors.amberSoft, name: "SBEE - Électricité", sub: "Janvier 2026", amount: "28 400" },
        { Icon: Droplets, color: colors.primary, bg: colors.primarySoft, name: "SONEB - Eau", sub: "Janvier 2026", amount: "14 200" },
        { Icon: Landmark, color: colors.secondary, bg: colors.secondarySoft, name: "Quittance Trésor", sub: "Patente 2026", amount: "45 000" },
    ];

    const handlePay = () => {
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
                <View style={s.headerRow}><Wallet size={22} color="#fff" /><Text style={s.headerTitle}>Paiement de Factures</Text></View>
            </LinearGradient>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                <FadeInView delay={100}>
                    <View style={[s.totalCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                        <Text style={[s.totalLabel, { color: colors.textMuted }]}>Montant sélectionné</Text>
                        <Text style={[s.totalAmount, { color: colors.textPrimary }]}>{bills[selected].amount} <Text style={[s.totalCurrency, { color: colors.primaryLight }]}>FCFA</Text></Text>
                        <Text style={[s.totalSub, { color: colors.textMuted }]}>{bills[selected].name}</Text>
                    </View>
                </FadeInView>
                <FadeInView delay={200}>
                    <View style={[s.billsCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                        {bills.map((b, i) => (
                            <TouchableOpacity key={b.name} onPress={() => { setSelected(i); setDone(false); }} style={[s.billItem, selected === i && { backgroundColor: colors.primarySoft, borderLeftWidth: 3, borderLeftColor: colors.primary }, i < bills.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]} activeOpacity={0.7}>
                                <View style={[s.billIcon, { backgroundColor: selected === i ? b.bg : colors.glass }]}><b.Icon size={20} color={selected === i ? b.color : colors.textMuted} /></View>
                                <View style={{ flex: 1 }}><Text style={[s.billName, { color: colors.textPrimary }]}>{b.name}</Text><Text style={[s.billSub, { color: colors.textMuted }]}>{b.sub}</Text></View>
                                <View style={{ alignItems: "flex-end" }}><Text style={[s.billAmount, { color: colors.textPrimary }]}>{b.amount}</Text><Text style={[s.billCurrency, { color: colors.textMuted }]}>FCFA</Text></View>
                                {selected === i && <View style={[s.selectedDot, { backgroundColor: colors.primary }]} />}
                            </TouchableOpacity>
                        ))}
                    </View>
                </FadeInView>
                <FadeInView delay={400}>
                    <View style={{ paddingHorizontal: 16, marginTop: 6 }}>
                        {done ? (
                            <Animated.View style={[s.successBox, { backgroundColor: colors.primarySoft, borderColor: colors.borderActive, opacity: successFade, transform: [{ scale: successScale }] }]}>
                                <View style={[s.successIconWrap, { backgroundColor: colors.primaryGlow }]}><CheckCircle2 size={36} color={colors.primary} /></View>
                                <Text style={[s.successTitle, { color: colors.textPrimary }]}>Paiement effectué !</Text>
                                <Text style={[s.successDesc, { color: colors.textSecondary }]}>{bills[selected].amount} FCFA payé avec succès via MTN MoMo.</Text>
                                <TouchableOpacity onPress={() => navigation.navigate("HomeTabs")} style={[s.homeBtn, { backgroundColor: colors.bgCardLight, borderColor: colors.border }]} activeOpacity={0.7}>
                                    <Home size={16} color={colors.textPrimary} /><Text style={[s.homeBtnText, { color: colors.textPrimary }]}>Retour à l'accueil</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        ) : (
                            <TouchableOpacity onPress={handlePay} activeOpacity={0.85}>
                                <LinearGradient colors={[colors.primary, colors.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[s.primaryBtn, shadows.glow]}>
                                    <CreditCard size={18} color="#fff" /><Text style={s.primaryBtnText}>Payer maintenant</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        )}
                    </View>
                </FadeInView>
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
    totalCard: { alignItems: "center", paddingVertical: 24, marginHorizontal: 16, marginTop: 8, borderRadius: 20, borderWidth: 1, ...shadows.card },
    totalLabel: { fontSize: 12, fontWeight: "500", textTransform: "uppercase", letterSpacing: 1 },
    totalAmount: { fontSize: 38, fontWeight: "800", marginTop: 4, letterSpacing: -1 },
    totalCurrency: { fontSize: 22, fontWeight: "800" },
    totalSub: { fontSize: 13, marginTop: 4 },
    billsCard: { margin: 16, borderRadius: 18, borderWidth: 1, overflow: "hidden", ...shadows.card },
    billItem: { padding: 14, flexDirection: "row", alignItems: "center", gap: 12 },
    billIcon: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" },
    billName: { fontWeight: "700", fontSize: 14, letterSpacing: -0.2 },
    billSub: { fontSize: 12, marginTop: 2 },
    billAmount: { fontWeight: "800", fontSize: 16 },
    billCurrency: { fontSize: 11 },
    selectedDot: { width: 8, height: 8, borderRadius: 4, marginLeft: 4 },
    successBox: { borderRadius: 20, padding: 24, borderWidth: 1, alignItems: "center" },
    successIconWrap: { width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center", marginBottom: 12 },
    successTitle: { fontWeight: "800", fontSize: 18 },
    successDesc: { fontSize: 14, marginTop: 6, textAlign: "center", lineHeight: 22 },
    primaryBtn: { borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
    primaryBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
    homeBtn: { borderRadius: 14, padding: 13, borderWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 14, width: "100%" },
    homeBtnText: { fontWeight: "600", fontSize: 14 },
});
