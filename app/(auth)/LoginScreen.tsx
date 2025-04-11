import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert } from "react-native";
import { useGlobalContext } from "@/app/(auth)/AuthContext"; 
import { account } from "@/services/appwrite";  
import { icons } from "@/constants/icons";  
import { Entypo } from '@expo/vector-icons';
import { login } from "@/services/auth";  
import { useRouter } from "expo-router";


const LoginScreen = () => {
  const router = useRouter();
  const { loading, refetch } = useGlobalContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }
    try {
      const session = await account.createEmailPasswordSession(email, password);
      if (session) {
        await refetch(); 
      } else {
        console.log("Session creation failed");
      }
    } catch (error) {
      console.error("Login failed:", error);
      Alert.alert("Error", "Login failed. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    const loginSuccess = await login();  
    if (loginSuccess) {
      console.log("Logged in successfully with Google");
      await refetch();  
    } else {
      Alert.alert("Google login failed", "Something went wrong during Google login.");
    }
  };
  

  return (
    <View className="flex-1 justify-center px-6 bg-black">
     <View className="flex-row items-center justify-center mt-16 mb-10 gap-x-2">
      <Image
        source={icons.logo}
        className="w-14 h-14"
        resizeMode="contain"
      />
       <Text className="text-5xl font-bold text-white leading-[65px]">POPFLIX</Text>
    </View>
    <Text className="text-white">Email</Text>
    <TextInput 
      className="border border-gray-600 p-3 rounded mb-4 text-white bg-white/10 h-14"
      placeholder="name@example.com"
      placeholderTextColor="gray"
      value={email}
      onChangeText={setEmail}
      keyboardType="email-address"
      autoCapitalize="none"
    />

    <Text className="text-white">Password</Text>
    <View className="flex-row items-center border border-gray-600 px-3 rounded mb-4 bg-white/10 h-14">
      <TextInput
        className="flex-1 text-base text-white"
        placeholder="Enter your password"
        placeholderTextColor="gray"
        secureTextEntry={!isPasswordVisible}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
        <Entypo
          name={isPasswordVisible ? "eye" : "eye-with-line"}
          size={22}
          color="gray"
        />
      </TouchableOpacity>
    </View>

      <TouchableOpacity 
        className="bg-blue-500 p-4 mt-5 rounded w-full mb-4"
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center font-medium">Login</Text>
        )}
      </TouchableOpacity>

      <View className="flex-row items-center my-4">
        <View className="flex-1 h-px bg-gray-600" />
        <Text className="mx-2 text-gray-400">OR</Text>
        <View className="flex-1 h-px bg-gray-600" />
      </View>

      <TouchableOpacity 
        className="border border-gray-600 p-4 rounded flex-row items-center justify-center mb-4 bg-white/10"
        onPress={handleGoogleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#0000ff" />
        ) : (
          <>
            <Image source={icons.google} className="w-6 h-6 mr-2 " />
            <Text className="text-white text-center">Login with Google</Text>
          </>
        )}
      </TouchableOpacity>

      <View className="mt-4 flex-row justify-center">
        <Text className="text-white">Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/(auth)/SignUpScreen")}>
          <Text className="text-blue-400 font-semibold">Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
