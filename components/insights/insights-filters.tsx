"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Filter } from "lucide-react";
import { TimeRange } from "@/hooks/useInsightsData";

const timeRanges: { label: string; value: TimeRange }[] = [
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "Last 3 Months", value: "quarter" },
  { label: "All Time", value: "all" },
];

const templateFilters = [
  { label: "People Pleasing", value: "people-pleasing", color: "bg-blue-500" },
  { label: "Overthinking", value: "overthinking", color: "bg-green-500" },
  { label: "Perfectionism", value: "perfectionism", color: "bg-purple-500" },
  {
    label: "Imposter Syndrome",
    value: "imposter-syndrome",
    color: "bg-yellow-500",
  },
  {
    label: "Social Anxiety",
    value: "social-anxiety",
    color: "bg-pink-500",
  },
  {
    label: "Comparison Trap",
    value: "comparison-trap",
    color: "bg-indigo-500",
  },
];

interface Props {
  selectedTimeRange: TimeRange;
  selectedTemplates: string[];
  onFilterChange: (timeRange: TimeRange, templates: string[]) => void;
}

export function InsightsFilters({
  selectedTimeRange,
  selectedTemplates,
  onFilterChange,
}: Props) {
  const toggleTemplate = (templateValue: string) => {
    const newTemplates = selectedTemplates.includes(templateValue)
      ? selectedTemplates.filter((t) => t !== templateValue)
      : [...selectedTemplates, templateValue];
    onFilterChange(selectedTimeRange, newTemplates);
  };

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Time Range Filter */}
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              Time Range:
            </span>
            <div className="flex flex-wrap lg:space-x-1">
              {timeRanges.map((range) => (
                <Button
                  key={range.value}
                  variant={
                    selectedTimeRange === range.value ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => onFilterChange(range.value, selectedTemplates)}
                  className={
                    selectedTimeRange === range.value
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : "border-border text-foreground hover:bg-muted bg-transparent"
                  }
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Template Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              Templates:
            </span>
            <div className="flex flex-wrap gap-1">
              {templateFilters.map((template) => (
                <Badge
                  key={template.value}
                  variant={
                    selectedTemplates.includes(template.value)
                      ? "default"
                      : "outline"
                  }
                  className={`cursor-pointer text-xs ${
                    selectedTemplates.includes(template.value)
                      ? `${template.color} text-white hover:opacity-80`
                      : "border-border text-foreground hover:bg-muted"
                  }`}
                  onClick={() => toggleTemplate(template.value)}
                >
                  {template.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
