export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { Sidebar } from '@/components/Sidebar'
import { TelemetryFeed } from '@/components/TelemetryFeed'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="flex flex-1 overflow-hidden">
      <TelemetryFeed />
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="px-8 py-7 max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
