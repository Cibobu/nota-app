import { describe, expect, it } from 'vitest'
import { formatCurrency } from '../src/lib/export'

describe('formatCurrency', () => {
  it('should format number as IDR currency', () => {
    const result = formatCurrency(35000)
    expect(result).toContain('35')
    expect(result).toContain('Rp')
  })

  it('should handle zero', () => {
    expect(formatCurrency(0)).toContain('0')
  })

  it('should handle large numbers', () => {
    const result = formatCurrency(1000000)
    expect(result).toContain('Rp')
  })
})
