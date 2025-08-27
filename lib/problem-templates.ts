export interface ProblemTemplate {
  id: string
  title: string
  description: string
  category: string
  color: string
  icon: string
  focusAreas: string[]
  questionTypes: string[]
  metrics: string[]
  aiPromptContext: string
}

export const PROBLEM_TEMPLATES: ProblemTemplate[] = [
  {
    id: "people-pleasing",
    title: "People Pleasing",
    description: "Break free from the need to constantly please others at your own expense",
    category: "Boundaries",
    color: "bg-rose-500",
    icon: "👥",
    focusAreas: [
      "Boundary setting",
      "Saying no authentically",
      "Authentic vs. performative behavior",
      "Self-worth independent of approval",
    ],
    questionTypes: ["boundary_moments", "people_pleasing_triggers", "authentic_responses", "self_advocacy"],
    metrics: [
      "Boundary Setting Success Rate",
      "Authentic Response Frequency",
      "Self-Advocacy Moments",
      "Approval-Seeking Reduction",
    ],
    aiPromptContext:
      "You are helping someone overcome people-pleasing patterns. Focus on boundary setting, authentic self-expression, and building self-worth independent of others' approval. Ask about specific situations where they felt pressured to please others, moments they successfully set boundaries, and their internal experience during these interactions.",
  },
  {
    id: "overthinking",
    title: "Overthinking & Analysis Paralysis",
    description: "Break free from worry loops and decision-making paralysis",
    category: "Mental Patterns",
    color: "bg-purple-500",
    icon: "🧠",
    focusAreas: [
      "Worry loop identification",
      "Decision-making patterns",
      "Rumination cycles",
      "Action vs. analysis balance",
    ],
    questionTypes: ["worry_loops", "decision_paralysis", "rumination_triggers", "action_steps"],
    metrics: ["Decision Speed Improvement", "Worry Loop Duration", "Action-to-Analysis Ratio", "Mental Clarity Score"],
    aiPromptContext:
      "You are helping someone break free from overthinking and analysis paralysis. Focus on identifying worry patterns, decision-making blocks, and finding the balance between thinking and action. Ask about specific decisions they're struggling with, recurring worry themes, and moments when they successfully moved from analysis to action.",
  },
  {
    id: "perfectionism",
    title: "Perfectionism",
    description: "Embrace 'good enough' and overcome fear of imperfection",
    category: "Self-Acceptance",
    color: "bg-blue-500",
    icon: "⭐",
    focusAreas: [
      "Good enough vs. perfect moments",
      "Procrastination from fear",
      "Progress over perfection",
      "Self-compassion in mistakes",
    ],
    questionTypes: ["perfectionism_triggers", "good_enough_wins", "fear_of_failure", "progress_celebration"],
    metrics: [
      "Good Enough Acceptance Rate",
      "Procrastination Reduction",
      "Progress Celebration Frequency",
      "Self-Compassion Score",
    ],
    aiPromptContext:
      "You are helping someone overcome perfectionism and embrace 'good enough.' Focus on recognizing perfectionist triggers, celebrating progress over perfection, and building self-compassion. Ask about situations where perfectionism held them back, moments they chose progress over perfection, and their relationship with mistakes and imperfection.",
  },
  {
    id: "imposter-syndrome",
    title: "Imposter Syndrome",
    description: "Build confidence and recognize your true competence",
    category: "Self-Worth",
    color: "bg-green-500",
    icon: "🎭",
    focusAreas: [
      "Achievement acknowledgment",
      "Competence evidence gathering",
      "Self-doubt patterns",
      "Success internalization",
    ],
    questionTypes: ["achievement_recognition", "competence_evidence", "self_doubt_moments", "success_ownership"],
    metrics: [
      "Achievement Recognition Rate",
      "Competence Confidence Score",
      "Self-Doubt Frequency",
      "Success Ownership Level",
    ],
    aiPromptContext:
      "You are helping someone overcome imposter syndrome and recognize their true competence. Focus on documenting achievements, gathering evidence of competence, and internalizing success. Ask about recent accomplishments they might be minimizing, skills they possess but don't acknowledge, and moments when self-doubt crept in despite evidence of their capability.",
  },
  {
    id: "social-anxiety",
    title: "Social Anxiety",
    description: "Build confidence in social situations and expand your comfort zone",
    category: "Social Skills",
    color: "bg-yellow-500",
    icon: "🤝",
    focusAreas: [
      "Pre/post social reflections",
      "Comfort zone expansion",
      "Social confidence building",
      "Anxiety management techniques",
    ],
    questionTypes: ["social_preparation", "interaction_reflection", "comfort_zone_expansion", "anxiety_management"],
    metrics: [
      "Social Confidence Growth",
      "Comfort Zone Expansion Rate",
      "Anxiety Level Reduction",
      "Social Interaction Quality",
    ],
    aiPromptContext:
      "You are helping someone overcome social anxiety and build social confidence. Focus on pre and post-social interaction reflections, comfort zone expansion, and anxiety management. Ask about upcoming social situations they're nervous about, recent social interactions and how they went, and small steps they can take to expand their comfort zone.",
  },
  {
    id: "procrastination",
    title: "Procrastination",
    description: "Understand avoidance patterns and build consistent action habits",
    category: "Productivity",
    color: "bg-orange-500",
    icon: "⏰",
    focusAreas: [
      "Avoidance pattern recognition",
      "Emotional triggers behind delays",
      "Task breakdown strategies",
      "Momentum building",
    ],
    questionTypes: ["avoidance_patterns", "emotional_triggers", "task_breakdown", "momentum_building"],
    metrics: [
      "Task Completion Rate",
      "Procrastination Frequency",
      "Emotional Trigger Awareness",
      "Momentum Consistency",
    ],
    aiPromptContext:
      "You are helping someone overcome procrastination and build consistent action habits. Focus on understanding avoidance patterns, identifying emotional triggers, and building momentum. Ask about tasks they're avoiding, the emotions that come up when they think about these tasks, and small actions they could take to build momentum.",
  },
  {
    id: "negative-self-talk",
    title: "Negative Self-Talk",
    description: "Transform your inner critic into a supportive inner voice",
    category: "Self-Compassion",
    color: "bg-pink-500",
    icon: "💭",
    focusAreas: [
      "Inner critic identification",
      "Thought pattern recognition",
      "Reframing techniques",
      "Self-compassion building",
    ],
    questionTypes: [
      "inner_critic_moments",
      "negative_thought_patterns",
      "reframing_practice",
      "self_compassion_building",
    ],
    metrics: [
      "Negative Thought Frequency",
      "Reframing Success Rate",
      "Self-Compassion Score",
      "Inner Voice Positivity",
    ],
    aiPromptContext:
      "You are helping someone transform negative self-talk into a more supportive inner voice. Focus on catching inner critic moments, recognizing thought patterns, and practicing reframing. Ask about the specific negative thoughts that come up, situations that trigger their inner critic, and how they might speak to a good friend in the same situation.",
  },
  {
    id: "boundary-issues",
    title: "Boundary Issues",
    description: "Master time, emotional, and work-life boundaries",
    category: "Boundaries",
    color: "bg-indigo-500",
    icon: "🚧",
    focusAreas: [
      "Time boundary setting",
      "Emotional boundary recognition",
      "Work-life separation",
      "Energy protection",
    ],
    questionTypes: ["time_boundaries", "emotional_boundaries", "work_life_balance", "energy_protection"],
    metrics: [
      "Boundary Maintenance Rate",
      "Work-Life Balance Score",
      "Energy Protection Level",
      "Boundary Violation Frequency",
    ],
    aiPromptContext:
      "You are helping someone establish and maintain healthy boundaries across all areas of life. Focus on time boundaries, emotional boundaries, and work-life separation. Ask about situations where their boundaries were tested, times they successfully maintained boundaries, and areas where they need stronger boundaries.",
  },
  {
    id: "fear-of-conflict",
    title: "Fear of Conflict",
    description: "Build courage for difficult conversations and expressing your needs",
    category: "Communication",
    color: "bg-red-500",
    icon: "⚡",
    focusAreas: [
      "Difficult conversation preparation",
      "Need expression practice",
      "Conflict resolution skills",
      "Assertiveness building",
    ],
    questionTypes: ["conflict_avoidance", "difficult_conversations", "need_expression", "assertiveness_practice"],
    metrics: [
      "Difficult Conversation Success",
      "Need Expression Frequency",
      "Conflict Resolution Skills",
      "Assertiveness Growth",
    ],
    aiPromptContext:
      "You are helping someone overcome fear of conflict and build skills for difficult conversations. Focus on preparing for challenging discussions, expressing needs clearly, and building assertiveness. Ask about conversations they're avoiding, needs they haven't expressed, and small steps they could take to be more assertive.",
  },
  {
    id: "comparison-trap",
    title: "Comparison Trap",
    description: "Focus on personal growth instead of measuring against others",
    category: "Self-Worth",
    color: "bg-teal-500",
    icon: "📊",
    focusAreas: [
      "Social media impact awareness",
      "Personal growth focus",
      "Comparison trigger identification",
      "Self-worth independence",
    ],
    questionTypes: ["comparison_triggers", "social_media_impact", "personal_growth_focus", "self_worth_building"],
    metrics: ["Comparison Frequency", "Personal Growth Focus", "Social Media Mindfulness", "Self-Worth Independence"],
    aiPromptContext:
      "You are helping someone break free from the comparison trap and focus on their personal growth journey. Focus on identifying comparison triggers, understanding social media impacts, and building self-worth independent of others. Ask about situations where they found themselves comparing to others, how social media affects their mood, and their personal growth wins that have nothing to do with others.",
  },
]

export function getTemplateById(id: string): ProblemTemplate | undefined {
  return PROBLEM_TEMPLATES.find((template) => template.id === id)
}

export function getTemplatesByCategory(category: string): ProblemTemplate[] {
  return PROBLEM_TEMPLATES.filter((template) => template.category === category)
}

export function getAllCategories(): string[] {
  return [...new Set(PROBLEM_TEMPLATES.map((template) => template.category))]
}
