import { Button, Input, Layout, Text } from "@ui-kitten/components";
import { useEffect, useState } from "react";
import { useMeQuery } from "../../src/hooks/useMe";
import { useProfileUpdateMutation } from "../../src/hooks/profileMutations";
import { requireBiometric } from "../../src/security/biometric";

export default function Profile() {
  const { data: user, isLoading } = useMeQuery();
  const update = useProfileUpdateMutation();

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (user) { setFirst(user.first_name || ""); setLast(user.last_name || ""); setPhone(user.phone || ""); }
  }, [user]);

  async function onSave() {
    if (!(await requireBiometric("Authenticate to save profile"))) return;
    update.mutate({ first_name: first, last_name: last, phone });
  }

  if (isLoading) return <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><Text>Loading…</Text></Layout>;
  if (!user) return <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><Text>Please sign in.</Text></Layout>;

  return (
    <Layout style={{ flex: 1, padding: 16 }}>
      <Input label="First name" value={first} onChangeText={setFirst} style={{ marginBottom: 8 }} />
      <Input label="Last name" value={last} onChangeText={setLast} style={{ marginBottom: 8 }} />
      <Input label="Phone" value={phone} onChangeText={setPhone} style={{ marginBottom: 8 }} />
      <Button disabled={update.isPending} onPress={onSave}>{update.isPending ? "Saving…" : "Save"}</Button>
      {update.error && <Text status="danger" style={{ marginTop: 8 }}>{String(update.error)}</Text>}
    </Layout>
  );
}
