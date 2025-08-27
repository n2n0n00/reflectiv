"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "@/lib/auth-context"
import { Loader2, Plus, X } from "lucide-react"

export default function ProfileSetupPage() {
  const [description, setDescription] = useState("")
  const [interests, setInterests] = useState<string[]>([])
  const [goals, setGoals] = useState<string[]>([])
  const [journalingExperience, setJournalingExperience] = useState("")
  const [questionStyle, setQuestionStyle] = useState("")
  const [newInterest, setNewInterest] = useState("")
  const [newGoal, setNewGoal] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()])
      setNewInterest("")
    }
  }

  const removeInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest))
  }

  const addGoal = () => {
    if (newGoal.trim() && !goals.includes(newGoal.trim())) {
      setGoals([...goals, newGoal.trim()])
      setNewGoal("")
    }
  }

  const removeGoal = (goal: string) => {
    setGoals(goals.filter((g) => g !== goal))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!description.trim()) {
      setError("Please provide a description about yourself")
      setLoading(false)
      return
    }

    if (!journalingExperience) {
      setError("Please select your journaling experience level")
      setLoading(false)
      return
    }

    if (!questionStyle) {
      setError("Please select your preferred question style")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/profile/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: description.trim(),
          interests,
          goals,
          journalingExperience,
          questionStyle,
        }),
      })

      if (response.ok) {
        router.push("/dashboard")
      } else {
        const data = await response.json()
        setError(data.error || "Failed to save profile")
      }
    } catch (err) {
      setError("Failed to save profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-600 font-sans mb-2">Welcome to MindFlow!</h1>
          <p className="text-slate-600">Let's personalize your journaling experience</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-sans">Tell us about yourself</CardTitle>
            <CardDescription>
              This information helps our AI create personalized questions that resonate with your unique journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">About You</Label>
                <Textarea
                  id="description"
                  placeholder="Tell us about yourself, your life situation, what you're working on, challenges you're facing, or anything that would help us ask better questions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[120px]"
                  disabled={loading}
                />
                <p className="text-sm text-slate-500">
                  The more you share, the better we can tailor your daily questions
                </p>
              </div>

              {/* Interests */}
              <div className="space-y-2">
                <Label>Interests & Hobbies</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add an interest..."
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())}
                    disabled={loading}
                  />
                  <Button type="button" onClick={addInterest} size="sm" disabled={loading}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {interests.map((interest) => (
                    <Badge key={interest} variant="secondary" className="flex items-center gap-1">
                      {interest}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeInterest(interest)} />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Goals */}
              <div className="space-y-2">
                <Label>Current Goals</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a goal..."
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addGoal())}
                    disabled={loading}
                  />
                  <Button type="button" onClick={addGoal} size="sm" disabled={loading}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {goals.map((goal) => (
                    <Badge key={goal} variant="secondary" className="flex items-center gap-1">
                      {goal}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeGoal(goal)} />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Journaling Experience */}
              <div className="space-y-3">
                <Label>Journaling Experience</Label>
                <RadioGroup value={journalingExperience} onValueChange={setJournalingExperience}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="beginner" id="beginner" />
                    <Label htmlFor="beginner">Beginner - New to journaling</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intermediate" id="intermediate" />
                    <Label htmlFor="intermediate">Intermediate - Some journaling experience</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="experienced" id="experienced" />
                    <Label htmlFor="experienced">Experienced - Regular journaler</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Question Style */}
              <div className="space-y-3">
                <Label>Preferred Question Style</Label>
                <RadioGroup value={questionStyle} onValueChange={setQuestionStyle}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="reflective" id="reflective" />
                    <Label htmlFor="reflective">
                      Reflective - Deep, thoughtful questions about emotions and experiences
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="goal-oriented" id="goal-oriented" />
                    <Label htmlFor="goal-oriented">
                      Goal-oriented - Questions focused on progress and achievements
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="creative" id="creative" />
                    <Label htmlFor="creative">Creative - Imaginative and open-ended questions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="analytical" id="analytical" />
                    <Label htmlFor="analytical">Analytical - Structured questions that help you analyze patterns</Label>
                  </div>
                </RadioGroup>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up your profile...
                  </>
                ) : (
                  "Complete Setup"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
