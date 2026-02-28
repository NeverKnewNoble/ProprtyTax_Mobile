import { Ionicons } from "@expo/vector-icons";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Property } from "../../types/property";

type Props = {
  selected: Property | null;
  onClose: () => void;
  onPay: () => void;
};

export default function PropertyModal({ selected, onClose, onPay }: Props) {
  const insets = useSafeAreaInsets();
  const paid = selected?.due === "Paid";

  return (
    <Modal
      visible={selected !== null}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-[32px]" style={{ maxHeight: "92%" }}>

          {/* Handle */}
          <View className="items-center pt-3 pb-1">
            <View className="w-10 h-1 bg-slate-200 rounded-full" />
          </View>

          {/* Header */}
          <View className="flex-row justify-between items-start px-6 pt-3 pb-4 border-b border-slate-100">
            <View className="flex-1 mr-4">
              <Text className="text-[20px] font-bold text-slate-900">{selected?.name}</Text>
              <Text className="text-[12px] text-slate-400 mt-0.5">{selected?.address}</Text>
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
            contentContainerStyle={{ padding: 24, gap: 24, paddingBottom: 12 }}
          >
            {/* Property Info */}
            <View>
              <Text className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-3">
                Property Info
              </Text>
              <View className="bg-slate-50 rounded-2xl overflow-hidden">
                {[
                  { label: "Type",      value: selected?.type },
                  { label: "Tax Year",  value: selected?.taxYear },
                  { label: "Parcel ID", value: selected?.parcelId },
                  { label: "Due Date",  value: selected?.dueDate },
                ].map((item, i, arr) => (
                  <View
                    key={item.label}
                    className={`flex-row justify-between items-center px-4 py-3.5 ${
                      i < arr.length - 1 ? "border-b border-slate-100" : ""
                    }`}
                  >
                    <Text className="text-[13px] text-slate-400">{item.label}</Text>
                    <Text className="text-[13px] font-semibold text-slate-900">{item.value}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Payment Details */}
            <View>
              <Text className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-3">
                Payment Details
              </Text>
              <View style={styles.payCard}>
                <View className="flex-row justify-between items-start mb-5">
                  <View>
                    <Text className="text-[10px] text-white/40 font-bold tracking-widest mb-1">
                      BALANCE DUE
                    </Text>
                    <Text className="text-[32px] font-extrabold text-white">{selected?.balance}</Text>
                  </View>
                  <View
                    className="px-3 py-1.5 rounded-full"
                    style={{
                      backgroundColor: paid
                        ? "rgba(74,222,128,0.15)"
                        : "rgba(252,211,77,0.15)",
                    }}
                  >
                    <Text
                      className="text-[11px] font-bold"
                      style={{ color: paid ? "#4ADE80" : "#FCD34D" }}
                    >
                      {selected?.due}
                    </Text>
                  </View>
                </View>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-[12px] text-white/40">Payment progress</Text>
                  <Text className="text-[12px] font-semibold text-white/80">{selected?.progress}%</Text>
                </View>
                <View className="h-[6px] bg-white/[0.08] rounded-full overflow-hidden">
                  <View
                    className={`h-[6px] rounded-full ${paid ? "bg-green-400" : "bg-primary"}`}
                    style={{ width: `${selected?.progress ?? 0}%` as any }}
                  />
                </View>
              </View>
            </View>

            {/* Payment History */}
            <View>
              <Text className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-3">
                Payment History
              </Text>
              <View className="gap-2">
                {selected?.history.map((h, i) => (
                  <View key={i} className="flex-row items-center bg-slate-50 rounded-2xl p-4">
                    <View className="w-9 h-9 rounded-[10px] bg-green-100 items-center justify-center mr-3">
                      <Ionicons name="checkmark-circle" size={18} color="#22C55E" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-[13px] font-semibold text-slate-900">{h.period}</Text>
                      <Text className="text-[11px] text-slate-400">{h.date}</Text>
                    </View>
                    <Text className="text-[14px] font-bold text-slate-900">{h.amount}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* CTA */}
          <View
            className="px-6 pt-3 border-t border-slate-100"
            style={{ paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }}
          >
            {!paid ? (
              <TouchableOpacity
                className="bg-primary rounded-2xl py-4 flex-row items-center justify-center gap-2"
                activeOpacity={0.85}
                onPress={onPay}
              >
                <Ionicons name="card" size={18} color="#fff" />
                <Text className="text-white font-bold text-[16px]">Pay {selected?.balance}</Text>
              </TouchableOpacity>
            ) : (
              <View className="bg-green-50 rounded-2xl py-4 flex-row items-center justify-center gap-2">
                <Ionicons name="checkmark-circle" size={18} color="#22C55E" />
                <Text className="text-green-600 font-bold text-[16px]">All Payments Up to Date</Text>
              </View>
            )}
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  payCard: {
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
