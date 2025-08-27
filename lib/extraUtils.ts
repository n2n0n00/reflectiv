// Type definitions
export interface JournalEntry {
  id: string;
  journal_id: string;
  user_id: string;
  content: string;
  template: string;
  template_color: string;
  created_at: string;
  updated_at: string;
  is_exported: boolean;
  export_count: number;
  journals:
    | {
        id: string;
        template_name: string;
        template_color: string;
        user_context?: string;
      }[]
    | null;
}

export interface ProcessedEntry {
  id: string;
  date: string;
  template: string;
  title: string;
  content: string;
  color: string;
  wordCount: number;
  insights: string[];
  sessionDuration: string;
  aiQuestions: number;
  journal_id: string;
  is_exported: boolean;
  export_count: number;
}

// Helper functions
export function extractTitle(content: string): string {
  const firstLine = content.split("\n")[0];
  if (firstLine && firstLine.length > 0) {
    return firstLine.length > 60
      ? firstLine.substring(0, 60) + "..."
      : firstLine;
  }
  return "Journal Entry";
}

export function countWords(content: string): number {
  return content
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

export function extractInsights(content: string): string[] {
  // Look for bullet points or numbered lists that might be insights
  const insights: string[] = [];
  const lines = content.split("\n");

  for (const line of lines) {
    const trimmedLine = line.trim();
    // Look for patterns like "- ", "• ", "1. ", etc.
    if (trimmedLine.match(/^[-•*]\s+/) || trimmedLine.match(/^\d+\.\s+/)) {
      const insight = trimmedLine
        .replace(/^[-•*]\s+/, "")
        .replace(/^\d+\.\s+/, "");
      if (insight.length > 20 && insight.length < 200) {
        // Filter for reasonable insight length
        insights.push(insight);
      }
    }
    // Look for lines that start with key phrases
    else if (
      trimmedLine.match(
        /^(I learned|I realized|I discovered|Key takeaway|Important)/i
      )
    ) {
      if (trimmedLine.length > 20 && trimmedLine.length < 200) {
        insights.push(trimmedLine);
      }
    }
  }

  // If no structured insights found, create some based on content analysis
  if (insights.length === 0) {
    const sentences = content
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 0);
    const meaningfulSentences = sentences.filter(
      (s) =>
        s.length > 30 &&
        (s.toLowerCase().includes("understand") ||
          s.toLowerCase().includes("realize") ||
          s.toLowerCase().includes("learn") ||
          s.toLowerCase().includes("important") ||
          s.toLowerCase().includes("discovered"))
    );

    insights.push(...meaningfulSentences.slice(0, 3).map((s) => s.trim()));
  }

  return insights.slice(0, 5); // Limit to 5 insights max
}

export function estimateSessionDuration(wordCount: number): string {
  // Rough estimate: average person writes 20-30 words per minute when journaling
  const minutes = Math.round(wordCount / 25);
  return `${minutes} minutes`;
}

export function estimateAiQuestions(wordCount: number): number {
  // Rough estimate: one AI question per 100-150 words
  return Math.round(wordCount / 120);
}

export function getColorClass(templateColor: string): string {
  const colorMap: { [key: string]: string } = {
    "blue": "bg-blue-500",
    "green": "bg-green-500",
    "purple": "bg-purple-500",
    "red": "bg-red-500",
    "yellow": "bg-yellow-500",
    "indigo": "bg-indigo-500",
    "pink": "bg-pink-500",
    "teal": "bg-teal-500",
  };

  return colorMap[templateColor] || "bg-chart-1";
}

export function getWeekRange(date: Date = new Date()): string {
  // clone so we don't mutate original date
  const currentDate = new Date(date);

  // get day of week (0 = Sunday, 6 = Saturday)
  const dayOfWeek = currentDate.getDay();

  // find Monday (start of week) – adjust depending on week start preference
  const weekStart = new Date(currentDate);
  weekStart.setDate(currentDate.getDate() - dayOfWeek + 1); // Monday as first day

  // find Sunday (end of week)
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  // format month names
  const options: Intl.DateTimeFormatOptions = { month: "short" };
  const startMonth = weekStart.toLocaleDateString("en-US", options);
  const endMonth = weekEnd.toLocaleDateString("en-US", options);

  const startDay = weekStart.getDate();
  const endDay = weekEnd.getDate();
  const year = currentDate.getFullYear();

  // if both in same month
  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}-${endDay}, ${year}`;
  } else {
    // if crossing months
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
  }
}

export function fixTypeOf(insights: any) {
  let keyThemesText = insights?.keyThemes;

  if (typeof keyThemesText !== "string") return keyThemesText;

  // Remove code fences
  let cleaned = keyThemesText.replace(/```json|```/g, "").trim();

  // If it's valid JSON → parse it
  if (cleaned.startsWith("{") && cleaned.endsWith("}")) {
    try {
      const parsed = JSON.parse(cleaned);
      return parsed.keyThemes || cleaned;
    } catch {
      // Fall through to regex extraction
    }
  }

  // ✅ Regex to extract "keyThemes" value even if JSON is malformed
  const match = cleaned.match(/"keyThemes"\s*:\s*"([^"]*)/);
  if (match) {
    return match[1]; // only the inside text
  }

  // Fallback → just return whatever we have
  return cleaned;
}
