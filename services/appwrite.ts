
import { Client, Databases, ID, Query , Account, Avatars, Storage} from 'react-native-appwrite';
import mime from 'mime';
import * as FileSystem from 'expo-file-system';
import { FavoriteMovie, Movie, TrendingMovie } from '@/interfaces/interfaces';

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const BUCKET_ID = process.env.EXPO_PUBLIC_GOOGLE_BUCKET_ID!;
const FAVORITES_ID = process.env.EXPO_PUBLIC_APPWRITE_FAVORITES_ID!;
export const client = new Client().
    setEndpoint("https://cloud.appwrite.io/v1").
    setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!).
    setPlatform('com.dmk.movieapp');
 
export const account = new Account(client);
export const database = new Databases(client);
export const avatar = new Avatars(client);

export const storage = new Storage(client);


export const updateSearchCount = async (query: string, movie: any) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('searchTerm', query),
    ]);

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, existingMovie.$id, {
        count: existingMovie.count + 1,
      });
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.slug, 
        count: 1,
        title: movie.name,
        poster_url: movie.poster_url, 
      });
    }

    console.log('✅ updateSearchCount thành công');
  } catch (error) {
    console.log('❌ updateSearchCount lỗi:', error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
    try {
      const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.limit(5),
        Query.orderDesc('count')
      ]);
      return result.documents.map((doc: any) => ({
        searchTerm: doc.searchTerm,
        movie_id: doc.movie_id,
        title: doc.title,
        count: doc.count,
        poster_url: doc.poster_url
      })) as TrendingMovie[];
    } catch (error) {
      console.log(error);
      return undefined;
    }
  };
  
export const uploadAvatar = async (uri: string): Promise<string> => {
    try {
      const fileName = uri.split('/').pop() ?? `avatar-${Date.now()}.jpg`;
      const mimeType = mime.getType(uri) || 'image/jpeg';
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) throw new Error('File does not exist at URI');
  
      const file = {
        uri,
        name: fileName,
        type: mimeType,
        size: fileInfo.size,
      };
  
      const result = await storage.createFile(BUCKET_ID, ID.unique(), file);
      const fileUrl = storage.getFileView(BUCKET_ID, result.$id).href;
      await account.updatePrefs({ avatar: fileUrl });
  
      return fileUrl;
    } catch (err) {
      console.error('❌ uploadAvatar failed:', err);
      throw err;
    }
  };
  
export const saveToFavorites = async (movie: Movie) => {
    const categoryStr = movie.category.map((c) => c.name).join(', ');
    const countryStr = movie.country.map((c) => c.name).join(', ');
    try {
      const user = await account.get();
      const userId = user.$id;
  
      const existing = await database.listDocuments(DATABASE_ID, FAVORITES_ID, [
        Query.equal("user_id", userId),
        Query.equal("slug", movie.slug),
      ]);
  
      if (existing.total > 0) {
        console.log("Movie is already in favorites");
        return;
      }  
      await database.createDocument(DATABASE_ID, FAVORITES_ID, ID.unique(), {
        user_id: userId,
        name: movie.name,
        slug: movie.slug,
        origin_name: movie.origin_name,
        poster_url: movie.poster_url,
        year: movie.year,
        category: categoryStr,
        country: countryStr,
        time: movie.time,
        episode_current: movie.episode_current,
        episode_total: movie.episode_total,
        quality: movie.quality,
        lang: movie.lang,
        status: movie.status,
        is_copyright: movie.is_copyright,
        trailer_url: movie.trailer_url || "",
      });
  
      console.log("✅ Movie saved to favorites");
    } catch (error) {
      console.error("❌ Error saving favorite:", error);
      throw error;
    }
  };

export const unsaveFavorite = async (slug: string, userId: string) => {
    try {
      const { documents } = await database.listDocuments(DATABASE_ID, FAVORITES_ID, [
        Query.equal('slug', slug),
        Query.equal('user_id', userId),
      ]);
  
      if (documents.length === 0) {
        throw new Error('No favorite found to remove.');
      }
      const target = documents[0];
      await database.deleteDocument(DATABASE_ID, FAVORITES_ID, target.$id);
      return true;
    } catch (err) {
      console.error('❌ unsaveFavorite error:', err);
      throw err;
    }
  };

  export const checkIfFavorite = async (slug: string, userId: string): Promise<boolean> => {
    try {
      const { documents } = await database.listDocuments(DATABASE_ID, FAVORITES_ID, [
        Query.equal('slug', slug),
        Query.equal('user_id', userId),
      ]);
      return documents.length > 0;
    } catch (err) {
      console.error('checkIfFavorite error:', err);
      return false;
    }
  };
  
  export const getFavoritesByUser = async (userId: string): Promise<FavoriteMovie[]> => {
    const result = await database.listDocuments(DATABASE_ID, FAVORITES_ID, [
      Query.equal("user_id", userId),
    ]);
  
    return result.documents.map((doc) => ({
      $id: doc.$id,
      user_id: doc.user_id,
      name: doc.name,
      slug: doc.slug,
      origin_name: doc.origin_name,
      poster_url: doc.poster_url,
      year: doc.year,
      category: doc.category,
      country: doc.country,
      time: doc.time,
      episode_current: doc.episode_current,
      episode_total: doc.episode_total,
      quality: doc.quality,
      lang: doc.lang,
      status: doc.status,
      modified: doc.modified,
      created: doc.created,
      is_copyright: doc.is_copyright,
      trailer_url: doc.trailer_url ?? "", 
    }));
  };
  