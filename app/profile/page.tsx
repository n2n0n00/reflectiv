import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileForm } from "@/components/profile/profile-form"
import { AccountSettings } from "@/components/profile/account-settings"
import { DataPrivacy } from "@/components/profile/data-privacy"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <ProfileHeader />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          <ProfileForm />
          <AccountSettings />
          <DataPrivacy />
        </div>
      </main>
    </div>
  )
}
