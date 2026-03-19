export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { DashboardNav } from '@/components/DashboardNav'
import { TelemetryFeed } from '@/components/TelemetryFeed'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <>
      <TelemetryFeed />
      <DashboardNav userEmail={user.email ?? ''} />
      <div className="flex-1 overflow-y-auto px-6 py-6 max-w-7xl mx-auto w-full">
        {children}
      </div>
    </>
  )
}
