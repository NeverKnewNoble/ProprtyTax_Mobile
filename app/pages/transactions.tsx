import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChatMessage } from "../../types/chat";
import { todayDate, nowTime, groupByDate } from "../../utils/chatUtils";
import { baseMessages } from "../../utils/sampleData";
import TabBar from "../components/tab-bar";
import StatementRequestModal from "../components/StatementRequestModal";

function DateSeparator({ date }: { date: string }) {
  return (
    <View className="flex-row items-center gap-3 my-4">
      <View className="flex-1 h-px bg-slate-200" />
      <Text className="text-[11px] font-semibold text-slate-400">{date}</Text>
      <View className="flex-1 h-px bg-slate-200" />
    </View>
  );
}

function SystemBubble({ msg }: { msg: ChatMessage }) {
  return (
    <View className="flex-row items-end gap-2 mb-4">
      {/* Avatar */}
      <View className="w-8 h-8 rounded-full bg-[#0B1426] items-center justify-center mb-1 shrink-0">
        <Ionicons name="business" size={14} color="#00CEC8" />
      </View>

      <View style={[styles.bubble, styles.leftBubble]}>
        {msg.type === "invoice" && (
          <>
            <View className="flex-row items-center gap-2 mb-3">
              <View className="w-6 h-6 rounded-[7px] bg-amber-100 items-center justify-center">
                <Ionicons name="document-text" size={13} color="#D97706" />
              </View>
              <Text className="text-[10px] font-bold text-amber-600 tracking-widest uppercase">
                New Invoice
              </Text>
            </View>
            <Text className="text-[15px] font-bold text-slate-900 mb-0.5">
              {msg.property}
            </Text>
            <Text className="text-[12px] text-slate-400 mb-3">
              You have a new tax invoice ready
            </Text>
            <View className="bg-amber-50 rounded-2xl px-4 py-3 flex-row justify-between items-center">
              <View>
                <Text className="text-[9px] font-bold text-amber-500 tracking-widest mb-1">
                  AMOUNT DUE
                </Text>
                <Text className="text-[20px] font-extrabold text-slate-900">
                  {msg.amount}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-[9px] font-bold text-amber-500 tracking-widest mb-1">
                  DUE DATE
                </Text>
                <Text className="text-[13px] font-bold text-slate-700">
                  {msg.dueDate}
                </Text>
              </View>
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
            <Text className="text-[12px] text-slate-400">
              Your statement is ready to download
            </Text>
          </>
        )}

        {msg.type === "request" && (
          <>
            {/* Request tag */}
            <View className="flex-row items-center gap-2 mb-3">
              <View className="w-6 h-6 rounded-[7px] bg-[#E6FAFA] items-center justify-center">
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
                { label: "Type",     value: msg.statementType },
                { label: "Period",   value: msg.period },
              ].map((row, i, arr) => (
                <View
                  key={row.label}
                  className={`flex-row justify-between px-3 py-2.5 ${
                    i < arr.length - 1 ? "border-b border-slate-100" : ""
                  }`}
                >
                  <Text className="text-[11px] text-slate-400">{row.label}</Text>
                  <Text className="text-[11px] font-semibold text-slate-900">{row.value}</Text>
                </View>
              ))}
            </View>

            {/* Please wait banner */}
            <View className="flex-row items-start gap-2 bg-[#E6FAFA] rounded-xl px-3 py-2.5">
              <Ionicons name="hourglass-outline" size={14} color="#00CEC8" style={{ marginTop: 1 }} />
              <Text className="text-[12px] text-[#00858080] font-medium flex-1 leading-[18px]">
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

export default function TransactionsScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(baseMessages);
  const [statementModal, setStatementModal] = useState(false);

  const grouped = groupByDate(messages);

  const handleStatementRequest = (payload: {
    property: string;
    statementType: string;
    period: string;
  }) => {
    const newMsg: ChatMessage = {
      id: Date.now(),
      sender: "system",
      type: "request",
      property: payload.property,
      statementType: payload.statementType,
      period: payload.period,
      date: todayDate(),
      time: nowTime(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* ── Header ─────────────────────────────── */}
      <View className="bg-white px-6 py-4 border-b border-[#F1F5F9] flex-row items-center justify-between">
        <View>
          <Text className="text-[22px] font-bold text-slate-900">Transactions</Text>
          <Text className="text-[12px] text-slate-400 mt-0.5">Tax invoice history</Text>
        </View>
        <View className="bg-[#E6FAFA] px-3 py-1.5 rounded-full">
          <Text className="text-[11px] font-bold text-primary">{messages.length} messages</Text>
        </View>
      </View>

      {/* ── Chat ───────────────────────────────── */}
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8 }}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: false })
        }
      >
        {Array.from(grouped.entries()).map(([date, msgs]) => (
          <View key={date}>
            <DateSeparator date={date} />
            {msgs.map((msg) =>
              msg.sender === "system" ? (
                <SystemBubble key={msg.id} msg={msg} />
              ) : (
                <UserBubble key={msg.id} msg={msg} />
              )
            )}
          </View>
        ))}
      </ScrollView>

      {/* ── Get Statement ──────────────────────── */}
      <View className="bg-white px-5 py-3 border-t border-[#F1F5F9]">
        <TouchableOpacity
          className="bg-primary rounded-2xl py-3.5 flex-row items-center justify-center gap-2"
          activeOpacity={0.85}
          onPress={() => setStatementModal(true)}
        >
          <Ionicons name="document-text-outline" size={18} color="#fff" />
          <Text className="text-white text-[15px] font-bold">Get Your Statement</Text>
        </TouchableOpacity>
      </View>

      <StatementRequestModal
        visible={statementModal}
        onClose={() => setStatementModal(false)}
        onSubmit={handleStatementRequest}
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
