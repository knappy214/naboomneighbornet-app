import { Button, Input, Layout, Text } from "@ui-kitten/components";
import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import { useLoginMutation } from "../../src/hooks/authMutations";
import { useMeQuery } from "../../src/hooks/useMe";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { data: user } = useMeQuery();
  const login = useLoginMutation();

  useEffect(() => { if (user) router.replace("/(tabs)"); }, [user]);

  async function submit() { 
    try {
      await login.mutateAsync({ email, password }); 
    } catch (error) {
      console.error('Login error:', error);
    }
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Layout style={{ flex: 1, padding: 16, justifyContent: "center" }}>
        <Text category="h4" style={{ marginBottom: 12 }}>Login</Text>
        <Input 
          value={email} 
          onChangeText={setEmail} 
          placeholder="Email" 
          autoCapitalize="none" 
          style={{ marginBottom: 8 }} 
        />
        <Input 
          value={password} 
          onChangeText={setPassword} 
          placeholder="Password" 
          secureTextEntry 
          style={{ marginBottom: 8 }} 
        />
        {login.error && (
          <Text status="danger" style={{ marginBottom: 8 }}>
            Error: {String(login.error)}
          </Text>
        )}
        {login.isError && (
          <Text status="danger" style={{ marginBottom: 8 }}>
            Login failed. Check console for details.
          </Text>
        )}
        <Button 
          disabled={login.isPending} 
          onPress={submit}
          style={{ marginBottom: 8 }}
        >
          {login.isPending ? "Signing in…" : "Sign in"}
        </Button>
      </Layout>
    </>
  );
}
