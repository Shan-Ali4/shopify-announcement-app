import { useState, useCallback } from "react";
import { useLoaderData } from "react-router";
import { connectDB } from "../lib/mongodb";
import Announcement from "../models/Announcement";
import {
  Page,
  Card,
  TextField,
  Button,
  Banner,
  DataTable,
  Text,
  BlockStack,
  InlineStack,
  Badge,
  Divider,
  Box,
} from "@shopify/polaris";

export async function loader() {
  await connectDB();
  const announcements = await Announcement.find()
    .sort({ createdAt: -1 })
    .lean();
  return Response.json({ announcements });
}

export default function Index() {
  const { announcements: initialAnnouncements } = useLoaderData();

  const [announcement, setAnnouncement] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [history, setHistory] = useState(
    initialAnnouncements.map((a) => ({
      text: a.text,
      date: new Date(a.createdAt).toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }))
  );

  const handleChange = useCallback((value) => setAnnouncement(value), []);

  const saveAnnouncement = async () => {
    if (!announcement.trim()) return;
    setSaving(true);
    setToast(null);
    try {
      const response = await fetch("/api/announcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: announcement }),
      });
      const data = await response.json();
      console.log(data);

      const now = new Date();
      const formatted = now.toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      setHistory((prev) => [{ text: announcement, date: formatted }, ...prev]);
      setAnnouncement("");
      setToast({ message: "Announcement saved successfully.", error: false });
    } catch (error) {
      console.error(error);
      setToast({ message: "Failed to save. Please try again.", error: true });
    } finally {
      setSaving(false);
    }
  };

  const rows = history.map((item) => [
    <Text variant="bodyMd" as="span">{item.text}</Text>,
    <Badge tone="info">{item.date}</Badge>,
  ]);

  return (
    <Page
      title="Announcement Manager"
      subtitle="Manage the announcement banner displayed across your store."
      primaryAction={{
        content: "Save Announcement",
        onAction: saveAnnouncement,
        loading: saving,
        disabled: !announcement.trim(),
      }}
    >
      <BlockStack gap="500">
        {toast && (
          <Banner
            tone={toast.error ? "critical" : "success"}
            onDismiss={() => setToast(null)}
          >
            <p>{toast.message}</p>
          </Banner>
        )}

        <Card>
          <BlockStack gap="400">
            <Text variant="headingMd" as="h2">
              📢 Active Announcement
            </Text>
            <Text variant="bodySm" tone="subdued" as="p">
              This text will be shown in your store's announcement banner.
            </Text>
            <TextField
              label="Announcement Text"
              value={announcement}
              onChange={handleChange}
              placeholder="e.g. Summer Sale — 40% OFF everything!"
              autoComplete="off"
              clearButton
              onClearButtonClick={() => setAnnouncement("")}
            />
            <InlineStack align="end">
              <Button
                variant="primary"
                onClick={saveAnnouncement}
                loading={saving}
                disabled={!announcement.trim()}
              >
                Save Announcement
              </Button>
            </InlineStack>
          </BlockStack>
        </Card>

        <Card padding="0">
          <Box padding="400" paddingBlockEnd="300">
            <Text variant="headingMd" as="h2">
              Recent Announcements
            </Text>
            <Text variant="bodySm" tone="subdued" as="p">
              Previously published announcements, newest first.
            </Text>
          </Box>
          <Divider />
          {rows.length > 0 ? (
            <DataTable
              columnContentTypes={["text", "text"]}
              headings={["Announcement", "Published At"]}
              rows={rows}
            />
          ) : (
            <Box padding="600">
              <Text tone="subdued" alignment="center" as="p">
                No announcements yet. Create one above.
              </Text>
            </Box>
          )}
        </Card>
      </BlockStack>
    </Page>
  );
}