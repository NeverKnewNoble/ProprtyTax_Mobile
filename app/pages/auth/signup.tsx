import { Signup } from "@/utils/frappe_services/signup";
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

export default function SignupScreen() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    if (!fullName || !phone || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const result = await Signup({
        full_name: fullName,
        phone: parseInt(phone),
        email,
        password,
      });

      Alert.alert("Success", result.message || "Sign Up successful");
      
      // Navigate to home page after successful login
      router.push("/pages/home");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Sign Up failed");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View className="flex-1 px-6 py-8">
        <View className="flex-1 justify-center">
          {/* Sign Up Title */}
          <Text className="text-6xl font-bold text-black text-left">
            Sign Up
          </Text>

          <Text className="text-xl text-gray-600 mb-16 text-left">
            Create your account to get started
          </Text>

          {/* Full Name Input */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-black mb-2">
              Full Name
            </Text>
            <TextInput
              className="w-full h-12 px-4 bg-gray-50 rounded-lg border border-gray-200 text-black focus:border-primary"
              placeholder="Enter your full name"
              placeholderTextColor="#9CA3AF"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>

          {/* Phone Input */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-black mb-2">Phone</Text>
            <TextInput
              className="w-full h-12 px-4 bg-gray-50 rounded-lg border border-gray-200 text-black focus:border-primary"
              placeholder="Enter your phone number"
              placeholderTextColor="#9CA3AF"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

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
              placeholder="Create a password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            onPress={handleSignup}
            className="w-full h-14 bg-primary rounded-full items-center justify-center mb-6"
          >
            <Text className="text-white font-bold text-base">Sign Up</Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View className="flex-row justify-center">
            <Text className="text-gray-600 text-sm">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity>
              <Text
                onPress={() => router.push("/pages/auth/login")}
                className="text-primary font-semibold text-sm"
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
