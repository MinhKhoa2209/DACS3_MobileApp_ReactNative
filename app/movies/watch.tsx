import { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useLocalSearchParams, router } from 'expo-router';
import { icons } from '@/constants/icons';

const WatchScreen = () => {
  const { link, title, episodes, index } = useLocalSearchParams<{
    link: string;
    title: string;
    index: string;
    episodes: string;
  }>();

  const episodeList = JSON.parse(episodes || '[]');
  const currentIndex = parseInt(index || '0');

  useEffect(() => {
    ScreenOrientation.unlockAsync();
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);


  return (
    <View className="flex-1 bg-primary">
      <View className="flex-row items-center justify-between px-4 py-5 bg-dark-100 z-10">
        <TouchableOpacity
          onPress={router.back}
          className="flex-row items-center gap-x-2 bg-white/10 px-3 py-2 rounded-lg active:scale-95"
        >
          <Image source={icons.arrow} className="size-5 rotate-180" tintColor="#fff" />
          <Text className="text-white font-bold text-base">Back</Text>
        </TouchableOpacity>

        <Text className="text-white text-base font-bold flex-1 text-right" numberOfLines={1}>
          {title}
        </Text>

        <View className="w-20" /> 
      </View>

      {/* WebView */}
      <WebView
        source={{ uri: link as string }}
        style={{ flex: 1 }}
        allowsFullscreenVideo
        mediaPlaybackRequiresUserAction={false}
      />

      {/* Episode Controls */}
      <View className="flex-row justify-between items-center px-6 py-5 bg-dark-100">
        {currentIndex > 0 ? (
          <TouchableOpacity
            onPress={() => {
              const prev = episodeList[currentIndex - 1];
              if (prev) {
                router.replace({
                  pathname: '/movies/watch',
                  params: {
                    link: prev.link_embed,
                    title: prev.name,
                    index: (currentIndex - 1).toString(),
                    episodes: JSON.stringify(episodeList),
                  },
                });
              }
            }}
       className="bg-white/10 px-4 py-3 w-30 rounded-lg active:scale-95 mb-10 "
          >
            <Text className="text-white text-base font-semibold ">← Previous</Text>
          </TouchableOpacity>
        ) : (
          <View className="w-[110px]" /> 
        )}

        {currentIndex < episodeList.length - 1 && (
          <TouchableOpacity
            onPress={() => {
              const next = episodeList[currentIndex + 1];
              if (next) {
                router.replace({
                  pathname: '/movies/watch',
                  params: {
                    link: next.link_embed,
                    title: next.name,
                    index: (currentIndex + 1).toString(),
                    episodes: JSON.stringify(episodeList),
                  },
                });
              }
            }}
            className="bg-white/10 px-4 py-3 w-30 rounded-lg active:scale-95 mb-10 "
          >
            <Text className="text-white text-base font-semibold">Next →</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default WatchScreen;
