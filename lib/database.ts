// import { neon } from "@neondatabase/serverless"
// import bcrypt from "bcryptjs"

// const sql = neon(process.env.DATABASE_URL!)

// interface User {
//   id: string
//   email: string
//   name: string
//   created_at: string
//   profile_completed?: boolean
// }

// interface JournalEntry {
//   id: number
//   user_id: string
//   journal_id: string
//   template_id: string
//   entry_date: string
//   questions: string[]
//   answers: string[]
//   generated_entry: string
//   ai_insights?: string
//   mood_score?: number
//   themes?: string[]
//   created_at: string
// }

// interface WeeklyInsight {
//   id: number
//   user_id: string
//   week_start: string
//   week_end: string
//   summary: string
//   key_themes: string[]
//   emotional_trends: any
//   growth_highlights: string[]
//   recommendations: string[]
//   created_at: string
// }

// interface UserProfile {
//   user_id: string
//   description?: string // Changed from bio to description to match database schema
//   interests?: string[]
//   goals?: string[]
//   experience_level?: string
//   question_style?: string
//   // Define other fields for user profile here
// }

// interface Subscription {
//   id: string
//   user_id: string
//   plan_type: "free" | "basic" | "premium" | "unlimited"
//   status: "active" | "cancelled" | "expired" | "trial"
//   trial_ends_at?: string
//   questions_per_day: number
//   questions_used_today: number
//   last_reset_date: string
//   created_at: string
//   updated_at: string
// }

// interface Journal {
//   id: string
//   user_id: string
//   template_id: string
//   title: string
//   description?: string
//   created_at: string
//   updated_at: string
//   is_active: boolean
//   entry_count: number
//   last_entry_date?: string
// }

// // Individual exported functions for API routes
// export async function createUser(email: string, name: string, password: string, description?: string): Promise<User> {
//   const hashedPassword = await bcrypt.hash(password, 12)

//   const result = await sql`
//     INSERT INTO users (email, name, password_hash)
//     VALUES (${email}, ${name}, ${hashedPassword})
//     RETURNING id, email, name, created_at
//   `

//   const user = result[0] as any

//   // Create user profile if description is provided
//   if (description) {
//     await sql`
//       INSERT INTO user_profiles (user_id, description)
//       VALUES (${user.id}, ${description})
//     `
//   }

//   await sql`
//     INSERT INTO subscriptions (user_id, plan_type, status, questions_per_day)
//     VALUES (${user.id}, 'free', 'active', 3)
//   `

//   return {
//     id: user.id,
//     email: user.email,
//     name: user.name,
//     created_at: user.created_at,
//   }
// }

// export async function getUserByEmail(email: string): Promise<User | null> {
//   const result = await sql`
//     SELECT id, email, name, created_at, profile_completed
//     FROM users
//     WHERE email = ${email}
//   `

//   if (!result[0]) return null

//   const user = result[0] as any
//   return {
//     id: user.id,
//     email: user.email,
//     name: user.name,
//     created_at: user.created_at,
//     profile_completed: user.profile_completed,
//   }
// }

// export async function verifyUserPassword(email: string, password: string): Promise<User | null> {
//   const result = await sql`
//     SELECT id, email, name, password_hash, created_at, profile_completed
//     FROM users
//     WHERE email = ${email}
//   `

//   if (!result[0]) return null

//   const user = result[0] as any

//   const isValid = await bcrypt.compare(password, user.password_hash)
//   if (!isValid) return null

//   return {
//     id: user.id,
//     email: user.email,
//     name: user.name,
//     created_at: user.created_at,
//     profile_completed: user.profile_completed,
//   }
// }

// export async function getUserProfile(userId: string): Promise<UserProfile | null> {
//   const result = await sql`
//     SELECT * FROM user_profiles
//     WHERE user_id = ${userId}
//   `
//   return result[0] || null
// }

