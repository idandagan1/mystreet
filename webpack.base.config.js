var path = require('path');

var DIST_DIR = path.join(__dirname, 'dist'),
    CLIENT_DIR = path.join(__dirname, 'client');

module.exports = {
    context: CLIENT_DIR,

    entry: './entry.js',

    output: {
        path: DIST_DIR,
        filename: 'bundle.js',
    },

    devtool: 'inline-source-map',

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
                test: /\.css$/,
                exclude: /node_modules/,
                loader: 'style-loader!css-loader!autoprefixer-loader',
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

    resolve: {
        extensions: ['', '.js', '.jsx'],
        root: [
            path.resolve(__dirname, 'client'),
            path.resolve(__dirname, 'node_modules'),
        ],
    },

}
