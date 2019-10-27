
export default {
    input: 'src/index.js',
    output: [{
        name: 'dk',
        file: 'dist/dkdj.js',
        format: 'iife',
        globals: {
            jquery: 'jQuery',
        }
    }, {
        file: 'dist/dkdj-node.js',
        format: 'cjs'
    }]
};
