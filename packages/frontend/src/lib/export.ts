import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const FIXED_COLORS = `
  :root {
    --color-base-100: #ffffff !important;
    --color-base-200: #f8fafc !important;
    --color-base-300: #e2e8f0 !important;
    --color-base-content: #1f2937 !important;
    --color-primary: #1e40af !important;
    --color-primary-content: #ffffff !important;
    --color-secondary: #059669 !important;
    --color-secondary-content: #ffffff !important;
    --color-accent: #f59e0b !important;
    --color-accent-content: #ffffff !important;
    --color-neutral: #1f2937 !important;
    --color-neutral-content: #f8fafc !important;
    --color-info: #3b82f6 !important;
    --color-info-content: #ffffff !important;
    --color-success: #10b981 !important;
    --color-success-content: #ffffff !important;
    --color-warning: #f59e0b !important;
    --color-warning-content: #ffffff !important;
    --color-error: #ef4444 !important;
    --color-error-content: #ffffff !important;
  }
  * { color-scheme: light; }
`

function removeColorMix(doc: Document) {
  function visit(rules: CSSRuleList, parent: CSSGroupingRule | CSSStyleSheet) {
    for (let i = rules.length - 1; i >= 0; i--) {
      try {
        const rule = rules[i]
        if ('cssRules' in rule && rule.cssRules) {
          visit(rule.cssRules as CSSRuleList, rule as CSSGroupingRule)
        }
        if ('cssText' in rule && (rule.cssText as string).includes('color-mix(in oklab')) {
          parent.deleteRule(i)
        }
      } catch {}
    }
  }
  for (const sheet of doc.styleSheets) {
    try {
      if (sheet.cssRules) {
        visit(sheet.cssRules, sheet)
      }
    } catch {}
  }
}

async function captureElement(element: HTMLElement) {
  return html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    onclone: (doc) => {
      removeColorMix(doc)
      const s = doc.createElement('style')
      s.textContent = FIXED_COLORS
      doc.head.appendChild(s)
    },
  })
}

export async function exportToPDF(element: HTMLElement, filename = 'nota.pdf') {
  const canvas = await captureElement(element)

  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = (canvas.height * pageWidth) / canvas.width
  pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight)
  pdf.save(filename)
}

export async function exportToJPG(element: HTMLElement, filename = 'nota.jpg') {
  const canvas = await captureElement(element)

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', 0.95),
  )
  if (!blob) throw new Error('Gagal mengkonversi gambar')

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
