import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const templates = [
  {
    id: "people-pleasing",
    name: "People Pleasing",
    description:
      "Learn to set boundaries and prioritize your own needs without guilt or fear of disappointing others.",
    color: "bg-blue-500",
    difficulty: "Beginner",
    duration: "15-20 min",
    focus: [
      "Boundary setting",
      "Saying no",
      "Authentic behavior",
      "Self-advocacy",
    ],
    questions:
      "Explores situations where you struggle to say no, fear of disappointing others, and building confidence in your own needs.",
    popularity: "Most Popular",
    sessions: 1247,
  },
  {
    id: "overthinking",
    name: "Overthinking",
    description:
      "Break free from worry loops, analysis paralysis, and the mental chatter that keeps you stuck.",
    color: "bg-green-500",
    difficulty: "Intermediate",
    duration: "20-25 min",
    focus: [
      "Decision making",
      "Rumination cycles",
      "Mental clarity",
      "Present moment awareness",
    ],
    questions:
      "Examines thought patterns, decision-making processes, and strategies to quiet mental chatter and find clarity.",
    popularity: "Trending",
    sessions: 892,
  },
  {
    id: "perfectionism",
    name: "Perfectionism",
    description:
      "Embrace 'good enough' and overcome procrastination that stems from fear of imperfection.",
    color: "bg-purple-500",
    difficulty: "Intermediate",
    duration: "20-30 min",
    focus: [
      "Fear of imperfection",
      "Procrastination",
      "Self-acceptance",
      "Progress over perfection",
    ],
    questions:
      "Investigates perfectionist tendencies, fear of failure, and finding balance between excellence and completion.",
    popularity: "Popular",
    sessions: 743,
  },
  {
    id: "imposter-syndrome",
    name: "Imposter Syndrome",
    description:
      "Document your achievements and build authentic confidence in your abilities and accomplishments.",
    color: "bg-yellow-500",
    difficulty: "Advanced",
    duration: "25-30 min",
    focus: [
      "Self-doubt",
      "Competence evidence",
      "Achievement recognition",
      "Authentic confidence",
    ],
    questions:
      "Focuses on recognizing accomplishments, challenging self-doubt, and building genuine confidence in your abilities.",
    popularity: "Growing",
    sessions: 567,
  },
  {
    id: "social-anxiety",
    name: "Social Anxiety",
    description:
      "Track social interactions and expand your comfort zone gradually through mindful reflection.",
    color: "bg-pink-500",
    difficulty: "Intermediate",
    duration: "15-25 min",
    focus: [
      "Social comfort",
      "Interaction reflection",
      "Confidence building",
      "Connection skills",
    ],
    questions:
      "Explores social situations, comfort zones, and strategies for meaningful connections without overwhelming anxiety.",
    popularity: "Popular",
    sessions: 634,
  },
  {
    id: "comparison-trap",
    name: "Comparison Trap",
    description:
      "Focus on personal growth instead of measuring your worth against others' highlight reels.",
    color: "bg-indigo-500",
    difficulty: "Advanced",
    duration: "20-25 min",
    focus: [
      "Social media impact",
      "Self-worth",
      "Personal progress",
      "Internal validation",
    ],
    questions:
      "Examines comparison habits, social media influence, and developing internal validation and self-compassion.",
    popularity: "New",
    sessions: 289,
  },
];

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
  journals: {
    template_name: string;
    template_color: string;
  } | null;
}

export interface ProcessedEntry {
  id: string;
  date: string;
  template: string;
  title: string;
  preview: string;
  color: string;
  created_at?: Date;
}

// Helper function to extract title from content
export function extractTitle(content: string): string {
  // Try to find first line or first sentence as title
  const firstLine = content.split("\n")[0];
  if (firstLine && firstLine.length > 0) {
    // Limit title length and clean up
    return firstLine.length > 50
      ? firstLine.substring(0, 50) + "..."
      : firstLine;
  }
  return "Journal Entry";
}

// Helper function to extract preview from content
export function extractPreview(content: string): string {
  // Remove the title line and get preview
  const lines = content.split("\n");
  const previewText = lines.length > 1 ? lines.slice(1).join(" ") : content;
  return previewText.length > 150
    ? previewText.substring(0, 150) + "..."
    : previewText;
}

// Helper function to map template color to Tailwind classes
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
