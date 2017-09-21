/**
 * Created by idandagan1 on 21/09/2017.
 */
/**
 * Entry Script
 */

if (process.env.NODE_ENV === 'production') {
    // process.env.webpackAssets = JSON.stringify(require('./dist/manifest.json'));
    // process.env.webpackChunkAssets = JSON.stringify(require('./dist/chunk-manifest.json'));
    // In production, serve the webpacked server file.
    require('./dist/server.bundle.js');
} else {
    require('./server/server-es6');
}
