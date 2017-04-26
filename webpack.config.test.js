/** Used in .babelrc for 'test' environment */
// for babel-plugin-webpack-loaders
import * as babelRegister from 'babel-register';
import devConfig from './webpack.config.development';

babelRegister.default();

export default {
    output: {
        libraryTarget: 'commonjs2'
    },
    module: {
        rule: [{ loader: devConfig.module.loaders.slice(1) }]
    }
};
