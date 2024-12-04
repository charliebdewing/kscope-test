
import { describe, it, expect } from 'vitest'
import { parseFile } from '@/utils/files'

describe('parseFile', () => {
  it('parses CSV file correctly', async () => {
    const csvFile = new File(['Engineering, Tara\nEngineering, Jon'], 'test.csv', { type: 'text/csv' })
    const result = await parseFile(csvFile)
    expect(result).toEqual([['Engineering', 'Tara'], ['Engineering', 'Jon']])
  })
})
