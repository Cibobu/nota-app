import { beforeEach, describe, expect, it } from 'vitest'
import { clearCache, getCache, setCache } from '../src/lib/cache.js'

describe('Cache', () => {
  beforeEach(() => {
    clearCache()
  })

  it('should store and retrieve data', () => {
    setCache('test', { foo: 'bar' })
    expect(getCache('test')).toEqual({ foo: 'bar' })
  })

  it('should return null for missing key', () => {
    expect(getCache('nonexistent')).toBeNull()
  })

  it('should clear cache by pattern', () => {
    setCache('notes:1', 'a')
    setCache('notes:2', 'b')
    setCache('profile', 'c')
    clearCache('notes')
    expect(getCache('notes:1')).toBeNull()
    expect(getCache('notes:2')).toBeNull()
    expect(getCache('profile')).toBe('c')
  })
})
