import { fetch } from 'undici'

type NodeTestResult = {
  _version: string
  _engine: string
} & Record<string, ESResult & Record<string, boolean | string>>

interface ESResult {
  _successful: number
  _count: number
  _percent: number
}

export interface Options {
  allowHarmony: boolean
  nodeVersion: string
}

async function query(feature: string, options: Partial<Options> = {}) {
  const nodeVersion = (options.nodeVersion || process.version).replace('v', '')
  const harmony = options.allowHarmony ? '--harmony' : ''
  const url =
    'https://raw.githubusercontent.com/williamkapke/' +
    `node-compat-table/gh-pages/results/v8/${nodeVersion}${harmony}.json`

  const result = (await fetch(url).then((response) =>
    response.json()
  )) as NodeTestResult

  const search: Array<{
    esVersion: string
    featureType: string
    category: string
    feature: string
    passed: boolean
  }> = Object.entries(result)
    .filter(([key]) => !key.startsWith('_'))
    .reverse()
    .flatMap(([version, info]) =>
      Object.entries(info)
        .filter(([key]) => !key.startsWith('_'))
        .filter(([key]) => key.includes(feature))
        .map(([key, value]) => {
          const info = key.split('›') as [string, string, string]
          return {
            esVersion: version,
            featureType: info[0],
            category: info[1],
            feature: info[2],
            passed: typeof value === 'string' ? false : value,
          }
        })
    )

  return {
    nodeVersion,
    v8Version: result._engine.replace('v8 ', ''),
    result: search,
  }
}

export default query
module.exports = query
Object.defineProperty(module.exports, 'default', { value: query })
Object.defineProperty(module.exports, '__esModule', { value: true })
