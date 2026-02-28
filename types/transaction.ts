import { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";

export type Transaction = {
  id: number;
  property: string;
  amount: string;
  date: string;
  type: "Payment" | "Statement";
  icon: ComponentProps<typeof Ionicons>["name"];
  color: string;
  bg: string;
};
