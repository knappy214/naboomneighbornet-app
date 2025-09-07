import { useEffect, useState } from 'react';
import { clearTokens, getTokens } from '../api/auth';
import { UserProfile, getProfile } from '../api/user';

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  async function hydrate() {
    try {
      setLoading(true);
      const tokens = await getTokens();
      if (tokens) {
        const profile = await getProfile();
        setUser(profile);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error hydrating auth:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile(profileData: Partial<UserProfile>) {
    // This would typically call an API to update the profile
    // For now, we'll just update the local state
    if (user) {
      setUser({ ...user, ...profileData });
    }
  }

  async function signOut() {
    await clearTokens();
    setUser(null);
  }

  useEffect(() => {
    hydrate();
  }, []);

  return {
    user,
    loading,
    hydrate,
    saveProfile,
    signOut,
  };
}
