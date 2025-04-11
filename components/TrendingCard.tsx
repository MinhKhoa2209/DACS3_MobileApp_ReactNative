import { TouchableOpacity, Image, View, Text} from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { images } from '@/constants/images'
import MaskedView from "@react-native-masked-view/masked-view";
import { TrendingCardProps } from '@/interfaces/interfaces';

const buildImageUrl = (path?: string): string => {
    if (!path) return 'https://placehold.co/300x450';
    return path.startsWith('http') ? path : `https://phimimg.com/${path}`;
  };

  
const TrendingCard = ({movie : {movie_id,title, poster_url}, index}: TrendingCardProps) => {
    const imageUrl = buildImageUrl(poster_url );
  return (
   <Link href={`/movies/${movie_id}`} asChild> 
        <TouchableOpacity className=" w-32 relative pl-5">
            <Image source = {{uri: imageUrl}} className="w-32 h-48 rounded-lg" resizeMode = "cover" />
            <View className="absolute bottom-9 -left-3.5 px-2 py-1 rounded-full">
                <MaskedView maskElement = {
                    <Text className="font-bold text-white text-6xl">{index + 1}</Text>
                }>
                    <Image source = {images.rankingGradient} className="size-14 " resizeMode = "cover" />
                </MaskedView>
            </View>
            <Text className="text-sm font-bold mt-2 text-light-200" numberOfLines={2}>{title}</Text>
          
        </TouchableOpacity>
   </Link>
  )
}

export default TrendingCard
