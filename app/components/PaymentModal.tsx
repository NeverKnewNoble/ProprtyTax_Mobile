import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Property } from "../../types/property";
import { MobileNetwork, PaymentScreen, PaymentTab } from "../../types/payment";
import { mobileNetworks, properties } from "../../utils/sampleData";

type Props = {
  visible: boolean;
  onClose: () => void;
  initialProperty?: Property;
};

export default function PaymentModal({ visible, onClose, initialProperty }: Props) {
  const insets = useSafeAreaInsets();

  const [selectedProperty, setSelectedProperty] = useState<Property>(
    initialProperty ?? properties[0]
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [tab, setTab] = useState<PaymentTab>("mobile");
  const [screen, setScreen] = useState<PaymentScreen>("form");

  // Mobile money
  const [network, setNetwork] = useState<MobileNetwork | null>(null);
  const [networkPickerOpen, setNetworkPickerOpen] = useState(false);
  const [phone, setPhone] = useState("");

  // Card
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  // Sync when modal opens
  useEffect(() => {
    if (visible) {
      setSelectedProperty(initialProperty ?? properties[0]);
      setScreen("form");
      setTab("mobile");
      setPickerOpen(false);
      setNetwork(null);
      setNetworkPickerOpen(false);
      setPhone("");
      setCardNumber("");
      setExpiry("");
      setCvv("");
      setCardName("");
    }
  }, [visible, initialProperty]);

  const handleClose = () => {
    onClose();
  };

  const handlePay = () => {
    setScreen("processing");
    setTimeout(() => {
      setScreen(tab === "mobile" ? "pending" : "success");
    }, 1500);
  };

  const canPay =
    tab === "mobile"
      ? network !== null && phone.replace(/\D/g, "").length >= 10
      : cardNumber.replace(/\s/g, "").length === 16 &&
        expiry.length === 5 &&
        cvv.length >= 3 &&
        cardName.trim().length > 0;

  const formatCard = (t: string) =>
    t.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (t: string) => {
    const d = t.replace(/\D/g, "").slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };

  // ── Property picker ──────────────────────────────────────────────
  const renderPropertyPicker = () => (
    <View className="mb-5">
      <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
        Paying For
      </Text>
      <TouchableOpacity
        className={`flex-row items-center bg-slate-50 rounded-2xl px-4 py-3.5 border ${
          pickerOpen ? "border-primary" : "border-slate-100"
        }`}
        onPress={() => setPickerOpen((o) => !o)}
        activeOpacity={0.8}
      >
        <View className="flex-1">
          <Text className="text-[15px] font-bold text-slate-900">
            {selectedProperty.name}
          </Text>
          <Text className="text-[12px] text-slate-400">
            {selectedProperty.balance} due
          </Text>
        </View>
        <Ionicons
          name={pickerOpen ? "chevron-up" : "chevron-down"}
          size={16}
          color="#94A3B8"
        />
      </TouchableOpacity>

      {pickerOpen && (
        <View
          className="mt-1 bg-white rounded-2xl overflow-hidden border border-slate-100"
          style={styles.dropdownShadow}
        >
          {properties.map((prop, i) => {
            const active = prop.id === selectedProperty.id;
            return (
              <TouchableOpacity
                key={prop.id}
                className={`flex-row items-center px-4 py-3 ${
                  i < properties.length - 1 ? "border-b border-slate-100" : ""
                } ${active ? "bg-[#F0FFFE]" : ""}`}
                onPress={() => {
                  setSelectedProperty(prop);
                  setPickerOpen(false);
                }}
                activeOpacity={0.7}
              >
                <View className="flex-1">
                  <Text
                    className={`text-[14px] font-semibold ${
                      active ? "text-primary" : "text-slate-900"
                    }`}
                  >
                    {prop.name}
                  </Text>
                  <Text className="text-[11px] text-slate-400">
                    {prop.due === "Paid" ? "Paid ✓" : `${prop.balance} due`}
                  </Text>
                </View>
                {active && <Ionicons name="checkmark" size={16} color="#00CEC8" />}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );

  // ── Amount card ──────────────────────────────────────────────────
  const renderAmount = () => (
    <View className="bg-[#0B1426] rounded-2xl px-5 py-4 mb-5 flex-row items-center justify-between">
      <View>
        <Text className="text-[10px] text-white/40 font-bold tracking-widest mb-1">
          AMOUNT DUE
        </Text>
        <Text className="text-[30px] font-extrabold text-white">
          {selectedProperty.balance}
        </Text>
      </View>
      <View
        className={`px-3 py-1.5 rounded-full ${
          selectedProperty.due === "Paid"
            ? "bg-green-500/20"
            : "bg-amber-400/20"
        }`}
      >
        <Text
          className={`text-[11px] font-bold ${
            selectedProperty.due === "Paid" ? "text-green-400" : "text-amber-300"
          }`}
        >
          {selectedProperty.due}
        </Text>
      </View>
    </View>
  );

  // ── Tab switcher ─────────────────────────────────────────────────
  const renderTabs = () => (
    <View className="flex-row bg-slate-100 rounded-2xl p-1 mb-5">
      {(["mobile", "card"] as PaymentTab[]).map((t) => {
        const active = tab === t;
        const icon = t === "mobile" ? "phone-portrait" : "card";
        const label = t === "mobile" ? "Mobile Money" : "Card";
        return (
          <TouchableOpacity
            key={t}
            className={`flex-1 py-2.5 rounded-xl flex-row items-center justify-center gap-2 ${
              active ? "bg-white" : ""
            }`}
            style={active ? styles.tabShadow : undefined}
            onPress={() => setTab(t)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={icon}
              size={15}
              color={active ? "#0B1426" : "#94A3B8"}
            />
            <Text
              className={`text-[13px] font-bold ${
                active ? "text-slate-900" : "text-slate-400"
              }`}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  // ── Mobile Money form ────────────────────────────────────────────
  const selectedNet = mobileNetworks.find((n) => n.id === network) ?? null;

  const renderMobile = () => (
    <View className="gap-4">
      {/* Network select */}
      <View>
        <Text className="text-[12px] font-bold text-slate-500 mb-2">
          Select Network
        </Text>

        {/* Trigger */}
        <TouchableOpacity
          className={`flex-row items-center h-14 px-4 bg-slate-50 rounded-2xl border ${
            networkPickerOpen ? "border-primary" : "border-slate-100"
          }`}
          onPress={() => setNetworkPickerOpen((o) => !o)}
          activeOpacity={0.8}
        >
          {selectedNet ? (
            <>
              {/* Colour dot */}
              <View
                className="w-2.5 h-2.5 rounded-full mr-3"
                style={{ backgroundColor: selectedNet.color }}
              />
              <Text className="flex-1 text-[15px] font-semibold text-slate-900">
                {selectedNet.label}
              </Text>
            </>
          ) : (
            <Text className="flex-1 text-[15px] text-slate-300">
              Choose a network…
            </Text>
          )}
          <Ionicons
            name={networkPickerOpen ? "chevron-up" : "chevron-down"}
            size={16}
            color="#94A3B8"
          />
        </TouchableOpacity>

        {/* Dropdown options */}
        {networkPickerOpen && (
          <View
            className="mt-1 bg-white rounded-2xl overflow-hidden border border-slate-100"
            style={styles.dropdownShadow}
          >
            {mobileNetworks.map((net, i) => {
              const active = network === net.id;
              return (
                <TouchableOpacity
                  key={net.id}
                  className={`flex-row items-center px-4 py-3.5 ${
                    i < mobileNetworks.length - 1 ? "border-b border-slate-100" : ""
                  } ${active ? "bg-[#F0FFFE]" : ""}`}
                  onPress={() => {
                    setNetwork(net.id);
                    setNetworkPickerOpen(false);
                  }}
                  activeOpacity={0.7}
                >
                  {/* Colour dot */}
                  <View
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: net.color }}
                  />
                  <Text
                    className={`flex-1 text-[14px] font-semibold ${
                      active ? "text-primary" : "text-slate-900"
                    }`}
                  >
                    {net.label}
                  </Text>
                  {active && (
                    <Ionicons name="checkmark" size={16} color="#00CEC8" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      {/* Phone number */}
      <View>
        <Text className="text-[12px] font-bold text-slate-500 mb-2">
          Mobile Number
        </Text>
        <TextInput
          className="h-14 px-4 bg-slate-50 rounded-2xl text-slate-900 text-[15px] border border-slate-100"
          placeholder="e.g. 024 XXX XXXX"
          placeholderTextColor="#CBD5E1"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          maxLength={15}
        />
      </View>
    </View>
  );

  // ── Card form ────────────────────────────────────────────────────
  const renderCard = () => (
    <View className="gap-4">
      <View>
        <Text className="text-[12px] font-bold text-slate-500 mb-2">
          Card Number
        </Text>
        <TextInput
          className="h-14 px-4 bg-slate-50 rounded-2xl text-slate-900 text-[16px] border border-slate-100 tracking-widest"
          placeholder="XXXX XXXX XXXX XXXX"
          placeholderTextColor="#CBD5E1"
          keyboardType="number-pad"
          value={cardNumber}
          onChangeText={(t) => setCardNumber(formatCard(t))}
          maxLength={19}
        />
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1">
          <Text className="text-[12px] font-bold text-slate-500 mb-2">Expiry</Text>
          <TextInput
            className="h-14 px-4 bg-slate-50 rounded-2xl text-slate-900 text-[15px] border border-slate-100"
            placeholder="MM/YY"
            placeholderTextColor="#CBD5E1"
            keyboardType="number-pad"
            value={expiry}
            onChangeText={(t) => setExpiry(formatExpiry(t))}
            maxLength={5}
          />
        </View>
        <View className="flex-1">
          <Text className="text-[12px] font-bold text-slate-500 mb-2">CVV</Text>
          <TextInput
            className="h-14 px-4 bg-slate-50 rounded-2xl text-slate-900 text-[15px] border border-slate-100"
            placeholder="XXX"
            placeholderTextColor="#CBD5E1"
            keyboardType="number-pad"
            secureTextEntry
            value={cvv}
            onChangeText={(t) => setCvv(t.replace(/\D/g, "").slice(0, 4))}
            maxLength={4}
          />
        </View>
      </View>

      <View>
        <Text className="text-[12px] font-bold text-slate-500 mb-2">
          Cardholder Name
        </Text>
        <TextInput
          className="h-14 px-4 bg-slate-50 rounded-2xl text-slate-900 text-[15px] border border-slate-100"
          placeholder="Name on card"
          placeholderTextColor="#CBD5E1"
          autoCapitalize="words"
          value={cardName}
          onChangeText={setCardName}
        />
      </View>
    </View>
  );

  // ── Processing ───────────────────────────────────────────────────
  const renderProcessing = () => (
    <View className="items-center py-16">
      <ActivityIndicator size="large" color="#00CEC8" />
      <Text className="text-[17px] font-bold text-slate-900 mt-6 mb-1">
        Processing Payment
      </Text>
      <Text className="text-[13px] text-slate-400">Please wait...</Text>
    </View>
  );

  // ── Pending (mobile money awaiting approval) ─────────────────────
  const renderPending = () => (
    <View className="items-center py-8 px-2">
      <View className="w-24 h-24 rounded-full bg-amber-100 items-center justify-center mb-5">
        <Ionicons name="hourglass-outline" size={44} color="#F59E0B" />
      </View>
      <Text className="text-[22px] font-extrabold text-slate-900 mb-2 text-center">
        Check Your Phone
      </Text>
      <Text className="text-[13px] text-slate-400 text-center leading-5 mb-1">
        A payment request has been sent to
      </Text>
      <Text className="text-[16px] font-bold text-slate-900 mb-5">{phone}</Text>

      <View className="bg-amber-50 rounded-2xl px-4 py-3.5 w-full flex-row items-start gap-3 mb-6">
        <Ionicons name="information-circle-outline" size={18} color="#F59E0B" style={{ marginTop: 1 }} />
        <Text className="text-[12px] text-amber-700 font-medium flex-1 leading-5">
          Open your mobile money app and approve the request to complete your payment of{" "}
          <Text className="font-bold">{selectedProperty.balance}</Text>
        </Text>
      </View>

      <TouchableOpacity
        className="bg-primary rounded-2xl py-4 w-full items-center mb-3"
        onPress={() => setScreen("success")}
        activeOpacity={0.85}
      >
        <Text className="text-white font-bold text-[15px]">
          I've Approved the Request ✓
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="py-3 w-full items-center"
        onPress={() => setScreen("failed")}
        activeOpacity={0.7}
      >
        <Text className="text-slate-400 text-[13px] font-medium">
          Didn't receive a prompt?
        </Text>
      </TouchableOpacity>
    </View>
  );

  // ── Success ──────────────────────────────────────────────────────
  const renderSuccess = () => (
    <View className="items-center py-8 px-2">
      <View className="w-24 h-24 rounded-full bg-green-100 items-center justify-center mb-5">
        <Ionicons name="checkmark-circle" size={52} color="#22C55E" />
      </View>
      <Text className="text-[22px] font-extrabold text-slate-900 mb-2">
        Payment Successful!
      </Text>
      <Text className="text-[13px] text-slate-400 text-center leading-5 mb-6">
        {selectedProperty.balance} has been paid for{"\n"}
        {selectedProperty.name}
      </Text>

      <View className="bg-slate-50 rounded-2xl w-full px-4 py-2 mb-6">
        {[
          { label: "Property", value: selectedProperty.name },
          { label: "Amount Paid", value: selectedProperty.balance },
          {
            label: "Method",
            value:
              tab === "mobile"
                ? `Mobile Money · ${mobileNetworks.find((n) => n.id === network)?.label ?? ""}`
                : "Card Payment",
          },
        ].map((row, i, arr) => (
          <View
            key={row.label}
            className={`flex-row justify-between py-3 ${
              i < arr.length - 1 ? "border-b border-slate-100" : ""
            }`}
          >
            <Text className="text-[13px] text-slate-400">{row.label}</Text>
            <Text className="text-[13px] font-semibold text-slate-900">
              {row.value}
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        className="bg-primary rounded-2xl py-4 w-full items-center"
        onPress={handleClose}
        activeOpacity={0.85}
      >
        <Text className="text-white font-bold text-[16px]">Done</Text>
      </TouchableOpacity>
    </View>
  );

  // ── Failed ───────────────────────────────────────────────────────
  const renderFailed = () => (
    <View className="items-center py-8 px-2">
      <View className="w-24 h-24 rounded-full bg-red-100 items-center justify-center mb-5">
        <Ionicons name="close-circle" size={52} color="#EF4444" />
      </View>
      <Text className="text-[22px] font-extrabold text-slate-900 mb-2">
        Payment Failed
      </Text>
      <Text className="text-[13px] text-slate-400 text-center leading-5 mb-6">
        We couldn't process your payment.{"\n"}Please check your details and try again.
      </Text>

      <View className="bg-red-50 rounded-2xl w-full px-4 py-3.5 flex-row items-start gap-3 mb-6">
        <Ionicons name="alert-circle-outline" size={18} color="#EF4444" style={{ marginTop: 1 }} />
        <Text className="text-[12px] text-red-600 font-medium flex-1 leading-5">
          If any funds were deducted, they will be refunded within 3–5 business days.
        </Text>
      </View>

      <TouchableOpacity
        className="bg-primary rounded-2xl py-4 w-full items-center mb-3"
        onPress={() => setScreen("form")}
        activeOpacity={0.85}
      >
        <Text className="text-white font-bold text-[16px]">Try Again</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="py-3 w-full items-center"
        onPress={handleClose}
        activeOpacity={0.7}
      >
        <Text className="text-slate-400 font-semibold text-[14px]">Close</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View className="bg-white rounded-t-[32px]" style={{ maxHeight: "95%" }}>

            {/* Handle */}
            <View className="items-center pt-3 pb-1">
              <View className="w-10 h-1 bg-slate-200 rounded-full" />
            </View>

            {/* Header */}
            <View className="flex-row items-center justify-between px-6 pt-3 pb-4 border-b border-slate-100">
              {screen === "form" ? (
                <View className="flex-1">
                  <Text className="text-[20px] font-bold text-slate-900">Pay Tax</Text>
                  <Text className="text-[12px] text-slate-400 mt-0.5">Secure payment</Text>
                </View>
              ) : (
                <View className="flex-1" />
              )}
              <TouchableOpacity
                className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
                onPress={handleClose}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingTop: 20,
                paddingBottom: insets.bottom > 0 ? insets.bottom + 16 : 24,
              }}
            >
              {screen === "processing" && renderProcessing()}
              {screen === "pending"    && renderPending()}
              {screen === "success"    && renderSuccess()}
              {screen === "failed"     && renderFailed()}

              {screen === "form" && (
                <>
                  {renderPropertyPicker()}
                  {renderAmount()}
                  {renderTabs()}
                  {tab === "mobile" ? renderMobile() : renderCard()}

                  <TouchableOpacity
                    className={`mt-6 rounded-2xl py-4 flex-row items-center justify-center gap-2 ${
                      canPay ? "bg-primary" : "bg-slate-200"
                    }`}
                    onPress={handlePay}
                    disabled={!canPay}
                    activeOpacity={0.85}
                  >
                    <Ionicons
                      name={tab === "mobile" ? "phone-portrait" : "card"}
                      size={18}
                      color={canPay ? "#fff" : "#94A3B8"}
                    />
                    <Text
                      className={`font-bold text-[16px] ${
                        canPay ? "text-white" : "text-slate-400"
                      }`}
                    >
                      Pay {selectedProperty.balance}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dropdownShadow: {
    shadowColor: "#0B1426",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  tabShadow: {
    shadowColor: "#0B1426",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
});
