import { useUser } from "@/contexts/UserContext";
import { FoundProperty, UserProperty } from "@/types/property";
import { addPropertyToUser } from "@/utils/frappe_services/add_property";
import { findProperty } from "@/utils/frappe_services/find_property";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FoundPropertyModal from "../../components/FoundPropertyModal";
import NotFoundModal from "../../components/NotFoundModal";

type Mode = "type" | "scan";

function mapToFoundProperty(p: UserProperty): FoundProperty {
  return {
    name: p.full_name || p.name,
    address: p.property_address || "—",
    type: p.property_type?.property_type || "—",
    parcelId: p.property_id || p.name,
    taxYear: "—",
    estimatedTax: "—",
    owner: p.customer?.customer_name || "—",
    assessedValue: "—",
  };
}

export default function AddPropertyScreen() {
  const { user } = useUser();
  const [mode, setMode] = useState<Mode>("type");
  const [code, setCode] = useState("");
  const [foundModal, setFoundModal] = useState(false);
  const [notFoundModal, setNotFoundModal] = useState(false);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState(false);
  const [foundProperty, setFoundProperty] = useState<FoundProperty | null>(
    null,
  );
  const [rawPropertyId, setRawPropertyId] = useState<string>("");

  const handleSearch = async () => {
    const term = code.trim();
    if (!term) return;

    setSearching(true);
    const result = await findProperty({ search_term: term });
    setSearching(false);

    if (result.success) {
      setRawPropertyId(result.property.property_id);
      setFoundProperty(mapToFoundProperty(result.property));
      setFoundModal(true);
    } else {
      setNotFoundModal(true);
    }
  };

  const handleAdd = async () => {
    if (!user?.email) {
      Alert.alert("Error", "You must be logged in to add a property.");
      return;
    }
    setAdding(true);
    const result = await addPropertyToUser(user.email, rawPropertyId);
    setAdding(false);

    if (result.success) {
      setFoundModal(false);
      Alert.alert("Success", "Property added to your account.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } else {
      Alert.alert("Error", result.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* ── Header ─────────────────────────────────── */}
      <View className="bg-white px-6 py-4 flex-row items-center gap-4 border-b border-slate-100">
        <TouchableOpacity
          className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={18} color="#0F172A" />
        </TouchableOpacity>
        <View>
          <Text className="text-[20px] font-bold text-slate-900">
            Add Property
          </Text>
          <Text className="text-[12px] text-slate-400">
            Search by code or scan
          </Text>
        </View>
      </View>

      {/* ── Mode toggle ─────────────────────────────── */}
      <View
        className="mx-5 mt-5 mb-4 flex-row bg-white rounded-2xl p-1.5"
        style={styles.toggleWrap}
      >
        {(["type", "scan"] as Mode[]).map((m) => {
          const active = mode === m;
          const icon = m === "type" ? "keypad-outline" : "scan-outline";
          const label = m === "type" ? "Enter Code" : "Scan Code";
          return (
            <TouchableOpacity
              key={m}
              className={`flex-1 py-3 rounded-xl flex-row items-center justify-center gap-2 ${
                active ? "bg-[#E6FAFA]" : ""
              }`}
              onPress={() => setMode(m)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={icon}
                size={16}
                color={active ? "#00CEC8" : "#94A3B8"}
              />
              <Text
                className={`text-[14px] ${active ? "text-primary font-bold" : "text-slate-400 font-medium"}`}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Enter Code ──────────────────────────────── */}
      {mode === "type" ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 20, gap: 14 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Input card */}
            <View className="bg-white rounded-[24px] p-6" style={styles.card}>
              <View className="w-14 h-14 rounded-2xl bg-[#E6FAFA] items-center justify-center mb-5 self-center">
                <Ionicons name="home-outline" size={28} color="#00CEC8" />
              </View>
              <Text className="text-[18px] font-bold text-slate-900 text-center mb-1">
                Enter Property Code
              </Text>
              <Text className="text-[13px] text-slate-400 text-center mb-6">
                Enter the ZIP code or parcel ID{"\n"}from your property tax
                notice
              </Text>

              <Text className="text-[12px] font-semibold text-slate-500 mb-2">
                ZIP or Parcel Code
              </Text>
              <View className="flex-row gap-3">
                <TextInput
                  className="flex-1 h-14 px-4 bg-slate-50 rounded-2xl text-slate-900 text-[15px] border border-slate-100"
                  placeholder="e.g. 33101 or 04-3219-011"
                  placeholderTextColor="#CBD5E1"
                  value={code}
                  onChangeText={setCode}
                  autoCapitalize="characters"
                  returnKeyType="search"
                  onSubmitEditing={handleSearch}
                />
                <TouchableOpacity
                  className={`w-14 h-14 rounded-2xl items-center justify-center ${
                    code.trim() && !searching ? "bg-primary" : "bg-slate-300"
                  }`}
                  onPress={handleSearch}
                  activeOpacity={0.85}
                  disabled={searching}
                >
                  {searching ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Ionicons name="search" size={20} color="#fff" />
                  )}
                </TouchableOpacity>
              </View>

              <View className="mt-5 pt-5 border-t border-slate-100">
                <Text className="text-[11px] text-slate-400 text-center">
                  The parcel code is printed on your county{"\n"}tax bill or
                  assessment notice
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        /* ── Scan Code ──────────────────────────────── */
        <View className="flex-1 mx-5 mt-1">
          <View
            className="bg-white rounded-3xl overflow-hidden"
            style={styles.scanCard}
          >
            {/* Camera viewport */}
            <View className="h-[260px] bg-[#0B1426] items-center justify-center">
              {/* Corner brackets */}
              <View className="w-[200px] h-[200px] items-center justify-center">
                {[
                  { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 },
                  { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 },
                  {
                    bottom: 0,
                    left: 0,
                    borderBottomWidth: 3,
                    borderLeftWidth: 3,
                  },
                  {
                    bottom: 0,
                    right: 0,
                    borderBottomWidth: 3,
                    borderRightWidth: 3,
                  },
                ].map((corner, i) => (
                  <View
                    key={i}
                    className="absolute w-7 h-7 border-primary"
                    style={corner as any}
                  />
                ))}
                {/* Scan line */}
                <View className="absolute left-1 right-1 h-0.5 bg-primary opacity-80" />
              </View>
              {/* Placeholder camera icon */}
              <View className="absolute items-center justify-center">
                <Ionicons
                  name="camera-outline"
                  size={44}
                  color="rgba(255,255,255,0.25)"
                />
              </View>
            </View>

            {/* Instructions */}
            <View className="p-6 items-center">
              <Text className="text-[15px] font-bold text-slate-900 mb-1.5">
                Scan Property Code
              </Text>
              <Text className="text-[12px] text-slate-400 text-center leading-5 mb-5">
                Point your camera at the barcode or QR code{"\n"}printed on your
                property tax notice
              </Text>

              <TouchableOpacity
                className="bg-[#E6FAFA] px-7 py-3 rounded-full flex-row items-center gap-2"
                activeOpacity={0.8}
                onPress={() => setFoundModal(true)}
              >
                <Ionicons name="camera" size={16} color="#00CEC8" />
                <Text className="text-primary font-bold text-[13px]">
                  Enable Camera
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Supported formats note */}
          <View
            className="mt-4 bg-white rounded-2xl px-4 py-3.5 flex-row items-center gap-3"
            style={styles.hintCard}
          >
            <View className="w-8 h-8 rounded-[10px] bg-slate-100 items-center justify-center">
              <Ionicons name="barcode-outline" size={18} color="#64748B" />
            </View>
            <Text className="text-[12px] text-slate-500 flex-1">
              Supports QR codes, barcodes, and parcel ID codes from tax notices
            </Text>
          </View>
        </View>
      )}

      {/* ── Modals ──────────────────────────────────── */}
      <FoundPropertyModal
        visible={foundModal && foundProperty !== null}
        property={
          foundProperty ?? {
            name: "",
            address: "",
            type: "",
            parcelId: "",
            taxYear: "",
            estimatedTax: "",
            owner: "",
            assessedValue: "",
          }
        }
        adding={adding}
        onClose={() => setFoundModal(false)}
        onAdd={handleAdd}
      />

      <NotFoundModal
        visible={notFoundModal}
        onClose={() => setNotFoundModal(false)}
        onTryAgain={() => {
          setNotFoundModal(false);
          setCode("");
        }}
      />
    </SafeAreaView>
  );
}

// StyleSheet kept only for shadow properties (NativeWind doesn't support shadows)
const styles = StyleSheet.create({
  toggleWrap: {
    shadowColor: "#0B1426",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  card: {
    shadowColor: "#0B1426",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  hintCard: {
    shadowColor: "#0B1426",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  scanCard: {
    shadowColor: "#0B1426",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
});
