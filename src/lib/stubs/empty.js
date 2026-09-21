// pdfjs-dist 3.x contains a Node-only `require('canvas')` branch for
// server-side rendering. We only ever run pdf.js in the browser, so the
// bundler is pointed here instead of at the native `canvas` package — which
// cannot be built on Vercel and is not needed.
module.exports = {};
