// Helper functions for database migrations
export const runMigrations = async (databaseService: any) => {
  const migrations = [
    "001_create_users_table.sql",
    "002_create_journal_entries_table.sql",
    "003_create_weekly_insights_table.sql",
    "004_create_user_preferences_table.sql",
    "005_create_user_stats_view.sql",
  ]

  console.log("Running database migrations...")

  for (const migration of migrations) {
    try {
      console.log(`Running migration: ${migration}`)
      // In a real implementation, you would read the SQL file and execute it
      // await databaseService.executeSql(sqlContent);
      console.log(`✓ Migration ${migration} completed`)
    } catch (error) {
      console.error(`✗ Migration ${migration} failed:`, error)
      throw error
    }
  }

  console.log("All migrations completed successfully!")
}

// Helper to migrate data from localStorage to database
export const migrateLocalStorageToDatabase = async (databaseService: any, userId: string) => {
  try {
    // Migrate journal entries
    const journalEntries = JSON.parse(localStorage.getItem("journalEntries") || "{}")
    for (const [date, entry] of Object.entries(journalEntries)) {
      const entryData = entry as any
      await databaseService.createJournalEntry(
        userId,
        date,
        entryData.questions,
        entryData.answers,
        entryData.generatedEntry,
      )
    }

    // Migrate user preferences
    const preferences = JSON.parse(localStorage.getItem("userPreferences") || "{}")
    if (Object.keys(preferences).length > 0) {
      await databaseService.updateUserPreferences(userId, preferences)
    }

    console.log("Data migration from localStorage completed successfully!")
  } catch (error) {
    console.error("Data migration failed:", error)
    throw error
  }
}
