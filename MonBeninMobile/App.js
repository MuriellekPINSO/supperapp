import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar, View, StyleSheet } from "react-native";
import {
  Home,
  IdCard,
  Sparkles,
  Star,
  User,
  Shield,
  Lock,
  Heart,
  Hospital,
  FileText,
  GraduationCap,
  FileEdit,
} from "lucide-react-native";
import { ThemeProvider, useAppTheme } from "./src/ThemeContext";
import HomeScreen from "./src/screens/HomeScreen";
import DocsScreen from "./src/screens/DocsScreen";
import CNIScreen from "./src/screens/CNIScreen";
import AIChatScreen from "./src/screens/AIChatScreen";
import OpportunitesScreen from "./src/screens/OpportunitesScreen";
import ProfilScreen from "./src/screens/ProfilScreen";
import FacturesScreen from "./src/screens/FacturesScreen";
import SimpleServiceScreen from "./src/screens/SimpleServiceScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabIcon({ name, color, focused }) {
  const icons = { Home, IdCard, Sparkles, Star, User };
  const IconComponent = icons[name];
  const { colors } = useAppTheme();
  return (
    <View style={styles.tabIconWrap}>
      <IconComponent size={focused ? 22 : 20} color={color} />
      {focused && (
        <View
          style={[styles.tabDot, { backgroundColor: colors.primaryLight }]}
        />
      )}
    </View>
  );
}

function HomeTabs() {
  const { colors } = useAppTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bgCard,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 88,
          paddingBottom: 28,
          paddingTop: 10,
          elevation: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.2,
          shadowRadius: 12,
        },
        tabBarActiveTintColor: colors.primaryLight,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          letterSpacing: 0.3,
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="Accueil"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="Home" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Documents"
        component={DocsScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="IdCard" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="IA"
        component={AIChatScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="Sparkles" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Opps"
        component={OpportunitesScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="Star" color={color} focused={focused} />
          ),
          tabBarBadge: 3,
          tabBarBadgeStyle: {
            backgroundColor: colors.red,
            fontSize: 9,
            fontWeight: "700",
            minWidth: 18,
            height: 18,
            lineHeight: 18,
            borderRadius: 9,
          },
        }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfilScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="User" color={color} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AppContent() {
  const { colors, isDark } = useAppTheme();

  const navTheme = {
    ...DefaultTheme,
    dark: isDark,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.primary,
      background: colors.bgDark,
      card: colors.bgCard,
      text: colors.textPrimary,
      border: colors.border,
      notification: colors.red,
    },
  };

  return (
    <>
      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.bgDark}
      />
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
            contentStyle: { backgroundColor: colors.bgDark },
          }}
        >
          <Stack.Screen name="HomeTabs" component={HomeTabs} />
          <Stack.Screen name="Docs" component={DocsScreen} />
          <Stack.Screen name="CNI" component={CNIScreen} />
          <Stack.Screen name="AIChat" component={AIChatScreen} />
          <Stack.Screen name="Factures" component={FacturesScreen} />
          <Stack.Screen name="Opportunites" component={OpportunitesScreen} />
          <Stack.Screen
            name="Assurance"
            component={SimpleServiceScreen}
            initialParams={{
              title: "Assurance Auto",
              Icon: Shield,
              description:
                "Votre assurance Toyota Corolla AB-1234-BJ expire le 15 Mars 2026. Prime annuelle : 85 000 FCFA.",
              actionLabel: "Renouveler l'assurance",
              successTitle: "Assurance renouvelée !",
              successDesc:
                "Votre assurance est valide jusqu'au 15 Mars 2027.",
              successRef: "NSIA-2026-44321",
            }}
          />
          <Stack.Screen
            name="CNSS"
            component={SimpleServiceScreen}
            initialParams={{
              title: "CNSS",
              Icon: Lock,
              description:
                "Allocation familiale de 45 000 FCFA disponible. Vous êtes éligible en tant qu'affilié actif.",
              actionLabel: "Demander l'allocation",
              successTitle: "Demande soumise !",
              successDesc:
                "Traitement sous 5 jours ouvrés. Versement sur votre compte MTN MoMo.",
              successRef: "CNSS-AF-2026-00112",
            }}
          />
          <Stack.Screen
            name="Sante"
            component={SimpleServiceScreen}
            initialParams={{
              title: "Santé",
              Icon: Heart,
              description:
                "Votre dernier bilan santé 2025 indique un score de 78/100. Cholestérol légèrement élevé à 5.8 mmol/L.",
              actionLabel: "Prendre RDV bilan",
              successTitle: "RDV confirmé !",
              successDesc:
                "CNHU Cotonou, 10 Mars à 9h00. Présentez votre CNI.",
              successRef: "RDV-SANTE-00234",
            }}
          />
          <Stack.Screen
            name="RDV"
            component={SimpleServiceScreen}
            initialParams={{
              title: "RDV Médical",
              Icon: Hospital,
              description:
                "Prochain créneau disponible : 15h30 au CNHU. Consultation générale.",
              actionLabel: "Confirmer le RDV",
              successTitle: "RDV confirmé !",
              successDesc:
                "CNHU Cotonou à 15h30. Apportez votre carnet de santé.",
              successRef: "RDV-CNHU-00234",
            }}
          />
          <Stack.Screen
            name="Impots"
            component={SimpleServiceScreen}
            initialParams={{
              title: "Impôts",
              Icon: FileText,
              description:
                "Revenus 2025 : 2 880 000 FCFA. Impôt sur le revenu estimé : 120 000 FCFA. Échéance : 30 Avril.",
              actionLabel: "Soumettre ma déclaration",
              successTitle: "Déclaration soumise !",
              successDesc:
                "Envoyée à la DGI. Montant dû : 120 000 FCFA.",
              successRef: "IMP-2025-44521",
            }}
          />
          <Stack.Screen
            name="Universite"
            component={SimpleServiceScreen}
            initialParams={{
              title: "Université",
              Icon: GraduationCap,
              description:
                "Candidature Master à l'UAC. Taux de sélection : 82% pour votre profil.",
              actionLabel: "Soumettre ma candidature",
              successTitle: "Dossier soumis !",
              successDesc:
                "Réponse sous 3 semaines. Suivi disponible dans l'app.",
              successRef: "UAC-2026-05521",
            }}
          />
          <Stack.Screen
            name="Perte"
            component={SimpleServiceScreen}
            initialParams={{
              title: "Déclaration de Perte",
              Icon: FileEdit,
              description:
                "Déclarez la perte d'un document officiel. La procédure de remplacement sera automatiquement initiée.",
              actionLabel: "Déclarer la perte",
              successTitle: "Déclaration enregistrée !",
              successDesc:
                "Votre demande de remplacement a été initiée. Suivez le statut dans l'app.",
              successRef: "PERTE-2026-00445",
            }}
          />
          <Stack.Screen
            name="Renew"
            component={SimpleServiceScreen}
            initialParams={{
              title: "Renouveler CNI",
              Icon: IdCard,
              description:
                "RDV à la Préfecture Lundi à 14h30. Coût du renouvellement : 3 500 FCFA.",
              actionLabel: "Confirmer — 3 500 FCFA",
              successTitle: "Demande soumise !",
              successDesc:
                "RDV confirmé lundi 14h30 à la Préfecture.",
              successRef: "CNI-2026-00892",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabIconWrap: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 30,
  },
  tabDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 3,
  },
});
