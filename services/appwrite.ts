import { Client, Databases, ID, Query , Account, Avatars, Storage} from 'react-native-appwrite';
import mime from 'mime';
import * as FileSystem from 'expo-file-system';


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

// export const storage = new Storage(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
    try {
     const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal('searchTerm', query)
     ])

    if(result.documents.length > 0) {
        const existingMovie = result.documents[0];
        await database.updateDocument(DATABASE_ID, COLLECTION_ID, existingMovie.$id, {
            count: existingMovie.count + 1
        });
    } else {
        await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        count: 1,
        title: movie.title,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    })
    
}
} catch (error) {
    console.log(error);
    throw error;
}
}

export const getTrendingMovies = async () : Promise<TrendingMovie[] | undefined > => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc('count')
         ])
         return result.documents as unknown as TrendingMovie[];
    }
    catch (error) {
        console.log(error);
        return undefined;
    }
}

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
  