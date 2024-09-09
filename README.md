<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>

  <h1>Version Checker Webpack Plugin</h1>
  <p>Dependency Version Checker Plugin.</p>
</div>

<h2 align="center">Install</h2>

<h3>Webpack 5</h3>

```bash
  npm i --save-dev version-checker-webpack-plugin
```

```bash
  yarn add --dev version-checker-webpack-plugin
```
<h2 align="center">Use</h2>

The plugin will output warnings to the console and to Windows or MacOS notifications, for this you need to add it as indicated below:

**webpack.config.js**

```js
const VersionCheckerPlugin = require("version-checker-webpack-plugin");

module.exports = {
  entry: "index.js",
  output: {
    path: __dirname + "/dist",
    filename: "index_bundle.js",
  },
  plugins: [new VersionCheckerPlugin({
    depNames: ['version-checker-webpack-plugin']
  })],
};
```

<h2 align="center">Options</h2>

Available settings:

|              Name               |                         Type                         |                        Default                        | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| :-----------------------------: | :--------------------------------------------------: | :---------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|          **`depNames`**         |                      `{Array.<string>}`              |                          ['']                         | Names of packages to be checked                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|      **`options.showToast`**    |                         `{Boolean}`                  |                          true                         | Toast of Windows or MacOC                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
|     **`options.showConsole`**   |                         `{Boolean}`                  |                          true                         | Toast of console                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **`options.devServerOnly`** |                         `{Boolean}`                  |                          true                         | For DevServer only                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |