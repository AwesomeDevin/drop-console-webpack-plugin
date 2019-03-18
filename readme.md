## drop-console-webpack-plugin
#### A webpack plugin for removing console and supporting webpack4
![](https://img.shields.io/badge/npm-4.0.2-blue.svg)     //webpack4

![](https://img.shields.io/badge/npm-3.0.0-blue.svg)     //webpack<4

![](https://img.shields.io/badge/build-passing-brightgreen.svg)

![](https://img.shields.io/badge/license-MIT-brightgreen.svg)


## Installation
```
npm install drop-console-webpack-plugin --save
```
## Usage
```
    const DropConsoleWebpackPlugin = require('drop-console-webpack-plugin')

    plugins: [
        new DropConsoleWebpackPlugin(),
    ]
```
## Notes
```
if   webpack version < 4    :    4.0.0>drop-console-webpack-plugin version >=3.0.0
if   webpack version >= 4   :    drop-console-webpack-plugin version >=4.0.0 && nodejs version > 7.6
```
## Options
Name | type | default | Description
---- | ---- | ------- | -----------
drop_log | Boolean | true | remove console.log(...)
drop_info | Boolean | true | remove console.info(...)
drop_warn | Boolean | false | remove console.warn(...)
drop_error | Boolean | false | remove console.error(...)
exclude   | Array | [] | exclude chunk - you should use it to reduce the time of building

## Code
```
new DropConsoleWebpackPlugin({
    drop_log    : true, 
    drop_info   : true,
    drop_warn   : false,
    drop_error  : false,
    exclude     : ['manifest'],
})
```
