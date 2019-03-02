import fetch from 'node-fetch'
import query from '../src'

jest.mock('node-fetch')

/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-require-imports */
const fixture = {
  normal: require('./fixture/8.11.1.json'),
  harmony: require('./fixture/8.11.1--harmony.json'),
}
/* eslint-enable global-require */
/* eslint-enable @typescript-eslint/no-require-imports */

beforeAll(() => Object.defineProperty(process, 'version', { writable: true }))

test('without harmony', async () => {
  // eslint-disable-next-line no-extra-parens
  (fetch as any as jest.Mock).mockResolvedValue({
    json() {
      return Promise.resolve(fixture.normal)
    },
  })

  let result = await query('Array.prototype.shift', { nodeVersion: '8.11.1' })
  expect(fetch).toBeCalledWith('https://raw.githubusercontent.com/williamkapke/' +
    'node-compat-table/gh-pages/results/v8/8.11.1.json')
  expect(result.nodeVersion).toBe('8.11.1')
  expect(result.v8Version).toBe('6.2.414.50')
  expect(result.result).toEqual([
    {
      esVersion: 'ES2015',
      featureType: 'misc',
      category: 'Proxy, internal \'get\' calls',
      feature: 'Array.prototype.shift',
      passed: true,
    },
    {
      esVersion: 'ES2015',
      featureType: 'misc',
      category: 'Proxy, internal \'set\' calls',
      feature: 'Array.prototype.shift',
      passed: true,
    },
    {
      esVersion: 'ES2015',
      featureType: 'misc',
      category: 'Proxy, internal \'deleteProperty\' calls',
      feature: 'Array.prototype.shift',
      passed: true,
    },
  ])

  result = await query(
    'proper tail calls (tail call optimisation)',
    { nodeVersion: 'v8.11.1' }
  )
  expect(result.result).toEqual([
    {
      esVersion: 'ES2015',
      featureType: 'optimisation',
      category: 'proper tail calls (tail call optimisation)',
      feature: 'direct recursion',
      passed: false,
    },
    {
      esVersion: 'ES2015',
      featureType: 'optimisation',
      category: 'proper tail calls (tail call optimisation)',
      feature: 'mutual recursion',
      passed: false,
    },
  ])
})

test('with harmony', async () => {
  const _version = process.version
  process.version = 'v8.11.1'

  const feature = 'unicode escape sequences in identifiers'
  // eslint-disable-next-line no-extra-parens
  ;(fetch as any as jest.Mock)
    .mockResolvedValueOnce({
      json() {
        return Promise.resolve(fixture.normal)
      },
    })
    .mockResolvedValueOnce({
      json() {
        return Promise.resolve(fixture.harmony)
      },
    })

  let result = await query(feature)
  expect(fetch).toBeCalledWith('https://raw.githubusercontent.com/williamkapke/' +
    'node-compat-table/gh-pages/results/v8/8.11.1.json')
  expect(result.result[0].passed).toBe(false)

  result = await query(feature, { allowHarmony: true })
  expect(fetch).toBeCalledWith('https://raw.githubusercontent.com/williamkapke/' +
    'node-compat-table/gh-pages/results/v8/8.11.1--harmony.json')
  expect(result.result[0].passed).toBe(true)

  process.version = _version
})
