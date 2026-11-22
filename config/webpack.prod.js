var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const AotPlugin = require('@ngtools/webpack').AngularCompilerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
var helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
    //devtool: 'source-map',
    mode: 'production',
    entry: {
        'ngApp': './Client/src/main.aot.ts'
    },
    module: {
        rules: [
            {
                test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
                loader: '@ngtools/webpack'
            }
        ]
    },
    output: {
        path: helpers.root('dist'),
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },

    optimization: {
        noEmitOnErrors: true,
        splitChunks: {
            //chunks: 'all',
            cacheGroups: {
                commons: { test: /[\\/]node_modules[\\/]/, name: "material-styles", filename: 'commons.js', chunks: "all" }
            }
        },
        minimizer: [
            //new UglifyJsPlugin({
            //    cache: true,
            //    parallel: true
            //}),

            new TerserPlugin({
                //cache: true,
                parallel: true
            }),

            new OptimizeCssAssetsPlugin({
                cssProcessor: require('cssnano'),
                cssProcessorOptions: {
                    discardComments: {
                        removeAll: true
                    }
                },
                canPrint: false
            })
        ]
    },

    plugins: [
        new AotPlugin({
            tsConfigPath: helpers.root('Client','src','tsconfig.aot.json'),
            entryModule: helpers.root('Client', 'src', 'app', 'app.module#AppModule'),
            // Webpack will generate source-maps independent of this setting. But,
            // this setting uses the original source code in the source-map, rather
            // than the generated / compiled code.
            sourceMap: true
        }),

        new webpack.DefinePlugin({
            __ANCHOR_TARGET__: JSON.stringify("_blank"),
            __DEBUG_MODE__: JSON.stringify("prod"),
            __UID__: JSON.stringify(""),
            __PWD__: JSON.stringify("")
        })
    ]
});