import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const templates = [
  {
    title: "People Pleasing",
    description: "Learn to set boundaries and prioritize your own needs without guilt.",
    color: "bg-chart-1",
    issues: ["Boundary setting", "Saying no", "Authentic behavior"],
  },
  {
    title: "Overthinking",
    description: "Break free from worry loops and analysis paralysis.",
    color: "bg-chart-2",
    issues: ["Decision making", "Rumination cycles", "Mental clarity"],
  },
  {
    title: "Perfectionism",
    description: "Embrace 'good enough' and overcome procrastination from fear.",
    color: "bg-chart-3",
    issues: ["Fear of imperfection", "Procrastination", "Self-acceptance"],
  },
  {
    title: "Imposter Syndrome",
    description: "Document your achievements and build confidence in your abilities.",
    color: "bg-chart-4",
    issues: ["Self-doubt", "Competence evidence", "Achievement recognition"],
  },
  {
    title: "Social Anxiety",
    description: "Track social interactions and expand your comfort zone gradually.",
    color: "bg-chart-5",
    issues: ["Social comfort", "Interaction reflection", "Confidence building"],
  },
  {
    title: "Comparison Trap",
    description: "Focus on personal growth instead of measuring against others.",
    color: "bg-primary",
    issues: ["Social media impact", "Self-worth", "Personal progress"],
  },
]

export function TemplatesSection() {
  return (
    <section id="templates" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
            Specialized Journaling Templates
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose a focused path that addresses your specific challenges. Each template provides targeted questions and
            insights.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template, index) => (
            <Card key={index} className="border-border bg-card hover:shadow-lg transition-shadow group">
              <CardHeader>
                <div
                  className={`w-12 h-12 ${template.color} rounded-lg mb-4 opacity-80 group-hover:opacity-100 transition-opacity`}
                ></div>
                <CardTitle className="text-xl font-serif text-foreground">{template.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">{template.description}</p>
                <div className="flex flex-wrap gap-2">
                  {template.issues.map((issue, issueIndex) => (
                    <Badge key={issueIndex} variant="secondary" className="text-xs">
                      {issue}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
