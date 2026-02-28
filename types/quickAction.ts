import { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";

export type QuickAction = {
  id: number;
  name: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  color: string;
  bg: string;
};
