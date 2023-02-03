import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { MockAgent, setGlobalDispatcher } from 'undici'
import query from '../src'

const mockAgent = new MockAgent()
setGlobalDispatcher(mockAgent)

const fixture = {
  normal: require('./fixture/8.11.1.json'),
  harmony: require('./fixture/8.11.1--harmony.json'),
  modern: require('./fixture/19.1.0.json'),
}

const mockPool = mockAgent.get('https://raw.githubusercontent.com')

beforeAll(() => {
  Object.defineProperty(process, 'version', { writable: true })
})

describe('without harmony', () => {
  beforeEach(() => {
    mockPool
      .intercept({
        path: '/williamkapke/node-compat-table/gh-pages/results/v8/8.11.1.json',
        method: 'GET',
      })
      .reply(200, fixture.normal)
  })

  it('Array.prototype.shift', async () => {
    const result = await query('Array.prototype.shift', {
      nodeVersion: '8.11.1',
    })
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
  })

  it('proper tail calls (tail call optimisation)', async () => {
    const result = await query('proper tail calls (tail call optimisation)', {
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
})

describe('with harmony', () => {
  const feature = 'unicode escape sequences in identifiers'
  let originalVersion = process.version

  beforeEach(() => {
    originalVersion = process.version
    Object.assign(process, { version: 'v8.11.1' })
  })

  afterEach(() => {
    Object.assign(process, { version: originalVersion })
  })

  it('normal', async () => {
    mockPool
      .intercept({
        path: '/williamkapke/node-compat-table/gh-pages/results/v8/8.11.1.json',
        method: 'GET',
      })
      .reply(200, fixture.normal)

    const result = await query(feature)
    expect(result.result[0].passed).toBe(false)
  })

  it('harmony', async () => {
    mockPool
      .intercept({
        path: '/williamkapke/node-compat-table/gh-pages/results/v8/8.11.1--harmony.json',
        method: 'GET',
      })
      .reply(200, fixture.harmony)

    const result = await query(feature, { allowHarmony: true })
    expect(result.result[0].passed).toBe(true)
  })
})

describe('modern ES_VERSION without harmony', () => {
  beforeEach(() => {
    mockPool
      .intercept({
        path: '/williamkapke/node-compat-table/gh-pages/results/v8/19.1.0.json',
        method: 'GET',
      })
      .reply(200, fixture.modern)
  })

  it('ES2022', async () => {
    // ES2022
    const result = await query('Error.cause', { nodeVersion: '19.1.0' })
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
