import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatementType, PeriodMode, MonthYear, SubmitPayload } from "../../types/statement";
import { Property } from "../../types/property";
import { properties, MONTHS } from "../../utils/sampleData";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (payload: SubmitPayload) => void;
};

// ── Month Picker ────────────────────────────────────────────────
function MonthPicker({
  label,
  value,
  onChange,
}: {
  label?: string;
  value: MonthYear;
  onChange: (v: MonthYear) => void;
}) {
  const prev = () => {
    if (value.month === 0) onChange({ month: 11, year: value.year - 1 });
    else onChange({ month: value.month - 1, year: value.year });
  };
  const next = () => {
    if (value.month === 11) onChange({ month: 0, year: value.year + 1 });
    else onChange({ month: value.month + 1, year: value.year });
  };

  return (
    <View>
      {label ? (
        <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          {label}
        </Text>
      ) : null}
      <View className="flex-row items-center bg-[#F8FAFC] rounded-2xl py-[14px] px-3">
        <TouchableOpacity
          onPress={prev}
          style={styles.arrowBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={16} color="#0F172A" />
        </TouchableOpacity>
        <Text className="text-[16px] font-bold text-slate-900 flex-1 text-center">
          {MONTHS[value.month]} {value.year}
        </Text>
        <TouchableOpacity
          onPress={next}
          style={styles.arrowBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-forward" size={16} color="#0F172A" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Step Indicator ──────────────────────────────────────────────
const STEPS = ["Property", "Type", "Period"];

function StepIndicator({ current }: { current: number }) {
  return (
    <View className="flex-row items-center justify-center px-6 pt-2 pb-4">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <View key={label} className="flex-row items-center">
            <View className="items-center">
              <View
                className={`w-[26px] h-[26px] rounded-full items-center justify-center ${
                  active ? "bg-primary" : done ? "bg-[#0B1426]" : "bg-slate-100"
                }`}
              >
                {done ? (
                  <Ionicons name="checkmark" size={12} color="#fff" />
                ) : (
                  <Text
                    className={`text-[11px] font-bold ${active ? "text-white" : "text-slate-300"}`}
                  >
                    {i + 1}
                  </Text>
                )}
              </View>
              <Text
                className={`text-[10px] mt-1 ${
                  active ? "text-primary font-bold" : done ? "text-[#0F172A] font-bold" : "text-slate-300"
                }`}
              >
                {label}
              </Text>
            </View>
            {i < STEPS.length - 1 && (
              <View
                className={`w-10 h-0.5 mx-1.5 mb-4 ${done ? "bg-[#0B1426]" : "bg-slate-100"}`}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

// ── Main Modal ──────────────────────────────────────────────────
export default function StatementRequestModal({ visible, onClose, onSubmit }: Props) {
  const insets = useSafeAreaInsets();

  const now = new Date();
  const [step, setStep] = useState(0);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [statementType, setStatementType] = useState<StatementType | null>(null);
  const [periodMode, setPeriodMode] = useState<PeriodMode>("single");
  const [singleMonth, setSingleMonth] = useState<MonthYear>({
    month: now.getMonth(),
    year: now.getFullYear(),
  });
  const [fromMonth, setFromMonth] = useState<MonthYear>({
    month: 0,
    year: now.getFullYear(),
  });
  const [toMonth, setToMonth] = useState<MonthYear>({
    month: now.getMonth(),
    year: now.getFullYear(),
  });

  const reset = () => {
    setStep(0);
    setSelectedProperty(null);
    setStatementType(null);
    setPeriodMode("single");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    if (!selectedProperty || !statementType) return;

    const period =
      periodMode === "single"
        ? `${MONTHS[singleMonth.month]} ${singleMonth.year}`
        : `${MONTHS[fromMonth.month]} ${fromMonth.year} – ${MONTHS[toMonth.month]} ${toMonth.year}`;

    onSubmit({
      property: selectedProperty.name,
      statementType,
      period,
    });
    handleClose();
  };

  const canNext =
    (step === 0 && selectedProperty !== null) ||
    (step === 1 && statementType !== null) ||
    (step === 2 && selectedProperty !== null && statementType !== null);

  // ── Step 1: Property ──────────────────────────────────────────
  const renderStep0 = () => (
    <View className="gap-3">
      {properties.map((prop) => {
        const active = selectedProperty?.id === prop.id;
        return (
          <TouchableOpacity
            key={prop.id}
            className={`flex-row items-center rounded-[18px] p-4 border-[1.5px] ${
              active ? "border-primary bg-[#F0FFFE]" : "border-transparent bg-[#F8FAFC]"
            }`}
            onPress={() => setSelectedProperty(prop)}
            activeOpacity={0.8}
          >
            <View className="flex-1">
              <Text
                className={`text-[14px] font-bold mb-0.5 ${active ? "text-primary" : "text-[#0F172A]"}`}
              >
                {prop.name}
              </Text>
              <Text className="text-[11px] text-slate-400">{prop.address}</Text>
            </View>
            <View
              className={`w-5 h-5 rounded-full border-2 items-center justify-center ml-2 ${
                active ? "border-primary" : "border-slate-300"
              }`}
            >
              {active && <View className="w-[10px] h-[10px] rounded-full bg-primary" />}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  // ── Step 2: Statement Type ────────────────────────────────────
  const renderStep1 = () => {
    const options: {
      value: StatementType;
      icon: "document-text" | "receipt";
      color: string;
      bg: string;
      desc: string;
    }[] = [
      {
        value: "Statement",
        icon: "document-text",
        color: "#6C63FF",
        bg: "#EEECFF",
        desc: "Official tax statement showing your property's tax history and balances",
      },
      {
        value: "Billing",
        icon: "receipt",
        color: "#00CEC8",
        bg: "#E6FAFA",
        desc: "Itemised billing summary with payment breakdowns and upcoming amounts",
      },
    ];

    return (
      <View className="gap-3">
        {options.map((opt) => {
          const active = statementType === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              className={`flex-row items-center rounded-[18px] p-4 border-[1.5px] ${
                active ? "border-primary bg-[#F0FFFE]" : "border-transparent bg-[#F8FAFC]"
              }`}
              onPress={() => setStatementType(opt.value)}
              activeOpacity={0.8}
            >
              <View
                className="w-12 h-12 rounded-2xl items-center justify-center mr-4 shrink-0"
                style={{ backgroundColor: active ? opt.color + "20" : opt.bg }}
              >
                <Ionicons name={opt.icon} size={22} color={opt.color} />
              </View>
              <View className="flex-1">
                <Text
                  className={`text-[15px] font-bold mb-1 ${active ? "text-primary" : "text-[#0F172A]"}`}
                >
                  {opt.value}
                </Text>
                <Text className="text-[12px] text-slate-400 leading-4">
                  {opt.desc}
                </Text>
              </View>
              <View
                className={`w-5 h-5 rounded-full border-2 items-center justify-center ml-2 ${
                  active ? "border-primary" : "border-slate-300"
                }`}
              >
                {active && <View className="w-[10px] h-[10px] rounded-full bg-primary" />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  // ── Step 3: Period ────────────────────────────────────────────
  const renderStep2 = () => (
    <View className="gap-5">
      {/* Mode toggle */}
      <View className="flex-row bg-[#F8FAFC] rounded-[14px] p-1">
        {(["single", "range"] as PeriodMode[]).map((m) => {
          const active = periodMode === m;
          const label = m === "single" ? "Single Month" : "Date Range";
          const icon = m === "single" ? "calendar-outline" : "calendar-clear-outline";
          return (
            <TouchableOpacity
              key={m}
              className={`flex-1 py-2.5 rounded-xl flex-row items-center justify-center gap-2 ${
                active ? "bg-[#E6FAFA]" : ""
              }`}
              onPress={() => setPeriodMode(m)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={icon}
                size={14}
                color={active ? "#00CEC8" : "#94A3B8"}
              />
              <Text
                className={`text-[13px] ${active ? "text-primary font-bold" : "text-slate-400 font-medium"}`}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Picker(s) */}
      {periodMode === "single" ? (
        <MonthPicker
          label="Select Month"
          value={singleMonth}
          onChange={setSingleMonth}
        />
      ) : (
        <View className="gap-4">
          <MonthPicker label="From" value={fromMonth} onChange={setFromMonth} />
          <View className="flex-row items-center gap-3">
            <View className="flex-1 h-px bg-slate-100" />
            <Ionicons name="arrow-forward" size={14} color="#CBD5E1" />
            <View className="flex-1 h-px bg-slate-100" />
          </View>
          <MonthPicker label="To" value={toMonth} onChange={setToMonth} />
        </View>
      )}
    </View>
  );

  const stepContent = [renderStep0, renderStep1, renderStep2];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View
          className="bg-white rounded-t-[32px]"
          style={{ maxHeight: "92%" }}
        >
          {/* Handle */}
          <View className="items-center pt-3">
            <View className="w-10 h-1 bg-slate-200 rounded-full" />
          </View>

          {/* Header */}
          <View className="flex-row justify-between items-center px-6 pt-4 pb-2">
            <View>
              <Text className="text-[20px] font-bold text-slate-900">
                Statement Request
              </Text>
              <Text className="text-[12px] text-slate-400 mt-0.5">
                Step {step + 1} of 3
              </Text>
            </View>
            <TouchableOpacity
              className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Step indicator */}
          <StepIndicator current={step} />

          {/* Step content */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 8 }}
          >
            {stepContent[step]()}
          </ScrollView>

          {/* Footer buttons */}
          <View
            className="px-5 pt-3 border-t border-slate-100 gap-3"
            style={{ paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }}
          >
            {step === 2 ? (
              <TouchableOpacity
                className={`rounded-2xl py-[15px] flex-row items-center justify-center gap-2 ${
                  canNext ? "bg-primary" : "bg-slate-300"
                }`}
                onPress={handleSubmit}
                activeOpacity={0.85}
                disabled={!canNext}
              >
                <Ionicons name="send-outline" size={18} color="#fff" />
                <Text className="text-white text-[15px] font-bold">Submit Request</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className={`rounded-2xl py-[15px] flex-row items-center justify-center gap-2 ${
                  canNext ? "bg-primary" : "bg-slate-300"
                }`}
                onPress={() => setStep((s) => s + 1)}
                activeOpacity={0.85}
                disabled={!canNext}
              >
                <Text className="text-white text-[15px] font-bold">Continue</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </TouchableOpacity>
            )}

            {step > 0 && (
              <TouchableOpacity
                className="items-center py-3"
                onPress={() => setStep((s) => s - 1)}
                activeOpacity={0.7}
              >
                <Text className="text-slate-400 font-semibold text-[14px]">
                  Back
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

// StyleSheet kept only for arrowBtn shadow (NativeWind doesn't support shadows)
const styles = StyleSheet.create({
  arrowBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0B1426",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
});
