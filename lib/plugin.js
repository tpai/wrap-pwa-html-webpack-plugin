'use strict';

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const { matchFiles } = require('./fileUtilities.js')
const nodeCreateManifest = require('./createManifest');
const nodeCreateSwScript = require('./createSwScript');

class WrapPwaHTMLWebpackPlugin {
  constructor (options) {
    this.options = Object.assign({
      enabled: true,
      manifest: {},
      writeFile: {
        flag: 'w'
      }
    }, options);
  }
  apply (compiler) {
    if (!this.options.enabled)return;

    this.options.webpack = compiler.options;

    compiler.plugin('compilation', compilation => {
      compilation.plugin('html-webpack-plugin-after-html-processing', (htmlPluginData, callback) => {
        this.createManifest();
        this.injectRequirements(htmlPluginData, callback);
      });
    });

    compiler.plugin('done', stats => {
      this.assets = Object.keys(stats.compilation.assets);
      this.createSwScript();
    });
  }
  createManifest () {
    const {
      webpack: {
        context,
        output: {
          path: outputPath
        }
      },
      writeFile,
      manifest
    } = this.options;
    fs.writeFileSync(
      `${outputPath}/manifest.json`,
      nodeCreateManifest(Object.assign({ name: path.basename(context) }, manifest)),
      writeFile
    );
  }
  createSwScript () {
    const {
      webpack: {
        context,
        output: {
          path: outputPath
        }
      },
      writeFile
    } = this.options;
    const name = path.basename(context);
    const files = matchFiles(this.assets, '(js|css)');
    const filename = `${outputPath}/sw.js`;

    let result;
    if (fs.existsSync(filename)) {
      fs.readFile(filename, 'utf8', (err, data) => {
        result = data
          .replace(/const cacheName = \'\S+\'/, `const cacheName = '${name}'`)
          .replace(/(\'[a-z0-9.]+\',?)+/, `${files.map(file => `\'${file}\'`)}`)
        fs.writeFileSync(filename, result, writeFile);
      });
    } else {
      result = nodeCreateSwScript({ name, files });
      fs.writeFileSync(filename, result, writeFile);
    }
  }
  injectRequirements (htmlPluginData, callback) {
    const dom = new JSDOM(htmlPluginData.html);
    const document = dom.window.document;
    document.body.insertAdjacentHTML('beforeend', `<script>
  if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(function() {
        console.log('Service Worker Registered');
      });
  }
</script>
    `);
    document.head.insertAdjacentHTML('afterbegin', `<meta name="theme-color" content="#ffffff"/>`);
    document.head.insertAdjacentHTML('beforeend', `<link rel="manifest" href="manifest.json">`);
    htmlPluginData.html = dom.window.document.documentElement.outerHTML;
    callback(null, htmlPluginData);
  }
}

module.exports = WrapPwaHTMLWebpackPlugin;
