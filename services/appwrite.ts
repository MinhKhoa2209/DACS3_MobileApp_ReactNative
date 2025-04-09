
import { Client, Databases, ID, Query , Account, Avatars, Storage} from 'react-native-appwrite';
import mime from 'mime';
import * as FileSystem from 'expo-file-system';
import { TrendingMovie } from '@/interfaces/interfaces';


const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const BUCKET_ID = process.env.EXPO_PUBLIC_GOOGLE_BUCKET_ID!;
export const client = new Client().
    setEndpoint("https://cloud.appwrite.io/v1").
    setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!).
    setPlatform('com.dmk.movieapp');
 
export const account = new Account(client);
export const database = new Databases(client);
export const avatar = new Avatars(client);

export const storage = new Storage(client);


const buildImageUrl = (path?: string): string => {
  if (!path) return 'https://placehold.co/300x450';
  return path.startsWith('http') ? path : `https://phimimg.com/${path}`;
};

export const updateSearchCount = async (query: string, movie: any) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('searchTerm', query),
    ]);

    const posterUrl = buildImageUrl(movie.poster_url);

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
        poster_url: posterUrl, 
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
  