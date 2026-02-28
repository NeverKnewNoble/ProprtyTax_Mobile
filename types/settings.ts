import { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";

export type SettingsItem = {
  label: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  color: string;
};

export type SettingsGroup = {
  section: string;
  items: SettingsItem[];
};

export type ProfileRow = {
  icon: string;
  label: string;
  value: string;
};
