import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
// import CleanWebpackPlugin from 'clean-webpack-plugin';

export default {
    entry: './client/entry.js',

    output: {
        filename: 'application.js',
        path: path.join(__dirname, '/dist'),
        publicPath: '/',
    },

    plugins: [
        // new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'MyStreet',
            filename: 'index.html',
            template: './client/index.html',
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
            },
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
            },
            {
                loader: 'style!css!sass',
                test: /\.scss$/i,
            },
            {
                test: /\.(?:png|svg|ico|jpe?g)$/i,
                loader: 'file-loader',
                query: { name: 'images/[name].[ext]' },
            },
            {
                test: /\.html$/,
                loader: 'html-loader?attrs[]=video:src',
            },
            {
                test: /\.mp4$/,
                loader: 'url-loader?limit=10000&mimetype=video/mp4',
            },
        ],
    },

    devtool: 'eval',
};
