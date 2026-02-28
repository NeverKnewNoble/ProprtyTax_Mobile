import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TABS = [
  {
    label: "Home",
    route: "/pages/home",
    icon: "home-outline" as const,
    iconActive: "home" as const,
  },
  {
    label: "Property",
    route: "/pages/property",
    icon: "business-outline" as const,
    iconActive: "business" as const,
  },
  {
    label: "Transactions",
    route: "/pages/transactions",
    icon: "receipt-outline" as const,
    iconActive: "receipt" as const,
  },
  {
    label: "Settings",
    route: "/pages/settings",
    icon: "settings-outline" as const,
    iconActive: "settings" as const,
  },
];

export default function TabBar() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row bg-white pt-[10px] border-t border-[#F1F5F9]"
      style={[styles.shadow, { paddingBottom: insets.bottom > 0 ? insets.bottom : 12 }]}
    >
      {TABS.map((tab) => {
        const active = pathname === tab.route;
        return (
          <TouchableOpacity
            key={tab.route}
            onPress={() => router.replace(tab.route as any)}
            className="flex-1 items-center gap-1"
            activeOpacity={0.7}
          >
            <View
              className={`w-11 h-8 rounded-[10px] items-center justify-center ${
                active ? "bg-[#E6FAFA]" : ""
              }`}
            >
              <Ionicons
                name={active ? tab.iconActive : tab.icon}
                size={22}
                color={active ? "#00CEC8" : "#94A3B8"}
              />
            </View>
            <Text
              className={`text-[10px] ${
                active ? "text-primary font-bold" : "text-slate-400 font-medium"
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// StyleSheet kept only for negative-y shadow (NativeWind can't express shadowOffset.height: -4)
const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#0B1426",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 12,
  },
});
