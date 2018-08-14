var path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        //path: path.resolve(__dirname, 'dkjs/static/dkjs/js'),
        path: path.resolve(__dirname, 'dist'),
        filename: 'dk.js',
        library: 'dk',
        libraryTarget: "var"
    },
    externals: {
        lodash: {
            commonjs: 'lodash',
            commonjs2: 'lodash',
            amd: 'lodash',
            root: '_'
        }
    }
    
};
