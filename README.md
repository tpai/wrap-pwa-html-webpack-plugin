# Wrap PWA HTML Webpack Plugin

Enhances html-webpack-plugin functionality with progressive web app features:

* manifest.json
* sw.js (service worker)
* index.html (with required tags and scripts)

## Installation

Install the plugin with npm:

```
$ npm install @tpai/wrap-pwa-html-webpack-plugin --save-dev
```

## Usage

Add the plugin to your webpack config as follows:

```
plugins: [
  new HtmlWebpackPlugin(),
  new WrapPwaHtmlWebpackPlugin()
]
```

The order is important - the plugin must come after HtmlWebpackPlugin.

You also could use environment variable to control the onoff switch of plugin like this:

```
plugins: [
  new HtmlWebpackPlugin(),
  new WrapPwaHtmlWebpackPlugin({ enabled: process.env.PWA })
]
```
