"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { templates } from "@/lib/utils";
import Link from "next/link";
import supabase from "@/lib/supabase/ssrUpdatedClient";
import { useAuth } from "@/lib/auth-context";

export function TemplateSelection() {
  const { user } = useAuth();
  const [sessionContext, setSessionContext] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");

  const selectedTemplateData = templates.find((t) => t.id === templateId);

  const handleStartJournal = async () => {
    if (!templateId || !selectedTemplateData || !user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("journals")
      .insert({
        template_id: templateId,
        template_name: selectedTemplateData.name,
        template_color: selectedTemplateData.color,
        user_context: sessionContext || null,
        user_id: user.id,
      })
      .select("id")
      .single();

    setLoading(false);

    if (error) {
      console.error("Failed to create journal:", error);
      return;
    }

    const journalId = data.id;
    router.push(`/journal/session/${templateId}/${journalId}`);
  };

  return (
    <div className="space-y-8">
      <Card className="border-primary bg-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div
              className={`w-4 h-4 ${selectedTemplateData?.color} rounded-full`}
            ></div>
            <span className="font-serif text-foreground">
              Ready to start: {selectedTemplateData?.name}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="context" className="text-foreground">
              Session Context (Optional)
            </Label>
            <Textarea
              id="context"
              placeholder="Share what's on your mind today or any specific situation you'd like to explore..."
              value={sessionContext}
              onChange={(e) => setSessionContext(e.target.value)}
              className="bg-input border-border focus:ring-ring min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">
              This helps the AI provide more personalized and relevant questions
              for your session.
            </p>
          </div>

          <div className="flex space-x-4">
            <Button
              onClick={handleStartJournal}
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1"
            >
              Start Journaling Session
            </Button>
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-muted bg-transparent"
            >
              <Link href="/templates">Choose Different Template</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
