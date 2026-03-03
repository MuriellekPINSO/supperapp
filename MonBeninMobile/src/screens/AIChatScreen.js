import React, { useState, useRef, useEffect } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "../ThemeContext";
import { shadows, PROFILE } from "../theme";
import { ArrowLeft, Sparkles, Send } from "lucide-react-native";

function TypingIndicator({ color }) {
    const dots = [useRef(new Animated.Value(0.3)).current, useRef(new Animated.Value(0.3)).current, useRef(new Animated.Value(0.3)).current];
    useEffect(() => {
        dots.forEach((dot, i) => {
            Animated.loop(Animated.sequence([
                Animated.delay(i * 200),
                Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.timing(dot, { toValue: 0.3, duration: 400, useNativeDriver: true }),
            ])).start();
        });
    }, []);
    return (
        <View style={s.typingWrap}>
            {dots.map((dot, i) => <Animated.View key={i} style={[s.typingDot, { opacity: dot, transform: [{ scale: dot }], backgroundColor: color }]} />)}
        </View>
    );
}

function MessageBubble({ message, colors, isDark }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.92)).current;
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, tension: 80, friction: 10, useNativeDriver: true }),
        ]).start();
    }, []);
    const isUser = message.role === "user";
    const formatMsg = (text) => text.split("\n").map((line, i) => {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return <Text key={i}>{parts.map((p, j) => j % 2 === 1 ? <Text key={j} style={{ fontWeight: "800", color: isUser ? "#fff" : colors.primaryLight }}>{p}</Text> : p)}{i < text.split("\n").length - 1 ? "\n" : ""}</Text>;
    });
    return (
        <Animated.View style={[s.msgRow, isUser && s.msgRowUser, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
            {!isUser && <View style={[s.avatarAI, { backgroundColor: isDark ? "rgba(0,224,142,0.1)" : "rgba(0,168,107,0.08)", borderColor: isDark ? "rgba(0,224,142,0.15)" : "rgba(0,168,107,0.12)" }]}><Sparkles size={14} color={colors.primaryLight} /></View>}
            <View>
                {!isUser && <Text style={[s.aiLabelText, { color: colors.textMuted }]}>IA MonBénin</Text>}
                <View style={[s.bubble, isUser ? [s.bubbleUser, { backgroundColor: colors.primary }] : [s.bubbleAI, { backgroundColor: colors.bgCard, borderColor: colors.border }]]}>
                    <Text style={[s.bubbleText, { color: isUser ? "#fff" : colors.textPrimary }]}>{formatMsg(message.content)}</Text>
                </View>
            </View>
        </Animated.View>
    );
}

export default function AIChatScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const { colors, isDark } = useAppTheme();
    const [messages, setMessages] = useState([{ role: "assistant", content: "Bonjour Koffi ! Je suis votre assistant citoyen IA.\n\nJe connais votre dossier : CNI expire dans **43 jours**, allocation CNSS de **45 000 FCFA** disponible, assurance auto expire dans **16 jours**.\n\nComment puis-je vous aider ?" }]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const scrollRef = useRef(null);
    useEffect(() => { setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100); }, [messages, loading]);

    const send = async (text) => {
        const msg = text || input.trim(); if (!msg || loading) return; setInput(""); setError(null);
        const newMessages = [...messages, { role: "user", content: msg }]; setMessages(newMessages); setLoading(true);
        try {
            const geminiMessages = newMessages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));
            const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
            if (!apiKey) throw new Error("Clé API Gemini manquante. Vérifiez votre fichier .env");
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ systemInstruction: { parts: [{ text: PROFILE }] }, contents: geminiMessages, generationConfig: { maxOutputTokens: 1000, temperature: 0.7 } }),
            });
            const data = await res.json(); if (data.error) throw new Error(data.error.message);
            const reply = data.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "Désolé, réessayez.";
            setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
        } catch (e) { setError("Erreur : " + e.message); setMessages((prev) => prev.slice(0, -1)); }
        setLoading(false);
    };

    const suggestions = ["Renouveler CNI ?", "Aides CNSS ?", "Payer SBEE ?", "Impôts 2025", "Assurance auto"];
    const headerGrad = isDark ? [colors.primaryDeep, colors.bgDark] : [colors.primaryDark, colors.primary];

    return (
        <KeyboardAvoidingView style={[s.container, { backgroundColor: colors.bgDark }]} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <LinearGradient colors={headerGrad} start={{ x: 0, y: 0 }} end={{ x: 0.5, y: 1 }} style={[s.header, { paddingTop: insets.top + 8 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}><ArrowLeft size={16} color="rgba(255,255,255,0.7)" /><Text style={s.backText}>Retour</Text></TouchableOpacity>
                <View style={s.titleRow}>
                    <View style={s.aiIcon}><Sparkles size={18} color="#fff" /></View>
                    <View style={{ flex: 1 }}><Text style={s.headerTitle}>Assistant IA Citoyen</Text><Text style={s.headerStatus}>Connecté · Prêt à aider</Text></View>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
                    {suggestions.map((sg) => (
                        <TouchableOpacity key={sg} onPress={() => send(sg)} disabled={loading} style={[s.chip, { backgroundColor: "rgba(255,255,255,0.12)", borderColor: "rgba(255,255,255,0.2)" }]} activeOpacity={0.7}>
                            <Text style={s.chipText}>{sg}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </LinearGradient>
            <ScrollView ref={scrollRef} style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 10 }}>
                {messages.map((m, i) => <MessageBubble key={i} message={m} colors={colors} isDark={isDark} />)}
                {loading && (
                    <View style={s.msgRow}>
                        <View style={[s.avatarAI, { backgroundColor: isDark ? "rgba(0,224,142,0.1)" : "rgba(0,168,107,0.08)", borderColor: isDark ? "rgba(0,224,142,0.15)" : "rgba(0,168,107,0.12)" }]}><Sparkles size={14} color={colors.primaryLight} /></View>
                        <View><Text style={[s.aiLabelText, { color: colors.textMuted }]}>IA MonBénin</Text><View style={[s.bubbleAI, { backgroundColor: colors.bgCard, borderColor: colors.border }]}><TypingIndicator color={colors.primary} /></View></View>
                    </View>
                )}
                {error && <View style={[s.errorBox, { backgroundColor: colors.redSoft, borderColor: "rgba(239,68,68,0.3)" }]}><Text style={[s.errorText, { color: colors.red }]}>{error}</Text></View>}
            </ScrollView>
            <View style={[s.inputBar, { paddingBottom: 8, backgroundColor: colors.bgCard, borderTopColor: colors.border }]}>
                <View style={[s.inputWrap, { backgroundColor: colors.bgSurface, borderColor: colors.border }]}>
                    <TextInput value={input} onChangeText={setInput} onSubmitEditing={() => send()} placeholder="Posez votre question..." editable={!loading} style={[s.input, { color: colors.textPrimary }]} placeholderTextColor={colors.textMuted} returnKeyType="send" />
                </View>
                <TouchableOpacity onPress={() => send()} disabled={loading || !input.trim()} activeOpacity={0.7}>
                    <LinearGradient colors={loading || !input.trim() ? [colors.bgCardLight, colors.bgCardLight] : [colors.primary, colors.primaryDark]} style={s.sendBtn}>
                        {loading ? <TypingIndicator color={colors.textMuted} /> : <Send size={16} color="#fff" />}
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const s = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 16, paddingBottom: 14 },
    backBtn: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10 },
    backText: { color: "rgba(255,255,255,0.7)", fontSize: 14 },
    titleRow: { flexDirection: "row", alignItems: "center", gap: 12 },
    aiIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.15)", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
    headerTitle: { fontWeight: "800", color: "#fff", fontSize: 18, letterSpacing: -0.3 },
    headerStatus: { color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 2, fontWeight: "500" },
    chip: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginRight: 8 },
    chipText: { color: "#fff", fontSize: 12, fontWeight: "500" },
    msgRow: { flexDirection: "row", marginBottom: 16, gap: 10, alignItems: "flex-end" },
    msgRowUser: { justifyContent: "flex-end" },
    avatarAI: { width: 32, height: 32, borderRadius: 10, borderWidth: 1, alignItems: "center", justifyContent: "center", marginBottom: 4 },
    aiLabelText: { fontSize: 11, marginBottom: 4, marginLeft: 4, fontWeight: "500" },
    bubble: { maxWidth: 270, padding: 12, paddingHorizontal: 16, borderRadius: 18 },
    bubbleUser: { borderBottomRightRadius: 4, ...shadows.glow },
    bubbleAI: { borderWidth: 1, borderBottomLeftRadius: 4 },
    bubbleText: { fontSize: 14, lineHeight: 22 },
    typingWrap: { flexDirection: "row", gap: 5, padding: 4, alignItems: "center" },
    typingDot: { width: 8, height: 8, borderRadius: 4 },
    errorBox: { borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 12 },
    errorText: { fontSize: 13 },
    inputBar: { paddingTop: 10, paddingHorizontal: 16, borderTopWidth: 1, flexDirection: "row", gap: 10, alignItems: "center" },
    inputWrap: { flex: 1, borderRadius: 22, borderWidth: 1 },
    input: { paddingHorizontal: 18, paddingVertical: 12, fontSize: 14 },
    sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
});
