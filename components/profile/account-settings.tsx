"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Shield } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabase/ssrUpdatedClient";

const notificationSettings = [
  {
    id: "weekly-insights",
    label: "Weekly Insights",
    description: "Receive AI-generated insights about your journaling patterns",
  },
  {
    id: "journal-reminders",
    label: "Journal Reminders",
    description: "Daily reminders to maintain your journaling habit",
  },
  {
    id: "progress-updates",
    label: "Progress Updates",
    description: "Monthly updates on your personal growth journey",
  },
];

export function AccountSettings() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Record<string, boolean>>(
    {}
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("user_settings")
        .select("notifications")
        .eq("user_id", user.id)
        .single();

      if (!error && data?.notifications) {
        setNotifications(data.notifications);
      } else {
        // Initialize with all true/false defaults
        const defaults: Record<string, boolean> = {};
        notificationSettings.forEach((n) => (defaults[n.id] = true));
        setNotifications(defaults);
      }

      setLoading(false);
    };

    fetchSettings();
  }, [user]);

  const handleToggle = async (key: string, value: boolean) => {
    if (!user) return;

    const updated = { ...notifications, [key]: value };
    setNotifications(updated);

    const { error } = await supabase
      .from("user_settings")
      .upsert([{ user_id: user.id, notifications: updated }], {
        onConflict: "user_id",
      });

    if (error) console.error("Failed to update notifications:", error.message);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-primary" />
            <span className="font-serif">Notification Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {notificationSettings.map((setting) => (
            <div key={setting.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <Label
                  htmlFor={setting.id}
                  className="text-foreground font-medium"
                >
                  {setting.label}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {setting.description}
                </p>
              </div>
              <Switch
                id={setting.id}
                checked={notifications[setting.id]}
                onCheckedChange={(val) => handleToggle(setting.id, val)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-serif">Security</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Change Password</h4>
              <p className="text-sm text-muted-foreground">
                Update your account password
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-border text-foreground hover:bg-muted bg-transparent"
            >
              Change
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">
                Two-Factor Authentication
              </h4>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-border text-foreground hover:bg-muted bg-transparent"
            >
              Enable
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
