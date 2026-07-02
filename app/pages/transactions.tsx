import { ChatMessage } from "@/types/chat";
import { Property } from "@/types/property";
import {
    BillingRow,
    StatementData,
    StatementInvoiceRow,
    SubmitPayload,
} from "@/types/statement";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
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
import {
    groupByDate,
    MONTH_LABELS,
    nowTime,
    todayDate,
} from "../../utils/chatUtils";
import { fetchUsersProperties } from "../../utils/frappe_services/getUsersProperties";
import { fetchPropertyInvoices } from "../../utils/frappe_services/property_invoices";
import { fetchPaymentsForInvoices } from "../../utils/frappe_services/statements";
import { mapUserProperty } from "../../utils/propertyUtils";
import StatementRequestModal from "../components/StatementRequestModal";
import StatementViewModal from "../components/StatementViewModal";
import TabBar from "../components/tab-bar";

function fmtPostedDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return `${MONTH_LABELS[month - 1]} ${day}, ${year}`;
}

function fmtAmount(n: number): string {
  return `GHS ${n.toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function DateSeparator({ date }: { date: string }) {
  return (
    <View className="flex-row items-center gap-3 my-4">
      <View className="flex-1 h-px bg-slate-200" />
      <Text className="text-[11px] font-semibold text-slate-400">{date}</Text>
      <View className="flex-1 h-px bg-slate-200" />
    </View>
  );
}

function SystemBubble({
  msg,
  onViewStatement,
}: {
  msg: ChatMessage;
  onViewStatement?: () => void;
}) {
  return (
    <View className="flex-row items-end gap-2 mb-4">
      {/* Avatar */}
      <View className="w-8 h-8 rounded-full bg-[#0B1426] items-center justify-center mb-1 shrink-0">
        <Ionicons name="business" size={14} color="#b5cc3b" />
      </View>

      <View style={[styles.bubble, styles.leftBubble]}>
        {msg.type === "invoice" && (
          <>
            {/* Tag row */}
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-2">
                <View className="w-6 h-6 rounded-[7px] bg-amber-100 items-center justify-center">
                  <Ionicons name="document-text" size={13} color="#D97706" />
                </View>
                <Text className="text-[10px] font-bold text-amber-600 tracking-widest uppercase">
                  New Invoice
                </Text>
              </View>
              {msg.billingYear && (
                <View className="bg-amber-100 px-2.5 py-1 rounded-full">
                  <Text className="text-[10px] font-bold text-amber-700">
                    {msg.billingYear}
                  </Text>
                </View>
              )}
            </View>

            {/* Property name */}
            <Text className="text-[15px] font-bold text-slate-900 mb-0.5">
              {msg.property}
            </Text>
            <Text className="text-[12px] text-slate-400 mb-3">
              You have a new tax invoice ready
            </Text>

            {/* Details card */}
            <View className="bg-amber-50 rounded-2xl overflow-hidden">
              {/* Amount */}
              <View className="px-4 pt-3 pb-2.5 border-b border-amber-100">
                <Text className="text-[9px] font-bold text-amber-500 tracking-widest mb-1">
                  AMOUNT DUE
                </Text>
                <Text className="text-[22px] font-extrabold text-slate-900">
                  {msg.amount}
                </Text>
              </View>

              {/* Due date + Tax year */}
              <View className="flex-row px-4 py-2.5 border-b border-amber-100">
                <View className="flex-1">
                  <Text className="text-[9px] font-bold text-amber-500 tracking-widest mb-1">
                    DUE DATE
                  </Text>
                  <Text className="text-[12px] font-bold text-slate-700">
                    {msg.dueDate}
                  </Text>
                </View>
                <View className="flex-1 items-end">
                  <Text className="text-[9px] font-bold text-amber-500 tracking-widest mb-1">
                    TAX YEAR
                  </Text>
                  <Text className="text-[12px] font-bold text-slate-700">
                    {msg.billingYear ?? "—"}
                  </Text>
                </View>
              </View>

              {/* Invoice number */}
              {msg.invoiceNumber && (
                <View className="flex-row items-center gap-1.5 px-4 py-2">
                  <Ionicons name="receipt-outline" size={11} color="#D97706" />
                  <Text className="text-[10px] text-amber-600 font-semibold">
                    {msg.invoiceNumber}
                  </Text>
                </View>
              )}
            </View>
          </>
        )}

        {msg.type === "statement" && (
          <>
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-6 h-6 rounded-[7px] bg-[#EEECFF] items-center justify-center">
                <Ionicons name="document" size={13} color="#6C63FF" />
              </View>
              <Text className="text-[10px] font-bold text-[#6C63FF] tracking-widest uppercase">
                Statement Ready
              </Text>
            </View>
            <Text className="text-[14px] font-bold text-slate-900 mb-0.5">
              {msg.property}
            </Text>
            <Text className="text-[12px] text-slate-400 mb-3">
              Your statement is ready to view
            </Text>
            <TouchableOpacity
              className="flex-row items-center justify-center gap-2 bg-[#6C63FF] rounded-xl py-2.5 px-4"
              activeOpacity={0.85}
              onPress={onViewStatement}
            >
              <Ionicons name="eye-outline" size={14} color="#fff" />
              <Text className="text-white text-[12px] font-bold">
                View Statement
              </Text>
            </TouchableOpacity>
          </>
        )}

        {msg.type === "request" && (
          <>
            {/* Request tag */}
            <View className="flex-row items-center gap-2 mb-3">
              <View className="w-6 h-6 rounded-[7px] bg-[#2b2a33] items-center justify-center">
                <Ionicons name="time-outline" size={13} color="#00CEC8" />
              </View>
              <Text className="text-[10px] font-bold text-primary tracking-widest uppercase">
                Statement Request
              </Text>
            </View>

            {/* Details rows */}
            <View className="bg-slate-50 rounded-2xl overflow-hidden mb-3">
              {[
                { label: "Property", value: msg.property },
                { label: "Type", value: msg.statementType },
                { label: "Period", value: msg.period },
              ].map((row, i, arr) => (
                <View
                  key={row.label}
                  className={`flex-row justify-between px-3 py-2.5 ${
                    i < arr.length - 1 ? "border-b border-slate-100" : ""
                  }`}
                >
                  <Text className="text-[11px] text-slate-400">
                    {row.label}
                  </Text>
                  <Text className="text-[11px] font-semibold text-slate-900">
                    {row.value}
                  </Text>
                </View>
              ))}
            </View>

            {/* Please wait banner */}
            <View className="flex-row items-start gap-2 bg-[#2b2a33] rounded-xl px-3 py-2.5">
              <Ionicons
                name="hourglass-outline"
                size={14}
                color="#00CEC8"
                style={{ marginTop: 1 }}
              />
              <Text className="text-[12px] text-[#ffffff] font-medium flex-1 leading-[18px]">
                Please wait while your information is being prepared
              </Text>
            </View>
          </>
        )}

        <Text className="text-[10px] text-slate-300 mt-2 self-end">
          {msg.time}
        </Text>
      </View>
    </View>
  );
}

function UserBubble({ msg }: { msg: ChatMessage }) {
  return (
    <View className="flex-row justify-end mb-4">
      <View style={[styles.bubble, styles.rightBubble]}>
        {/* Paid tag */}
        <View className="flex-row items-center gap-2 mb-2">
          <View className="w-6 h-6 rounded-[7px] bg-white/10 items-center justify-center">
            <Ionicons name="checkmark-circle" size={13} color="#4ADE80" />
          </View>
          <Text className="text-[10px] font-bold text-green-400 tracking-widest uppercase">
            Payment Made
          </Text>
        </View>

        <Text className="text-[13px] text-white/60 mb-1">
          I paid for the {msg.property} invoice
        </Text>
        <Text className="text-[24px] font-extrabold text-white mb-1">
          {msg.amount}
        </Text>

        <Text className="text-[10px] text-white/30 self-end">{msg.time}</Text>
      </View>
    </View>
  );
}

const STORAGE_KEY = "transactions_local_messages";
const STORAGE_MAP_KEY = "transactions_statement_map";

export default function TransactionsScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const storageLoaded = useRef(false);
  const [invoiceMessages, setInvoiceMessages] = useState<ChatMessage[]>([]);
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProperties, setUserProperties] = useState<Property[]>([]);
  const [statementModal, setStatementModal] = useState(false);
  const [statementDataMap, setStatementDataMap] = useState<
    Map<number, StatementData>
  >(new Map());
  const [viewingStatementData, setViewingStatementData] =
    useState<StatementData | null>(null);

  // Load persisted local messages on mount
  useEffect(() => {
    AsyncStorage.multiGet([STORAGE_KEY, STORAGE_MAP_KEY])
      .then(([[, msgs], [, map]]) => {
        if (msgs) setLocalMessages(JSON.parse(msgs));
        if (map) setStatementDataMap(new Map(JSON.parse(map)));
        storageLoaded.current = true;
      })
      .catch(() => {
        storageLoaded.current = true;
      });
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchUsersProperties().then(async (result) => {
        if (!result.success) {
          setLoading(false);
          return;
        }

        const perProperty = await Promise.all(
          result.properties.map((p) =>
            fetchPropertyInvoices(p.property_id || p.name),
          ),
        );

        // Flatten all invoices, sort by raw posting_date (YYYY-MM-DD sorts correctly as string)
        const allInvoices = perProperty
          .flatMap((res) => (res.success ? res.invoices : []))
          .sort((a, b) => a.posting_date.localeCompare(b.posting_date));

        const msgs: ChatMessage[] = allInvoices.map((inv, i) => ({
          id: i + 1,
          sender: "system" as const,
          type: "invoice" as const,
          property: inv.property_details?.full_name ?? "",
          amount: fmtAmount(inv.grand_total),
          dueDate: inv.due_date ? fmtPostedDate(inv.due_date) : "—",
          billingYear: inv.custom_billing_year ?? undefined,
          invoiceNumber: inv.name,
          date: fmtPostedDate(inv.posting_date),
          time: "9:00 AM",
        }));

        setUserProperties(result.properties.map(mapUserProperty));
        setInvoiceMessages(msgs);
        setLoading(false);
      });
    }, []),
  );

  const messages = [...invoiceMessages, ...localMessages];
  const grouped = groupByDate(messages);

  // Persist local messages whenever they change (skip until storage is loaded)
  useEffect(() => {
    if (!storageLoaded.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(localMessages)).catch(
      () => {},
    );
  }, [localMessages]);

  // Persist statement data map whenever it changes (skip until storage is loaded)
  useEffect(() => {
    if (!storageLoaded.current) return;
    AsyncStorage.setItem(
      STORAGE_MAP_KEY,
      JSON.stringify(Array.from(statementDataMap.entries())),
    ).catch(() => {});
  }, [statementDataMap]);

  useEffect(() => {
    if (!loading && messages.length > 0) {
      setTimeout(
        () => scrollRef.current?.scrollToEnd({ animated: false }),
        100,
      );
    }
  }, [loading]);

  const handleStatementRequest = async (payload: SubmitPayload) => {
    // 1. Show "request" bubble immediately
    const requestMsg: ChatMessage = {
      id: Date.now(),
      sender: "system",
      type: "request",
      property: payload.property,
      statementType: payload.statementType,
      period: payload.period,
      date: todayDate(),
      time: nowTime(),
    };
    setLocalMessages((prev) => [...prev, requestMsg]);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    // 2. Fetch invoices for the property
    const invoiceResult = await fetchPropertyInvoices(payload.propertyParcelId);
    if (!invoiceResult.success) return;

    let statementData: StatementData;

    if (payload.statementType === "Statement") {
      // ── Statement: invoice-centric ──────────────────────────────────
      // Show invoices posted in the selected period + their payment history

      const filtered = invoiceResult.invoices.filter(
        (inv) =>
          inv.posting_date >= payload.from_date &&
          inv.posting_date <= payload.to_date,
      );

      const invoice_names = filtered.map((inv) => inv.name);
      const paymentsResult =
        invoice_names.length > 0
          ? await fetchPaymentsForInvoices(invoice_names)
          : { success: true as const, payments: [] };

      const paymentsMap: Record<
        string,
        { invoice_name: string; amount: number; entry: any }[]
      > = {};
      if (paymentsResult.success) {
        for (const pmt of paymentsResult.payments) {
          if (!paymentsMap[pmt.invoice_name])
            paymentsMap[pmt.invoice_name] = [];
          paymentsMap[pmt.invoice_name].push(pmt);
        }
      }

      const rows: StatementInvoiceRow[] = filtered.map((inv) => {
        const pmts = paymentsMap[inv.name] ?? [];
        return {
          invoiceNumber: inv.name,
          billingYear: inv.custom_billing_year ?? "—",
          grandTotal: inv.grand_total,
          outstanding: inv.outstanding_amount,
          dueDate: inv.due_date || "—",
          payments: pmts.map((p: any) => ({
            date: p.entry?.posting_date ?? "—",
            amount: p.amount,
            method: p.entry?.mode_of_payment ?? "",
          })),
        };
      });

      const totalBilled = rows.reduce((s, r) => s + r.grandTotal, 0);
      const totalOutstanding = rows.reduce((s, r) => s + r.outstanding, 0);

      statementData = {
        property: payload.property,
        period: payload.period,
        statementType: payload.statementType,
        rows,
        totalBilled,
        totalPaid: totalBilled - totalOutstanding,
        totalOutstanding,
      };
    } else {
      // ── Billing: payment-centric ────────────────────────────────────
      // Show payment transactions made within the selected period

      const allInvoiceNames = invoiceResult.invoices.map((inv) => inv.name);
      const invoiceMap = Object.fromEntries(
        invoiceResult.invoices.map((inv) => [inv.name, inv]),
      );

      const paymentsResult =
        allInvoiceNames.length > 0
          ? await fetchPaymentsForInvoices(allInvoiceNames)
          : { success: true as const, payments: [] };

      const billingRows: BillingRow[] = paymentsResult.success
        ? paymentsResult.payments
            .filter((p) => {
              const d = p.entry?.posting_date;
              return d && d >= payload.from_date && d <= payload.to_date;
            })
            .map((p) => ({
              paymentName: p.entry?.name ?? "—",
              paymentDate: p.entry?.posting_date ?? "—",
              invoiceName: p.invoice_name,
              billingYear:
                invoiceMap[p.invoice_name]?.custom_billing_year ?? "—",
              amount: p.amount,
              method: p.entry?.mode_of_payment ?? "",
            }))
            .sort((a, b) => a.paymentDate.localeCompare(b.paymentDate))
        : [];

      const totalPaid = billingRows.reduce((s, r) => s + r.amount, 0);

      statementData = {
        property: payload.property,
        period: payload.period,
        statementType: payload.statementType,
        rows: [],
        totalBilled: 0,
        totalPaid,
        totalOutstanding: 0,
        billingRows,
        totalPayments: billingRows.length,
      };
    }

    // 6. Add "statement ready" bubble
    const statementMsgId = Date.now() + 1;
    setStatementDataMap((prev) =>
      new Map(prev).set(statementMsgId, statementData),
    );
    const statementMsg: ChatMessage = {
      id: statementMsgId,
      sender: "system",
      type: "statement",
      property: payload.property,
      date: todayDate(),
      time: nowTime(),
    };
    setLocalMessages((prev) => [...prev, statementMsg]);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* ── Header ─────────────────────────────── */}
      <View className="bg-white px-6 py-4 border-b border-[#F1F5F9] flex-row items-center justify-between">
        <View>
          <Text className="text-[22px] font-bold text-slate-900">
            Transactions
          </Text>
          <Text className="text-[12px] text-slate-400 mt-0.5">
            Tax invoice history
          </Text>
        </View>
        <View className="bg-[#2b2a33] px-3 py-1.5 rounded-full">
          <Text className="text-[11px] font-bold text-primary">
            {loading
              ? "…"
              : `${invoiceMessages.length} invoice${invoiceMessages.length !== 1 ? "s" : ""}`}
          </Text>
        </View>
      </View>

      {/* ── Chat ───────────────────────────────── */}
      {loading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color="#00CEC8" />
          <Text className="text-slate-400 text-[13px] mt-3">
            Loading invoices…
          </Text>
        </View>
      ) : messages.length === 0 ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Ionicons name="document-outline" size={36} color="#CBD5E1" />
          <Text className="text-slate-400 text-[13px] mt-3">
            No invoices found
          </Text>
        </View>
      ) : (
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8 }}
        >
          {Array.from(grouped.entries()).map(([date, msgs]) => (
            <View key={date}>
              <DateSeparator date={date} />
              {msgs.map((msg) =>
                msg.sender === "system" ? (
                  <SystemBubble
                    key={msg.id}
                    msg={msg}
                    onViewStatement={
                      msg.type === "statement"
                        ? () =>
                            setViewingStatementData(
                              statementDataMap.get(msg.id) ?? null,
                            )
                        : undefined
                    }
                  />
                ) : (
                  <UserBubble key={msg.id} msg={msg} />
                ),
              )}
            </View>
          ))}
        </ScrollView>
      )}

      {/* ── Get Statement ──────────────────────── */}
      <View className="bg-white px-5 py-3 border-t border-[#F1F5F9]">
        <TouchableOpacity
          className="bg-primary rounded-2xl py-3.5 flex-row items-center justify-center gap-2"
          activeOpacity={0.85}
          onPress={() => setStatementModal(true)}
        >
          <Ionicons name="document-text-outline" size={18} color="#fff" />
          <Text className="text-white text-[15px] font-bold">
            Get Your Statement
          </Text>
        </TouchableOpacity>
      </View>

      <StatementRequestModal
        visible={statementModal}
        properties={userProperties}
        onClose={() => setStatementModal(false)}
        onSubmit={handleStatementRequest}
      />

      <StatementViewModal
        visible={viewingStatementData !== null}
        data={viewingStatementData}
        onClose={() => setViewingStatementData(null)}
      />

      <TabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: "78%",
    borderRadius: 20,
    padding: 14,
  },
  leftBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    shadowColor: "#0B1426",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  rightBubble: {
    backgroundColor: "#0B1426",
    borderBottomRightRadius: 4,
  },
});
