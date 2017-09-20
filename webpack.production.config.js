var webpack = require('webpack');
var baseConfig = require('./webpack.base.config.js');

baseConfig.devtool = 'cheap-module-source-map';

baseConfig.entry = {
    app: '../server/server.js',
    vendor: ['react', 'react-dom', 'react-router'],
}

baseConfig.plugins = [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production'),
        },
    }),
];

module.exports = baseConfig;
