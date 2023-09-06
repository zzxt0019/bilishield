import {BannerPlugin, Configuration} from 'webpack';
import {EsbuildPlugin} from 'esbuild-loader';

import * as base from './webpack.config.base';
import * as  objectUtil from '../src/utils/object-util';

const p: Configuration = {
    entry: {
        [base.userscript + '.p']: './src/main.tsx',
        [base.userscript + '.p.min']: './src/main.tsx',
    },
    optimization: {
        minimizer: [
            new EsbuildPlugin({
                target: 'es2016',
                include: new RegExp(`${base.userscript}.*\\.min\\.js`),
                banner: base.banner(base.userscript + '.p.min.js'),
            })
        ],
    },
    plugins: [
        new BannerPlugin({
            raw: true,
            include: new RegExp(`(${base.userscript})(?!.*(\\.min\\.js))`),
            banner: base.banner(base.userscript + '.p.js'),
        }),
    ]
}
let config = base.config();
objectUtil.copyProperties(p, config, 'force-append');
export default config;