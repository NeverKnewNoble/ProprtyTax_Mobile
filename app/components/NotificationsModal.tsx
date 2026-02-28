import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Notification } from "../../types/notification";
import { notificationTypeMeta, sampleNotifications } from "../../utils/sampleData";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function NotificationsModal({ visible, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] =
    useState<Notification[]>(sampleNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id: number) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const hasNotifications = notifications.length > 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-[32px]" style={{ maxHeight: "88%" }}>

          {/* Handle */}
          <View className="items-center pt-3 pb-1">
            <View className="w-10 h-1 bg-slate-200 rounded-full" />
          </View>

          {/* Header */}
          <View className="flex-row items-center px-6 pt-3 pb-4">
            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <Text className="text-[20px] font-bold text-slate-900">
                  Notifications
                </Text>
                {unreadCount > 0 && (
                  <View className="bg-[#FF4757] rounded-full min-w-[20px] h-5 px-1.5 items-center justify-center">
                    <Text className="text-white text-[11px] font-bold">
                      {unreadCount}
                    </Text>
                  </View>
                )}
              </View>
              {unreadCount > 0 && (
                <Text className="text-[12px] text-slate-400 mt-0.5">
                  {unreadCount} unread message{unreadCount > 1 ? "s" : ""}
                </Text>
              )}
            </View>

            {unreadCount > 0 && (
              <TouchableOpacity
                className="mr-3 py-1.5 px-3 bg-[#E6FAFA] rounded-xl"
                onPress={markAllRead}
                activeOpacity={0.7}
              >
                <Text className="text-primary text-[12px] font-bold">
                  Mark all read
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View className="h-px bg-slate-100 mx-6" />

          {/* Content */}
          {hasNotifications ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingTop: 12,
                paddingBottom: insets.bottom > 0 ? insets.bottom + 8 : 24,
              }}
            >
              {notifications.map((notif, i) => {
                const meta = notificationTypeMeta[notif.type];
                return (
                  <TouchableOpacity
                    key={notif.id}
                    className={`flex-row items-center py-[14px] ${
                      !notif.read ? "bg-[#FAFEFF]" : ""
                    } ${
                      i < notifications.length - 1 ? "border-b border-[#F1F5F9]" : ""
                    }`}
                    activeOpacity={0.7}
                    onPress={() => markRead(notif.id)}
                  >
                    {/* Icon */}
                    <View
                      className="w-11 h-11 rounded-2xl items-center justify-center shrink-0"
                      style={{ backgroundColor: meta.bg }}
                    >
                      <Ionicons
                        name={meta.icon as any}
                        size={20}
                        color={meta.color}
                      />
                    </View>

                    {/* Text */}
                    <View className="flex-1 mx-3">
                      <Text
                        className={`text-[14px] text-slate-900 mb-0.5 ${
                          notif.read ? "font-medium" : "font-bold"
                        }`}
                        numberOfLines={1}
                      >
                        {notif.title}
                      </Text>
                      <Text
                        className="text-[12px] text-slate-400 leading-[18px]"
                        numberOfLines={2}
                      >
                        {notif.body}
                      </Text>
                    </View>

                    {/* Time + unread dot */}
                    <View className="items-end gap-2">
                      <Text className="text-[11px] text-slate-400">
                        {notif.time}
                      </Text>
                      {!notif.read && (
                        <View className="w-2 h-2 rounded-full bg-[#FF4757]" />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          ) : (
            /* ── Empty state ── */
            <View
              className="items-center justify-center px-10"
              style={{
                paddingTop: 56,
                paddingBottom: insets.bottom > 0 ? insets.bottom + 32 : 64,
              }}
            >
              <View className="w-20 h-20 rounded-full bg-slate-100 items-center justify-center mb-5">
                <Ionicons name="notifications-off-outline" size={36} color="#CBD5E1" />
              </View>
              <Text className="text-[18px] font-bold text-slate-900 mb-2 text-center">
                No Notifications
              </Text>
              <Text className="text-[13px] text-slate-400 text-center leading-5">
                You're all caught up! We'll let you know when something new arrives.
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
