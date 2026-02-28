import { useUser } from "@/contexts/UserContext";
import { clearSession } from "@/utils/frappe_services/login";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TabBar from "../components/tab-bar";

const AVATAR_SIZE = 90;

export default function SettingsScreen() {
  const { user, clearUser } = useUser();

  const fullName = user
    ? [user.first_name, user.last_name].filter(Boolean).join(" ") || user.name
    : "—";

  const initials = user
    ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase() || "?"
    : "?";

  const profileRows = [
    { icon: "person-outline", label: "Full Name", value: fullName },
    { icon: "at-outline",     label: "Username",  value: user?.username ?? "—" },
    { icon: "mail-outline",   label: "Email",     value: user?.email ?? "—" }
  ];

  const handleLogout = () => {
    clearSession();
    clearUser();
    router.push("/");
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* ── Header ─────────────────────────────── */}
      <View className="bg-white px-6 py-4 border-b border-[#F1F5F9]">
        <Text className="text-[22px] font-bold text-slate-900">Settings</Text>
      </View>

      {/* ── Content ────────────────────────────── */}
      <View style={{ flex: 1 }}>
        <View style={styles.outerWrap}>
          <View style={styles.card}>

            {/* Avatar — straddles the top border */}
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <Text className="text-[30px] font-extrabold text-primary">{initials}</Text>
              </View>
            </View>

            {/* Name + role */}
            <View className="items-center mb-6">
              <Text className="text-[20px] font-extrabold text-slate-900 mb-1">
                {fullName}
              </Text>
              <Text className="text-[13px] text-slate-400 font-medium">
                Property Owner
              </Text>
            </View>

            {/* Info rows */}
            <View className="bg-[#F8FAFC] rounded-2xl mb-5 overflow-hidden">
              {profileRows.map((row, i) => (
                <View
                  key={row.label}
                  className={`flex-row items-center px-4 py-3.5 gap-3 ${
                    i < profileRows.length - 1 ? "border-b border-[#F1F5F9]" : ""
                  }`}
                >
                  <View className="w-[34px] h-[34px] rounded-[10px] bg-[#E6FAFA] items-center justify-center">
                    <Ionicons name={row.icon as any} size={16} color="#00CEC8" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[11px] text-slate-400 font-medium mb-0.5">
                      {row.label}
                    </Text>
                    <Text className="text-[13px] font-semibold text-slate-900">
                      {row.value}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Logout — bottom border of card */}
            <View className="border-t border-[#F1F5F9] py-4">
              <TouchableOpacity
                onPress={handleLogout}
                className="flex-row items-center justify-center gap-2 py-3.5 rounded-2xl bg-red-50"
                activeOpacity={0.85}
              >
                <Ionicons name="log-out-outline" size={18} color="#EF4444" />
                <Text className="text-red-500 text-[15px] font-bold">Log Out</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </View>

      <TabBar />
    </SafeAreaView>
  );
}

// StyleSheet only for computed values (AVATAR_SIZE math) and shadows
const styles = StyleSheet.create({
  outerWrap: {
    marginTop: AVATAR_SIZE / 2 + 20,
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingTop: AVATAR_SIZE / 2 + 16,
    shadowColor: "#0B1426",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.09,
    shadowRadius: 20,
    elevation: 6,
  },
  avatarWrap: {
    position: "absolute",
    top: -(AVATAR_SIZE / 2),
    left: 0,
    right: 0,
    alignItems: "center",
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: "#0B1426",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#F1F5F9",
  },
});
