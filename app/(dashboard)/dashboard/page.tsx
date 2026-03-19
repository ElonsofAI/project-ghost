import { NodeGrid } from '@/components/NodeGrid'

export const metadata = { title: 'Command Center // GHOST' }

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-[9px] text-orange/70 tracking-[0.3em] uppercase mb-2">
            [ACTIVE_NODES // STATUS]
          </p>
          <h1
            className="text-2xl font-bold uppercase tracking-tight text-bone"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Command Center
          </h1>
        </div>
        <p className="font-mono text-[9px] text-bone/25 tracking-wider pb-1">
          {new Date().toISOString().split('T')[0]}
        </p>
      </div>

      <NodeGrid />
    </div>
  )
}
