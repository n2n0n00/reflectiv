"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Edit3, Check, X, Sparkles } from "lucide-react";
import { EntryGenerationModal } from "./entry-generation-modal";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth-context";

interface Message {
  id: string;
  type: "ai" | "user";
  content: string;
  timestamp: Date;
  isEditing?: boolean;
}

interface JournalChatInterfaceProps {
  journal: {
    id: string;
    template: string;
    templateColor: string;
    description: string;
    currentSession: {
      messages: Array<{
        id: string;
        journal_id: string;
        role: "user" | "assistant";
        content: string;
        created_at: string;
      }>;
    };
  };
}

export function JournalChatInterface({ journal }: JournalChatInterfaceProps) {
  const { user } = useAuth();
  const supabase = createClient();

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize messages from database
  useEffect(() => {
    const initializeMessages = () => {
      if (journal.currentSession.messages.length > 0) {
        const convertedMessages: Message[] =
          journal.currentSession.messages.map((msg) => ({
            id: msg.id,
            type: msg.role === "assistant" ? "ai" : "user",
            content: msg.content,
            timestamp: new Date(msg.created_at),
          }));
        setMessages(convertedMessages);
        setIsInitialized(true);
      } else {
        // If no messages, start with AI greeting
        generateAIResponse([]);
      }
    };

    initializeMessages();
  }, [journal.currentSession.messages]);

  const saveMessageToDatabase = async (
    content: string,
    role: "user" | "assistant"
  ) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from("journal_messages")
      .insert({
        journal_id: journal.id,
        user_id: user.id,
        role: role,
        content: content,
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving message:", error);
      return null;
    }

    return data;
  };

  const updateMessageInDatabase = async (
    messageId: string,
    content: string
  ) => {
    const { error } = await supabase
      .from("journal_messages")
      .update({ content })
      .eq("id", messageId);

    if (error) {
      console.error("Error updating message:", error);
      return false;
    }

    return true;
  };

  const generateAIResponse = async (currentMessages: Message[]) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          template: journal.template.toLowerCase().replace(" ", "-"),
          messages: currentMessages.map((msg) => ({
            role: msg.type === "ai" ? "assistant" : "user",
            content: msg.content,
          })),
          userContext: journal.description,
        }),
      });

      const data = await response.json();
      let aiContent =
        data.message ||
        "I'm here to help you explore your thoughts and feelings. What's on your mind today?";

      // Save AI message to database
      const savedMessage = await saveMessageToDatabase(aiContent, "assistant");

      if (savedMessage) {
        const aiMessage: Message = {
          id: savedMessage.id,
          type: "ai",
          content: aiContent,
          timestamp: new Date(savedMessage.created_at),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error("Failed to generate AI response:", error);
      // Fallback message
      const fallbackContent =
        "I'm here to help you explore your thoughts and feelings. What's on your mind today?";
      const savedMessage = await saveMessageToDatabase(
        fallbackContent,
        "assistant"
      );

      if (savedMessage) {
        const fallbackMessage: Message = {
          id: savedMessage.id,
          type: "ai",
          content: fallbackContent,
          timestamp: new Date(savedMessage.created_at),
        };
        setMessages((prev) => [...prev, fallbackMessage]);
      }
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;

    const userContent = currentInput.trim();
    setCurrentInput("");

    // Save user message to database
    const savedUserMessage = await saveMessageToDatabase(userContent, "user");

    if (!savedUserMessage) {
      console.error("Failed to save user message");
      return;
    }

    const userMessage: Message = {
      id: savedUserMessage.id,
      type: "user",
      content: userContent,
      timestamp: new Date(savedUserMessage.created_at),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Generate AI response
    await generateAIResponse(updatedMessages);
  };

  const handleEditMessage = (messageId: string, content: string) => {
    setEditingMessageId(messageId);
    setEditContent(content);
  };

  const handleSaveEdit = async (messageId: string) => {
    const success = await updateMessageInDatabase(messageId, editContent);

    if (success) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, content: editContent } : msg
        )
      );
    }

    setEditingMessageId(null);
    setEditContent("");
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditContent("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const canGenerateEntry =
    messages.filter((m) => m.type === "user").length >= 3;

  return (
    <>
      <div className="space-y-6">
        {/* Session Info */}
        <Card className="p-4 bg-muted/30 border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-4 h-4 ${journal.templateColor} rounded-full`}
              ></div>
              <div>
                <h2 className="font-serif font-semibold text-foreground">
                  {journal.template} Session
                </h2>
                <p className="text-sm text-muted-foreground">
                  Take your time to reflect deeply. You can edit your responses
                  anytime.
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              {messages.filter((m) => m.type === "user").length} responses
            </Badge>
          </div>
        </Card>

        {/* Chat Messages */}
        <div className="space-y-6 min-h-[400px]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] ${
                  message.type === "user" ? "order-2" : "order-1"
                }`}
              >
                <div className="flex items-start space-x-3">
                  {message.type === "ai" && (
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary-foreground text-sm font-medium">
                        AI
                      </span>
                    </div>
                  )}

                  <div className="flex-1">
                    {editingMessageId === message.id ? (
                      <div className="space-y-3">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="bg-input border-border focus:ring-ring min-h-[100px]"
                          placeholder="Edit your response..."
                        />
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleSaveEdit(message.id)}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelEdit}
                            className="border-border text-foreground hover:bg-muted bg-transparent"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`rounded-lg p-4 ${
                          message.type === "ai"
                            ? "bg-muted text-foreground"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        <p className="leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>

                        {message.type === "user" && (
                          <button
                            onClick={() =>
                              handleEditMessage(message.id, message.content)
                            }
                            className="mt-2 text-xs opacity-70 hover:opacity-100 flex items-center space-x-1"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                        )}
                      </div>
                    )}

                    <div className="mt-1 text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  {message.type === "user" && (
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-secondary-foreground text-sm font-medium">
                        You
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground text-sm font-medium">
                    AI
                  </span>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <Card className="p-4 border-border bg-card">
          <div className="space-y-4">
            <div className="flex space-x-4">
              <Textarea
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share your thoughts and feelings..."
                className="flex-1 bg-input border-border focus:ring-ring min-h-[80px] resize-none"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!currentInput.trim() || isLoading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground self-end"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {canGenerateEntry && (
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Sparkles className="w-4 h-4" />
                  <span>Ready to generate your journal entry</span>
                </div>
                <Button
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={() => setShowEntryModal(true)}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Entry
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>

      <EntryGenerationModal
        isOpen={showEntryModal}
        onClose={() => setShowEntryModal(false)}
        template={journal.template}
        templateColor={journal.templateColor}
        messages={messages}
        userContext={journal.description}
        journalId={journal.id}
      />
    </>
  );
}
