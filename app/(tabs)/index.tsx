import { Layout, List, ListItem } from "@ui-kitten/components";
import { useEffect, useState } from "react";
import { listPages } from "../../src/api/content";
import { i18n } from "../../src/i18n";

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  async function load() { setItems((await listPages(i18n.locale as "en" | "af")).items || []); }
  useEffect(() => { load(); }, []);
  return (
    <Layout style={{ flex: 1, padding: 16 }}>
      <List data={items} renderItem={({ item }) => <ListItem title={item.title} description={item.meta?.locale} />} />
    </Layout>
  );
}
