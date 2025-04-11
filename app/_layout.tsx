import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useGlobalContext } from '@/app/(auth)/AuthContext';
import GlobalProvider from '@/app/(auth)/AuthContext';
import "./globals.css";

const RootLayoutInner = () => {
  const { loading, isLogged } = useGlobalContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isLogged) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/LoginScreen');
      }
    }
  }, [loading, isLogged, router]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-primary">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#AB8BFF" />
          <Text className="mt-4 text-dark-100">Checking your session...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
      <Stack screenOptions={{ headerShown: false }}></Stack>
  );
};

const RootLayout = () => {
  return (
    <GlobalProvider>
      <StatusBar hidden={true} />
      <RootLayoutInner />
    </GlobalProvider>
  );
};


export default RootLayout;
