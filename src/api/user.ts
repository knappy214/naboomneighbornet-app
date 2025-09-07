import { authFetch } from './authFetch';

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
}

export async function getProfile(): Promise<UserProfile> {
  const response = await authFetch('/user/profile');
  return response.json();
}

export async function updateProfile(patch: Partial<UserProfile>): Promise<UserProfile> {
  const response = await authFetch('/user/profile', {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
  return response.json();
}
