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
    <div className="stat bg-base-100 rounded-box shadow-sm border border-base-200">
      <div className={`stat-figure ${colorClass[color]}`}>{icon}</div>
      <div className="stat-title text-sm">{title}</div>
      <div className={`stat-value ${colorClass[color]}`}>{value.toLocaleString('id-ID')}</div>
    </div>
  )
}
