# Wrap PWA HTML Webpack Plugin

Enhances html-webpack-plugin functionality with progressive web app features:

* manifest.json
* sw.js (service worker)
* index.html (with required tags and scripts)

## Installation

Install the plugin with npm:

```
$ npm install wrap-pwa-html-webpack-plugin --save-dev
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

## Configurations

You could pass configuration options to the plugin to customize `manifest.json`:

```
plugins: [
  new HtmlWebpackPlugin(),
  new WrapPwaHtmlWebpackPlugin({
    manifest: {
      name: 'application',
      short_name: 'app',
      icons: [{
        "src": "icons/icon-128x128.png",
        "sizes": "128x128",
        "type": "image/png"
      }],
      start_url = '/index.html',
      display = 'standalone',
      background_color = '#ffffff',
      theme_color = '#ffffff'
    }
  })
]
```

Service worker file will automatically generate, you could modify any of it but variable definitions at the top.

```
// Plugin will automatically generate cache name and asset file name
const cacheName = 'app-name';
const filesToCache = [
  '0.0ff519584c0599558727.js','1.0ff519584c0599558727.js','main.0ff519584c0599558727.js'
];
// So DO NOT delete variable definitions upon

self.addEventListener('install', e => {
  console.log('[ServiceWorker] Install');
```
