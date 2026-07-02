import { StatementData } from "@/types/statement";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { downloadStatement } from "../../utils/statementPDF";

type Props = {
  visible: boolean;
  data: StatementData | null;
  onClose: () => void;
};

function fmtAmount(n: number) {
  return `GHS ${n.toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function StatementViewModal({ visible, data, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const [downloading, setDownloading] = useState(false);

  if (!data) return null;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadStatement(data);
    } catch (err: any) {
      Alert.alert("Download Failed", err.message ?? "Could not generate PDF");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View
          className="bg-[#F1F5F9] rounded-t-[32px]"
          style={{ maxHeight: "94%" }}
        >
          {/* Handle */}
          <View className="items-center pt-3 pb-2">
            <View className="w-10 h-1 bg-slate-300 rounded-full" />
          </View>

          {/* Header */}
          <View className="px-6 pb-4 flex-row justify-between items-start">
            <View className="flex-1 mr-3">
              <Text className="text-[20px] font-bold text-slate-900">
                {data.property}
              </Text>
              <Text className="text-[12px] text-slate-400 mt-0.5">
                {data.period}
              </Text>
            </View>
            <View className="items-end gap-2">
              <TouchableOpacity
                className="w-9 h-9 rounded-full bg-white items-center justify-center"
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={18} color="#64748B" />
              </TouchableOpacity>
              <View
                className="px-3 py-1 rounded-full"
                style={{
                  backgroundColor:
                    data.statementType === "Statement" ? "#EEECFF" : "#2b2a33",
                }}
              >
                <Text
                  className="text-[10px] font-bold"
                  style={{
                    color:
                      data.statementType === "Statement"
                        ? "#6C63FF"
                        : "#00CEC8",
                  }}
                >
                  {data.statementType}
                </Text>
              </View>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 12,
              gap: 14,
            }}
          >
            {data.statementType === "Statement" ? (
              <>
                {/* ── Statement: Summary ── */}
                <View style={styles.summaryCard}>
                  {[
                    {
                      label: "TOTAL BILLED",
                      value: fmtAmount(data.totalBilled),
                      color: "#0B1426",
                    },
                    {
                      label: "TOTAL PAID",
                      value: fmtAmount(data.totalPaid),
                      color: "#22C55E",
                    },
                    {
                      label: "OUTSTANDING",
                      value: fmtAmount(data.totalOutstanding),
                      color: data.totalOutstanding > 0 ? "#F59E0B" : "#22C55E",
                    },
                  ].map((stat, i) => (
                    <View
                      key={stat.label}
                      className={`flex-1 items-center ${i < 2 ? "border-r border-slate-100" : ""}`}
                    >
                      <Text className="text-[9px] font-bold text-slate-400 tracking-widest mb-1">
                        {stat.label}
                      </Text>
                      <Text
                        className="text-[13px] font-extrabold"
                        style={{ color: stat.color }}
                      >
                        {stat.value}
                      </Text>
                    </View>
                  ))}
                </View>

                <Text className="text-[11px] font-bold text-slate-400 tracking-widest uppercase px-1">
                  Invoices
                </Text>

                {/* ── Statement: Invoice rows ── */}
                {data.rows.length === 0 ? (
                  <View style={styles.emptyCard}>
                    <Ionicons
                      name="document-outline"
                      size={32}
                      color="#CBD5E1"
                    />
                    <Text className="text-[13px] text-slate-400 mt-2">
                      No invoices for this period
                    </Text>
                  </View>
                ) : (
                  data.rows.map((row) => (
                    <View key={row.invoiceNumber} style={styles.invoiceCard}>
                      <View className="flex-row justify-between items-start mb-3">
                        <View>
                          <Text className="text-[13px] font-bold text-slate-900">
                            {row.invoiceNumber}
                          </Text>
                          <Text className="text-[11px] text-slate-400 mt-0.5">
                            Billing Year: {row.billingYear || "—"}
                          </Text>
                        </View>
                        <View
                          className="px-2.5 py-1 rounded-full"
                          style={{
                            backgroundColor:
                              row.outstanding === 0 ? "#DCFCE7" : "#FEF3C7",
                          }}
                        >
                          <Text
                            className="text-[10px] font-bold"
                            style={{
                              color:
                                row.outstanding === 0 ? "#16A34A" : "#D97706",
                            }}
                          >
                            {row.outstanding === 0 ? "Paid" : "Unpaid"}
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row gap-5 mb-3 pb-3 border-b border-slate-100">
                        <View>
                          <Text className="text-[9px] font-bold text-slate-400 tracking-widest mb-0.5">
                            BILLED
                          </Text>
                          <Text className="text-[13px] font-bold text-slate-800">
                            {fmtAmount(row.grandTotal)}
                          </Text>
                        </View>
                        {row.outstanding > 0 && (
                          <View>
                            <Text className="text-[9px] font-bold text-slate-400 tracking-widest mb-0.5">
                              OUTSTANDING
                            </Text>
                            <Text className="text-[13px] font-bold text-amber-600">
                              {fmtAmount(row.outstanding)}
                            </Text>
                          </View>
                        )}
                        <View>
                          <Text className="text-[9px] font-bold text-slate-400 tracking-widest mb-0.5">
                            DUE DATE
                          </Text>
                          <Text className="text-[13px] font-semibold text-slate-600">
                            {row.dueDate}
                          </Text>
                        </View>
                      </View>

                      {row.payments.length === 0 ? (
                        <View className="flex-row items-center gap-2">
                          <Ionicons
                            name="time-outline"
                            size={14}
                            color="#94A3B8"
                          />
                          <Text className="text-[11px] text-slate-400">
                            No payments recorded
                          </Text>
                        </View>
                      ) : (
                        <View>
                          <Text className="text-[9px] font-bold text-slate-400 tracking-widest mb-2">
                            PAYMENTS
                          </Text>
                          <View className="bg-slate-50 rounded-[12px] overflow-hidden">
                            {row.payments.map((pmt, i) => (
                              <View
                                key={i}
                                className={`flex-row items-center px-3 py-2.5 ${i < row.payments.length - 1 ? "border-b border-slate-100" : ""}`}
                              >
                                <View className="w-6 h-6 rounded-full bg-green-100 items-center justify-center mr-3 shrink-0">
                                  <Ionicons
                                    name="checkmark"
                                    size={12}
                                    color="#22C55E"
                                  />
                                </View>
                                <View className="flex-1">
                                  <Text className="text-[12px] font-bold text-slate-800">
                                    {fmtAmount(pmt.amount)}
                                  </Text>
                                  <Text className="text-[10px] text-slate-400">
                                    {pmt.date}
                                    {pmt.method ? ` · ${pmt.method}` : ""}
                                  </Text>
                                </View>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}
                    </View>
                  ))
                )}
              </>
            ) : (
              <>
                {/* ── Billing: Summary ── */}
                <View style={styles.summaryCard}>
                  {[
                    {
                      label: "PAYMENTS MADE",
                      value: `${data.totalPayments ?? 0}`,
                      color: "#0B1426",
                    },
                    {
                      label: "TOTAL PAID",
                      value: fmtAmount(data.totalPaid),
                      color: "#22C55E",
                    },
                  ].map((stat, i) => (
                    <View
                      key={stat.label}
                      className={`flex-1 items-center ${i < 1 ? "border-r border-slate-100" : ""}`}
                    >
                      <Text className="text-[9px] font-bold text-slate-400 tracking-widest mb-1">
                        {stat.label}
                      </Text>
                      <Text
                        className="text-[13px] font-extrabold"
                        style={{ color: stat.color }}
                      >
                        {stat.value}
                      </Text>
                    </View>
                  ))}
                </View>

                <Text className="text-[11px] font-bold text-slate-400 tracking-widest uppercase px-1">
                  Payment Transactions
                </Text>

                {/* ── Billing: Payment rows ── */}
                {!data.billingRows || data.billingRows.length === 0 ? (
                  <View style={styles.emptyCard}>
                    <Ionicons name="card-outline" size={32} color="#CBD5E1" />
                    <Text className="text-[13px] text-slate-400 mt-2">
                      No payments made in this period
                    </Text>
                  </View>
                ) : (
                  <View style={styles.invoiceCard}>
                    {data.billingRows.map((row, i) => (
                      <View
                        key={row.paymentName}
                        className={`py-3 ${i < data.billingRows!.length - 1 ? "border-b border-slate-100" : ""}`}
                      >
                        <View className="flex-row items-center">
                          <View className="w-9 h-9 rounded-[10px] bg-green-100 items-center justify-center mr-3 shrink-0">
                            <Ionicons
                              name="checkmark-circle"
                              size={18}
                              color="#22C55E"
                            />
                          </View>
                          <View className="flex-1">
                            <Text className="text-[13px] font-bold text-slate-900">
                              {fmtAmount(row.amount)}
                            </Text>
                            <Text className="text-[11px] text-slate-400">
                              {row.paymentDate}
                              {row.method ? ` · ${row.method}` : ""}
                            </Text>
                          </View>
                          <View className="items-end">
                            <Text className="text-[10px] font-semibold text-slate-500">
                              {row.invoiceName}
                            </Text>
                            <Text className="text-[10px] text-slate-400">
                              Year: {row.billingYear}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </>
            )}

            <View style={{ height: 4 }} />
          </ScrollView>

          {/* Footer */}
          <View
            className="px-6 pt-3 border-t border-slate-200 flex-row gap-3"
            style={{
              paddingBottom: insets.bottom > 0 ? insets.bottom : 16,
            }}
          >
            <TouchableOpacity
              className="flex-1 bg-primary rounded-2xl py-4 flex-row items-center justify-center gap-2"
              onPress={handleDownload}
              disabled={downloading}
              activeOpacity={0.85}
            >
              {downloading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="download-outline" size={18} color="#fff" />
              )}
              <Text className="text-white font-bold text-[15px]">
                {downloading ? "Generating…" : "Download PDF"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-[#0B1426] rounded-2xl py-4 flex-row items-center justify-center gap-2"
              onPress={onClose}
              activeOpacity={0.85}
            >
              <Ionicons name="close-circle-outline" size={18} color="#fff" />
              <Text className="text-white font-bold text-[15px]">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 16,
    flexDirection: "row",
    shadowColor: "#0B1426",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
  },
  invoiceCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
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
