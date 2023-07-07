const path = require('path');
const webpack = require('webpack')
module.exports = {
    entry: './index.js',
    target: 'node',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        fallback: {
        util: require.resolve('util/'),
        path: require.resolve('path-browserify'),
        url: require.resolve("url/"),
        assert: require.resolve("assert/"),
        crypto: require.resolve("crypto-browserify"),
        process: require.resolve("process/browser"),
        }
    },
    module: {
        rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
            loader: 'babel-loader'
            }
        },
        {
            test: /\.html$/,
            loader: 'html-loader'
        }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.FLUENTFFMPEG_COV': false
            })
        ],
    externals: ['nock', 'mock-aws-s3', 'aws-sdk'],
};