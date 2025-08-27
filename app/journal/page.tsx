"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Send, Sparkles, MessageCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/protected-route"

interface Message {
  type: "ai" | "user"
  content: string
  timestamp: Date
}

export default function JournalPage() {
  const { user } = useAuth()
  const [conversation, setConversation] = useState<Message[]>([])
  const [currentInput, setCurrentInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [generatedEntry, setGeneratedEntry] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user?.id && conversation.length === 0) {
      startConversation()
    }
  }, [user?.id])

  useEffect(() => {
    scrollToBottom()
  }, [conversation])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const startConversation = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/chat-journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          conversation: [],
          isFirstMessage: true,
        }),
      })

      if (!response.ok) throw new Error("Failed to start conversation")

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let aiResponse = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          aiResponse += decoder.decode(value, { stream: true })
        }
      }

      setConversation([
        {
          type: "ai",
          content: aiResponse.trim(),
          timestamp: new Date(),
        },
      ])
    } catch (error) {
      console.error("Error starting conversation:", error)
      setConversation([
        {
          type: "ai",
          content: "Hi there! How was your day? I'd love to hear what's been on your mind.",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!currentInput.trim() || isLoading) return

    const userMessage: Message = {
      type: "user",
      content: currentInput.trim(),
      timestamp: new Date(),
    }

    const newConversation = [...conversation, userMessage]
    setConversation(newConversation)
    setCurrentInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai/chat-journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          conversation: newConversation,
          isFirstMessage: false,
        }),
      })

      if (response.status === 429) {
        const errorData = await response.json()
        setConversation([
          ...newConversation,
          {
            type: "ai",
            content:
              errorData.message ||
              "You've reached your daily question limit. Please upgrade your plan or try again tomorrow.",
            timestamp: new Date(),
          },
        ])
        setIsLoading(false)
        return
      }

      if (!response.ok) throw new Error("Failed to get response")

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let aiResponse = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          aiResponse += decoder.decode(value, { stream: true })
        }
      }

      setConversation([
        ...newConversation,
        {
          type: "ai",
          content: aiResponse.trim(),
          timestamp: new Date(),
        },
      ])
    } catch (error) {
      console.error("Error getting AI response:", error)
      setConversation([
        ...newConversation,
        {
          type: "ai",
          content: "I'm having trouble connecting right now. Could you tell me more about that?",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const completeJournal = async (finalConversation: Message[]) => {
    setIsGenerating(true)

    try {
      // Extract questions and answers from conversation
      const questions: string[] = []
      const answers: string[] = []

      finalConversation.forEach((msg) => {
        if (msg.type === "ai") {
          questions.push(msg.content)
        } else {
          answers.push(msg.content)
        }
      })

      const response = await fetch("/api/ai/generate-entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          questions,
          answers,
          conversationFlow: finalConversation,
        }),
      })

      if (!response.ok) throw new Error("Failed to generate entry")

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          fullResponse += decoder.decode(value, { stream: true })
        }
      }

      setGeneratedEntry(fullResponse)
      setIsComplete(true)

      // Save to database
      try {
        await fetch("/api/journal/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user?.id,
            questions,
            answers,
            aiGeneratedEntry: fullResponse,
          }),
        })
      } catch (error) {
        console.error("Error saving journal entry:", error)
      }
    } catch (error) {
      console.error("Error generating entry:", error)
      setGeneratedEntry("Sorry, there was an error generating your journal entry. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const startNewEntry = () => {
    setConversation([])
    setCurrentInput("")
    setIsComplete(false)
    setGeneratedEntry("")
    startConversation()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (isGenerating) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Creating Your Journal Entry</h3>
              <p className="text-gray-600">AI is weaving your conversation into a beautiful reflection...</p>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    )
  }

  if (isComplete) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Journal Entry</h1>
              <p className="text-gray-600">AI has crafted your conversation into a meaningful reflection</p>
            </div>

            <Card className="mb-6">
              <CardContent className="p-8">
                <div className="prose prose-lg max-w-none">
                  <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">{generatedEntry}</div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-4">
              <Button onClick={startNewEntry} variant="outline" className="gap-2 bg-transparent">
                <MessageCircle className="w-4 h-4" />
                Start New Chat
              </Button>
              <Button onClick={() => (window.location.href = "/dashboard")} className="gap-2">
                View All Entries
              </Button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Journal Chat</h1>
            <p className="text-gray-600">Have a natural conversation about your day and thoughts</p>
          </div>

          <Card className="mb-4 h-96 overflow-hidden">
            <CardContent className="p-0 h-full flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {conversation.map((message, index) => (
                  <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === "user" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Textarea
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your response..."
              className="flex-1 min-h-12 max-h-32 resize-none"
              disabled={isLoading}
            />
            <Button onClick={sendMessage} disabled={!currentInput.trim() || isLoading} className="gap-2 px-4">
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {conversation.length >= 4 && (
            <div className="text-center mt-4">
              <Button
                onClick={() => completeJournal(conversation)}
                className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2"
                size="lg"
              >
                <Sparkles className="w-4 h-4" />
                Generate My Journal Entry
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                Ready to create your journal entry? You can continue chatting or generate it now.
              </p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
