/**
 * Base webpack config used across other specific configs
 */

import path from 'path';

export default {
    module: {
        rules: [{
            test: /\.jsx?$/,
            loader: ['babel-loader'],
            exclude: /node_modules/
        }]
    },

    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',

        // https://github.com/webpack/webpack/issues/1114
        libraryTarget: 'commonjs2'
    },

    // https://webpack.github.io/docs/configuration.html#resolve
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        mainFields: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main']
    },

    plugins: [],

    externals: [
        // put your node 3rd party libraries which can't be built with webpack here
        // (mysql, mongodb, and so on..)
    ]
};
