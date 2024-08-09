const { webpack } = require("next/dist/compiled/webpack/webpack");

/** @type {import("next").NextConfig} */
const nextConfig = {
    webpack: (config) => {
        /** @see https://github.com/sebhildebrandt/systeminformation/issues/230#issuecomment-610371026 */
        config.plugins.push(new webpack.IgnorePlugin({ resourceRegExp: /osx-temperature-sensor$/ }));

        return config;
    }
}

module.exports = nextConfig
