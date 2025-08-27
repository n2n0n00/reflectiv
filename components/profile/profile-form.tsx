"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import supabase from "@/lib/supabase/ssrUpdatedClient";

export function ProfileForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    timezone: "",
    avatar: "/generic-user-avatar.png",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.user_metadata?.full_name || "",
        email: user.user_metadata.email || "",
        bio: user.user_metadata?.description || "",
        timezone: user.user_metadata?.timezone || "",
        avatar: user.user_metadata?.avatar_url || "/generic-user-avatar.png",
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({
      email: formData.email, // allow updating email too
      data: {
        full_name: formData.name,
        description: formData.bio,
        timezone: formData.timezone,
        avatar_url: formData.avatar,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Profile updated successfully!");
    }

    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-xl font-serif text-foreground">
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          {/* <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={formData.avatar || "/placeholder.svg"} alt={formData.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {formData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <Button
              type="button"
              variant="outline"
              className="border-border text-foreground hover:bg-muted bg-transparent"
            >
              <Camera className="w-4 h-4 mr-2" />
              Change Photo
            </Button>
          </div> */}

          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Full Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="bg-input border-border focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="bg-input border-border focus:ring-ring"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-foreground">
              About You
            </Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              className="bg-input border-border focus:ring-ring min-h-[120px]"
              placeholder="Tell us about yourself, your background, and what you'd like to explore through journaling..."
            />
            <p className="text-xs text-muted-foreground">
              This information helps our AI provide more personalized and
              relevant questions during your journaling sessions.
            </p>
          </div>

          {/* Timezone */}
          <div className="space-y-2">
            <Label htmlFor="timezone" className="text-foreground">
              Timezone
            </Label>
            <select
              id="timezone"
              value={formData.timezone}
              onChange={(e) => handleInputChange("timezone", e.target.value)}
              className="w-full p-2 bg-input border border-border rounded-md focus:ring-2 focus:ring-ring text-foreground"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
            </select>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
