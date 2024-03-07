module.exports = {
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    extends: [
        "next/core-web-vitals",
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
    ],
    rules: {
        "react/react-in-jsx-scope": "off",
    },
};
