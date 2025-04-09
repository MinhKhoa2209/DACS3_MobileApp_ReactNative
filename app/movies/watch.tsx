import { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useLocalSearchParams, router } from 'expo-router';
import { icons } from '@/constants/icons';

const WatchScreen = () => {
  const { link, title } = useLocalSearchParams();

  useEffect(() => {
    ScreenOrientation.unlockAsync();

    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  return (
    <View className="flex-1 bg-black">
      <View className="flex-row items-center justify-between px-4 py-3 bg-dark-100 z-10">
        <TouchableOpacity onPress={router.back} className="flex-row items-center gap-x-1">
          <Image source={icons.arrow} className="size-5 rotate-180" tintColor="#fff" />
          <Text className="text-white font-semibold text-base">Back</Text>
        </TouchableOpacity>
        <Text className="text-white text-sm font-medium" numberOfLines={1}>
          {title}
        </Text>
      </View>

      <WebView
        source={{ uri: link as string }}
        style={{ flex: 1 }}
        allowsFullscreenVideo
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
};

export default WatchScreen;
