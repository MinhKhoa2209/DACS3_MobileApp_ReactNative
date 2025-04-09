import React from 'react';
import { ScrollView, Text, View, Image, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { router, useLocalSearchParams } from 'expo-router';

import useFetch from '@/services/useFetch';
import { fetchMovieDetails, fetchMovieVideos } from '@/services/api';
import { icons } from '@/constants/icons';
import { Movie } from '@/interfaces/interfaces';

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">{value || 'N/A'}</Text>
  </View>
);

// Helper to safely join names
const getNames = (arr?: { name?: string }[]) => {
  if (!Array.isArray(arr)) return 'N/A';
  return arr
    .filter((item): item is { name: string } => !!item?.name)
    .map((item) => item.name)
    .join(', ') || 'N/A';
};

// Type for episode object
interface Episode {
  name: string;
  link_embed: string;
}

const MovieDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: movie } = useFetch<Movie>(() => fetchMovieDetails(id));
  const { data: videoSources } = useFetch<Episode[]>(() => fetchMovieVideos(id));

  const posterUrl = movie?.poster_url ;
  const episodes = Array.isArray(videoSources)
    ? videoSources.filter((ep) => ep?.link_embed && ep?.name)
    : [];
    console.log(posterUrl);

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Poster */}
        <Image source={{ uri: posterUrl }} className="w-full h-[550px]" resizeMode="stretch" />

        {/* Movie Info */}
        <View className="px-5 mt-5">
          <Text className="text-white text-xl font-bold">{movie?.name || 'Unknown Title'}</Text>

          <View className="flex-row items-center gap-x-3 mt-2">
            <Text className="text-white">{movie?.year || 'N/A'}</Text>
            <Text className="text-white">{movie?.time || 'N/A'}</Text>
            <Text className="text-white">{movie?.quality || 'N/A'}</Text>
          </View>

          <MovieInfo label="Original Title" value={movie?.origin_name} />
          <MovieInfo label="Genres" value={getNames(movie?.category)} />
          <MovieInfo label="Country" value={getNames(movie?.country)} />
          <MovieInfo label="Language" value={movie?.lang} />
          <MovieInfo label="Status" value={movie?.status} />
          <MovieInfo
            label="Episodes"
            value={
              movie?.episode_current && movie?.episode_total
                ? `${movie.episode_current}/${movie.episode_total}`
                : movie?.episode_current || movie?.episode_total || 'N/A'
            }
          />
        </View>

        {/* Trailer */}
          {movie?.trailer_url && (
            <View className="mt-5 px-5">
              <Text className="text-white text-lg font-bold mb-2">Trailer</Text>
              <View className="aspect-video h-[200px] w-full overflow-hidden rounded-lg ">
                <WebView
                  source={{ uri: movie.trailer_url }}
                  javaScriptEnabled
                  domStorageEnabled
                  allowsFullscreenVideo
                  mediaPlaybackRequiresUserAction={false}
              
                />
              </View>
            </View>
          )}

        {/* Episodes */}
        {episodes.length > 0 && (
          <View className="mt-5 px-5">
            <Text className="text-white text-lg font-bold mb-2">Watch Episodes</Text>
            <View className="flex flex-wrap flex-row gap-2">
              {episodes.map((ep, index) => (
                <TouchableOpacity
                  key={index}
                  className="bg-dark-100 px-3 py-2 rounded-md"
                  onPress={() =>
                    router.push({
                      pathname: '/movies/watch',
                      params: {
                        link: ep.link_embed,
                        title: `${movie?.name || ''} - ${ep.name}`,
                      },
                    })
                  }
                >
                  <Text className="text-white text-xs">{ep.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Back Button */}
      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={router.back}
      >
        <Image source={icons.arrow} className="size-5 mr-1 mt-0.5 rotate-180" tintColor="#fff" />
        <Text className="text-white font-semibold text-base">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MovieDetails;
