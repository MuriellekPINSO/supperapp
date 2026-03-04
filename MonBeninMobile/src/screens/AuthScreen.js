import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "../ThemeContext";
import { shadows } from "../theme";
import {
    User,
    Mail,
    Phone,
    Hash,
    Lock,
    Eye,
    EyeOff,
    ChevronRight,
    Shield,
    CheckCircle,
    MessageSquare,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

function FloatingOrb({ delay, colors }) {
    const anim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(anim, {
                    toValue: 1,
                    duration: 4000 + delay,
                    useNativeDriver: true,
                }),
                Animated.timing(anim, {
                    toValue: 0,
                    duration: 4000 + delay,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const translateY = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -20],
    });
    const opacity = anim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.15, 0.3, 0.15],
    });

    return (
        <Animated.View
            style={{
                position: "absolute",
                width: 120 + delay * 0.02,
                height: 120 + delay * 0.02,
                borderRadius: 70,
                backgroundColor: colors.primary,
                opacity,
                transform: [{ translateY }],
                top: 60 + (delay % 200),
                left: (delay * 1.3) % (width - 100),
            }}
        />
    );
}

function InputField({
    icon: Icon,
    label,
    placeholder,
    value,
    onChangeText,
    keyboardType = "default",
    required = false,
    error,
    colors,
    delay = 0,
    secureTextEntry = false,
    rightIcon,
    onRightIconPress,
    maxLength,
}) {
    const [focused, setFocused] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                delay,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 50,
                friction: 9,
                delay,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <Animated.View
            style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
                marginBottom: 16,
            }}
        >
            <View style={s.labelRow}>
                <Text style={[s.label, { color: colors.textSecondary }]}>
                    {label}
                    {required && (
                        <Text style={{ color: colors.red, fontWeight: "800", fontSize: 16 }}>
                            {" "}*
                        </Text>
                    )}
                </Text>
            </View>
            <View
                style={[
                    s.inputWrap,
                    {
                        backgroundColor: colors.bgCard,
                        borderColor: error
                            ? colors.red
                            : focused
                                ? colors.primaryLight
                                : colors.border,
                        borderWidth: focused || error ? 1.5 : 1,
                    },
                ]}
            >
                <View
                    style={[
                        s.inputIconWrap,
                        {
                            backgroundColor: focused ? colors.primarySoft : colors.glass,
                        },
                    ]}
                >
                    <Icon
                        size={18}
                        color={focused ? colors.primaryLight : colors.textMuted}
                    />
                </View>
                <TextInput
                    style={[s.input, { color: colors.textPrimary }]}
                    placeholder={placeholder}
                    placeholderTextColor={colors.textMuted}
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    autoCapitalize="none"
                    secureTextEntry={secureTextEntry}
                    maxLength={maxLength}
                />
                {rightIcon && (
                    <TouchableOpacity onPress={onRightIconPress}>
                        {rightIcon}
                    </TouchableOpacity>
                )}
                {!rightIcon && value.length > 0 && !error && (
                    <CheckCircle size={18} color={colors.primary} />
                )}
            </View>
            {error && (
                <Text style={[s.errorText, { color: colors.red }]}>{error}</Text>
            )}
        </Animated.View>
    );
}

