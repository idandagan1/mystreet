var webpack = require('webpack');
var baseConfig = require('./webpack.base.config.js');

baseConfig.devtool = 'cheap-module-source-map';

baseConfig.plugins = [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production'),
        },
    }),
];

module.exports = baseConfig;
