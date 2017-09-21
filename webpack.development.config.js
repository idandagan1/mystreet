var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var devConfig = require('./webpack.base.config.js');

devConfig.entry = [
    'webpack-dev-server/client?http://localhost:8000/',
    './client/entry.js',
];

devConfig.output.publicPath = '/';
devConfig.output.filename = 'bundle.js';

devConfig.plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
        title: 'MyStreet',
        filename: 'index.html',
        template: './client/index.html',
        favicon: './client/resources/images/favicon.ico',
    }),
];

module.exports = devConfig;
