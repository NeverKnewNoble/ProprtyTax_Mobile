import { Invoice, Property } from "@/types/property";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
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
import { fetchPropertyInvoices } from "../../utils/frappe_services/property_invoices";
import { getTypeStyle } from "../../utils/propertyUtils";

const YEAR_PALETTE = [
  { bg: "#0B1426", accent: "#00CEC8" },
  { bg: "#6C63FF", accent: "#D4D2FF" },
  { bg: "#D97706", accent: "#FDE68A" },
  { bg: "#0E6E61", accent: "#99F6E4" },
  { bg: "#9333EA", accent: "#E9D5FF" },
];

type Props = {
  selected: Property | null;
  onClose: () => void;
  onPay: () => void;
};

function fmtAmount(n: number) {
  return `GHS ${n.toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function PropertyModal({ selected, onClose, onPay }: Props) {
  const insets = useSafeAreaInsets();
  const [expandedYear, setExpandedYear] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);

  const tc = selected
    ? getTypeStyle(selected.type)
    : { bg: "#2b2a33", text: "#00CEC8" };

  useEffect(() => {
    if (!selected?.parcelId) {
      setInvoices([]);
      return;
    }
    setInvoicesLoading(true);
    setExpandedYear(null);
    fetchPropertyInvoices(selected.parcelId).then((result) => {
      setInvoices(result.success ? result.invoices : []);
      setInvoicesLoading(false);
    });
  }, [selected?.parcelId]);

  // Group invoices by billing year
  const invoicesByYear: Record<string, Invoice[]> = {};
  for (const inv of invoices) {
    const year = inv.custom_billing_year ?? "Unknown";
    if (!invoicesByYear[year]) invoicesByYear[year] = [];
    invoicesByYear[year].push(inv);
  }
  const years = Object.keys(invoicesByYear).sort(
    (a, b) => Number(b) - Number(a),
  );

  const totalOutstanding = invoices.reduce(
    (sum, inv) => sum + inv.outstanding_amount,
    0,
  );
  const hasUnpaid = totalOutstanding > 0;

  // Pull extra details from invoice data
  const gpsId = invoices[0]?.property_details?.gps_id;
  const zone = invoices[0]?.custom_zone;

  return (
    <Modal
      visible={selected !== null}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View
          className="bg-[#F1F5F9] rounded-t-[32px]"
          style={{ maxHeight: "92%" }}
        >
          {/* Handle */}
          <View className="items-center pt-3 pb-2">
            <View className="w-10 h-1 bg-slate-300 rounded-full" />
          </View>

          {/* Header */}
          <View className="flex-row justify-between items-center px-6 pb-4">
            <Text className="text-[20px] font-bold text-slate-900">
              Property Details
            </Text>
            <TouchableOpacity
              className="w-9 h-9 rounded-full bg-white items-center justify-center"
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 12,
              gap: 14,
            }}
          >
            {/* ── Property Info Card ── */}
            <View style={styles.infoCard}>
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1 mr-3">
                  <Text className="text-[17px] font-bold text-slate-900">
                    {selected?.name}
                  </Text>
                  <Text className="text-[12px] text-slate-400 mt-0.5">
                    {selected?.address ?? "—"}
                  </Text>
                </View>
                <View
                  className="px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: tc.bg }}
                >
                  <Text
                    className="text-[11px] font-bold"
                    style={{ color: tc.text }}
                  >
                    {selected?.type}
                  </Text>
                </View>
              </View>

              <View className="flex-row flex-wrap gap-x-6 gap-y-2">
                <View>
                  <Text className="text-[10px] text-slate-400 font-medium mb-0.5">
                    Parcel ID
                  </Text>
                  <Text className="text-[12px] font-semibold text-slate-700">
                    {selected?.parcelId ?? "—"}
                  </Text>
                </View>
                {gpsId ? (
                  <View>
                    <Text className="text-[10px] text-slate-400 font-medium mb-0.5">
                      GPS ID
                    </Text>
                    <Text className="text-[12px] font-semibold text-slate-700">
                      {gpsId}
                    </Text>
                  </View>
                ) : null}
                {zone ? (
                  <View>
                    <Text className="text-[10px] text-slate-400 font-medium mb-0.5">
                      Zone
                    </Text>
                    <Text className="text-[12px] font-semibold text-slate-700">
                      {zone}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>

            {/* ── Tax Years ── */}
            <Text className="text-[11px] font-bold text-slate-400 tracking-widest uppercase px-1">
              Tax Years
            </Text>

            {invoicesLoading ? (
              <View className="items-center py-10">
                <ActivityIndicator color="#00CEC8" size="large" />
                <Text className="text-[12px] text-slate-400 mt-3">
                  Loading invoices...
                </Text>
              </View>
            ) : years.length === 0 ? (
              <View style={styles.emptyCard}>
                <Ionicons name="document-outline" size={32} color="#CBD5E1" />
                <Text className="text-[13px] text-slate-400 mt-2">
                  No invoices found
                </Text>
              </View>
            ) : (
              years.map((year, idx) => {
                const palette = YEAR_PALETTE[idx % YEAR_PALETTE.length];
                const yearInvoices = invoicesByYear[year];
                const isExpanded = expandedYear === year;
                const totalForYear = yearInvoices.reduce(
                  (s, i) => s + i.grand_total,
                  0,
                );
                const outstandingForYear = yearInvoices.reduce(
                  (s, i) => s + i.outstanding_amount,
                  0,
                );
                const progress =
                  totalForYear > 0
                    ? Math.round(
                        ((totalForYear - outstandingForYear) / totalForYear) *
                          100,
                      )
                    : 100;
                const allPaid = outstandingForYear === 0;

                return (
                  <View key={year}>
                    {/* Year Card */}
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => setExpandedYear(isExpanded ? null : year)}
                      style={[styles.yearCard, { backgroundColor: palette.bg }]}
                    >
                      <View className="flex-row justify-between items-start mb-4">
                        <View>
                          <Text
                            className="text-[10px] font-bold tracking-widest mb-1"
                            style={{ color: palette.accent, opacity: 0.85 }}
                          >
                            TAX YEAR
                          </Text>
                          <Text className="text-[30px] font-extrabold text-white">
                            {year}
                          </Text>
                        </View>
                        <View className="items-end gap-2">
                          <View
                            className="px-3 py-1.5 rounded-full"
                            style={{
                              backgroundColor: allPaid
                                ? "rgba(74,222,128,0.15)"
                                : "rgba(252,211,77,0.15)",
                            }}
                          >
                            <Text
                              className="text-[11px] font-bold"
                              style={{ color: allPaid ? "#4ADE80" : "#FCD34D" }}
                            >
                              {allPaid ? "Paid" : "Unpaid"}
                            </Text>
                          </View>
                          <Text
                            className="text-[11px]"
                            style={{ color: "rgba(255,255,255,0.4)" }}
                          >
                            {yearInvoices.length} invoice
                            {yearInvoices.length !== 1 ? "s" : ""}
                          </Text>
                          <Ionicons
                            name={isExpanded ? "chevron-up" : "chevron-down"}
                            size={16}
                            color="rgba(255,255,255,0.4)"
                          />
                        </View>
                      </View>

                      {/* Totals row */}
                      <View className="flex-row justify-between items-end mb-3">
                        <View>
                          <Text
                            className="text-[10px] font-bold tracking-widest mb-1"
                            style={{ color: "rgba(255,255,255,0.4)" }}
                          >
                            {allPaid ? "STATUS" : "OUTSTANDING"}
                          </Text>
                          <Text className="text-[20px] font-extrabold text-white">
                            {allPaid
                              ? "Fully Paid"
                              : fmtAmount(outstandingForYear)}
                          </Text>
                        </View>
                        <View className="items-end">
                          <Text
                            className="text-[10px] font-bold tracking-widest mb-1"
                            style={{ color: "rgba(255,255,255,0.4)" }}
                          >
                            TOTAL BILLED
                          </Text>
                          <Text
                            className="text-[20px] font-extrabold"
                            style={{ color: palette.accent }}
                          >
                            {fmtAmount(totalForYear)}
                          </Text>
                        </View>
                      </View>

                      {/* Progress bar */}
                      <View
                        className="h-[6px] rounded-full overflow-hidden"
                        style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
                      >
                        <View
                          className="h-[6px] rounded-full"
                          style={{
                            width: `${progress}%`,
                            backgroundColor: palette.accent,
                          }}
                        />
                      </View>
                      <Text
                        className="text-[10px] mt-1.5"
                        style={{ color: "rgba(255,255,255,0.35)" }}
                      >
                        {progress}% paid
                      </Text>
                    </TouchableOpacity>

                    {/* Expanded Invoice List */}
                    {isExpanded && (
                      <View style={styles.historyContainer}>
                        {yearInvoices.map((inv, i) => {
                          const isPaid =
                            inv.outstanding_amount === 0 ||
                            inv.status.toLowerCase() === "paid";
                          return (
                            <View
                              key={inv.name}
                              className="py-3"
                              style={
                                i < yearInvoices.length - 1
                                  ? {
                                      borderBottomWidth: 1,
                                      borderBottomColor: "#F1F5F9",
                                    }
                                  : undefined
                              }
                            >
                              {/* Invoice header row */}
                              <View className="flex-row items-center mb-2">
                                <View
                                  className="w-9 h-9 rounded-[10px] items-center justify-center mr-3"
                                  style={{
                                    backgroundColor: isPaid
                                      ? "#DCFCE7"
                                      : "#FEF9C3",
                                  }}
                                >
                                  <Ionicons
                                    name={
                                      isPaid
                                        ? "checkmark-circle"
                                        : "time-outline"
                                    }
                                    size={18}
                                    color={isPaid ? "#22C55E" : "#EAB308"}
                                  />
                                </View>
                                <View className="flex-1">
                                  <Text className="text-[13px] font-semibold text-slate-900">
                                    {inv.name}
                                  </Text>
                                  <Text className="text-[11px] text-slate-400">
                                    Due: {inv.due_date}
                                  </Text>
                                </View>
                                <View
                                  className="px-2.5 py-1 rounded-full"
                                  style={{
                                    backgroundColor: isPaid
                                      ? "#DCFCE7"
                                      : "#FEF9C3",
                                  }}
                                >
                                  <Text
                                    className="text-[10px] font-bold"
                                    style={{
                                      color: isPaid ? "#16A34A" : "#CA8A04",
                                    }}
                                  >
                                    {inv.status}
                                  </Text>
                                </View>
                              </View>

                              {/* Amount details */}
                              <View className="flex-row gap-5 pl-12">
                                <View>
                                  <Text className="text-[10px] text-slate-400 font-medium mb-0.5">
                                    Total
                                  </Text>
                                  <Text className="text-[13px] font-bold text-slate-800">
                                    {fmtAmount(inv.grand_total)}
                                  </Text>
                                </View>
                                {!isPaid && (
                                  <View>
                                    <Text className="text-[10px] text-slate-400 font-medium mb-0.5">
                                      Outstanding
                                    </Text>
                                    <Text className="text-[13px] font-bold text-amber-600">
                                      {fmtAmount(inv.outstanding_amount)}
                                    </Text>
                                  </View>
                                )}
                                <View>
                                  <Text className="text-[10px] text-slate-400 font-medium mb-0.5">
                                    Posted
                                  </Text>
                                  <Text className="text-[13px] font-semibold text-slate-600">
                                    {inv.posting_date}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    )}
                  </View>
                );
              })
            )}

            <View style={{ height: 4 }} />
          </ScrollView>

          {/* CTA */}
          <View
            className="px-6 pt-3 border-t border-slate-200"
            style={{ paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }}
          >
            {invoicesLoading ? (
              <View className="bg-slate-100 rounded-2xl py-4 flex-row items-center justify-center gap-2">
                <ActivityIndicator size="small" color="#00CEC8" />
                <Text className="text-slate-400 font-semibold text-[16px]">
                  Loading...
                </Text>
              </View>
            ) : hasUnpaid ? (
              <TouchableOpacity
                className="bg-primary rounded-2xl py-4 flex-row items-center justify-center gap-2"
                activeOpacity={0.85}
                onPress={onPay}
              >
                <Ionicons name="card" size={18} color="#fff" />
                <Text className="text-white font-bold text-[16px]">
                  Pay {fmtAmount(totalOutstanding)}
                </Text>
              </TouchableOpacity>
            ) : (
              <View className="bg-green-50 rounded-2xl py-4 flex-row items-center justify-center gap-2">
                <Ionicons name="checkmark-circle" size={18} color="#22C55E" />
                <Text className="text-green-600 font-bold text-[16px]">
                  All Payments Up to Date
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    shadowColor: "#0B1426",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
  },
  yearCard: {
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 6,
  },
  historyContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginTop: 6,
    shadowColor: "#0B1426",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    shadowColor: "#0B1426",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
});
