var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var baseConfig = require('./webpack.base.config.js');
var config = require('./server/config/config');

baseConfig.devtool = 'cheap-module-source-map';

baseConfig.plugins = [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production'),
            SERVER_URL: JSON.stringify(`${config.url}:${config.port}`),
        },
    }),
    new HtmlWebpackPlugin({
        title: 'MyStreet',
        filename: 'index.html',
        template: './client/index.html',
        favicon: './client/resources/images/favicon.ico',
    }),
];

module.exports = baseConfig;
