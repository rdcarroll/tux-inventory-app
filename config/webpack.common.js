
var webpack = require('webpack');
var MiniCssExtractPlugin  = require('mini-css-extract-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
var helpers = require('./helpers');

module.exports = {
    entry: {
        'polyfills': './Client/src/polyfills.ts',
        'vendors': './Client/src/vendor.ts'
    },

    resolve: {
        extensions: ['.ts', '.js']
    },

    module: {
        rules: [
            {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader'
                }]
            },
            {
                test: /\.(htm|css)$/,
                loader: "raw-loader"
            },
            {
                test: /\.(scss|sass)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ],
            },
            {
                // Mark files inside `@angular/core` as using SystemJS style dynamic imports.
                // Removing this will cause deprecation warnings to appear.
                test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
                parser: { system: true },  // enable SystemJS
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
                styles: { name: 'material-styles', test: /.*material.*\.css$/, chunks: 'all', enforce: true }
            }
        }
    },

    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: 'ngApp.css',
            chunkFilename: '[name].css',
        }),
        new CleanWebpackPlugin( ),

        new CopyWebpackPlugin([
            { from: 'Client/src/assets/images', to: 'images', force: true },
            { from: 'Server/Views', to: 'views', force: true },
            //{ from: 'Scripts/tinymce', to: 'tinymce', force: true }
        ]),
        // Workaround for Critical dependency 
        // The request of a dependency is an expression in ./node_modules/@angular/core/fesm5/core.js
        //new webpack.ContextReplacementPlugin(
        //    /\@angular(\\|\/)core(\\|\/)fesm5/,
        //    helpers.root('./Client/src/app'),
        //    {}
        //),
        new webpack.ContextReplacementPlugin(/(.+)?angular(\\|\/)core(.+)?/, helpers.root('./src'), {}),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ]
};