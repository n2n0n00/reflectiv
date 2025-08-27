import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const availableTemplates = [
  {
    id: 1,
    name: "Perfectionism",
    description: "Embrace 'good enough' and overcome fear of imperfection",
    color: "bg-chart-3",
    isNew: true,
    difficulty: "Beginner",
  },
  {
    id: 2,
    name: "Imposter Syndrome",
    description: "Build confidence and recognize your achievements",
    color: "bg-chart-4",
    isNew: false,
    difficulty: "Intermediate",
  },
  {
    id: 3,
    name: "Social Anxiety",
    description: "Expand your comfort zone through guided reflection",
    color: "bg-chart-5",
    isNew: false,
    difficulty: "Intermediate",
  },
  {
    id: 4,
    name: "Comparison Trap",
    description: "Focus on personal growth instead of comparing to others",
    color: "bg-primary",
    isNew: true,
    difficulty: "Advanced",
  },
]

export function TemplateSelector() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold text-foreground">Explore New Templates</h2>
        <Link href="/templates">
          <Button variant="outline" className="border-border text-foreground hover:bg-muted bg-transparent">
            View All Templates
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {availableTemplates.map((template) => (
          <Card key={template.id} className="border-border bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 ${template.color} rounded-full`}></div>
                    <h3 className="font-serif font-semibold text-foreground">{template.name}</h3>
                  </div>
                  <div className="flex space-x-2">
                    {template.isNew && (
                      <Badge variant="secondary" className="text-xs bg-accent text-accent-foreground">
                        New
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {template.difficulty}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">{template.description}</p>

                <Link href={`/templates/${template.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-border text-foreground hover:bg-muted bg-transparent"
                  >
                    Start This Template
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
