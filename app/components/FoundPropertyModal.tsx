import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FoundProperty } from "../../types/property";

export type { FoundProperty };

type Props = {
  visible: boolean;
  property: FoundProperty;
  adding?: boolean;
  onClose: () => void;
  onAdd: () => void;
};

export default function FoundPropertyModal({
  visible,
  property,
  adding = false,
  onClose,
  onAdd,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-[32px]" style={{ maxHeight: "90%" }}>

          {/* Handle */}
          <View className="items-center pt-3 pb-1">
            <View className="w-10 h-1 bg-slate-200 rounded-full" />
          </View>

          {/* Header */}
          <View className="px-6 pt-3 pb-4 border-b border-slate-100 flex-row justify-between items-center">
            <View className="flex-row items-center gap-3 flex-1 mr-4">
              <View className="w-10 h-10 rounded-2xl bg-green-100 items-center justify-center">
                <Ionicons name="checkmark-circle" size={22} color="#22C55E" />
              </View>
              <View>
                <Text className="text-[18px] font-bold text-slate-900">
                  Property Found!
                </Text>
                <Text className="text-[12px] text-slate-400">
                  Review details before adding
                </Text>
              </View>
            </View>
            <TouchableOpacity
              className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 24, gap: 20 }}
          >
            {/* Property name card */}
            <View style={styles.propCard}>
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-[20px] font-extrabold text-white flex-1 mr-3">
                  {property.name}
                </Text>
                <View className="px-3 py-1 rounded-full bg-white/10">
                  <Text className="text-[11px] font-bold text-white/80">
                    {property.type}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center gap-1.5">
                <Ionicons
                  name="location-outline"
                  size={12}
                  color="rgba(255,255,255,0.5)"
                />
                <Text className="text-[12px] text-white/50 flex-1">
                  {property.address}
                </Text>
              </View>
            </View>

            {/* Property details */}
            <View>
              <Text className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-3">
                Property Details
              </Text>
              <View className="bg-slate-50 rounded-2xl overflow-hidden">
                {[
                  { label: "Owner",          value: property.owner },
                  { label: "Parcel ID",      value: property.parcelId },
                  { label: "Tax Year",       value: property.taxYear },
                  { label: "Assessed Value", value: property.assessedValue },
                  { label: "Estimated Tax",  value: property.estimatedTax },
                ].map((row, i, arr) => (
                  <View
                    key={row.label}
                    className={`flex-row justify-between items-center px-4 py-3.5 ${
                      i < arr.length - 1 ? "border-b border-slate-100" : ""
                    }`}
                  >
                    <Text className="text-[13px] text-slate-400">
                      {row.label}
                    </Text>
                    <Text className="text-[13px] font-semibold text-slate-900">
                      {row.value}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* CTAs */}
          <View
            className="px-6 pt-3 gap-3 border-t border-slate-100"
            style={{ paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }}
          >
            <TouchableOpacity
              className="bg-primary rounded-2xl py-4 flex-row items-center justify-center gap-2"
              onPress={onAdd}
              activeOpacity={0.85}
              disabled={adding}
            >
              {adding ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="add-circle-outline" size={20} color="#fff" />
              )}
              <Text className="text-white font-bold text-[16px]">
                {adding ? "Adding…" : "Add Property"}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="rounded-2xl py-4 items-center justify-center"
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text className="text-slate-400 font-semibold text-[14px]">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  propCard: {
    backgroundColor: "#0B1426",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#0B1426",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
});
