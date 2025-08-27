import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    title: "AI-Guided Conversations",
    description:
      "No more staring at blank pages. Our AI asks the right questions to unlock your thoughts and feelings.",
    icon: "💬",
  },
  {
    title: "Personalized Insights",
    description: "Get tailored questions based on your background, previous entries, and current challenges.",
    icon: "🎯",
  },
  {
    title: "Weekly Summaries",
    description: "Discover patterns in your thinking with AI-generated weekly insights and progress tracking.",
    icon: "📊",
  },
  {
    title: "Problem-Focused Templates",
    description: "Choose from specialized journaling paths for overthinking, people-pleasing, perfectionism, and more.",
    icon: "🗂️",
  },
  {
    title: "Export Your Journey",
    description: "Download your complete journal entries as PDF or Word documents to keep forever.",
    icon: "📄",
  },
  {
    title: "Private & Secure",
    description: "Your thoughts are encrypted and private. We never share your personal journaling data.",
    icon: "🔒",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Why MindfulPath Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Traditional journaling can feel overwhelming. Our AI makes it effortless by guiding you through meaningful
            conversations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <CardTitle className="text-xl font-serif text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
