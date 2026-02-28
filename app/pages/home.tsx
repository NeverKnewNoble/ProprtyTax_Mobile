import { useUser } from "@/contexts/UserContext";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Property } from "../../types/property";
import { fetchUsersProperties } from "../../utils/frappe_services/getUsersProperties";
import { mapUserProperty } from "../../utils/propertyUtils";
import { quickActions } from "../../utils/sampleData";
import NotificationsModal from "../components/NotificationsModal";
import PaymentModal from "../components/PaymentModal";
import SupportModal from "../components/SupportModal";
import TabBar from "../components/tab-bar";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 48;
const CARD_GAP = 12;

const ACTION_ROUTES: Record<number, string> = {
  1: "/pages/property", // Pay Now
  2: "/pages/transactions", // Statement
  4: "/pages/settings", // Settings
};

export default function HomeScreen() {
  const { user } = useUser();

  const scrollX = useRef(new Animated.Value(0)).current;
  const [selectedProperty, setSelectedProperty] = useState(0);
  const [notifVisible, setNotifVisible] = useState(false);
  const [supportVisible, setSupportVisible] = useState(false);
  const [paymentProperty, setPaymentProperty] = useState<Property | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchUsersProperties().then((result) => {
        if (result.success) {
          setProperties(result.properties.map(mapUserProperty));
        }
        setLoading(false);
      });
    }, []),
  );

  return (
    <SafeAreaView className="flex-1 bg-[#0B1426]" edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#0B1426" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        className="bg-slate-100"
      >
        {/* ── Header ─────────────────────────────────── */}
        <View className="bg-[#0B1426] pt-2 pb-6">
          {/* Top row */}
          <View className="flex-row justify-between items-center px-6 mb-5">
            <View>
              <Text className="text-white/40 text-[13px] font-medium mb-0.5">
                Good morning
              </Text>
              <Text className="text-white text-[22px] font-bold">
                {user ? `Hi, ${user.first_name} 👋` : "Welcome back 👋"}
              </Text>
            </View>
            <TouchableOpacity
              className="w-10 h-10 rounded-xl bg-white/[0.07] items-center justify-center"
              activeOpacity={0.7}
              onPress={() => setNotifVisible(true)}
            >
              <Ionicons name="notifications-outline" size={20} color="#fff" />
              <View className="absolute top-[9px] right-[9px] w-[7px] h-[7px] rounded-full bg-[#FF4757] border-[1.5px] border-[#0B1426]" />
            </TouchableOpacity>
          </View>

          {/* Property carousel */}
          {loading ? (
            <View
              style={{
                height: 220,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="#00CEC8" />
            </View>
          ) : properties.length === 0 ? (
            <View
              style={{
                height: 220,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 24,
              }}
            >
              <Ionicons
                name="home-outline"
                size={36}
                color="rgba(255,255,255,0.2)"
              />
              <Text className="text-white/40 text-[14px] mt-3 text-center">
                No properties found.{"\n"}Add a property to get started.
              </Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={CARD_WIDTH + CARD_GAP}
              decelerationRate="fast"
              scrollEventThrottle={16}
              contentContainerStyle={{ paddingLeft: 40, paddingRight: 24 }}
              style={styles.carouselScroll}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                {
                  useNativeDriver: false,
                  listener: (e: any) => {
                    setSelectedProperty(
                      Math.round(
                        e.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_GAP),
                      ),
                    );
                  },
                },
              )}
            >
              {properties.map((prop) => (
                <View key={prop.id} style={styles.propCard}>
                  {/* Card top */}
                  <View className="flex-row items-center mb-2.5">
                    <View className="flex-1">
                      <Text className="text-white text-[16px] font-bold mb-0.5">
                        {prop.name}
                      </Text>
                      <Text className="text-white/40 text-[12px] font-medium">
                        {prop.type}
                      </Text>
                    </View>
                    <View
                      className="px-[10px] py-[5px] rounded-[8px]"
                      style={{
                        backgroundColor:
                          prop.due === "Paid"
                            ? "rgba(34,197,94,0.15)"
                            : "rgba(251,191,36,0.15)",
                      }}
                    >
                      <Text
                        className="text-[11px] font-bold"
                        style={{
                          color: prop.due === "Paid" ? "#4ADE80" : "#FCD34D",
                        }}
                      >
                        {prop.due}
                      </Text>
                    </View>
                  </View>

                  <Text className="text-white/40 text-[12px] mb-4">
                    {prop.address}
                  </Text>

                  {/* Progress */}
                  <View className="mb-4">
                    <View className="flex-row justify-between mb-2">
                      <Text className="text-white/40 text-[12px]">
                        Payment progress
                      </Text>
                      <Text className="text-white/80 text-[12px] font-semibold">
                        {prop.progress}%
                      </Text>
                    </View>
                    <View className="h-[5px] bg-white/[0.08] rounded-[3px] overflow-hidden">
                      <View
                        className={`h-[5px] rounded-[3px] ${prop.progress === 100 ? "bg-green-400" : "bg-primary"}`}
                        style={{ width: `${prop.progress}%` as any }}
                      />
                    </View>
                  </View>

                  {/* Footer */}
                  <View
                    className="flex-row items-center justify-between rounded-[14px] p-[14px]"
                    style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
                  >
                    <View>
                      <Text className="text-[10px] text-white/40 font-bold tracking-widest mb-1">
                        AMOUNT DUE
                      </Text>
                      <Text className="text-white text-[24px] font-extrabold">
                        {prop.balance}
                      </Text>
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      className={`px-5 py-[11px] rounded-xl ${prop.due === "Paid" ? "bg-white/[0.08]" : "bg-primary"}`}
                      onPress={() => {
                        if (prop.due !== "Paid") setPaymentProperty(prop);
                      }}
                    >
                      <Text
                        className={`text-[13px] font-bold ${prop.due === "Paid" ? "text-white/35" : "text-white"}`}
                      >
                        {prop.due === "Paid" ? "Paid ✓" : "Pay Now"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}

          {/* Dots — only shown when properties are loaded */}
          {!loading && properties.length > 0 && (
            <View className="flex-row justify-center mt-4 gap-1.5">
              {properties.map((_, i) => (
                <View
                  key={i}
                  className={`h-[5px] rounded-[3px] ${i === selectedProperty ? "w-5 bg-primary" : "w-[5px] bg-white/20"}`}
                />
              ))}
            </View>
          )}
        </View>

        {/* ── Stats row ───────────────────────────────── */}
        <View style={styles.statsCard}>
          {[
            {
              label: "Properties",
              value: loading ? "…" : `${properties.length}`,
              icon: "home" as const,
              color: "#00CEC8",
            },
            {
              label: "Payments",
              value: "24",
              icon: "receipt" as const,
              color: "#6C63FF",
            },
            {
              label: "Credit",
              value: "A+",
              icon: "star" as const,
              color: "#F59E0B",
            },
          ].map((stat, i) => (
            <View
              key={i}
              className={`flex-1 items-center ${i < 2 ? "border-r border-slate-100" : ""}`}
            >
              <View
                className="w-8 h-8 rounded-[9px] items-center justify-center mb-[5px]"
                style={{ backgroundColor: stat.color + "18" }}
              >
                <Ionicons name={stat.icon} size={16} color={stat.color} />
              </View>
              <Text className="text-[20px] font-extrabold text-slate-900 mb-0.5">
                {stat.value}
              </Text>
              <Text className="text-[11px] text-slate-400 font-medium">
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* ── Quick Actions ────────────────────────────── */}
        <View className="mb-7">
          <Text className="text-[18px] font-bold text-slate-900 px-6 mb-[14px]">
            Quick Actions
          </Text>
          <View className="flex-row flex-wrap px-5 gap-[10px]">
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                activeOpacity={0.8}
                style={styles.actionCard}
                onPress={() => {
                  if (action.id === 3) {
                    setSupportVisible(true);
                    return;
                  }
                  const route = ACTION_ROUTES[action.id];
                  if (route) router.push(route as any);
                }}
              >
                <View
                  className="w-11 h-11 rounded-[14px] items-center justify-center mb-3"
                  style={{ backgroundColor: action.bg }}
                >
                  <Ionicons name={action.icon} size={22} color={action.color} />
                </View>
                <Text className="text-[14px] font-bold text-slate-900">
                  {action.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <NotificationsModal
        visible={notifVisible}
        onClose={() => setNotifVisible(false)}
      />

      <SupportModal
        visible={supportVisible}
        onClose={() => setSupportVisible(false)}
      />

      <PaymentModal
        visible={paymentProperty !== null}
        initialProperty={paymentProperty ?? undefined}
        onClose={() => setPaymentProperty(null)}
      />

      <TabBar />
    </SafeAreaView>
  );
}

// StyleSheet only for values NativeWind can't handle:
// computed widths, rgba transparency, negative margins, shadows
const styles = StyleSheet.create({
  carouselScroll: {
    marginHorizontal: -24,
  },
  propCard: {
    width: CARD_WIDTH,
    marginRight: CARD_GAP,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 20,
  },
  statsCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 20,
    flexDirection: "row",
    paddingVertical: 8,
    marginBottom: 28,
    shadowColor: "#0B1426",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
  actionCard: {
    width: (width - 50) / 2,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    shadowColor: "#0B1426",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
});