// export async function createJournal(
//   userId: string,
//   templateId: string,
//   title: string,
//   description?: string,
// ): Promise<Journal> {
//   const result = await sql`
//     INSERT INTO journals (user_id, template_id, title, description)
//     VALUES (${userId}, ${templateId}, ${title}, ${description || ""})
//     RETURNING *
//   `
//   return result[0] as Journal
// }

// export async function getUserJournals(userId: string): Promise<Journal[]> {
//   const result = await sql`
//     SELECT j.*, COUNT(je.id) as entry_count, MAX(je.entry_date) as last_entry_date
//     FROM journals j
//     LEFT JOIN journal_entries je ON j.id = je.journal_id
//     WHERE j.user_id = ${userId} AND j.is_active = true
//     GROUP BY j.id
//     ORDER BY j.updated_at DESC
//   `
//   return result as Journal[]
// }

// export async function getJournalById(journalId: string): Promise<Journal | null> {
//   const result = await sql`
//     SELECT j.*, COUNT(je.id) as entry_count, MAX(je.entry_date) as last_entry_date
//     FROM journals j
//     LEFT JOIN journal_entries je ON j.id = je.journal_id
//     WHERE j.id = ${journalId}
//     GROUP BY j.id
//   `
//   return (result[0] as Journal) || null
// }

// export async function updateJournal(
//   journalId: string,
//   updates: { title?: string; description?: string; is_active?: boolean },
// ): Promise<Journal> {
//   const result = await sql`
//     UPDATE journals
//     SET
//       title = COALESCE(${updates.title}, title),
//       description = COALESCE(${updates.description}, description),
//       is_active = COALESCE(${updates.is_active}, is_active),
//       updated_at = NOW()
//     WHERE id = ${journalId}
//     RETURNING *
//   `
//   return result[0] as Journal
// }

// export async function getJournalEntries(journalId: string, limit = 10, offset = 0): Promise<JournalEntry[]> {
//   const result = await sql`
//     SELECT * FROM journal_entries
//     WHERE journal_id = ${journalId}
//     ORDER BY entry_date DESC
//     LIMIT ${limit} OFFSET ${offset}
//   `
//   return result as JournalEntry[]
// }

// export async function getRecentJournalEntries(userId: string, limit = 3): Promise<JournalEntry[]> {
//   const result = await sql`
//     SELECT je.*, j.title as journal_title, j.template_id
//     FROM journal_entries je
//     JOIN journals j ON je.journal_id = j.id
//     WHERE je.user_id = ${userId}
//     ORDER BY je.entry_date DESC
//     LIMIT ${limit}
//   `
//   return result as JournalEntry[]
// }

// export async function saveJournalEntry(
//   userId: string,
//   journalId: string,
//   entryData: {
//     questions: string[]
//     answers: string[]
//     aiGeneratedEntry: string
//     moodScore?: number
//     themes?: string[]
//   },
// ): Promise<JournalEntry> {
//   const today = new Date().toISOString().split("T")[0]

//   // Get journal template_id
//   const journal = await getJournalById(journalId)
//   if (!journal) throw new Error("Journal not found")

//   const result = await sql`
//     INSERT INTO journal_entries (user_id, journal_id, template_id, entry_date, questions, answers, generated_entry, mood_score, themes)
//     VALUES (${userId}, ${journalId}, ${journal.template_id}, ${today}, ${JSON.stringify(entryData.questions)}, ${JSON.stringify(entryData.answers)}, ${entryData.aiGeneratedEntry}, ${entryData.moodScore || null}, ${entryData.themes || null})
//     ON CONFLICT (user_id, journal_id, entry_date) DO UPDATE SET
//       questions = EXCLUDED.questions,
//       answers = EXCLUDED.answers,
//       generated_entry = EXCLUDED.generated_entry,
//       mood_score = EXCLUDED.mood_score,
//       themes = EXCLUDED.themes,
//       updated_at = NOW()
//     RETURNING *
//   `

//   // Update journal's last entry date and entry count
//   await sql`
//     UPDATE journals
//     SET
//       last_entry_date = ${today},
//       entry_count = (SELECT COUNT(*) FROM journal_entries WHERE journal_id = ${journalId}),
//       updated_at = NOW()
//     WHERE id = ${journalId}
//   `

//   return result[0] as JournalEntry
// }

// export async function updateUserProfileCompleted(userId: string) {
//   await sql`
//     UPDATE users
//     SET profile_completed = TRUE
//     WHERE id = ${userId}
//   `
// }

// export async function updateUserProfile(
//   userId: string,
//   profileData: {
//     name?: string
//     email?: string
//     description?: string // Changed from bio to description to match database schema
//     interests?: string[]
//     goals?: string[]
//     journaling_experience?: string
//     preferred_question_style?: string
//     daily_reminders?: boolean
//     reminder_time?: string
//     weekly_insights?: boolean
//     email_notifications?: boolean
//     timezone?: string
//   },
// ): Promise<User> {
//   // Update user basic info
//   const userResult = await sql`
//     UPDATE users
//     SET name = COALESCE(${profileData.name}, name),
//         email = COALESCE(${profileData.email}, email)
//     WHERE id = ${userId}
//     RETURNING id, email, name, created_at, profile_completed
//   `

//   await sql`
//     INSERT INTO user_profiles (
//       user_id,
//       description,
//       interests,
//       goals,
//       journaling_experience,
//       preferred_question_style,
//       daily_reminders,
//       reminder_time,
//       weekly_insights,
//       email_notifications,
//       timezone
//     )
//     VALUES (
//       ${userId},
//       ${profileData.description || ""},
//       ${profileData.interests || []},
//       ${profileData.goals || []},
//       ${profileData.journaling_experience || "beginner"},
//       ${profileData.preferred_question_style || "reflective"},
//       ${profileData.daily_reminders ?? true},
//       ${profileData.reminder_time || "19:00"},
//       ${profileData.weekly_insights ?? true},
//       ${profileData.email_notifications ?? false},
//       ${profileData.timezone || "America/New_York"}
//     )
//     ON CONFLICT (user_id) DO UPDATE SET
//       description = EXCLUDED.description,
//       interests = EXCLUDED.interests,
//       goals = EXCLUDED.goals,
//       journaling_experience = EXCLUDED.journaling_experience,
//       preferred_question_style = EXCLUDED.preferred_question_style,
//       daily_reminders = EXCLUDED.daily_reminders,
//       reminder_time = EXCLUDED.reminder_time,
//       weekly_insights = EXCLUDED.weekly_insights,
//       email_notifications = EXCLUDED.email_notifications,
//       timezone = EXCLUDED.timezone,
//       updated_at = NOW()
//   `

//   return userResult[0] as User
// }

// // Subscription management functions
// export async function getUserSubscription(userId: string): Promise<Subscription | null> {
//   // Reset daily questions if needed
//   await sql`
//     UPDATE subscriptions
//     SET questions_used_today = 0, last_reset_date = CURRENT_DATE
//     WHERE user_id = ${userId} AND last_reset_date < CURRENT_DATE
//   `

//   const result = await sql`
//     SELECT * FROM subscriptions
//     WHERE user_id = ${userId}
//     ORDER BY created_at DESC
//     LIMIT 1
//   `

//   return (result[0] as Subscription) || null
// }

// export async function createSubscription(userId: string, planType: string, trialEndsAt?: Date): Promise<Subscription> {
//   const questionsPerDay =
//     {
//       free: 3,
//       basic: 10,
//       premium: 20,
//       unlimited: 999,
//     }[planType] || 3

//   const existingSubscription = await sql`
//     SELECT id FROM subscriptions WHERE user_id = ${userId}
//   `

