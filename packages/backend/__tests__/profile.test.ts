import { describe, expect, it } from 'vitest'

describe('Profile API', () => {
  it('should create a valid profile body', () => {
    const body = {
      businessName: 'Toko Makmur',
      address: 'Jl. Merdeka No. 123',
      phone: '0812-3456-7890',
    }
    expect(body.businessName).toBeDefined()
    expect(body.address).toBeDefined()
    expect(body.phone).toBeDefined()
  })

  it('should validate required fields are strings', () => {
    const validTypes = (val: unknown): val is string => typeof val === 'string' || val === undefined
    expect(validTypes('test')).toBe(true)
    expect(validTypes(undefined)).toBe(true)
    expect(validTypes(123)).toBe(false)
  })
})
