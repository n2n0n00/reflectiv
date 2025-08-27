"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import { JournalChatInterface } from "@/components/journal/journal-chat-interface";
import { JournalHeader } from "@/components/journal/journal-header";
import { templates } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";

type Journal = {
  id: string;
  user_id: string;
  template_id: string;
  context?: string;
  created_at: string;
};

type JournalMessage = {
  id: string;
  journal_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

export default function JournalSessionPage({
  params,
}: {
  params: Promise<{ id: string; journalId: string }>;
}) {
  const { user } = useAuth();

  const { id: templateId, journalId } = use(params);

  const selectedTemplateData = templates.find((t) => t.id === templateId);

  const [journal, setJournal] = useState<Journal | null>(null);
  const [messages, setMessages] = useState<JournalMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJournalAndMessages = async () => {
      if (!user) return;
      const supabase = createClient();

      const { data: journalData, error: journalError } = await supabase
        .from("journals")
        .select("*")
        .eq("id", journalId)
        .eq("user_id", user.id)
        .single();

      if (journalError) {
        console.error("Error loading journal:", journalError);
        setLoading(false);
        return;
      }

      setJournal(journalData);

      const { data: messageData, error: messageError } = await supabase
        .from("journal_messages")
        .select("*")
        .eq("journal_id", journalId)
        .order("created_at", { ascending: true });

      if (messageError) {
        console.error("Error loading messages:", messageError);
      } else {
        setMessages(messageData ?? []);
      }

      setLoading(false);
    };

    fetchJournalAndMessages();
  }, [journalId, user]);

  if (loading) {
    return <div className="p-8 text-center">Loading journal...</div>;
  }

  if (!journal) {
    return (
      <div className="p-8 text-center text-red-500">Journal not found.</div>
    );
  }

  const sessionContext = {
    id: journal.id,
    template: selectedTemplateData?.name ?? "Unknown",
    templateColor: selectedTemplateData?.color ?? "bg-gray-300",
    startDate: journal.created_at,
    currentSession: {
      date: new Date().toISOString(),
      messages,
      isComplete: false,
    },
    description: journal.context ?? user?.user_metadata.description,
  };

  return (
    <div className="min-h-screen bg-background">
      <JournalHeader journal={sessionContext} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <JournalChatInterface journal={sessionContext} />
      </main>
    </div>
  );
}
