/**
 * Created by idandagan1 on 21/09/2017.
 */
var serverConfig = require('./webpack.base.config.js');

serverConfig.devtool = 'cheap-module-source-map';

serverConfig.entry = './server/server.js';

serverConfig.output = {
    path: './dist/',
    filename: 'server.bundle.js',
};

serverConfig.module = {
    loaders: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: [
                    'react',
                    'es2015',
                    'stage-0',
                ],
            },
        }, {
            test: /\.json$/,
            loader: 'json-loader',
        },
    ],
};

module.exports = serverConfig;
