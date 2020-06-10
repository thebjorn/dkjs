module.exports = function (api) {
    api.cache(true);
    
    const presets = [
        ["@babel/preset-env", {
            "targets": {
            },
            "useBuiltIns": "entry",
            "corejs": "2",
            // "useBuiltIns": "usage"
        }],
        ["@babel/preset-flow"]
    ];
    
    const plugins = [
        "@babel/plugin-transform-flow-strip-types",
        "@babel/plugin-transform-for-of",
        ["@babel/plugin-proposal-decorators", {
            "decoratorsBeforeExport": false,
            "version": "nov-2018"
            // "version": "jan-2019"
        }],
        "@babel/plugin-proposal-class-properties",

    ];
    if (!process.env.BABEL_SKIP_TRANSFORM_RUNTIME) {
        plugins.push([
            "@babel/plugin-transform-runtime",
            {
                "corejs": "2",
                "helpers": true,
                "regenerator": true,
                "useESModules": false
                // "useESModules": true
            }
        ]);
    }

    return {
        presets,
        plugins,
        "ignore": [
            "node_modules"
        ],
        // env: {
        //     test: {
        //         plugins: [
        //             '@babel/plugin-transform-modules-commonjs'
        //         ]
        //     }
        // }
    };
};
