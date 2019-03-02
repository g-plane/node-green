# node-green

Check Node.js ECMAScript compatibility.

![Azure Pipelines](https://flat.badgen.net/azure-pipelines/G-Plane/G-Plane/g-plane.node-green)
![License](https://flat.badgen.net/github/license/g-plane/node-green)
![NPM Version](https://flat.badgen.net/npm/v/node-green)

## Installation

Using Yarn:

```bash
$ yarn add node-green
```

Using npm:

```bash
$ npm install node-green
```

## Usage

```javascript
const nodeGreen = require('node-green')
;(async () => {
  // Use the version of Node.js you're running by default
  let result = await nodeGreen('Array.prototype.includes')
  console.log(result)

  let result = await nodeGreen('Array.prototype.includes', { nodeVersion: '6.4.0' })
  console.log(result)

  // Allow `harmony` flag
  let result = await nodeGreen('Array.prototype.includes', { allowHarmony: true })
  console.log(result)
})
```

## API

### nodeGreen(feature, [options])

Fetch [williamkapke/node-compat-table](https://github.com/williamkapke/node-compat-table)
and returns query result.

#### feature

Type: `string`

ES feature you want to search.

#### options

Type: `object`

##### allowHarmony

Type: `boolean`

Allow using `--harmony` flag for Node.js.

##### nodeVersion

Type: `string`

Specify Node.js version.
If it is omitted, use the version of Node.js you are running currently.

#### Return Type

Type: `object`

##### nodeVersion

Type: `string`

Node.js verison.

##### v8Version

Type: `string`

V8 version.

##### result

Type: `Array`

An array of query result.

###### esVersion

Type: `string`

It will be one of `ESNEXT`, `ES2018`, `ES2017`, `ES2016`, `ES2015`.

###### featureType

Type: `string`

It may be one of `misc`, `syntax`, `functions` and so on.

###### category

Type: `string`

###### feature

Type: `string`

###### passed

Type: `boolean`

Indicates whether the feature was passed under that Node.js.

## Related Projects

[node-green-cli](https://github.com/g-plane/node-green-cli) - CLI for this module.

## Credits

Thanks [@williamkapke](https://github.com/williamkapke)'s work:
[williamkapke/node-compat-table](https://github.com/williamkapke/node-compat-table).

## License

MIT License

Copyright (c) 2018-present Pig Fang
