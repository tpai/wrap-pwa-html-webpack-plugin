'use strict';

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const { matchFiles } = require('./fileUtilities.js')
const nodeCreateManifest = require('./createManifest');
const nodeCreateSwScript = require('./createSwScript');

const DEFAULT_OPTIONS = {
  enabled: true
};

class WrapPwaHTMLWebpackPlugin {
  constructor (options) {
    this.options = Object.assign({
      writeFile: {
        flag: 'w'
      }
    }, DEFAULT_OPTIONS, options);
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
      writeFile
    } = this.options;
    fs.writeFileSync(
      `${outputPath}/manifest.json`,
      nodeCreateManifest({ name: path.basename(context) }),
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
    fs.writeFileSync(
      `${outputPath}/sw.js`,
      nodeCreateSwScript({
        name: path.basename(context),
        files: matchFiles(this.assets, '(js|css)')
      }),
      writeFile
    );
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
