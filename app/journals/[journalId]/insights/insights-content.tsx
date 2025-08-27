"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, TrendingUp, Calendar, Target, BarChart3 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { getTemplateById } from "@/lib/problem-templates"
import { JournalDownload } from "@/components/journal-download"

interface JournalEntry {
  id: number
  journal_id: string
  template_id: string
  date: string
  questions: string[]
  answers: string[]
  generated_entry: string
  created_at: string
}

interface Journal {
  id: string
  template_id: string
  title: string
  description: string
  entry_count: number
  last_entry_date: string
  created_at: string
}

interface JournalInsights {
  totalEntries: number
  weeklyEntries: number
  consistency: number
  currentStreak: number
  templateMetrics: Record<string, number>
  insights: {
    progress: string
    patterns: string
    recommendation: string
  }
  topThemes: string[]
}

export default function JournalInsightsContent({ journalId }: { journalId: string }) {
  const { user } = useAuth()
  const [journal, setJournal] = useState<Journal | null>(null)
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [insights, setInsights] = useState<JournalInsights | null>(null)
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadJournalData = async () => {
      if (!user) return

      try {
        setLoading(true)

        // Load journal details
        const journalResponse = await fetch(`/api/journals/${journalId}?userId=${user.id}`)
        if (journalResponse.ok) {
          const journalData = await journalResponse.json()
          setJournal(journalData.journal)
        }

        // Load journal entries
        const entriesResponse = await fetch(`/api/journal-entries?userId=${user.id}&journalId=${journalId}`)
        if (entriesResponse.ok) {
          const entriesData = await entriesResponse.json()
          setEntries(entriesData.entries || [])
        }

        // Load AI insights for this journal
        const insightsResponse = await fetch("/api/ai/generate-insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, journalId }),
        })

        if (insightsResponse.ok) {
          const insightsData = await insightsResponse.json()
          setInsights(insightsData)
        }
      } catch (error) {
        console.error("Error loading journal data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadJournalData()
  }, [user, journalId])

  const template = journal ? getTemplateById(journal.template_id) : null

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading journal insights...</p>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (selectedEntry) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button onClick={() => setSelectedEntry(null)} variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Insights
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                {new Date(selectedEntry.date || selectedEntry.created_at).toLocaleDateString()}
              </h1>
              {template && <Badge className={`${template.color} text-white`}>{template.title}</Badge>}
            </div>

            <Card>
              <CardContent className="p-8">
                <div className="prose prose-emerald max-w-none">
                  {selectedEntry.generated_entry ? (
                    selectedEntry.generated_entry.split("\n").map((paragraph, index) => (
                      <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                        {paragraph && paragraph.startsWith("**") && paragraph.endsWith("**") ? (
                          <strong className="text-xl text-gray-900">{paragraph.slice(2, -2)}</strong>
                        ) : (
                          paragraph
                        )}
                      </p>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">This entry doesn't have generated content yet.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <Button onClick={() => (window.location.href = "/dashboard")} variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Button>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {template && <div className={`p-2 ${template.color} text-white rounded-lg`}>{template.icon}</div>}
                  <h1 className="text-3xl font-bold text-gray-900">{journal?.title}</h1>
                </div>
                <p className="text-gray-600">{journal?.description}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <JournalDownload journalId={journalId} />
              <Button onClick={() => (window.location.href = `/journal/${journalId}`)} className="gap-2">
                <BookOpen className="w-4 h-4" />
                Add Entry
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <BookOpen className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{insights?.totalEntries || entries.length}</p>
                    <p className="text-sm text-gray-600">Total Entries</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{insights?.weeklyEntries || 0}</p>
                    <p className="text-sm text-gray-600">This Week</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{insights?.consistency || 0}%</p>
                    <p className="text-sm text-gray-600">Consistency</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Target className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{insights?.currentStreak || 0}</p>
                    <p className="text-sm text-gray-600">Current Streak</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {template && insights?.templateMetrics && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  {template.title} Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {template.metrics.map((metric, index) => (
                    <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{insights.templateMetrics[metric] || 0}%</p>
                      <p className="text-sm text-gray-600">{metric}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {insights && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-emerald-800">Progress Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">{insights.insights.progress}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-800">Patterns & Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-blue-700 mb-1">Patterns</h4>
                      <p className="text-sm text-gray-700">{insights.insights.patterns}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-700 mb-1">Recommendation</h4>
                      <p className="text-sm text-gray-700">{insights.insights.recommendation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Past Entries
              </CardTitle>
            </CardHeader>
            <CardContent>
              {entries.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No entries yet</h3>
                  <p className="text-gray-600 mb-4">Start your {template?.title.toLowerCase()} journey today!</p>
                  <Button onClick={() => (window.location.href = `/journal/${journalId}`)} className="gap-2">
                    <BookOpen className="w-4 h-4" />
                    Add First Entry
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {entries
                    .sort(
                      (a, b) => new Date(b.date || b.created_at).getTime() - new Date(a.date || a.created_at).getTime(),
                    )
                    .map((entry) => (
                      <div
                        key={entry.id}
                        onClick={() => setSelectedEntry(entry)}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {template && (
                            <div className={`p-2 ${template.color} text-white rounded-lg text-sm`}>{template.icon}</div>
                          )}
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {new Date(entry.date || entry.created_at).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {entry.generated_entry
                                ? `${entry.generated_entry.slice(0, 100)}...`
                                : "Entry in progress..."}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {new Date(entry.date || entry.created_at).toLocaleDateString()}
                        </Badge>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
