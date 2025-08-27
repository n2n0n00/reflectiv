"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Users, Clock, Target } from "lucide-react";
import Link from "next/link";
import { templates } from "@/lib/utils";

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedPopularity, setSelectedPopularity] = useState("all");

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.focus.some((f) =>
        f.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesDifficulty =
      selectedDifficulty === "all" ||
      template.difficulty === selectedDifficulty;
    const matchesPopularity =
      selectedPopularity === "all" ||
      template.popularity === selectedPopularity;

    return matchesSearch && matchesDifficulty && matchesPopularity;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-serif font-bold text-foreground">
              Therapeutic Journal Templates
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Choose from our collection of evidence-based templates designed to
              help you work through specific challenges and build emotional
              resilience.
            </p>
          </div>

          {/* Filters */}
          <Card className="p-6 border-border bg-card">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-foreground">
                <Filter className="w-4 h-4" />
                <h3 className="font-medium">Find Your Perfect Template</h3>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-input border-border focus:ring-ring"
                  />
                </div>

                <Select
                  value={selectedDifficulty}
                  onValueChange={setSelectedDifficulty}
                >
                  <SelectTrigger className="bg-input border-border focus:ring-ring">
                    <SelectValue placeholder="All Difficulties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={selectedPopularity}
                  onValueChange={setSelectedPopularity}
                >
                  <SelectTrigger className="bg-input border-border focus:ring-ring">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Most Popular">Most Popular</SelectItem>
                    <SelectItem value="Trending">Trending</SelectItem>
                    <SelectItem value="Popular">Popular</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Templates Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className="border-border bg-card hover:shadow-lg transition-all group"
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-4 h-4 ${template.color} rounded-full`}
                      ></div>
                      <CardTitle className="text-lg font-serif text-foreground group-hover:text-primary transition-colors">
                        {template.name}
                      </CardTitle>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <Badge variant="outline" className="text-xs">
                        {template.difficulty}
                      </Badge>
                      {template.popularity && (
                        <Badge
                          variant={
                            template.popularity === "Most Popular"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {template.popularity}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {template.description}
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{template.duration}</span>
                      </div>
                      {/* <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{template.sessions.toLocaleString()} sessions</span>
                      </div> */}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-1 text-xs font-medium text-foreground">
                        <Target className="w-3 h-3" />
                        <span>Focus Areas:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {template.focus.slice(0, 3).map((focus, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {focus}
                          </Badge>
                        ))}
                        {template.focus.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{template.focus.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-foreground">
                        What to Expect:
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {template.questions}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/journal/new?template=${template.id}`}
                    className="block"
                  >
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      Start This Template
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <Card className="p-12 text-center border-border bg-card">
              <div className="space-y-4">
                <Search className="w-12 h-12 text-muted-foreground mx-auto" />
                <h3 className="text-lg font-serif font-semibold text-foreground">
                  No templates found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters.
                </p>
              </div>
            </Card>
          )}

          {/* Call to Action */}
          <Card className="p-8 text-center border-primary bg-card">
            <div className="space-y-4">
              <h3 className="text-xl font-serif font-semibold text-foreground">
                Need help choosing?
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Not sure which template is right for you? Start with People
                Pleasing if you struggle with boundaries, or Overthinking if you
                get stuck in worry loops.
              </p>
              <div className="flex justify-center space-x-4">
                <Link href="/journal/new?template=people-pleasing">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Start with People Pleasing
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    className="border-border text-foreground hover:bg-muted bg-transparent"
                  >
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
