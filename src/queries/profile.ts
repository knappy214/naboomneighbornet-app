import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile, UserProfile } from "../api/user";

export const QK = { me: ["me"] as const };

export function useMe() {
  return useQuery<UserProfile>({ queryKey: QK.me, queryFn: getProfile, gcTime: 10 * 60_000 });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: Partial<UserProfile>) => updateProfile(patch),
    onSuccess: () => { qc.invalidateQueries({ queryKey: QK.me }); },
  });
}
