import { UserProperty } from "@/types/property";

export type GetPropertiesResult =
  | { success: true; properties: UserProperty[] }
  | { success: false; message: string };