//   if (existingSubscription.length > 0) {
//     // Update existing subscription
//     const result = await sql`
//       UPDATE subscriptions
//       SET
//         plan_type = ${planType},
//         status = ${trialEndsAt ? "trial" : "active"},
//         trial_ends_at = ${trialEndsAt?.toISOString() || null},
//         questions_per_day = ${questionsPerDay},
//         current_period_start = NOW(),
//         current_period_end = NOW() + INTERVAL '1 month',
//         updated_at = NOW()
//       WHERE user_id = ${userId}
//       RETURNING *
//     `
//     return result[0] as Subscription
//   } else {
//     // Create new subscription
//     const result = await sql`
//       INSERT INTO subscriptions (
//         user_id,
//         plan_type,
//         status,
//         trial_ends_at,
//         questions_per_day,
//         questions_used_today,
//         last_reset_date,
//         current_period_start,
//         current_period_end
//       )
//       VALUES (
//         ${userId},
//         ${planType},
//         ${trialEndsAt ? "trial" : "active"},
//         ${trialEndsAt?.toISOString() || null},
//         ${questionsPerDay},
//         0,
//         CURRENT_DATE,
//         NOW(),
//         NOW() + INTERVAL '1 month'
//       )
//       RETURNING *
//     `
//     return result[0] as Subscription
//   }
// }

// export async function updateSubscription(userId: string, planType: string): Promise<Subscription> {
//   const questionsPerDay =
//     {
//       free: 3,
//       basic: 10,
//       premium: 20,
//       unlimited: 999,
//     }[planType] || 3

//   const result = await sql`
//     UPDATE subscriptions
//     SET
//       plan_type = ${planType},
//       questions_per_day = ${questionsPerDay},
//       status = 'active',
//       trial_ends_at = NULL,
//       current_period_start = NOW(),
//       current_period_end = NOW() + INTERVAL '1 month',
//       updated_at = NOW()
//     WHERE user_id = ${userId}
//     RETURNING *
//   `

//   return result[0] as Subscription
// }

// export async function cancelSubscription(userId: string): Promise<void> {
//   await sql`
//     UPDATE subscriptions
//     SET
//       status = 'cancelled',
//       updated_at = NOW()
//     WHERE user_id = ${userId}
//   `
// }

// export async function incrementQuestionUsage(userId: string): Promise<boolean> {
//   const subscription = await getUserSubscription(userId)
//   if (!subscription) return false

//   if (subscription.questions_used_today >= subscription.questions_per_day) {
//     return false // Usage limit reached
//   }

//   await sql`
//     UPDATE subscriptions
//     SET
//       questions_used_today = questions_used_today + 1,
//       updated_at = NOW()
//     WHERE user_id = ${userId}
//   `

//   return true
// }

// export async function checkQuestionLimit(userId: string): Promise<{ canAsk: boolean; remaining: number }> {
//   const subscription = await getUserSubscription(userId)
//   if (!subscription) {
//     return { canAsk: false, remaining: 0 }
//   }

//   const remaining = Math.max(0, subscription.questions_per_day - subscription.questions_used_today)
//   return {
//     canAsk: remaining > 0,
//     remaining,
//   }
// }

// // Database service class for other operations
// export class DatabaseService {
//   async createJournal(userId: string, templateId: string, title: string, description?: string): Promise<Journal> {
//     return createJournal(userId, templateId, title, description)
//   }

//   async getUserJournals(userId: string): Promise<Journal[]> {
//     return getUserJournals(userId)
//   }

//   async getJournalById(journalId: string): Promise<Journal | null> {
//     return getJournalById(journalId)
//   }

//   async updateJournal(
//     journalId: string,
//     updates: { title?: string; description?: string; is_active?: boolean },
//   ): Promise<Journal> {
//     return updateJournal(journalId, updates)
//   }

//   async getJournalEntries(journalId: string, limit = 10, offset = 0): Promise<JournalEntry[]> {
//     return getJournalEntries(journalId, limit, offset)
//   }

//   async getUserProfile(userId: string): Promise<UserProfile | null> {
//     return getUserProfile(userId)
//   }

//   async getRecentJournalEntries(userId: string, limit = 3): Promise<JournalEntry[]> {
//     return getRecentJournalEntries(userId, limit)
//   }

//   async saveJournalEntry(
//     userId: string,
//     journalId: string,
//     entryData: {
//       questions: string[]
//       answers: string[]
//       aiGeneratedEntry: string
//       moodScore?: number
//       themes?: string[]
//     },
//   ): Promise<JournalEntry> {
//     return saveJournalEntry(userId, journalId, entryData)
//   }

