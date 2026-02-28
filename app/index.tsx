import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

const { width } = Dimensions.get("window");

const FEATURES = [
  { icon: "shield-checkmark" as const, label: "Bank-level security" },
  { icon: "flash"            as const, label: "Instant confirmations" },
  { icon: "notifications"    as const, label: "Smart due-date alerts" },
  { icon: "alert"    as const, label: "Late payment notifications" },
];

export default function Index() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#0B1426]">
      <StatusBar barStyle="light-content" backgroundColor="#0B1426" />

      {/* ── Background glow orbs ───────────────────── */}
      <View style={styles.orbTopRight} />
      <View style={styles.orbBottomLeft} />
      <View style={styles.orbCenter} />

      <SafeAreaView className="flex-1 justify-between" edges={["top", "bottom"]}>

        {/* ── Top brand area ─────────────────────────── */}
        <View className="flex-1 px-7 pt-5 justify-center">

          {/* Logo mark */}
          <View
            className="w-[68px] h-[68px] rounded-[20px] items-center justify-center mb-5"
            style={styles.logoOuter}
          >
            <View
              className="w-[52px] h-[52px] rounded-[14px] items-center justify-center"
              style={styles.logoInner}
            >
              <Ionicons name="home" size={28} color="#00CEC8" />
            </View>
          </View>

          {/* Brand chip */}
          <View
            className="flex-row items-center self-start rounded-full px-3 py-[5px] mb-6"
            style={styles.brandChip}
          >
            <View className="w-[6px] h-[6px] rounded-full bg-primary mr-[7px]" />
            <Text className="text-white/75 text-[12px] font-semibold tracking-wider">
              PropertyTax
            </Text>
          </View>

          {/* Hero headline */}
          <View className="mb-4">
            <Text className="text-[18px] font-normal text-white/45 mb-0.5">
              The smarter way to
            </Text>
            <Text className="text-[44px] font-extrabold text-white leading-[50px] tracking-tight">
              manage your
            </Text>
            <Text className="text-[44px] font-extrabold text-primary leading-[52px] tracking-tight">
              property taxes.
            </Text>
          </View>

          {/* Sub-copy */}
          <Text className="text-[14px] text-white/40 leading-[22px] mb-7">
            Pay, track, and stay on top of every property —{"\n"}
            all from one beautifully simple app.
          </Text>

          {/* Divider */}
          <View className="h-px bg-white/[0.07] mb-6" />

          {/* Feature list */}
          <View className="gap-[14px]">
            {FEATURES.map((f) => (
              <View key={f.label} className="flex-row items-center gap-3">
                <View
                  className="w-[30px] h-[30px] rounded-[9px] items-center justify-center"
                  style={styles.featureIconWrap}
                >
                  <Ionicons name={f.icon} size={14} color="#00CEC8" />
                </View>
                <Text className="text-[14px] font-medium text-white/65">
                  {f.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── CTA block ──────────────────────────────── */}
        <View className="px-6 pb-3 gap-3">

          {/* Primary — Login */}
          <TouchableOpacity
            onPress={() => router.push("/pages/auth/login")}
            activeOpacity={0.88}
            style={styles.primaryBtn}
          >
            <LinearGradient
              colors={["#00D4CE", "#00AFA9"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryGrad}
            >
              <Text className="text-white text-[16px] font-bold tracking-wide">
                Login
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Secondary — Get Started */}
          <TouchableOpacity
            onPress={() => router.push("/pages/auth/signup")}
            activeOpacity={0.8}
            className="rounded-2xl h-14 items-center justify-center"
            style={styles.secondaryBtn}
          >
            <Text className="text-white/75 text-[16px] font-semibold tracking-wide">
              Get Started
            </Text>
          </TouchableOpacity>

          {/* Trust row */}
          <View className="flex-row items-center justify-center gap-[10px] pt-1">
            <View className="flex-row">
              {[0, 1, 2].map((i) => (
                <View
                  key={i}
                  className="w-[22px] h-[22px] rounded-full"
                  style={[styles.trustAvatar, { marginLeft: i === 0 ? 0 : -8 }]}
                />
              ))}
            </View>
            <Text className="text-[12px] text-white/35 font-medium">
              Trusted by 10,000+ property owners
            </Text>
          </View>
        </View>

      </SafeAreaView>
    </View>
  );
}

// StyleSheet only for rgba values and shadows — NativeWind handles everything else
const styles = StyleSheet.create({
  orbTopRight: {
    position: "absolute",
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: "rgba(0,206,200,0.07)",
    top: -80,
    right: -100,
  },
  orbBottomLeft: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(108,99,255,0.07)",
    bottom: 60,
    left: -120,
  },
  orbCenter: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(0,206,200,0.04)",
    top: "38%",
    left: "50%",
    marginLeft: -90,
  },
  logoOuter: {
    backgroundColor: "rgba(0,206,200,0.08)",
    borderWidth: 1,
    borderColor: "rgba(0,206,200,0.18)",
  },
  logoInner: {
    backgroundColor: "rgba(0,206,200,0.12)",
  },
  brandChip: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  featureIconWrap: {
    backgroundColor: "rgba(0,206,200,0.12)",
  },
  primaryBtn: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#00CEC8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  primaryGrad: {
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  trustAvatar: {
    backgroundColor: "rgba(0,206,200,0.25)",
    borderWidth: 1.5,
    borderColor: "#0B1426",
  },
});
