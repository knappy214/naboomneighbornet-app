import { Button, Icon, Input, Layout, Text } from "@ui-kitten/components";
import { Stack, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from "react-native";
import { useAuth } from "../../src/context/AuthProvider";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const { user, login: loginFn } = useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => { 
    if (user && !hasRedirected.current) {
      hasRedirected.current = true;
      router.replace("/(tabs)");
    }
  }, [user]);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const renderEmailIcon = (props: any) => (
    <Icon {...props} name='email-outline' />
  );

  const renderPasswordIcon = (props: any) => (
    <Pressable onPress={toggleSecureEntry}>
      <Icon {...props} name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'} />
    </Pressable>
  );

  const renderSubmitIcon = (props: any) => (
    <Icon {...props} name={submitting ? 'activity-outline' : 'log-in-outline'} />
  );

  async function submit() { 
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    
    try {
      await loginFn(email.trim(), password);
      // Navigation will be handled by the useEffect above
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error?.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  }

  const isFormValid = email.trim().length > 0 && password.length > 0;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
          <Layout style={{ flex: 1 }}>
            <ScrollView 
              contentContainerStyle={{ 
                flex: 1, 
                padding: 24, 
                justifyContent: "center",
                minHeight: '100%'
              }}
              keyboardShouldPersistTaps="handled"
            >
              <Layout style={{ 
                maxWidth: 400, 
                width: '100%', 
                alignSelf: 'center',
                backgroundColor: 'transparent'
              }}>
                {/* Header */}
                <Text 
                  category="h3" 
                  style={{ 
                    textAlign: 'center',
                    marginBottom: 8 
                  }}
                >
                  Welcome Back
                </Text>
                <Text 
                  category="s1" 
                  appearance="hint"
                  style={{ 
                    textAlign: 'center',
                    marginBottom: 32 
                  }}
                >
                  Sign in to your account
                </Text>

                {/* Form Container - Fixes DOM violation */}
                <View 
                  role="form" 
                  aria-label="Login form"
                  style={{ width: '100%' }}
                >
                  {/* Email Input */}
                  <Input 
                    label="Email Address"
                    value={email} 
                    onChangeText={setEmail} 
                    placeholder="Enter your email" 
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                    textContentType="emailAddress"
                    accessoryLeft={renderEmailIcon}
                    style={{ marginBottom: 16 }} 
                    size="large"
                  />

                  {/* Password Input */}
                  <Input 
                    label="Password"
                    value={password} 
                    onChangeText={setPassword} 
                    placeholder="Enter your password" 
                    secureTextEntry={secureTextEntry}
                    autoComplete="current-password"
                    textContentType="password"
                    accessoryRight={renderPasswordIcon}
                    style={{ marginBottom: 16 }} 
                    size="large"
                  />

                  {/* Error Message */}
                  {error && (
                    <Text 
                      status="danger" 
                      category="c1"
                      style={{ 
                        marginBottom: 16,
                        textAlign: 'center'
                      }}
                    >
                      {error}
                    </Text>
                  )}

                  {/* Submit Button */}
                  <Button 
                    disabled={submitting || !isFormValid} 
                    onPress={submit}
                    accessoryLeft={renderSubmitIcon}
                    size="large"
                    style={{ marginTop: 8 }}
                  >
                    {submitting ? "Signing in..." : "Sign In"}
                  </Button>
                </View>
              </Layout>
            </ScrollView>
          </Layout>
        </Pressable>
      </KeyboardAvoidingView>
    </>
  );
}
