import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export default function PropertyEmptyState() {
  return (
    <View className="flex-1 items-center justify-center px-10">
      <View className="w-24 h-24 rounded-[28px] bg-slate-100 items-center justify-center mb-5">
        <Ionicons name="business-outline" size={44} color="#CBD5E1" />
      </View>
      <Text className="text-[20px] font-bold text-slate-900 mb-2">No Properties</Text>
      <Text className="text-[14px] text-slate-400 text-center leading-5 mb-8">
        You haven&apos;t added any properties yet.{"\n"}Add your first to get started.
      </Text>
      <TouchableOpacity
        className="bg-primary flex-row items-center gap-2 px-7 py-3.5 rounded-full"
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={18} color="#fff" />
        <Text className="text-white font-bold text-[14px]">Add Property</Text>
      </TouchableOpacity>
    </View>
  );
}
