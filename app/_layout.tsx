import { UserProvider } from "@/contexts/UserContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="pages/auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="pages/auth/signup" options={{ headerShown: false }} />
        <Stack.Screen name="pages/home" options={{ headerShown: false }} />
        <Stack.Screen name="pages/property" options={{ headerShown: false }} />
        <Stack.Screen name="pages/transactions" options={{ headerShown: false }} />
        <Stack.Screen name="pages/settings" options={{ headerShown: false }} />
        <Stack.Screen name="pages/add_property/add_property" options={{ headerShown: false }} />
      </Stack>
    </UserProvider>
  );
}
