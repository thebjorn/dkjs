
var path = require('path');

module.exports = {
    mode: 'development',   // production, none
    // devtool: 'eval',
    target: 'web',
    // target: 'node',
    
    entry: './src/index.js',
    
    output: {
        //path: path.resolve(__dirname, 'dkjs/static/dkjs/js'),
        path: path.resolve(__dirname, 'dist'),
        filename: 'dk.js',
        library: 'dk',
        libraryExport: 'default',
        umdNamedDefine: true,
        libraryTarget: "umd"                 // dk.default
    },
    
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
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
    
    externals: {
        jquery: 'jQuery',
        lodash: {
            commonjs: 'lodash',
            commonjs2: 'lodash',
            amd: 'lodash',
            root: '_'
        }
    }
    
};
