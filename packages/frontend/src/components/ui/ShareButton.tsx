import { Check, Share2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface ShareButtonProps {
  token: string | null
  className?: string
}

export default function ShareButton({ token, className = '' }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const buildUrl = () => `${window.location.origin}/s/${token}`

  const fallbackCopy = async (text: string) => {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    try {
      document.execCommand('copy')
    } finally {
      document.body.removeChild(ta)
    }
  }

  const handleShare = async () => {
    if (!token) {
      toast.error('Nota belum bisa dibagikan')
      return
    }
    const url = buildUrl()
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
      } else {
        await fallbackCopy(url)
      }
      setCopied(true)
      toast.success('Link nota disalin')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Gagal menyalin link')
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`btn btn-ghost btn-sm font-medium ${className}`}
      aria-label="Salin link berbagi nota"
      title="Salin link berbagi nota"
    >
      {copied ? <Check className="w-4 h-4 text-success" /> : <Share2 className="w-4 h-4" />}
      <span className="hidden sm:inline">{copied ? 'Tersalin' : 'Bagikan'}</span>
    </button>
  )
}
