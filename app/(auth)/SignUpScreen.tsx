import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { account } from "@/services/appwrite";
import { Entypo } from '@expo/vector-icons';

const SignUpScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password) {  
      Alert.alert("Error", "Please enter your email and password");
      return;
    }
  
    setLoading(true);
    try {
      const user = await account.create("unique()", email, password);
      console.log("User created:", user);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View className="flex-1 justify-center px-6 bg-primary">
      <Text className="text-center text-3xl font-bold text-white mb-6">Sign Up</Text>

      <Text className="text-gray-400">Email</Text>
      <TextInput
        className="border border-gray-600 p-3 rounded mb-4 text-white bg-[#1E1E1E]"
        placeholder="name@example.com"
        placeholderTextColor="gray"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text className="text-gray-400">Password</Text>
      <View className="border border-gray-600 p-3 rounded mb-4 flex-row items-center bg-[#1E1E1E]">
        <TextInput
          className="flex-1 text-white"
          placeholder="Enter your password"
          placeholderTextColor="gray"
          secureTextEntry={!isPasswordVisible}
          value={password}
          onChangeText={setPassword}
        />
          <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <Entypo name={isPasswordVisible ? "eye" : "eye-with-line"} size={24} color="gray" />
            </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="bg-blue-500 p-4 rounded w-full mb-4"
        onPress={handleSignUp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center font-medium">Sign Up</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(auth)/LoginScreen")}>
        <Text className="text-white text-center">
          Already have an account? <Text className="text-blue-400">Log In</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpScreen;
