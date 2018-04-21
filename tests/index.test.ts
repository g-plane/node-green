import * as fs from 'fs'
import * as moxios from 'moxios'
import query from '../src'

const fixture = {
  normal: fs.readFileSync(__dirname + '/fixture/8.11.1.json', 'utf-8'),
  harmony: fs.readFileSync(__dirname + '/fixture/8.11.1--harmony.json', 'utf-8')
}

beforeAll(() => Object.defineProperty(process, 'version', { writable: true }))

beforeEach(() => moxios.install())

afterEach(() => moxios.uninstall())

test('without harmony', async () => {
  moxios.stubRequest('https://raw.githubusercontent.com/williamkapke/'
    + 'node-compat-table/gh-pages/results/v8/8.11.1.json', {
      status: 200,
      responseText: fixture.normal
    })

  let result = await query('Array.prototype.shift', { nodeVersion: '8.11.1' })
  expect(result.nodeVersion).toBe('8.11.1')
  expect(result.v8Version).toBe('6.2.414.50')
  expect(result.result).toEqual([
    {
      esVersion: 'ES2015',
      category: 'Proxy, internal \'get\' calls',
      feature: 'Array.prototype.shift',
      passed: true
    },
    {
      esVersion: 'ES2015',
      category: 'Proxy, internal \'set\' calls',
      feature: 'Array.prototype.shift',
      passed: true
    },
    {
      esVersion: 'ES2015',
      category: 'Proxy, internal \'deleteProperty\' calls',
      feature: 'Array.prototype.shift',
      passed: true
    }
  ])

  result = await query(
    'proper tail calls (tail call optimisation)',
    { nodeVersion: 'v8.11.1' }
  )
  expect(result.result).toEqual([
    {
      esVersion: 'ES2015',
      category: 'proper tail calls (tail call optimisation)',
      feature: 'direct recursion',
      passed: false
    },
    {
      esVersion: 'ES2015',
      category: 'proper tail calls (tail call optimisation)',
      feature: 'mutual recursion',
      passed: false
    }
  ])
})

test('with harmony', async () => {
  const _version = process.version
  process.version = 'v8.11.1'

  moxios.stubRequest('https://raw.githubusercontent.com/williamkapke/'
    + 'node-compat-table/gh-pages/results/v8/8.11.1.json', {
      status: 200,
      responseText: fixture.normal
    })
  moxios.stubRequest('https://raw.githubusercontent.com/williamkapke/'
    + 'node-compat-table/gh-pages/results/v8/8.11.1--harmony.json', {
      status: 200,
      responseText: fixture.harmony
    })

  let result = await query('unicode escape sequences in identifiers')
  expect(result.result[0].passed).toBe(false)

  result = await query(
    'unicode escape sequences in identifiers',
    { allowHarmony: true }
  )
  expect(result.result[0].passed).toBe(true)

  process.version = _version
})
