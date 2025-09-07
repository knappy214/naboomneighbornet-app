import * as SecureStore from 'expo-secure-store';
import { http } from './http';

export interface Tokens {
  access: string;
  refresh: string;
}

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export async function getTokens(): Promise<Tokens | null> {
  try {
    const access = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    const refresh = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    
    if (!access || !refresh) return null;
    
    return { access, refresh };
  } catch (error) {
    console.error('Error getting tokens:', error);
    return null;
  }
}

export async function setTokens(tokens: Tokens): Promise<void> {
  try {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.access);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refresh);
  } catch (error) {
    console.error('Error setting tokens:', error);
  }
}

export async function clearTokens(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
}

export async function refreshAccessToken(): Promise<Tokens | null> {
  const tokens = await getTokens();
  if (!tokens?.refresh) return null;
  
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE || 'https://dev.example.com/api'}/auth/jwt/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: tokens.refresh }),
    });
    
    if (!response.ok) {
      await clearTokens();
      return null;
    }
    
    const data = await response.json();
    const newTokens = { access: data.access, refresh: tokens.refresh };
    await setTokens(newTokens);
    return newTokens;
  } catch (error) {
    console.error('Error refreshing token:', error);
    await clearTokens();
    return null;
  }
}

export async function login(email: string, password: string): Promise<Tokens> {
  const response = await http('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  const tokens = { access: response.access_token, refresh: response.refresh_token };
  await setTokens(tokens);
  return tokens;
}
