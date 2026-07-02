import { Property } from "@/types/property";
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
import { fetchUsersProperties } from "../../utils/frappe_services/getUsersProperties";
import {
    getTypeStyle,
    isPaid,
    mapUserProperty,
} from "../../utils/propertyUtils";
import PaymentModal from "../components/PaymentModal";
import PropertyEmptyState from "../components/PropertyEmptyState";
import PropertyModal from "../components/PropertyModal";
import TabBar from "../components/tab-bar";

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
    }, []),
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
          className="w-10 h-10 rounded-xl bg-[#2b2a33] items-center justify-center"
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={22} color="#b5cc3b" />
        </TouchableOpacity>
      </View>

      {/* ── Empty state or list ─────────────────── */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#b5cc3b" />
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
              <TouchableOpacity
                key={prop.id}
                className="bg-white rounded-[20px] p-[18px]"
                style={styles.card}
                activeOpacity={0.8}
                onPress={() => setSelected(prop)}
              >
                {/* Name + due badge */}
                <View className="flex-row justify-between items-start mb-4">
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

                {/* Type tag + View button */}
                <View className="flex-row items-center justify-between">
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
                  <TouchableOpacity
                    className="flex-row items-center gap-1.5 bg-[#0B1426] px-5 py-[10px] rounded-xl"
                    activeOpacity={0.85}
                    onPress={(e) => {
                      e.stopPropagation();
                      setSelected(prop);
                    }}
                  >
                    <Text className="text-white text-[13px] font-bold">
                      View
                    </Text>
                    <Ionicons name="arrow-forward" size={14} color="#fff" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
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
