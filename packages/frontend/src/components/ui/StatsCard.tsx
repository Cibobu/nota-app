interface StatsCardProps {
  title: string
  value: number
  icon: React.ReactNode
  color: 'primary' | 'secondary' | 'accent'
}

export default function StatsCard({ title, value, icon, color }: StatsCardProps) {
  const colorClass = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
  }

  return (
    <div className="stat bg-base-100 rounded-box shadow-sm border border-base-300">
      <div className={`stat-figure ${colorClass[color]}`}>{icon}</div>
      <div className="stat-title text-sm font-medium text-base-content/50">{title}</div>
      <div className={`stat-value text-2xl ${colorClass[color]} font-heading`}>
        {value.toLocaleString('id-ID')}
      </div>
    </div>
  )
}
