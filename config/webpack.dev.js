var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
    devtool: 'cheap-module-eval-source-map',
    mode: 'development',
    entry: {
        'ngApp': './Client/src/main.jit.ts',
        'commons': './Client/src/vendors.ts',
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                loaders: [
                    //'babel-loader',
                    {
                        loader: 'awesome-typescript-loader',
                        options: {
                            configFileName: helpers.root('Client', 'src', 'tsconfig.json')
                        }
                    },
                    'angular2-template-loader',
                    'angular-router-loader'
                ],
                exclude: [/node_modules/]
            }
        ]
    },
    output: {
        path: helpers.root('dist'),
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },
    
    devServer: {
        historyApiFallback: true,
        stats: 'minimal'
    },

    plugins: [
        new webpack.DefinePlugin({
            __ANCHOR_TARGET__: JSON.stringify("_self"),
            __DEBUG_MODE__: JSON.stringify("dev"),
            __UID__: JSON.stringify("KC1"),
            __PWD__: JSON.stringify("123456")
        })
    ]
});