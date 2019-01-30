module.exports = {
    "env": {
        "browser": true,    // we're deploying to the browser
        "commonjs": true,   // ???
        "es6": true,        // source is es6
    },
    "overrides": [{         // setup jest for files under __tests__ directories
        files: ["**/__tests__/*.js"],
        env: {
            jest: true,
        },
        plugins: ['jest'],
        rules: {
            "jest/no-disabled-tests": "warn",
            "jest/no-focused-tests": "error",
            "jest/no-identical-title": "error",
            "jest/prefer-to-have-length": "warn",
            "jest/valid-expect": "error"
        }
    }],
    "extends": "eslint:recommended",   // recommended style guide, incl. 1tbs
    "parser": 'babel-eslint',          // let babel do the parsing
    "parserOptions": {
        // "ecmaVersion": 2018,
        "sourceType": "module",
        "codeFrame": false
    },
    "rules": {
        "indent": [           
            "error",            // indentation problems are errors
            4, {                // 4 space indents
                SwitchCase: 1   // case statments should be indented 1 level
            }
        ],
        "no-unused-vars": ["off"],  // turn off unused vars errors (they're obtrusive when writing new code)
        "linebreak-style": [        // git handles line breaks, don't let eslint fuss about it
            "off",
            "windows"
        ],
        "quotes": [                 // both 'string' and "string" are ok
            "off",
            "single",
        ],
        "semi": [                   // missing semi-colons are errors
            "error",
            "always"
        ]
    }
};
