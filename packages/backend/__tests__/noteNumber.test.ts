import { describe, expect, it } from 'vitest'
import { buildNoteNumber } from '../src/lib/noteNumber.js'

describe('buildNoteNumber', () => {
  it('should format as Nota-{seq:03d}/{MM}/{YY}', () => {
    expect(buildNoteNumber(1, new Date(2026, 6, 5))).toBe('Nota-001/07/26')
    expect(buildNoteNumber(17, new Date(2026, 6, 5))).toBe('Nota-017/07/26')
    expect(buildNoteNumber(150, new Date(2026, 11, 31))).toBe('Nota-150/12/26')
  })

  it('should pad sequence to three digits', () => {
    expect(buildNoteNumber(9, new Date(2026, 0, 1))).toBe('Nota-009/01/26')
    expect(buildNoteNumber(10, new Date(2026, 0, 1))).toBe('Nota-010/01/26')
    expect(buildNoteNumber(999, new Date(2026, 0, 1))).toBe('Nota-999/01/26')
  })
})
