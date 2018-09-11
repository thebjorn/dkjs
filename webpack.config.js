
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = {
    mode: 'development',   // production, none
    devtool: 'eval-source-map',
    // mode: "production",
    // devtool: 'source-map',

    target: 'web',
    // target: 'node',
    
    entry: './src/index.js',
    
    output: {
        //path: path.resolve(__dirname, 'dkjs/static/dkjs/js'),
        path: path.resolve(__dirname, 'dist'),
        filename: 'dk.js',
        library: 'dk',
        libraryTarget: "var"
    },
    
    // plugins: [
    //     new HtmlWebpackPlugin({template: './src/index.html'})
    // ],
    
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                // exclude: /node_modules\/(?!(@polymer|@webcomponents)\/).*/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        presets: ['env'],
                        // plugins: ['@babel/plugin-transform-runtime']
                    }
                }
            }
        ]
    },
    // externals: {
    //     $: "jquery",
    //     _: "loadash"
    // }
    
    externals: {
        jquery: {
            commonjs: 'jQuery',
            commonjs2: 'jQuery',
            amd: 'jQuery',
            root: '$'
        },
        lodash: {
            commonjs: 'lodash',
            commonjs2: 'lodash',
            amd: 'lodash',
            root: '_'
        }
    }
    
};
