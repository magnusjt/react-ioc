var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
        "./index.js"
    ],
    output: {
        path: __dirname,
        filename: "index.bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                loaders: ['babel-loader?stage=0'],
                include: [__dirname, path.resolve(__dirname, '../../src')]
            }
        ]
    },
    plugins: [
        new webpack.NoErrorsPlugin()
    ]
};