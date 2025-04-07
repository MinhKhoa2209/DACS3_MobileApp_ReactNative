import { Account, OAuthProvider, Avatars } from "react-native-appwrite";
import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";
import { client } from "@/services/appwrite";import { Alert } from "react-native";
import { router } from "expo-router";

export const account = new Account(client);
export const avatar = new Avatars(client);

export async function login() {
  try {
    const redirectUri = Linking.createURL("/");

    const response = await account.createOAuth2Token(
      OAuthProvider.Google,
      redirectUri
    );
    if (!response) throw new Error("Create OAuth2 token failed");

    const browserResult = await openAuthSessionAsync(
      response.toString(),
      redirectUri
    );
    if (browserResult.type !== "success")
      throw new Error("Create OAuth2 token failed");
    const url = new URL(browserResult.url);
    const secret = url.searchParams.get("secret")?.toString();
    const userId = url.searchParams.get("userId")?.toString();
    if (!secret || !userId) throw new Error("Create OAuth2 token failed");

    const session = await account.createSession(userId, secret);
    if (!session) throw new Error("Failed to create session");
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}


export async function logout() {
  try {
    const result = await account.deleteSession("current");
    console.log("Logged out successfully:", result);
    return result;
  } catch (error) {
    console.error("Logout failed:", error);
    return false;
  }
}

export async function getCurrentUser() {
  try {
    const result = await account.get();

    if (result?.$id) {
      return {
        $id: result.$id,
        name: result.name,
        email: result.email,
        avatar: result.prefs?.avatar,
        phone: result.phone,
        createdAt: result.registration,
      };
    }
    return null;  
  } catch (error) {
    if ((error as { code?: number }).code === 401) {
      console.log("User is not logged.");
    } else {
      console.log("❌ Error when fetch user infor:", error);
    }
    return null;  
  }
}

