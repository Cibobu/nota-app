import { FileText } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  action?: { label: string; onClick: () => void }
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-xl bg-base-200 flex items-center justify-center mb-4">
        <FileText className="w-7 h-7 text-base-content/20" />
      </div>
      <h3 className="text-lg font-heading font-semibold text-neutral mb-1.5">{title}</h3>
      <p className="text-sm text-base-content/50 mb-5 max-w-sm">{description}</p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="btn btn-primary btn-sm font-medium transition-all duration-200"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
