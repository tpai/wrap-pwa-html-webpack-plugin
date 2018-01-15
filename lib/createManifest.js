const manifest = ({
  name,
  background_color = '#ffffff',
  theme_color = '#ffffff'
}) => (`{
  "name": "${name}",
  "short_name": "${name}",
  "icons": [{
    "src": "icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    }, {
      "src": "icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    }, {
      "src": "icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    }, {
      "src": "icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "start_url": "/index.html",
  "display": "standalone",
  "background_color": "${background_color}",
  "theme_color": "${theme_color}"
}`);

module.exports = manifest;