// ─── SMS Code Input ───
function CodeInput({ value, onChangeText, colors, error }) {
    const inputRef = useRef(null);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.05, duration: 800, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    const digits = value.padEnd(6, " ").split("");

    return (
        <View style={{ marginBottom: 20 }}>
            <Text style={[s.label, { color: colors.textSecondary, marginBottom: 12, textAlign: "center" }]}>
                Entrez le code à 6 chiffres
            </Text>
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => inputRef.current?.focus()}
                style={s.codeRow}
            >
                {digits.map((d, i) => (
                    <Animated.View
                        key={i}
                        style={[
                            s.codeBox,
                            {
                                backgroundColor: colors.bgCard,
                                borderColor: d.trim()
                                    ? colors.primaryLight
                                    : i === value.length
                                        ? colors.primary
                                        : colors.border,
                                borderWidth: i === value.length ? 2 : 1,
                                transform: i === value.length ? [{ scale: pulseAnim }] : [],
                            },
                        ]}
                    >
                        <Text
                            style={[
                                s.codeDigit,
                                { color: d.trim() ? colors.textPrimary : colors.textMuted },
                            ]}
                        >
                            {d.trim() || "·"}
                        </Text>
                    </Animated.View>
                ))}
            </TouchableOpacity>
            <TextInput
                ref={inputRef}
                value={value}
                onChangeText={(t) => {
                    if (/^\d*$/.test(t) && t.length <= 6) onChangeText(t);
                }}
                keyboardType="number-pad"
                maxLength={6}
                style={{ position: "absolute", opacity: 0, height: 0 }}
                autoFocus
            />
            {error && (
                <Text style={[s.errorText, { color: colors.red, textAlign: "center", marginTop: 8 }]}>
                    {error}
                </Text>
            )}
        </View>
    );
}

