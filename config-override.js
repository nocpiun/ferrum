const customizeCra = require('customize-cra')

const config = customizeCra.override(
    customizeCra.useBabelRc(),
    customizeCra.useEslintRc()
);

module.exports = config;
