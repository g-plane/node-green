import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
  type Mock,
} from 'vitest'
import fetch from 'node-fetch'
import query from '../src'

vi.mock('node-fetch')

/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-require-imports */
const fixture = {
  normal: require('./fixture/8.11.1.json'),
  harmony: require('./fixture/8.11.1--harmony.json'),
  modern: require('./fixture/19.1.0.json'),
}
/* eslint-enable global-require */
/* eslint-enable @typescript-eslint/no-require-imports */

beforeAll(() => {
  Object.defineProperty(process, 'version', { writable: true })
})

test('without harmony', async () => {
  ;(fetch as unknown as Mock).mockResolvedValue({
    json() {
      return Promise.resolve(fixture.normal)
    },
  })

  let result = await query('Array.prototype.shift', { nodeVersion: '8.11.1' })
  expect(fetch).toBeCalledWith(
    'https://raw.githubusercontent.com/williamkapke/' +
      'node-compat-table/gh-pages/results/v8/8.11.1.json'
  )
  expect(result.nodeVersion).toBe('8.11.1')
  expect(result.v8Version).toBe('6.2.414.50')
  expect(result.result).toEqual([
    {
      esVersion: 'ES2015',
      featureType: 'misc',
      category: "Proxy, internal 'get' calls",
      feature: 'Array.prototype.shift',
      passed: true,
    },
    {
      esVersion: 'ES2015',
      featureType: 'misc',
      category: "Proxy, internal 'set' calls",
      feature: 'Array.prototype.shift',
      passed: true,
    },
    {
      esVersion: 'ES2015',
      featureType: 'misc',
      category: "Proxy, internal 'deleteProperty' calls",
      feature: 'Array.prototype.shift',
      passed: true,
    },
  ])

  result = await query('proper tail calls (tail call optimisation)', {
    nodeVersion: 'v8.11.1',
  })
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
  Object.assign(process, { version: 'v8.11.1' })

  const feature = 'unicode escape sequences in identifiers'
  ;(fetch as unknown as Mock)
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
  expect(fetch).toBeCalledWith(
    'https://raw.githubusercontent.com/williamkapke/' +
      'node-compat-table/gh-pages/results/v8/8.11.1.json'
  )
  expect(result.result[0].passed).toBe(false)

  result = await query(feature, { allowHarmony: true })
  expect(fetch).toBeCalledWith(
    'https://raw.githubusercontent.com/williamkapke/' +
      'node-compat-table/gh-pages/results/v8/8.11.1--harmony.json'
  )
  expect(result.result[0].passed).toBe(true)

  Object.assign(process, { version: _version })
})

describe('modern ES_VERSION without harmony', () => {
  beforeEach(() => {
    ;(fetch as unknown as Mock).mockResolvedValue({
      json() {
        return Promise.resolve(fixture.modern)
      },
    })
  })

  test('ES2022', async () => {
    // ES2022
    const result = await query('Error.cause', { nodeVersion: '19.1.0' })
    expect(fetch).toBeCalledWith(
      'https://raw.githubusercontent.com/williamkapke/' +
        'node-compat-table/gh-pages/results/v8/19.1.0.json'
    )
    expect(result.nodeVersion).toBe('19.1.0')
    expect(result.v8Version).toBe('10.7.193.20-node.19')
    expect(result.result).toEqual([
      {
        category: 'Error.cause property',
        esVersion: 'ES2022',
        feature: 'Error has cause',
        featureType: 'features',
        passed: true,
      },
      {
        category: 'Error.cause property',
        esVersion: 'ES2022',
        feature: 'Error.prototype lacks cause',
        featureType: 'features',
        passed: true,
      },
      {
        category: 'Error.cause property',
        esVersion: 'ES2022',
        feature: 'EvalError has cause',
        featureType: 'features',
        passed: true,
      },
      {
        category: 'Error.cause property',
        esVersion: 'ES2022',
        feature: 'EvalError.prototype lacks cause',
        featureType: 'features',
        passed: true,
      },
      {
        category: 'Error.cause property',
        esVersion: 'ES2022',
        feature: 'RangeError has cause',
        featureType: 'features',
        passed: true,
      },
      {
        category: 'Error.cause property',
        esVersion: 'ES2022',
        feature: 'RangeError.prototype lacks cause',
        featureType: 'features',
        passed: true,
      },
      {
        category: 'Error.cause property',
        esVersion: 'ES2022',
        feature: 'ReferenceError has cause',
        featureType: 'features',
        passed: true,
      },
      {
        category: 'Error.cause property',
        esVersion: 'ES2022',
        feature: 'ReferenceError.prototype lacks cause',
        featureType: 'features',
        passed: true,
      },
      {
        category: 'Error.cause property',
        esVersion: 'ES2022',
        feature: 'SyntaxError has cause',
        featureType: 'features',
        passed: true,
      },
      {
        category: 'Error.cause property',
        esVersion: 'ES2022',
        feature: 'SyntaxError.prototype lacks cause',
        featureType: 'features',
        passed: true,
      },
      {
        category: 'Error.cause property',
        esVersion: 'ES2022',
        feature: 'TypeError has cause',
        featureType: 'features',
        passed: true,
      },
      {
        category: 'Error.cause property',
        esVersion: 'ES2022',
        feature: 'TypeError.prototype lacks cause',
        featureType: 'features',
        passed: true,
      },
      {
        category: 'Error.cause property',
        esVersion: 'ES2022',
        feature: 'URIError has cause',
        featureType: 'features',
        passed: true,
      },
      {
        category: 'Error.cause property',
        esVersion: 'ES2022',
        feature: 'URIError.prototype lacks cause',
        featureType: 'features',
        passed: true,
      },
      {
        category: 'Error.cause property',
        esVersion: 'ES2022',
        feature: 'AggregateError has cause',
        featureType: 'features',
        passed: true,
      },
      {
        category: 'Error.cause property',
        esVersion: 'ES2022',
        feature: 'AggregateError.prototype lacks cause',
        featureType: 'features',
        passed: true,
      },
    ])
  })
})
