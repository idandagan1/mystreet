var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: [
        'webpack-dev-server/client?mystreet-project.herokuapp.com',
        './client/entry.js',
    ],

    output: {
        filename: 'application.js',
        path: path.join(__dirname, '/dist'),
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: 'MyStreet',
            filename: 'index.html',
            template: './client/index.html',
            favicon: './client/resources/images/favicon.ico',
        }),
    ],

    resolve: {
        extensions: ['', '.js', '.jsx'],
        root: [
            path.resolve(__dirname, 'client'),
            path.resolve(__dirname, 'node_modules'),
        ],
    },

    resolveLoader: {
        root: path.resolve(__dirname, 'node_modules'),
    },

    sassLoader: {
        includePaths: [
            path.resolve(__dirname, 'client'),
            path.resolve(__dirname, 'node_modules'),
        ],
    },

    module: {
        loaders: [
            {
                loader: 'babel-loader',
                test: /\.js$/,
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react', 'stage-0'],
                },
            },
            {
                loader: 'style!css!sass',
                test: /\.scss$/i,
            },
            {
                test: /\.(?:png|svg|jpe?g|ico)$/i,
                loader: 'file-loader',
                query: { name: 'images/[name].[ext]' },
            },
            {
                test: /\.(?:mp4)$/i,
                loader: 'file-loader',
                query: { name: 'videos/[name].[ext]' },
            },
        ],
    },

    devtool: 'inline-source-map',
};
