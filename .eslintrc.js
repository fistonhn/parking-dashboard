module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "standard",
        'plugin:react/recommended'
    ],
    "settings": {
        "react": {
            "version": "detect"
        }
    },
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "parser": "babel-eslint",
    "plugins": [
        "react"
    ],
    "rules": {
        "semi": [2, 'always'],
        "react/prop-types" : "off",
        "no-unused-vars": "off",
        "react/no-unknown-property": "off",
        "no-return-assign": "off",
        "camelcase": "off",
        "react/no-unescaped-entities": "off",
        "import/no-duplicates": "off",
        "react/no-deprecated": "off",
        "eqeqeq": "off",
        "react/no-string-refs": "off",
        "react/display-name": "off",
        "no-mixed-operators": "off",
        "no-new": "off",
        "prefer-promise-reject-errors": "off",
        "no-tabs": "off",
        "no-mixed-spaces-and-tabs": "off",
        "no-unneeded-ternary": "off",
        "no-constant-condition": "off"
    }
};