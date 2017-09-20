var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var baseConfig = require('./webpack.base.config.js');

baseConfig.devtool = 'cheap-module-source-map';

baseConfig.entry = {
    app: '../server/server.js',
}

baseConfig.plugins = [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production'),
        },
    }),
    new HtmlWebpackPlugin({
        title: 'MyStreet',
        filename: 'index.html',
        template: './index.html',
        favicon: './resources/images/favicon.ico',
    }),
];

module.exports = baseConfig;
