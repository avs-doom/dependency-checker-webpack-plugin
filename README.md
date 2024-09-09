<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>

  <h1>Version Checker Webpack Plugin</h1>
  <p>Плагин проверки версий зависимостей.</p>
</div>

<h2 align="center">Установка</h2>

<h3>Webpack 5</h3>

```bash
  npm i --save-dev @cloudx/packages-version-checker-webpack-plugin
```

```bash
  yarn add --dev @cloudx/packages-version-checker-webpack-plugin
```
<h2 align="center">Использование</h2>

Плагин выведет предупреждения в консоль и в уведомления Windows или MacOS, для этого необходимо добавить его как указано ниже:

**webpack.config.js**

```js
const VersionCheckerPlugin = require("@cloudx/packages-version-checker-webpack-plugin");

module.exports = {
  entry: "index.js",
  output: {
    path: __dirname + "/dist",
    filename: "index_bundle.js",
  },
  plugins: [new VersionCheckerPlugin({
    depNames: ['@cloudx/packages-version-checker-webpack-plugin']
  })],
};
```

<h2 align="center">Настройки</h2>

Доступные настройки:

|              Name               |                         Type                         |                        Default                        | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| :-----------------------------: | :--------------------------------------------------: | :---------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|          **`depNames`**         |                      `{Array.<string>}`              |                          ['']                         | Имена проверяемых пакетов                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|      **`options.showToast`**    |                         `{Boolean}`                  |                          true                         | Оповещения ОС                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
|     **`options.showConsole`**   |                         `{Boolean}`                  |                          true                         | Оповещения в консоль                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **`options.devServerOnly`** |                         `{Boolean}`                  |                          true                         | Только для DevServer                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |