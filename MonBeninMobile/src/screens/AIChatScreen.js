import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Animated,
    Modal,
    Dimensions,
    Vibration,
    Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "../ThemeContext";
import { shadows, PROFILE } from "../theme";
import {
    ArrowLeft,
    Sparkles,
    Send,
    CreditCard,
    CheckCircle,
    X,
    Zap,
    Droplets,
    Wifi,
    Receipt,
    ShieldCheck,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

// ─── Payment detection keywords ───
const PAYMENT_KEYWORDS = [
    { keys: ["facture", "eau", "soneb"], label: "SONEB (Eau)", amount: "14 200", icon: "water", ref: "SONEB-2026-" },
    { keys: ["facture", "électricité", "sbee", "courant", "lumière"], label: "SBEE (Électricité)", amount: "28 400", icon: "electric", ref: "SBEE-2026-" },
    { keys: ["facture", "internet", "wifi", "fibre"], label: "Internet / Fibre", amount: "18 500", icon: "wifi", ref: "NET-2026-" },
    { keys: ["impôt", "impot", "trésor", "quittance"], label: "Quittance Trésor", amount: "45 000", icon: "receipt", ref: "TRESOR-2026-" },
    { keys: ["assurance"], label: "Assurance Auto (NSIA)", amount: "85 000", icon: "receipt", ref: "NSIA-2026-" },
];

function detectPaymentIntent(userMsg) {
    const lower = userMsg.toLowerCase();
    const isPaying = ["payer", "pay", "régler", "regler", "paiement", "facture"].some((k) => lower.includes(k));
    if (!isPaying) return null;

    for (const p of PAYMENT_KEYWORDS) {
        if (p.keys.some((k) => lower.includes(k))) return p;
    }
    // Default to SBEE if just "payer facture"
    if (lower.includes("facture")) return PAYMENT_KEYWORDS[1]; // SBEE
    return PAYMENT_KEYWORDS[0]; // Default SONEB
}

function getPaymentIcon(iconName, color) {
    switch (iconName) {
        case "water": return <Droplets size={20} color={color} />;
        case "electric": return <Zap size={20} color={color} />;
        case "wifi": return <Wifi size={20} color={color} />;
        case "receipt": return <Receipt size={20} color={color} />;
        default: return <CreditCard size={20} color={color} />;
    }
}

// ─── Typing indicator ───
function TypingIndicator({ color }) {
    const dots = [
        useRef(new Animated.Value(0.3)).current,
        useRef(new Animated.Value(0.3)).current,
        useRef(new Animated.Value(0.3)).current,
    ];
    useEffect(() => {
        dots.forEach((dot, i) => {
            Animated.loop(
                Animated.sequence([
                    Animated.delay(i * 200),
                    Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
                    Animated.timing(dot, { toValue: 0.3, duration: 400, useNativeDriver: true }),
                ])
            ).start();
        });
    }, []);
    return (
        <View style={s.typingWrap}>
            {dots.map((dot, i) => (
                <Animated.View
                    key={i}
                    style={[s.typingDot, { opacity: dot, transform: [{ scale: dot }], backgroundColor: color }]}
                />
            ))}
        </View>
    );
}

// ─── Payment Button (inside chat bubble) ───
function PaymentButton({ payment, colors, isDark, onPay }) {
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.02, duration: 1200, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View style={{ transform: [{ scale: pulseAnim }], marginTop: 12 }}>
            <View
                style={[
                    s.paymentCard,
                    {
                        backgroundColor: isDark ? "rgba(0,176,116,0.08)" : "rgba(0,168,107,0.06)",
                        borderColor: isDark ? "rgba(0,224,142,0.2)" : "rgba(0,168,107,0.15)",
                    },
                ]}
            >
                <View style={s.paymentHeader}>
                    <View
                        style={[
                            s.paymentIconWrap,
                            { backgroundColor: isDark ? "rgba(0,224,142,0.12)" : "rgba(0,168,107,0.1)" },
                        ]}
                    >
                        {getPaymentIcon(payment.icon, colors.primaryLight)}
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[s.paymentLabel, { color: colors.textPrimary }]}>{payment.label}</Text>
                        <Text style={[s.paymentAmount, { color: colors.primaryLight }]}>
                            {payment.amount} FCFA
                        </Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => onPay(payment)} activeOpacity={0.8}>
                    <LinearGradient
                        colors={[colors.primary, colors.primaryLight]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={s.payBtn}
                    >
                        <CreditCard size={16} color="#fff" />
                        <Text style={s.payBtnText}>Payer {payment.amount} FCFA</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
}

// ─── Payment Modal ───
function PaymentModal({ visible, payment, colors, isDark, onClose, onConfirm }) {
    const [stage, setStage] = useState("confirm"); // confirm | processing | success
    const [phoneNumber, setPhoneNumber] = useState("+229 97 00 00 00");
    const [editingPhone, setEditingPhone] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;
    const checkAnim = useRef(new Animated.Value(0)).current;
    const phoneInputRef = useRef(null);

    useEffect(() => {
        if (visible) {
            setStage("confirm");
            setEditingPhone(false);
            fadeAnim.setValue(0);
            scaleAnim.setValue(0.8);
            progressAnim.setValue(0);
            checkAnim.setValue(0);
            Animated.parallel([
                Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 10, useNativeDriver: true }),
            ]).start();
        }
    }, [visible]);

    const handleConfirm = () => {
        setStage("processing");
        setEditingPhone(false);
        Animated.timing(progressAnim, {
            toValue: 1,
            duration: 2500,
            useNativeDriver: false,
        }).start(() => {
            setStage("success");
            Vibration.vibrate([0, 50, 100, 50]);
            Animated.spring(checkAnim, {
                toValue: 1,
                tension: 50,
                friction: 6,
                useNativeDriver: true,
            }).start();
        });
    };

    if (!payment) return null;

    const refNumber = payment.ref + String(Math.floor(10000 + Math.random() * 90000));
    const dateStr = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
    const timeStr = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"],
    });

    return (
        <Modal transparent visible={visible} animationType="none">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); setEditingPhone(false); }}>
                    <Animated.View style={[s.modalOverlay, { opacity: fadeAnim }]}>
                        <Animated.View
                            style={[
                                s.modalContent,
                                {
                                    backgroundColor: colors.bgCard,
                                    borderColor: colors.border,
                                    transform: [{ scale: scaleAnim }],
                                },
                            ]}
                        >
                            {/* Close button */}
                            {stage !== "processing" && (
                                <TouchableOpacity
                                    style={[s.modalClose, { backgroundColor: colors.glass }]}
                                    onPress={() => {
                                        onClose();
                                        if (stage === "success") onConfirm(payment, refNumber);
                                    }}
                                >
                                    <X size={18} color={colors.textMuted} />
                                </TouchableOpacity>
                            )}

                            {stage === "confirm" && (
                                <>
                                    <View
                                        style={[
                                            s.modalIcon,
                                            { backgroundColor: isDark ? "rgba(0,224,142,0.1)" : "rgba(0,168,107,0.08)" },
                                        ]}
                                    >
                                        {getPaymentIcon(payment.icon, colors.primaryLight)}
                                    </View>
                                    <Text style={[s.modalTitle, { color: colors.textPrimary }]}>Confirmer le paiement</Text>
                                    <Text style={[s.modalSub, { color: colors.textMuted }]}>
                                        Vous allez payer votre facture {payment.label}
                                    </Text>

                                    <View style={[s.modalAmountBox, { backgroundColor: colors.bgSurface, borderColor: colors.border }]}>
                                        <Text style={[s.modalAmountLabel, { color: colors.textMuted }]}>Montant total</Text>
                                        <Text style={[s.modalAmount, { color: colors.primaryLight }]}>{payment.amount} FCFA</Text>
                                    </View>

                                    <View style={s.modalDetails}>
                                        <View style={s.modalDetailRow}>
                                            <Text style={[s.modalDetailKey, { color: colors.textMuted }]}>Moyen de paiement</Text>
                                            <Text style={[s.modalDetailVal, { color: colors.textPrimary }]}>MTN MoMo</Text>
                                        </View>
                                        <View style={[s.modalDivider, { backgroundColor: colors.border }]} />

                                        {/* Editable phone number */}
                                        <View style={s.modalDetailRow}>
                                            <Text style={[s.modalDetailKey, { color: colors.textMuted }]}>Numéro</Text>
                                            {editingPhone ? (
                                                <View style={s.phoneEditActive}>
                                                    <TextInput
                                                        ref={phoneInputRef}
                                                        value={phoneNumber}
                                                        onChangeText={setPhoneNumber}
                                                        keyboardType="phone-pad"
                                                        style={[
                                                            s.phoneInput,
                                                            {
                                                                color: colors.textPrimary,
                                                                borderColor: colors.primaryLight,
                                                                backgroundColor: colors.bgSurface,
                                                            },
                                                        ]}
                                                        autoFocus
                                                    />
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setEditingPhone(false);
                                                            Keyboard.dismiss();
                                                        }}
                                                        style={[s.phoneOkBtn, { backgroundColor: colors.primary }]}
                                                    >
                                                        <Text style={s.phoneOkText}>OK</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            ) : (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setEditingPhone(true);
                                                        setTimeout(() => phoneInputRef.current?.focus(), 100);
                                                    }}
                                                    style={s.phoneEditRow}
                                                >
                                                    <Text style={[s.modalDetailVal, { color: colors.textPrimary }]}>
                                                        {phoneNumber}
                                                    </Text>
                                                    <Text style={[s.phoneChangeBtn, { color: colors.primaryLight }]}>
                                                        Modifier
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>

                                    <TouchableOpacity onPress={handleConfirm} activeOpacity={0.85}>
                                        <LinearGradient
                                            colors={[colors.primary, colors.primaryLight]}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={s.modalPayBtn}
                                        >
                                            <ShieldCheck size={18} color="#fff" />
                                            <Text style={s.modalPayBtnText}>Confirmer — {payment.amount} FCFA</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </>
                            )}

                            {stage === "processing" && (
                                <View style={{ alignItems: "center", paddingVertical: 30 }}>
                                    <View
                                        style={[
                                            s.modalIcon,
                                            { backgroundColor: isDark ? "rgba(0,224,142,0.1)" : "rgba(0,168,107,0.08)" },
                                        ]}
                                    >
                                        <CreditCard size={28} color={colors.primaryLight} />
                                    </View>
                                    <Text style={[s.modalTitle, { color: colors.textPrimary }]}>Paiement en cours...</Text>
                                    <Text style={[s.modalSub, { color: colors.textMuted }]}>
                                        Connexion à MTN MoMo...
                                    </Text>
                                    <View style={[s.progressBar, { backgroundColor: colors.bgSurface }]}>
                                        <Animated.View
                                            style={[
                                                s.progressFill,
                                                { width: progressWidth, backgroundColor: colors.primary },
                                            ]}
                                        />
                                    </View>
                                </View>
                            )}

                            {stage === "success" && (
                                <Animated.View
                                    style={{ width: "100%", alignItems: "center", transform: [{ scale: checkAnim }] }}
                                >
                                    <View style={[s.successIcon, { backgroundColor: "rgba(0,224,142,0.15)" }]}>
                                        <CheckCircle size={40} color={colors.primaryLight} />
                                    </View>
                                    <Text style={[s.modalTitle, { color: colors.primaryLight }]}>Paiement réussi !</Text>
                                    <Text style={[s.modalSub, { color: colors.textMuted }]}>
                                        Votre facture {payment.label} a été payée.
                                    </Text>

                                    <View style={[s.receiptCard, { backgroundColor: colors.bgSurface, borderColor: colors.border }]}>
                                        <Text style={[s.receiptTitle, { color: colors.textPrimary }]}>Reçu de paiement</Text>
                                        <View style={[s.receiptDivider, { backgroundColor: colors.border }]} />
                                        {[
                                            ["Référence", refNumber],
                                            ["Montant", `${payment.amount} FCFA`],
                                            ["Date", dateStr],
                                            ["Heure", timeStr],
                                            ["Via", "MTN MoMo"],
                                            ["Statut", "Payé"],
                                        ].map(([k, v]) => (
                                            <View key={k} style={s.receiptRow}>
                                                <Text style={[s.receiptKey, { color: colors.textMuted }]}>{k}</Text>
                                                <Text style={[s.receiptVal, { color: colors.textPrimary }]}>{v}</Text>
                                            </View>
                                        ))}
                                    </View>

                                    <TouchableOpacity
                                        onPress={() => {
                                            onClose();
                                            onConfirm(payment, refNumber);
                                        }}
                                        activeOpacity={0.85}
                                        style={{ width: "100%" }}
                                    >
                                        <LinearGradient
                                            colors={[colors.primary, colors.primaryLight]}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={s.modalPayBtn}
                                        >
                                            <Text style={s.modalPayBtnText}>Fermer</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </Animated.View>
                            )}
                        </Animated.View>
                    </Animated.View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Modal>
    );
}

// ─── Message Bubble ───
function MessageBubble({ message, colors, isDark, onPay }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.92)).current;
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, tension: 80, friction: 10, useNativeDriver: true }),
        ]).start();
    }, []);
    const isUser = message.role === "user";

    const formatMsg = (text) =>
        text.split("\n").map((line, i) => {
            const parts = line.split(/\*\*(.*?)\*\*/g);
            return (
                <Text key={i}>
                    {parts.map((p, j) =>
                        j % 2 === 1 ? (
                            <Text key={j} style={{ fontWeight: "800", color: isUser ? "#fff" : colors.primaryLight }}>
                                {p}
                            </Text>
                        ) : (
                            p
                        )
                    )}
                    {i < text.split("\n").length - 1 ? "\n" : ""}
                </Text>
            );
        });

    return (
        <Animated.View
            style={[s.msgRow, isUser && s.msgRowUser, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
        >
            {!isUser && (
                <View
                    style={[
                        s.avatarAI,
                        {
                            backgroundColor: isDark ? "rgba(0,224,142,0.1)" : "rgba(0,168,107,0.08)",
                            borderColor: isDark ? "rgba(0,224,142,0.15)" : "rgba(0,168,107,0.12)",
                        },
                    ]}
                >
                    <Sparkles size={14} color={colors.primaryLight} />
                </View>
            )}
            <View>
                {!isUser && <Text style={[s.aiLabelText, { color: colors.textMuted }]}>IA Super App</Text>}
                <View
                    style={[
                        s.bubble,
                        isUser
                            ? [s.bubbleUser, { backgroundColor: colors.primary }]
                            : [s.bubbleAI, { backgroundColor: colors.bgCard, borderColor: colors.border }],
                    ]}
                >
                    <Text style={[s.bubbleText, { color: isUser ? "#fff" : colors.textPrimary }]}>
                        {formatMsg(message.content)}
                    </Text>
                    {/* Payment button if present */}
                    {message.payment && !message.paid && (
                        <PaymentButton payment={message.payment} colors={colors} isDark={isDark} onPay={onPay} />
                    )}
                    {message.paid && (
                        <View style={[s.paidBadge, { backgroundColor: "rgba(0,224,142,0.12)", borderColor: "rgba(0,224,142,0.2)" }]}>
                            <CheckCircle size={14} color={colors.primaryLight} />
                            <Text style={[s.paidText, { color: colors.primaryLight }]}>
                                Payé · Réf: {message.paidRef}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </Animated.View>
    );
}

// ─── ENHANCED PROFILE with payment instructions ───
const ENHANCED_PROFILE =
    PROFILE +
    `\n\nIMPORTANT - INSTRUCTIONS DE PAIEMENT:
Quand le citoyen demande de payer une facture ou régler un paiement, tu DOIS répondre avec un résumé clair de la facture à payer.
Par exemple : "Voici votre facture **SONEB (Eau)** d'un montant de **14 200 FCFA**. Vous pouvez procéder au paiement ci-dessous."
Ou : "Votre facture **SBEE (Électricité)** de **28 400 FCFA** est prête. Cliquez sur le bouton pour payer."
Sois toujours encourageant et rassure le citoyen que le paiement est sécurisé via MTN MoMo.
`;

// ─── Main Chat Screen ───
export default function AIChatScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const { colors, isDark } = useAppTheme();
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content:
                'Bonjour Koffi ! Je suis votre assistant citoyen IA.\n\nJe connais votre dossier : CNI expire dans **43 jours**, allocation CNSS de **45 000 FCFA** disponible, assurance auto expire dans **16 jours**.\n\nVous pouvez me demander de **payer vos factures** (eau, électricité, impôts...) directement ici !\n\nComment puis-je vous aider ?',
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paymentModal, setPaymentModal] = useState({ visible: false, payment: null });
    const [payingMsgIndex, setPayingMsgIndex] = useState(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, [messages, loading]);

    const handlePay = (payment, msgIdx) => {
        setPayingMsgIndex(msgIdx);
        setPaymentModal({ visible: true, payment });
    };

    const handlePaymentConfirm = (payment, refNumber) => {
        // Mark the message as paid
        setMessages((prev) =>
            prev.map((m, i) => {
                if (m.payment && m.payment.label === payment.label && !m.paid) {
                    return { ...m, paid: true, paidRef: refNumber };
                }
                return m;
            })
        );
        // Add confirmation message from AI
        setMessages((prev) => [
            ...prev,
            {
                role: "assistant",
                content: `**Paiement confirmé !**\n\nVotre facture **${payment.label}** de **${payment.amount} FCFA** a été payée avec succès via MTN MoMo.\n\nRéférence : **${refNumber}**\n\nVotre reçu a été enregistré dans votre dossier citoyen.`,
            },
        ]);
    };

    const send = async (text) => {
        const msg = text || input.trim();
        if (!msg || loading) return;
        setInput("");
        setError(null);

        const newMessages = [...messages, { role: "user", content: msg }];
        setMessages(newMessages);
        setLoading(true);

        // Check for payment intent FIRST
        const paymentIntent = detectPaymentIntent(msg);

        if (paymentIntent) {
            // Simulate a short delay then show AI response with payment button
            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content: `Bien sûr ! Voici votre facture **${paymentIntent.label}** d'un montant de **${paymentIntent.amount} FCFA**.\n\nLe paiement sera effectué via **MTN MoMo** (+229 97 XX XX XX). Cliquez sur le bouton ci-dessous pour procéder.`,
                        payment: paymentIntent,
                    },
                ]);
                setLoading(false);
            }, 1200);
            return;
        }

        // Normal AI response via Gemini
        try {
            const geminiMessages = newMessages
                .filter((m) => !m.payment) // Filter out payment meta
                .map((m) => ({
                    role: m.role === "assistant" ? "model" : "user",
                    parts: [{ text: m.content }],
                }));

            const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
            if (!apiKey) throw new Error("Clé API Gemini manquante. Vérifiez votre fichier .env");

            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        systemInstruction: { parts: [{ text: ENHANCED_PROFILE }] },
                        contents: geminiMessages,
                        generationConfig: { maxOutputTokens: 1000, temperature: 0.7 },
                    }),
                }
            );
            const data = await res.json();
            if (data.error) throw new Error(data.error.message);
            const reply =
                data.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "Désolé, réessayez.";

            // Check if AI response mentions payment too
            const aiPayment = detectPaymentIntent(reply);
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: reply,
                    ...(aiPayment ? { payment: aiPayment } : {}),
                },
            ]);
        } catch (e) {
            setError("Erreur : " + e.message);
            setMessages((prev) => prev.slice(0, -1));
        }
        setLoading(false);
    };

    const suggestions = [
        "Payer facture eau",
        "Payer SBEE",
        "Renouveler CNI ?",
        "Aides CNSS ?",
        "Impôts 2025",
    ];
    const headerGrad = isDark ? [colors.primaryDeep, colors.bgDark] : [colors.primaryDark, colors.primary];

    return (
        <KeyboardAvoidingView
            style={[s.container, { backgroundColor: colors.bgDark }]}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            {/* Header */}
            <LinearGradient
                colors={headerGrad}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={[s.header, { paddingTop: insets.top + 8 }]}
            >
                <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
                    <ArrowLeft size={16} color="rgba(255,255,255,0.7)" />
                    <Text style={s.backText}>Retour</Text>
                </TouchableOpacity>
                <View style={s.titleRow}>
                    <View style={s.aiIcon}>
                        <Sparkles size={18} color="#fff" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={s.headerTitle}>Assistant IA Citoyen</Text>
                        <Text style={s.headerStatus}>Connecté · Prêt à aider</Text>
                    </View>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
                    {suggestions.map((sg) => (
                        <TouchableOpacity
                            key={sg}
                            onPress={() => send(sg)}
                            disabled={loading}
                            style={[
                                s.chip,
                                { backgroundColor: "rgba(255,255,255,0.12)", borderColor: "rgba(255,255,255,0.2)" },
                            ]}
                            activeOpacity={0.7}
                        >
                            <Text style={s.chipText}>{sg}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </LinearGradient>

            {/* Messages */}
            <ScrollView ref={scrollRef} style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 10 }}>
                {messages.map((m, i) => (
                    <MessageBubble
                        key={i}
                        message={m}
                        colors={colors}
                        isDark={isDark}
                        onPay={(payment) => handlePay(payment, i)}
                    />
                ))}
                {loading && (
                    <View style={s.msgRow}>
                        <View
                            style={[
                                s.avatarAI,
                                {
                                    backgroundColor: isDark ? "rgba(0,224,142,0.1)" : "rgba(0,168,107,0.08)",
                                    borderColor: isDark ? "rgba(0,224,142,0.15)" : "rgba(0,168,107,0.12)",
                                },
                            ]}
                        >
                            <Sparkles size={14} color={colors.primaryLight} />
                        </View>
                        <View>
                            <Text style={[s.aiLabelText, { color: colors.textMuted }]}>IA Super App</Text>
                            <View style={[s.bubbleAI, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                                <TypingIndicator color={colors.primary} />
                            </View>
                        </View>
                    </View>
                )}
                {error && (
                    <View style={[s.errorBox, { backgroundColor: colors.redSoft, borderColor: "rgba(239,68,68,0.3)" }]}>
                        <Text style={[s.errorText, { color: colors.red }]}>{error}</Text>
                    </View>
                )}
            </ScrollView>

            {/* Input bar */}
            <View style={[s.inputBar, { paddingBottom: 8, backgroundColor: colors.bgCard, borderTopColor: colors.border }]}>
                <View style={[s.inputWrap, { backgroundColor: colors.bgSurface, borderColor: colors.border }]}>
                    <TextInput
                        value={input}
                        onChangeText={setInput}
                        onSubmitEditing={() => send()}
                        placeholder="Posez votre question..."
                        editable={!loading}
                        style={[s.input, { color: colors.textPrimary }]}
                        placeholderTextColor={colors.textMuted}
                        returnKeyType="send"
                    />
                </View>
                <TouchableOpacity onPress={() => send()} disabled={loading || !input.trim()} activeOpacity={0.7}>
                    <LinearGradient
                        colors={
                            loading || !input.trim()
                                ? [colors.bgCardLight, colors.bgCardLight]
                                : [colors.primary, colors.primaryDark]
                        }
                        style={s.sendBtn}
                    >
                        {loading ? <TypingIndicator color={colors.textMuted} /> : <Send size={16} color="#fff" />}
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* Payment Modal */}
            <PaymentModal
                visible={paymentModal.visible}
                payment={paymentModal.payment}
                colors={colors}
                isDark={isDark}
                onClose={() => setPaymentModal({ visible: false, payment: null })}
                onConfirm={handlePaymentConfirm}
            />
        </KeyboardAvoidingView>
    );
}

const s = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 16, paddingBottom: 14 },
    backBtn: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10 },
    backText: { color: "rgba(255,255,255,0.7)", fontSize: 14 },
    titleRow: { flexDirection: "row", alignItems: "center", gap: 12 },
    aiIcon: {
        width: 40,
        height: 40,
        borderRadius: 14,
        backgroundColor: "rgba(255,255,255,0.15)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: { fontWeight: "800", color: "#fff", fontSize: 18, letterSpacing: -0.3 },
    headerStatus: { color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 2, fontWeight: "500" },
    chip: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginRight: 8 },
    chipText: { color: "#fff", fontSize: 12, fontWeight: "500" },

    // Messages
    msgRow: { flexDirection: "row", marginBottom: 16, gap: 10, alignItems: "flex-end" },
    msgRowUser: { justifyContent: "flex-end" },
    avatarAI: {
        width: 32,
        height: 32,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 4,
    },
    aiLabelText: { fontSize: 11, marginBottom: 4, marginLeft: 4, fontWeight: "500" },
    bubble: { maxWidth: 290, padding: 12, paddingHorizontal: 16, borderRadius: 18 },
    bubbleUser: { borderBottomRightRadius: 4, ...shadows.glow },
    bubbleAI: { borderWidth: 1, borderBottomLeftRadius: 4 },
    bubbleText: { fontSize: 14, lineHeight: 22 },

    // Typing
    typingWrap: { flexDirection: "row", gap: 5, padding: 4, alignItems: "center" },
    typingDot: { width: 8, height: 8, borderRadius: 4 },

    // Error
    errorBox: { borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 12 },
    errorText: { fontSize: 13 },

    // Input
    inputBar: {
        paddingTop: 10,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
    },
    inputWrap: { flex: 1, borderRadius: 22, borderWidth: 1 },
    input: { paddingHorizontal: 18, paddingVertical: 12, fontSize: 14 },
    sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },

    // Payment card in bubble
    paymentCard: {
        borderRadius: 14,
        borderWidth: 1,
        padding: 14,
    },
    paymentHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 12,
    },
    paymentIconWrap: {
        width: 42,
        height: 42,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    paymentLabel: { fontSize: 14, fontWeight: "700", letterSpacing: -0.2 },
    paymentAmount: { fontSize: 18, fontWeight: "900", marginTop: 2 },
    payBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 12,
        borderRadius: 12,
        ...shadows.glow,
    },
    payBtnText: { color: "#fff", fontSize: 14, fontWeight: "800" },

    // Paid badge
    paidBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1,
    },
    paidText: { fontSize: 12, fontWeight: "700" },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    modalContent: {
        width: width - 48,
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        alignItems: "center",
        ...shadows.elevated,
    },
    modalClose: {
        position: "absolute",
        top: 14,
        right: 14,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    modalIcon: {
        width: 64,
        height: 64,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    modalTitle: { fontSize: 20, fontWeight: "900", letterSpacing: -0.5, marginBottom: 6 },
    modalSub: { fontSize: 14, textAlign: "center", lineHeight: 20, marginBottom: 20 },
    modalAmountBox: {
        width: "100%",
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
        alignItems: "center",
        marginBottom: 16,
    },
    modalAmountLabel: { fontSize: 12, fontWeight: "600", letterSpacing: 0.5, textTransform: "uppercase" },
    modalAmount: { fontSize: 28, fontWeight: "900", marginTop: 4, letterSpacing: -1 },
    modalDetails: { width: "100%", marginBottom: 20 },
    modalDetailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
    },
    modalDetailKey: { fontSize: 13, fontWeight: "500" },
    modalDetailVal: { fontSize: 13, fontWeight: "700" },
    modalDivider: { height: 1, width: "100%" },
    modalPayBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 16,
        width: "100%",
        ...shadows.glow,
    },
    modalPayBtnText: { color: "#fff", fontSize: 16, fontWeight: "800", letterSpacing: 0.3 },

    // Progress bar
    progressBar: {
        width: "80%",
        height: 6,
        borderRadius: 3,
        marginTop: 20,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        borderRadius: 3,
    },

    // Success
    successIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },

    // Receipt
    receiptCard: {
        width: "100%",
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
        marginBottom: 20,
        marginTop: 8,
    },
    receiptTitle: { fontSize: 14, fontWeight: "800", textAlign: "center", marginBottom: 8 },
    receiptDivider: { height: 1, width: "100%", marginBottom: 8 },
    receiptRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 4,
    },
    receiptKey: { fontSize: 12, fontWeight: "500" },
    receiptVal: { fontSize: 12, fontWeight: "700" },

    // Phone edit
    phoneInput: {
        borderWidth: 1.5,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 13,
        fontWeight: "700",
        minWidth: 160,
        textAlign: "right",
    },
    phoneEditRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    phoneChangeBtn: {
        fontSize: 12,
        fontWeight: "700",
    },
    phoneEditActive: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    phoneOkBtn: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
    },
    phoneOkText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "800",
    },
});
