const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const devConfig = require('./webpack.base.config');
const config = require('./server/config/config');

devConfig.entry = [
    'webpack-dev-server/client?http://localhost:8000/',
    './client/entry.js',
];

devConfig.output.filename = 'bundle.js';

devConfig.plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
        title: 'MyStreet',
        filename: 'index.html',
        template: './client/index.html',
        favicon: './favicon.ico',
    }),
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('development'),
            SERVER_URL: JSON.stringify(`${config.url}:${config.port}`),
            SERVER_HOST: JSON.stringify(`${config.url}`),
        },
    }),
];

module.exports = devConfig;
