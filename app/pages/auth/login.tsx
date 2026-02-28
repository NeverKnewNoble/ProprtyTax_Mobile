import { useUser } from "@/contexts/UserContext";
import { Login } from "@/utils/frappe_services/login";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUser();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const result = await Login({ email, password });

      console.log("Login result:", result);

      const userData = {
        email: result.user?.email ?? email,
        name: result.user?.name ?? email,
        first_name: result.user?.first_name ?? "",
        last_name: result.user?.last_name ?? "",
        username: result.user?.username ?? email,
      };

      console.log("User context set with:", userData);
      setUser(userData);

      router.push("/pages/home");
    } catch (error: any) {
      console.log("Login error:", error);
      Alert.alert("Error", error.message || "Login failed");
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert("Google Login", "Google login functionality to be implemented");
  };

  const handleAppleLogin = () => {
    Alert.alert("Apple Login", "Apple login functionality to be implemented");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View className="flex-1 px-6 py-8">
        {/* Intro Text */}
        <View className="flex-1 justify-center">
          <Text className="text-5xl font-bold text-black">Welcome Back</Text>
          <Text className="text-xl text-gray-600 mb-16">
            Sign in to continue to your account
          </Text>

          {/* Email Input */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-black mb-2">Email</Text>
            <TextInput
              className="w-full h-12 px-4 bg-gray-50 rounded-lg border border-gray-200 text-black focus:border-primary"
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View className="mb-8">
            <Text className="text-sm font-medium text-black mb-2">
              Password
            </Text>
            <TextInput
              className="w-full h-12 px-4 bg-gray-50 rounded-lg border border-gray-200 text-black focus:border-primary"
              placeholder="Enter your password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            className="w-full h-14 bg-primary rounded-full items-center justify-center mb-6"
          >
            <Text className="text-white font-bold text-base">Login</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="px-4 text-gray-500 text-sm">OR</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Continue with Google Button */}
          <TouchableOpacity
            onPress={handleGoogleLogin}
            className="w-full h-14 bg-white border border-gray-300 rounded-full flex-row items-center justify-center mb-4"
          >
            <Ionicons name="logo-google" size={20} color="#4285F4" />
            <Text className="ml-3 text-black font-medium text-base">
              Continue with Google
            </Text>
          </TouchableOpacity>

          {/* Continue with Apple ID Button */}
          <TouchableOpacity
            onPress={handleAppleLogin}
            className="w-full h-14 bg-black rounded-full flex-row items-center justify-center mb-8"
          >
            <Ionicons name="logo-apple" size={20} color="white" />
            <Text className="ml-3 text-white font-medium text-base">
              Continue with Apple ID
            </Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View className="flex-row justify-center">
            <Text className="text-gray-600 text-sm">
              Don&apos;t have an account?{" "}
            </Text>
            <TouchableOpacity>
              <Text
                onPress={() => router.push("/pages/auth/signup")}
                className="text-primary font-semibold text-sm"
              >
                Sign Up
              </Text>
              {/* <Text
                onPress={() => router.push("/pages/home")}
                className="text-primary font-semibold text-sm"
              >
                Home
              </Text> */}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
