import { useMutation } from "@tanstack/react-query";
import { login } from "../api/auth";
import { queryClient } from "../api/queryClient";

export function useLogin() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => login(email, password),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["me"] }); },
  });
}
