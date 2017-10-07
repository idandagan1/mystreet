const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.base.config');
const config = require('./server/config/config');

baseConfig.devtool = 'cheap-module-source-map';

baseConfig.plugins = [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production'),
            SERVER_URL: JSON.stringify(`${config.url}`),
        },
    }),
    new webpack.EnvironmentPlugin([
        'NODE_ENV',
        'PORT',
    ]),
    new HtmlWebpackPlugin({
        title: 'MyStreet',
        filename: 'index.html',
        template: './client/index.html',
        favicon: './favicon.ico',
    }),
];

module.exports = baseConfig;
