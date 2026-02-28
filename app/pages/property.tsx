import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PropertyModal from "../components/PropertyModal";
import PaymentModal from "../components/PaymentModal";
import { getTypeStyle, isPaid, mapUserProperty } from "../../utils/propertyUtils";
import { fetchUsersProperties } from "../../utils/frappe_services/getUsersProperties";
import PropertyEmptyState from "../components/PropertyEmptyState";
import TabBar from "../components/tab-bar";
import { Property } from "../../types/property";

export default function PropertyScreen() {
  const [selected, setSelected] = useState<Property | null>(null);
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
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* ── Header ─────────────────────────────── */}
      <View className="bg-white px-6 py-4 flex-row justify-between items-center border-b border-slate-100">
        <View>
          <Text className="text-[22px] font-bold text-slate-900">
            Properties
          </Text>
          <Text className="text-[12px] text-slate-400 mt-0.5">
            {loading ? "Loading…" : `${properties.length} properties`}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/pages/add_property/add_property")}
          className="w-10 h-10 rounded-xl bg-[#E6FAFA] items-center justify-center"
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={22} color="#00CEC8" />
        </TouchableOpacity>
      </View>

      {/* ── Empty state or list ─────────────────── */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#00CEC8" />
        </View>
      ) : properties.length === 0 ? (
        <PropertyEmptyState />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="bg-white"
          contentContainerStyle={{ padding: 20, gap: 14 }}
        >
          {properties.map((prop) => {
            const tc = getTypeStyle(prop.type);
            const paid = isPaid(prop.due);

            return (
              <View key={prop.id} className="bg-white rounded-[20px] p-[18px]" style={styles.card}>
                {/* Name + due badge */}
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1 mr-3">
                    <Text className="text-[17px] font-bold text-slate-900 mb-0.5">
                      {prop.name}
                    </Text>
                    <Text className="text-[12px] text-slate-400">
                      {prop.address}
                    </Text>
                  </View>
                  <View
                    className="px-[10px] py-[5px] rounded-[8px]"
                    style={{ backgroundColor: paid ? "#DCFCE7" : "#FEF3C7" }}
                  >
                    <Text
                      className="text-[11px] font-bold"
                      style={{ color: paid ? "#16A34A" : "#D97706" }}
                    >
                      {prop.due}
                    </Text>
                  </View>
                </View>

                {/* Type tag + Balance */}
                <View className="flex-row items-center justify-between mb-4">
                  <View
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: tc.bg }}
                  >
                    <Text
                      className="text-[11px] font-bold"
                      style={{ color: tc.text }}
                    >
                      {prop.type}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-[10px] text-slate-400 font-medium mb-0.5">
                      Balance
                    </Text>
                    <Text className="text-[17px] font-extrabold text-slate-900">
                      {prop.balance}
                    </Text>
                  </View>
                </View>

                {/* Progress bar */}
                <View className="mb-4">
                  <View className="flex-row justify-between mb-1.5">
                    <Text className="text-[12px] text-slate-400">
                      Payment Progress
                    </Text>
                    <Text className="text-[12px] font-semibold text-slate-700">
                      {prop.progress}%
                    </Text>
                  </View>
                  <View className="h-[6px] bg-slate-100 rounded-full overflow-hidden">
                    <View
                      className={`h-[6px] rounded-full ${paid ? "bg-green-500" : "bg-primary"}`}
                      style={{ width: `${prop.progress}%` as any }}
                    />
                  </View>
                </View>

                {/* View button */}
                <View className="flex-row justify-end">
                  <TouchableOpacity
                    className="flex-row items-center gap-1.5 bg-[#0B1426] px-5 py-[10px] rounded-xl"
                    activeOpacity={0.85}
                    onPress={() => setSelected(prop)}
                  >
                    <Text className="text-white text-[13px] font-bold">
                      View
                    </Text>
                    <Ionicons name="arrow-forward" size={14} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}

      <PropertyModal
        selected={selected}
        onClose={() => setSelected(null)}
        onPay={() => {
          const prop = selected;
          setSelected(null);
          setPaymentProperty(prop);
        }}
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

const styles = StyleSheet.create({
  card: {
    shadowColor: "#0B1426",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
  },
});
