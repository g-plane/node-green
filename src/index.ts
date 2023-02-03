import fetch from 'node-fetch'

interface NodeTestResult {
  _version: string
  _engine: string
  ESNEXT: ESResult & { [esFeature: string]: boolean | string }
  ES2018: ESResult & { [esFeature: string]: boolean | string }
  ES2017: ESResult & { [esFeature: string]: boolean | string }
  ES2016: ESResult & { [esFeature: string]: boolean | string }
  ES2015: ESResult & { [esFeature: string]: boolean | string }
}

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

  const result: NodeTestResult = await fetch(url).then((response) =>
    response.json()
  )

  const ES_VERSIONS = Object.keys(result)
    .filter((key) => !key.startsWith('_'))
    .reverse()

  const search: Array<{
    esVersion: string
    featureType: string
    category: string
    feature: string
    passed: boolean
  }> = []

  ES_VERSIONS.forEach((ver) => {
    Object.keys(result[ver])
      .filter((key) => !key.startsWith('_'))
      .filter((key) => key.includes(feature))
      .forEach((key) => {
        const info = key.split('›')
        search.push({
          esVersion: ver,
          featureType: info[0],
          category: info[1],
          feature: info[2],
          passed:
            typeof result[ver][key] === 'string' ? false : result[ver][key],
        })
      })
  })

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
