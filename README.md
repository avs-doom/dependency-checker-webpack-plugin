<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>

  <h1>Dependency Checker Webpack Plugin</h1>
  <p>Plugin that simplifies checke of dependensies version and notify at new versions.</p>
</div>

<h2 align="center">Install</h2>

<h3>Webpack 5</h3>

```bash
  npm i --save-dev dependency-checker-webpack-plugin
```

```bash
  yarn add --dev dependency-checker-webpack-plugin
```
<h2 align="center">Use</h2>

The plugin will output info in console and to Windows, MacOS or Linux toast, for this you need to add it as indicated below:

**webpack.config.js**

```js
import DependencyCheckerPlugin from 'dependency-checker-webpack-plugin';

module.exports = {
  ...
  plugins: [new DependencyCheckerPlugin({
    depNames: ['dependency-checker-webpack-plugin']
  })],
  ...
};
```

<h2 align="center">Settings</h2>

Available settings:

|              Name               |                         Type                         |                        Default                        | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| :-----------------------------: | :--------------------------------------------------: | :---------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|          **`depNames`**         |                      `{Array.<string>}`              |                          ['']                         | Names of packages to be checked                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|      **`options.showToast`**    |                         `{Boolean}`                  |                          true                         | Enable toast of Windows, MacOS or Linux                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
|     **`options.showConsole`**   |                         `{Boolean}`                  |                          true                         | Enable notify of console                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **`options.devServerOnly`** |                         `{Boolean}`                  |                          true                         | For DevServer only                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **`options.disableCertValid`** |                         `{Boolean}`                  |                          false                         | NODE_TLS_REJECT_UNAUTHORIZED = 0 or 1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |