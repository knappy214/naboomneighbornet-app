import { Button, Input, Layout, Text } from "@ui-kitten/components";
import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import { useLogin } from "../../src/queries/auth";
import { useMe } from "../../src/queries/profile";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { data: user } = useMe();
  const login = useLogin();

  useEffect(() => { if (user) router.replace("/(tabs)"); }, [user?.id]);

  async function submit() { await login.mutateAsync({ email, password }); }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Layout style={{ flex: 1, padding: 16, justifyContent: "center" }}>
        <Text category="h4" style={{ marginBottom: 12 }}>Login</Text>
        <Input value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" style={{ marginBottom: 8 }} />
        <Input value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry style={{ marginBottom: 8 }} />
        {login.error && <Text status="danger" style={{ marginBottom: 8 }}>{String(login.error)}</Text>}
        <Button disabled={login.isPending} onPress={submit}>{login.isPending ? "Signing in…" : "Sign in"}</Button>
      </Layout>
    </>
  );
}
