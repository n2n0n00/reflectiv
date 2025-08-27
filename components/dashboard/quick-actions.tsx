import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const quickActions = [
  // {
  //   title: "Start Today's Session",
  //   description: "Continue your journaling journey",
  //   icon: "✍️",
  //   href: "/journal/new",
  //   primary: true,
  // },
  // {
  //   title: "View Weekly Insights",
  //   description: "See your progress and patterns",
  //   icon: "📊",
  //   href: "/insights/weekly",
  //   primary: false,
  // },
  {
    title: "Export Entries",
    description: "Download your journal as PDF",
    icon: "📄",
    href: "/export",
    primary: false,
  },
  {
    title: "Update Profile",
    description: "Personalize your AI experience",
    icon: "⚙️",
    href: "/profile",
    primary: false,
  },
];

export function QuickActions() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-serif text-foreground">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickActions.map((action, index) => (
          <Link key={index} href={action.href}>
            <Button
              variant={action.primary ? "default" : "ghost"}
              className={`w-full justify-start h-auto p-4 ${
                action.primary
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{action.icon}</span>
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div
                    className={`text-xs ${
                      action.primary
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                    }`}
                  >
                    {action.description}
                  </div>
                </div>
              </div>
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
