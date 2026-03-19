type Trend = 'up' | 'down' | 'neutral'

interface KPICardProps {
  label: string
  value: string
  sub?: string
  trend?: Trend
  trendValue?: string
  accent?: 'orange' | 'cyan' | 'white'
  size?: 'sm' | 'md' | 'lg'
}

export function KPICard({
  label,
  value,
  sub,
  trend,
  trendValue,
  accent = 'orange',
  size = 'md',
}: KPICardProps) {
  const accentClass = {
    orange: 'text-orange neon-orange',
    cyan:   'text-cyan neon-cyan',
    white:  'text-bone',
  }[accent]

  const valueSize = { sm: 'text-xl', md: 'text-2xl', lg: 'text-4xl' }[size]

  const trendColor =
    trend === 'up'   ? 'text-emerald-400' :
    trend === 'down' ? 'text-red-400' :
    'text-bone/30'

  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'

  return (
    <div className="light-pipe-elevated p-5 flex flex-col gap-3">
      <p className="font-mono text-[9px] text-bone/35 uppercase tracking-[0.25em]">{label}</p>
      <div className="flex items-end justify-between gap-2">
        <span className={`font-bold tabular-nums leading-none ${valueSize} ${accentClass}`}
          style={{ fontFamily: 'var(--font-display)' }}>
          {value}
        </span>
        {trend && trendValue && (
          <span className={`font-mono text-[10px] ${trendColor} shrink-0 pb-0.5`}>
            {trendIcon} {trendValue}
          </span>
        )}
      </div>
      {sub && (
        <p className="font-mono text-[9px] text-bone/25">{sub}</p>
      )}
    </div>
  )
}
