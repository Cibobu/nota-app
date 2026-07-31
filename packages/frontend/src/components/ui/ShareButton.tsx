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
      className={`btn btn-ghost btn-sm ${className}`}
      aria-label="Salin link berbagi nota"
      title="Salin link berbagi nota"
    >
      {copied ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
      )}
      <span className="hidden sm:inline">{copied ? 'Tersalin' : 'Bagikan'}</span>
    </button>
  )
}
