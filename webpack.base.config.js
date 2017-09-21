var path = require('path');

var DIST_DIR = path.join(__dirname, 'dist'),
    CLIENT_DIR = path.join(__dirname, 'client');

module.exports = {

    entry: {
        app: [
            './client/entry.js',
        ],
        vendor: [
            'react',
            'react-dom',
        ],
    },

    output: {
        path: DIST_DIR,
        filename: '[name].[chunkhash].js',
        publicPath: '/',
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
                loader: 'babel',
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
