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
      {/* pt-12 on mobile = space for top bar; pb-16 on mobile = space for bottom tab bar */}
      <div className="flex-1 overflow-y-auto pt-12 pb-16 lg:pt-0 lg:pb-0">
        <div className="px-4 py-5 lg:px-8 lg:py-7 max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
