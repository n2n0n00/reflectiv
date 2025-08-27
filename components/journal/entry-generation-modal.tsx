"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Download, Edit3, Save, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth-context";

interface EntryGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: string;
  templateColor: string;
  messages: any[];
  userContext: string;
  journalId: string;
}

export function EntryGenerationModal({
  isOpen,
  onClose,
  template,
  templateColor,
  messages,
  userContext,
  journalId,
}: EntryGenerationModalProps) {
  const { user } = useAuth();
  const supabase = createClient();

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedEntry, setGeneratedEntry] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedEntry, setEditedEntry] = useState("");
  const [savedEntryId, setSavedEntryId] = useState<string | null>(null);

  const handleGenerateEntry = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-entry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          template: template.toLowerCase().replace(" ", "-"),
          messages: messages.map((msg) => ({
            role: msg.type === "ai" ? "assistant" : "user",
            content: msg.content,
          })),
          userContext,
        }),
      });

      const data = await response.json();
      if (data.entry) {
        setGeneratedEntry(data.entry);
        setEditedEntry(data.entry);
      }
    } catch (error) {
      console.error("Failed to generate entry:", error);
      // You could add a toast notification here
    } finally {
      setIsGenerating(false);
    }
  };

  const saveEntryToDatabase = async (content: string) => {
    if (!user) return null;

    try {
      // Check if we already have a saved entry for this journal
      if (savedEntryId) {
        // Update existing entry
        const { data, error } = await supabase
          .from("journal_entries")
          .update({
            content,
            updated_at: new Date().toISOString(),
          })
          .eq("id", savedEntryId)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new entry
        const { data, error } = await supabase
          .from("journal_entries")
          .insert({
            journal_id: journalId,
            user_id: user.id,
            content,
            template: template,
            template_color: templateColor,
          })
          .select()
          .single();

        if (error) throw error;
        setSavedEntryId(data.id);
        return data;
      }
    } catch (error) {
      console.error("Error saving entry to database:", error);
      return null;
    }
  };

  const handleSaveEntry = async () => {
    setIsSaving(true);
    try {
      const savedEntry = await saveEntryToDatabase(editedEntry);
      if (savedEntry) {
        setGeneratedEntry(editedEntry);
        setIsEditing(false);
        // You could add a success toast here
      }
    } catch (error) {
      console.error("Failed to save entry:", error);
      // You could add an error toast here
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportEntry = async () => {
    try {
      // Save to database first if not already saved
      if (!savedEntryId) {
        await saveEntryToDatabase(generatedEntry);
      }

      // Create and download text file
      const element = document.createElement("a");
      const file = new Blob([generatedEntry], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `journal-entry-${template}-${
        new Date().toISOString().split("T")[0]
      }.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (error) {
      console.error("Failed to export entry:", error);
    }
  };

  const handleCloseModal = async () => {
    // Auto-save if there's unsaved content
    if (generatedEntry && !savedEntryId) {
      await saveEntryToDatabase(generatedEntry);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className={`w-4 h-4 ${templateColor} rounded-full`}></div>
            <span className="font-serif">Generate Journal Entry</span>
            <Badge variant="secondary" className="text-xs">
              {template}
            </Badge>
            {savedEntryId && (
              <Badge
                variant="outline"
                className="text-xs text-green-600 border-green-600"
              >
                Saved
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!generatedEntry ? (
            <Card className="p-6 text-center space-y-4">
              <div className="space-y-2">
                <Sparkles className="w-12 h-12 text-primary mx-auto" />
                <h3 className="text-lg font-serif font-semibold text-foreground">
                  Ready to Create Your Entry
                </h3>
                <p className="text-muted-foreground">
                  I'll transform your conversation into a thoughtful,
                  personalized journal entry that captures your insights and
                  reflections.
                </p>
              </div>

              <div className="bg-muted rounded-lg p-4 text-left space-y-2">
                <h4 className="font-medium text-foreground">
                  Your session included:
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    • {messages.filter((m) => m.type === "user").length}{" "}
                    thoughtful responses
                  </li>
                  <li>
                    • Deep exploration of {template.toLowerCase()} patterns
                  </li>
                  <li>• Personal insights and breakthrough moments</li>
                  <li>• Actionable reflections for continued growth</li>
                </ul>
              </div>

              <Button
                onClick={handleGenerateEntry}
                disabled={isGenerating}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                    Generating Entry...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate My Journal Entry
                  </>
                )}
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-serif font-semibold text-foreground">
                  Your Journal Entry
                </h3>
                <div className="flex space-x-2">
                  {!isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="border-border text-foreground hover:bg-muted bg-transparent"
                      >
                        <Edit3 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExportEntry}
                        className="border-border text-foreground hover:bg-muted bg-transparent"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        onClick={handleSaveEntry}
                        disabled={isSaving}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        {isSaving ? (
                          <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-1" />
                        ) : (
                          <Save className="w-4 h-4 mr-1" />
                        )}
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsEditing(false);
                          setEditedEntry(generatedEntry);
                        }}
                        className="border-border text-foreground hover:bg-muted bg-transparent"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <Card className="p-6">
                {isEditing ? (
                  <Textarea
                    value={editedEntry}
                    onChange={(e) => setEditedEntry(e.target.value)}
                    className="bg-input border-border focus:ring-ring min-h-[400px] text-sm leading-relaxed"
                  />
                ) : (
                  <div className="prose prose-sm max-w-none">
                    <div className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                      {generatedEntry}
                    </div>
                  </div>
                )}
              </Card>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setGeneratedEntry("");
                    setEditedEntry("");
                    setSavedEntryId(null);
                  }}
                  className="border-border text-foreground hover:bg-muted bg-transparent"
                >
                  Generate New Entry
                </Button>
                <Button
                  onClick={handleCloseModal}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {savedEntryId ? "Continue" : "Save & Continue"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
