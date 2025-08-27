"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { signUp } from "@/lib/actions"

function SubmitButton({ agreeToTerms }: { agreeToTerms: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending || !agreeToTerms}
      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating account...
        </>
      ) : (
        "Start Free Trial"
      )}
    </Button>
  )
}

export function SignupForm() {
  const [state, formAction] = useActionState(signUp, null)
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-700 px-4 py-3 rounded">{state.error}</div>
      )}

      {state?.success && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-700 px-4 py-3 rounded">
          {state.success}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-foreground">
          Full Name
        </Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="Enter your full name"
          required
          className="bg-input border-border focus:ring-ring"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          required
          className="bg-input border-border focus:ring-ring"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-foreground">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Create a password"
          required
          className="bg-input border-border focus:ring-ring"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-foreground">
          Tell us about yourself (Optional)
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Share a bit about your background, work, or what you'd like to explore through journaling. This helps our AI provide more personalized guidance."
          className="bg-input border-border focus:ring-ring min-h-[80px]"
        />
        <p className="text-xs text-muted-foreground">
          This information helps our AI provide more relevant and personalized journaling questions.
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={agreeToTerms}
          onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
          className="border-border"
        />
        <Label htmlFor="terms" className="text-sm text-muted-foreground">
          I agree to the{" "}
          <Link href="/terms" className="text-primary hover:text-primary/80">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary hover:text-primary/80">
            Privacy Policy
          </Link>
        </Label>
      </div>

      <SubmitButton agreeToTerms={agreeToTerms} />

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </form>
  )
}