export default function AuthScreen({ onAuth }) {
    const insets = useSafeAreaInsets();
    const { colors, isDark } = useAppTheme();

    const [isLogin, setIsLogin] = useState(true);

    // Login fields
    const [npi, setNpi] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Registration fields
    const [regNpi, setRegNpi] = useState("");
    const [regNom, setRegNom] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPhone, setRegPhone] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [showRegPassword, setShowRegPassword] = useState(false);

    // SMS verification
    const [step, setStep] = useState("form"); // "form" | "sms"
    const [smsCode, setSmsCode] = useState("");
    const [generatedCode, setGeneratedCode] = useState("");
    const [countdown, setCountdown] = useState(0);

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Animations
    const headerAnim = useRef(new Animated.Value(0)).current;
    const formAnim = useRef(new Animated.Value(0)).current;
    const btnAnim = useRef(new Animated.Value(1)).current;
    const smsAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.stagger(200, [
            Animated.timing(headerAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(formAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    // Countdown timer for resend
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const switchMode = () => {
        setIsLogin(!isLogin);
        setErrors({});
        setStep("form");
        setSmsCode("");
    };

    const validate = () => {
        const newErrors = {};

        if (isLogin) {
            if (!npi.trim()) newErrors.npi = "Le NPI est obligatoire";
            if (!password.trim()) newErrors.password = "Le mot de passe est obligatoire";
            if (password.trim() && password.trim().length < 4)
                newErrors.password = "Mot de passe trop court";
        } else {
            if (!regNpi.trim()) newErrors.regNpi = "Le NPI est obligatoire";
            if (!regNom.trim()) newErrors.regNom = "Le nom est requis";
            if (regEmail.trim() && !/\S+@\S+\.\S+/.test(regEmail))
                newErrors.regEmail = "Format d'email invalide";
            if (regPhone.trim() && regPhone.trim().length < 8)
                newErrors.regPhone = "Numéro de téléphone invalide";
            if (!regPassword.trim()) newErrors.regPassword = "Le mot de passe est obligatoire";
            if (regPassword.trim() && regPassword.trim().length < 6)
                newErrors.regPassword = "Minimum 6 caractères";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const sendSmsCode = () => {
        // Generate a 6-digit code
        const code = String(Math.floor(100000 + Math.random() * 900000));
        setGeneratedCode(code);
        setCountdown(60);

        // Animate transition to SMS screen
        Animated.timing(smsAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();

        // In a real app, this would send an SMS
        // For demo, we show the code in an alert-like card
        console.log("Code SMS envoyé:", code);
    };

    const handleSubmit = () => {
        if (step === "sms") {
            // Verify SMS code
            if (smsCode.length !== 6) {
                setErrors({ sms: "Veuillez entrer le code à 6 chiffres" });
                return;
            }
            if (smsCode !== generatedCode) {
                setErrors({ sms: "Code incorrect. Veuillez réessayer." });
                return;
            }

            setLoading(true);
            Animated.sequence([
                Animated.timing(btnAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
                Animated.timing(btnAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
            ]).start();

            setTimeout(() => {
                setLoading(false);
                if (onAuth) {
                    const data = isLogin
                        ? { npi, password }
                        : { npi: regNpi, nom: regNom, email: regEmail, phone: regPhone };
                    onAuth(data);
                }
            }, 1000);
            return;
        }

        if (!validate()) return;

        setLoading(true);

        Animated.sequence([
            Animated.timing(btnAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
            Animated.timing(btnAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start();

        // Simulate sending SMS
        setTimeout(() => {
            setLoading(false);
            setStep("sms");
            setSmsCode("");
            setErrors({});
            sendSmsCode();
        }, 1200);
    };

    const handleResend = () => {
        if (countdown > 0) return;
        setSmsCode("");
        setErrors({});
        sendSmsCode();
    };

    const headerGradient = isDark
        ? [colors.primaryDeep, colors.bgDark]
        : [colors.primaryDark, colors.primary];

    // ─── SMS Verification Screen ───
    if (step === "sms") {
        return (
            <View style={[s.container, { backgroundColor: colors.bgDark }]}>
                <View style={s.orbContainer}>
                    <FloatingOrb delay={0} colors={colors} />
                    <FloatingOrb delay={300} colors={colors} />
                </View>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ flexGrow: 1 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <LinearGradient
                            colors={headerGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0.5, y: 1 }}
                            style={[s.header, { paddingTop: insets.top + 30 }]}
                        >
                            <Animated.View style={{ opacity: smsAnim, alignItems: "center" }}>
                                <View style={s.logoContainer}>
                                    <LinearGradient
                                        colors={["rgba(255,255,255,0.2)", "rgba(255,255,255,0.05)"]}
                                        style={s.logoGradient}
                                    >
                                        <Image
                                            source={require("../../assets/logo.png")}
                                            style={{ width: 50, height: 50, borderRadius: 12 }}
                                            resizeMode="contain"
                                        />
                                    </LinearGradient>
                                </View>
                                <Text style={s.appTitle}>Vérification SMS</Text>
                                <Text style={s.appSubtitle}>
                                    Un code a été envoyé à votre numéro
                                </Text>
                            </Animated.View>
                        </LinearGradient>

                        <Animated.View
                            style={[
                                s.formContainer,
                                {
                                    opacity: smsAnim,
                                    transform: [
                                        {
                                            translateY: smsAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [40, 0],
                                            }),
                                        },
                                    ],
                                },
                            ]}
                        >
                            {/* Demo code display */}
                            <View
                                style={[
                                    s.demoCodeCard,
                                    {
                                        backgroundColor: colors.primarySoft,
                                        borderColor: colors.borderActive,
                                    },
                                ]}
                            >
                                <Shield size={16} color={colors.primary} />
                                <View style={{ flex: 1 }}>
                                    <Text style={[s.demoCodeLabel, { color: colors.textSecondary }]}>
                                        Code de vérification (démo) :
                                    </Text>
                                    <Text style={[s.demoCode, { color: colors.primaryLight }]}>
                                        {generatedCode}
                                    </Text>
                                </View>
                            </View>

                            <CodeInput
                                value={smsCode}
                                onChangeText={(t) => {
                                    setSmsCode(t);
                                    if (errors.sms) setErrors({});
                                }}
                                colors={colors}
                                error={errors.sms}
                            />

                            {/* Verify Button */}
                            <Animated.View
                                style={{ transform: [{ scale: btnAnim }], marginTop: 8 }}
                            >
                                <TouchableOpacity
                                    onPress={handleSubmit}
                                    activeOpacity={0.85}
                                    disabled={loading}
                                >
                                    <LinearGradient
                                        colors={[colors.primary, colors.primaryLight]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={[s.submitBtn, loading && { opacity: 0.7 }]}
                                    >
                                        <Text style={s.submitBtnText}>
                                            {loading ? "Vérification..." : "Vérifier le code"}
                                        </Text>
                                        {!loading && (
                                            <View style={s.submitArrow}>
                                                <ChevronRight size={18} color="#fff" />
                                            </View>
                                        )}
                                    </LinearGradient>
                                </TouchableOpacity>
                            </Animated.View>

                            {/* Resend */}
                            <TouchableOpacity
                                onPress={handleResend}
                                disabled={countdown > 0}
                                style={s.resendBtn}
                            >
                                <Text
                                    style={[
                                        s.resendText,
                                        {
                                            color: countdown > 0 ? colors.textMuted : colors.primaryLight,
                                        },
                                    ]}
                                >
                                    {countdown > 0
                                        ? `Renvoyer le code dans ${countdown}s`
                                        : "Renvoyer le code"}
                                </Text>
                            </TouchableOpacity>

                            {/* Back button */}
                            <TouchableOpacity
                                onPress={() => {
                                    setStep("form");
                                    setSmsCode("");
                                    setErrors({});
                                }}
                                style={s.switchBtn}
                            >
                                <Text style={[s.switchLink, { color: colors.textMuted }]}>
                                    ← Retour
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        );
    }

    // ─── Main Form Screen ───
    return (
        <View style={[s.container, { backgroundColor: colors.bgDark }]}>
            <View style={s.orbContainer}>
                <FloatingOrb delay={0} colors={colors} />
                <FloatingOrb delay={300} colors={colors} />
                <FloatingOrb delay={600} colors={colors} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <LinearGradient
                        colors={headerGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        style={[s.header, { paddingTop: insets.top + 30 }]}
                    >
                        <Animated.View
                            style={{ opacity: headerAnim, alignItems: "center" }}
                        >
                            <View style={s.logoContainer}>
                                <LinearGradient
                                    colors={["rgba(255,255,255,0.2)", "rgba(255,255,255,0.05)"]}
                                    style={s.logoGradient}
                                >
                                    <Image
                                        source={require("../../assets/logo.png")}
                                        style={{ width: 50, height: 50, borderRadius: 12 }}
                                        resizeMode="contain"
                                    />
                                </LinearGradient>
                                <View style={s.logoPulse} />
                            </View>

                            <Text style={s.appTitle}>Super App</Text>
                            <Text style={s.appSubtitle}>
                                La super application citoyenne
                            </Text>

                            {/* Mode toggle */}
                            <View
                                style={[
                                    s.modeToggle,
                                    { backgroundColor: "rgba(255,255,255,0.12)" },
                                ]}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        setIsLogin(true);
                                        setErrors({});
                                    }}
                                    style={[
                                        s.modeBtn,
                                        isLogin && {
                                            backgroundColor: "rgba(255,255,255,0.2)",
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            s.modeBtnText,
                                            { opacity: isLogin ? 1 : 0.6 },
                                        ]}
                                    >
                                        Connexion
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        setIsLogin(false);
                                        setErrors({});
                                    }}
                                    style={[
                                        s.modeBtn,
                                        !isLogin && {
                                            backgroundColor: "rgba(255,255,255,0.2)",
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            s.modeBtnText,
                                            { opacity: !isLogin ? 1 : 0.6 },
                                        ]}
                                    >
                                        Inscription
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    </LinearGradient>

                    {/* Form */}
                    <Animated.View
                        style={[
                            s.formContainer,
                            {
                                opacity: formAnim,
                                transform: [
                                    {
                                        translateY: formAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [40, 0],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        {isLogin ? (
                            <>
                                {/* ─── LOGIN FORM ─── */}
                                <InputField
                                    icon={Hash}
                                    label="NPI"
                                    placeholder="Ex: BJ-204-987-654-1"
                                    value={npi}
                                    onChangeText={(t) => {
                                        setNpi(t);
                                        if (errors.npi) setErrors((e) => ({ ...e, npi: undefined }));
                                    }}
                                    required
                                    error={errors.npi}
                                    colors={colors}
                                    delay={200}
                                />

                                <InputField
                                    icon={Lock}
                                    label="Mot de passe"
                                    placeholder="Entrez votre mot de passe"
                                    value={password}
                                    onChangeText={(t) => {
                                        setPassword(t);
                                        if (errors.password)
                                            setErrors((e) => ({ ...e, password: undefined }));
                                    }}
                                    required
                                    secureTextEntry={!showPassword}
                                    error={errors.password}
                                    colors={colors}
                                    delay={300}
                                    rightIcon={
                                        showPassword ? (
                                            <EyeOff size={20} color={colors.textMuted} />
                                        ) : (
                                            <Eye size={20} color={colors.textMuted} />
                                        )
                                    }
                                    onRightIconPress={() => setShowPassword(!showPassword)}
                                />
                            </>
                        ) : (
                            <>
                                {/* ─── REGISTRATION FORM ─── */}
                                <InputField
                                    icon={Hash}
                                    label="NPI"
                                    placeholder="Ex: BJ-204-987-654-1"
                                    value={regNpi}
                                    onChangeText={(t) => {
                                        setRegNpi(t);
                                        if (errors.regNpi)
                                            setErrors((e) => ({ ...e, regNpi: undefined }));
                                    }}
                                    required
                                    error={errors.regNpi}
                                    colors={colors}
                                    delay={200}
                                />

                                <InputField
                                    icon={User}
                                    label="Nom complet"
                                    placeholder="Ex: Koffi Adéchina Emmanuel"
                                    value={regNom}
                                    onChangeText={(t) => {
                                        setRegNom(t);
                                        if (errors.regNom)
                                            setErrors((e) => ({ ...e, regNom: undefined }));
                                    }}
                                    error={errors.regNom}
                                    colors={colors}
                                    delay={300}
                                />

                                <InputField
                                    icon={Mail}
                                    label="Adresse email"
                                    placeholder="Ex: koffi@email.com"
                                    value={regEmail}
                                    onChangeText={(t) => {
                                        setRegEmail(t);
                                        if (errors.regEmail)
                                            setErrors((e) => ({ ...e, regEmail: undefined }));
                                    }}
                                    keyboardType="email-address"
                                    error={errors.regEmail}
                                    colors={colors}
                                    delay={400}
                                />

                                <InputField
                                    icon={Phone}
                                    label="Numéro de téléphone"
                                    placeholder="Ex: +229 97 00 00 00"
                                    value={regPhone}
                                    onChangeText={(t) => {
                                        setRegPhone(t);
                                        if (errors.regPhone)
                                            setErrors((e) => ({ ...e, regPhone: undefined }));
                                    }}
                                    keyboardType="phone-pad"
                                    error={errors.regPhone}
                                    colors={colors}
                                    delay={500}
                                />

                                <InputField
                                    icon={Lock}
                                    label="Mot de passe"
                                    placeholder="Minimum 6 caractères"
                                    value={regPassword}
                                    onChangeText={(t) => {
                                        setRegPassword(t);
                                        if (errors.regPassword)
                                            setErrors((e) => ({ ...e, regPassword: undefined }));
                                    }}
                                    required
                                    secureTextEntry={!showRegPassword}
                                    error={errors.regPassword}
                                    colors={colors}
                                    delay={600}
                                    rightIcon={
                                        showRegPassword ? (
                                            <EyeOff size={20} color={colors.textMuted} />
                                        ) : (
                                            <Eye size={20} color={colors.textMuted} />
                                        )
                                    }
                                    onRightIconPress={() => setShowRegPassword(!showRegPassword)}
                                />
                            </>
                        )}

                        {/* NPI Info card */}
                        <View
                            style={[
                                s.infoCard,
                                {
                                    backgroundColor: colors.primarySoft,
                                    borderColor: colors.borderActive,
                                },
                            ]}
                        >
                            <Shield size={16} color={colors.primary} />
                            <Text style={[s.infoText, { color: colors.textSecondary }]}>
                                {isLogin
                                    ? "Entrez votre NPI et mot de passe. Un code de vérification SMS vous sera envoyé."
                                    : "Le NPI est votre identifiant unique citoyen. Un code de vérification SMS sera envoyé après l'inscription."}
                            </Text>
                        </View>

                        {/* Submit Button */}
                        <Animated.View
                            style={{ transform: [{ scale: btnAnim }], marginTop: 8 }}
                        >
                            <TouchableOpacity
                                onPress={handleSubmit}
                                activeOpacity={0.85}
                                disabled={loading}
                            >
                                <LinearGradient
                                    colors={[colors.primary, colors.primaryLight]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={[s.submitBtn, loading && { opacity: 0.7 }]}
                                >
                                    <Text style={s.submitBtnText}>
                                        {loading
                                            ? "Envoi du code..."
                                            : isLogin
                                                ? "Recevoir le code SMS"
                                                : "S'inscrire et recevoir le code"}
                                    </Text>
                                    {!loading && (
                                        <View style={s.submitArrow}>
                                            <ChevronRight size={18} color="#fff" />
                                        </View>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>

                        {/* Switch mode */}
                        <TouchableOpacity onPress={switchMode} style={s.switchBtn}>
                            <Text style={[s.switchText, { color: colors.textMuted }]}>
                                {isLogin
                                    ? "Pas encore de compte ?"
                                    : "Déjà un compte ?"}
                            </Text>
                            <Text style={[s.switchLink, { color: colors.primaryLight }]}>
                                {isLogin ? "S'inscrire" : "Se connecter"}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const s = StyleSheet.create({
    container: { flex: 1 },
    orbContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
    },

    // Header
    header: { paddingHorizontal: 24, paddingBottom: 30, alignItems: "center" },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 28,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    logoGradient: {
        width: 80,
        height: 80,
        borderRadius: 28,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
    },
    logoPulse: {
        position: "absolute",
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
    },
    appTitle: {
        fontSize: 32,
        fontWeight: "900",
        color: "#fff",
        letterSpacing: -1,
    },
    appSubtitle: {
        fontSize: 14,
        color: "rgba(255,255,255,0.65)",
        marginTop: 4,
        fontWeight: "500",
        letterSpacing: 0.3,
    },

    // Mode toggle
    modeToggle: {
        flexDirection: "row",
        borderRadius: 16,
        padding: 4,
        marginTop: 24,
    },
    modeBtn: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 12,
    },
    modeBtnText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "700",
    },

    // Form
    formContainer: {
        paddingHorizontal: 20,
        paddingTop: 28,
        paddingBottom: 40,
    },

    // Input
    labelRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    label: {
        fontSize: 13,
        fontWeight: "600",
        letterSpacing: 0.2,
    },
    inputWrap: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 4,
        gap: 10,
    },
    inputIconWrap: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    input: {
        flex: 1,
        fontSize: 15,
        fontWeight: "500",
        paddingVertical: 14,
    },
    errorText: {
        fontSize: 12,
        fontWeight: "500",
        marginTop: 6,
        marginLeft: 4,
    },

    // Code input
    codeRow: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
    },
    codeBox: {
        width: 48,
        height: 56,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    codeDigit: {
        fontSize: 24,
        fontWeight: "800",
    },

    // Demo code card
    demoCodeCard: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        marginBottom: 24,
    },
    demoCodeLabel: {
        fontSize: 12,
        fontWeight: "500",
    },
    demoCode: {
        fontSize: 22,
        fontWeight: "900",
        letterSpacing: 4,
        marginTop: 2,
    },

    // Info card
    infoCard: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 10,
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        marginTop: 4,
        marginBottom: 20,
    },
    infoText: {
        flex: 1,
        fontSize: 12,
        lineHeight: 18,
        fontWeight: "500",
    },

    // Submit button
    submitBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        borderRadius: 16,
        gap: 8,
        ...shadows.glow,
    },
    submitBtnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "800",
        letterSpacing: 0.3,
    },
    submitArrow: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "rgba(255,255,255,0.2)",
        alignItems: "center",
        justifyContent: "center",
    },

    // Switch mode
    switchBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        marginTop: 20,
        paddingVertical: 8,
    },
    switchText: {
        fontSize: 14,
        fontWeight: "500",
    },
    switchLink: {
        fontSize: 14,
        fontWeight: "700",
    },

    // Resend
    resendBtn: {
        alignItems: "center",
        marginTop: 16,
        paddingVertical: 8,
    },
    resendText: {
        fontSize: 14,
        fontWeight: "600",
    },
});