//   async getAllJournalEntries(userId: string): Promise<JournalEntry[]> {
//     const result = await sql`
//       SELECT je.*, j.title as journal_title, j.template_id
//       FROM journal_entries je
//       JOIN journals j ON je.journal_id = j.id
//       WHERE je.user_id = ${userId}
//       ORDER BY je.entry_date DESC
//     `
//     return result as JournalEntry[]
//   }

//   async getAllJournalEntriesForJournal(journalId: string): Promise<JournalEntry[]> {
//     const result = await sql`
//       SELECT je.*, j.title as journal_title, j.template_id
//       FROM journal_entries je
//       JOIN journals j ON je.journal_id = j.id
//       WHERE je.journal_id = ${journalId}
//       ORDER BY je.entry_date DESC
//     `
//     return result as JournalEntry[]
//   }

//   async createJournalEntry(
//     userId: string,
//     journalId: string,
//     entryDate: string,
//     questions: string[],
//     answers: string[],
//     generatedEntry: string,
//     moodScore?: number,
//     themes?: string[],
//   ): Promise<JournalEntry> {
//     // Get journal template_id
//     const journal = await this.getJournalById(journalId)
//     if (!journal) throw new Error("Journal not found")

//     const result = await sql`
//       INSERT INTO journal_entries (user_id, journal_id, template_id, entry_date, questions, answers, generated_entry, mood_score, themes)
//       VALUES (${userId}, ${journalId}, ${journal.template_id}, ${entryDate}, ${JSON.stringify(questions)}, ${JSON.stringify(answers)}, ${generatedEntry}, ${moodScore || null}, ${themes || null})
//       ON CONFLICT (user_id, journal_id, entry_date) DO UPDATE SET
//         questions = EXCLUDED.questions,
//         answers = EXCLUDED.answers,
//         generated_entry = EXCLUDED.generated_entry,
//         mood_score = EXCLUDED.mood_score,
//         themes = EXCLUDED.themes,
//         updated_at = NOW()
//       RETURNING *
//     `

//     return result[0] as JournalEntry
//   }

//   async getJournalEntriesByDateRange(userId: string, startDate: string, endDate: string): Promise<JournalEntry[]> {
//     const result = await sql`
//       SELECT je.*, j.title as journal_title, j.template_id
//       FROM journal_entries je
//       JOIN journals j ON je.journal_id = j.id
//       WHERE je.user_id = ${userId} AND je.entry_date BETWEEN ${startDate} AND ${endDate}
//       ORDER BY je.entry_date DESC
//     `

//     return result as JournalEntry[]
//   }

//   async getUserStats(userId: string) {
//     const result = await sql`
//       SELECT
//         COUNT(*) as total_entries,
//         COUNT(CASE WHEN je.entry_date >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as entries_this_week,
//         COUNT(CASE WHEN je.entry_date >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as entries_this_month,
//         AVG(je.mood_score) as average_mood,
//         MAX(je.entry_date) as last_entry_date,
//         MIN(je.entry_date) as first_entry_date,
//         COUNT(DISTINCT j.id) as total_journals
//       FROM journal_entries je
//       JOIN journals j ON je.journal_id = j.id
//       WHERE je.user_id = ${userId}
//     `

//     return result[0]
//   }

//   async getJournalStats(journalId: string) {
//     const result = await sql`
//       SELECT
//         COUNT(*) as total_entries,
//         COUNT(CASE WHEN entry_date >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as entries_this_week,
//         COUNT(CASE WHEN entry_date >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as entries_this_month,
//         AVG(mood_score) as average_mood,
//         MAX(entry_date) as last_entry_date,
//         MIN(entry_date) as first_entry_date
//       FROM journal_entries
//       WHERE journal_id = ${journalId}
//     `

//     return result[0]
//   }
// }

// // Factory function to create database service
// export function createDatabaseService(): DatabaseService {
//   return new DatabaseService()
// }
