import { Ionicons } from "@expo/vector-icons";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  visible: boolean;
  onClose: () => void;
  onTryAgain: () => void;
};

export default function NotFoundModal({ visible, onClose, onTryAgain }: Props) {
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
          className="bg-white rounded-t-[32px] px-6 pt-4"
          style={{ paddingBottom: insets.bottom > 0 ? insets.bottom : 24 }}
        >
          {/* Handle */}
          <View className="items-center mb-6">
            <View className="w-10 h-1 bg-slate-200 rounded-full" />
          </View>

          {/* Icon + Message */}
          <View className="items-center mb-6">
            <View className="w-20 h-20 rounded-[28px] bg-red-50 items-center justify-center mb-4">
              <Ionicons name="search-outline" size={40} color="#EF4444" />
            </View>
            <Text className="text-[20px] font-bold text-slate-900 mb-2">
              Property Not Found
            </Text>
            <Text className="text-[13px] text-slate-400 text-center leading-5">
              We couldn&apos;t find a property matching the code you entered.
              {"\n"}Please check the code and try again.
            </Text>
          </View>

          {/* Tips */}
          <View className="bg-amber-50 rounded-2xl p-4 mb-6 gap-2">
            <View className="flex-row items-center gap-2 mb-1">
              <Ionicons
                name="information-circle-outline"
                size={16}
                color="#D97706"
              />
              <Text className="text-[12px] font-bold text-amber-700">Tips</Text>
            </View>
            {[
              "Make sure the ZIP or parcel code is correct",
              "Check your property tax notice for the correct code",
              "Contact your county office for further assistance",
            ].map((tip) => (
              <View key={tip} className="flex-row items-start gap-2">
                <View className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-[6px]" />
                <Text className="text-[12px] text-amber-700 flex-1">{tip}</Text>
              </View>
            ))}
          </View>

          {/* Actions */}
          <View className="gap-3">
            <TouchableOpacity
              className="bg-primary rounded-2xl py-4 items-center justify-center"
              onPress={onTryAgain}
              activeOpacity={0.85}
            >
              <Text className="text-white font-bold text-[15px]">
                Try Again
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-slate-100 rounded-2xl py-4 items-center justify-center"
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text className="text-slate-500 font-semibold text-[14px]">
                Enter Manually
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
