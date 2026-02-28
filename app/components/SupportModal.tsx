import { Ionicons } from "@expo/vector-icons";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { contactInfo } from "../../utils/sampleData";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function SupportModal({ visible, onClose }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View
          className="bg-white rounded-t-[32px]"
          style={{ paddingBottom: insets.bottom > 0 ? insets.bottom : 24 }}
        >
          {/* Handle */}
          <View className="items-center pt-3 pb-1">
            <View className="w-10 h-1 bg-slate-200 rounded-full" />
          </View>

          {/* Header */}
          <View className="flex-row items-start justify-between px-6 pt-4 pb-5">
            <View className="flex-1 pr-4">
              <Text className="text-[20px] font-bold text-slate-900 mb-1">
                Contact Us
              </Text>
              <Text className="text-[13px] text-slate-400 leading-5">
                Reach us through any of the channels below.
              </Text>
            </View>
            <TouchableOpacity
              className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Contact info rows */}
          <View className="mx-5 bg-[#F8FAFC] rounded-2xl overflow-hidden">
            {contactInfo.map((item, i) => (
              <View
                key={item.id}
                className={`flex-row items-center px-4 py-3.5 gap-3 ${
                  i < contactInfo.length - 1 ? "border-b border-[#F1F5F9]" : ""
                }`}
              >
                {/* Icon */}
                <View
                  className="w-9 h-9 rounded-[10px] items-center justify-center shrink-0"
                  style={{ backgroundColor: item.bg }}
                >
                  <Ionicons name={item.icon as any} size={17} color={item.color} />
                </View>

                {/* Label + value */}
                <View className="flex-1">
                  <Text className="text-[11px] text-slate-400 font-medium mb-0.5">
                    {item.label}
                  </Text>
                  <Text className="text-[13px] font-semibold text-slate-900">
                    {item.value}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Office hours */}
          <View className="mx-5 mt-4 rounded-2xl bg-[#E6FAFA] flex-row items-center gap-3 px-4 py-3.5">
            <Ionicons name="time-outline" size={18} color="#00CEC8" />
            <Text className="text-[12px] text-[#00858080] font-medium flex-1 leading-5">
              Office hours: Mon – Fri, 8:00 AM – 6:00 PM EST
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
