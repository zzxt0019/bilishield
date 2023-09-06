import {BannerPlugin, Configuration} from 'webpack';
import {EsbuildPlugin} from 'esbuild-loader';

import * as  base from './webpack.config.base';
import * as objectUtil from '../src/utils/object-util';

const requires: { key: string, value: string, url: string }[] = [
    {
        key: 'react',
        value: 'React',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js',
    },
    {
        key: 'react-dom',
        value: 'ReactDOM',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js',
    },
    {
        key: 'dayjs',
        value: 'dayjs',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.7/dayjs.min.js',
    },
    {
        key: 'antd',
        value: 'antd',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/antd/5.1.7/antd.min.js',
    },
    {
        key: 'arrive',
        value: 'arrive',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js',
    }, {
        key: '@ant-design/icons',
        value: 'icons',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/ant-design-icons/5.0.1/index.umd.min.js'
    }
]
const s: Configuration = {
    entry: {
        [base.userscript + '.s']: './src/main.tsx',
        [base.userscript + '.s.min']: './src/main.tsx',
    },
    externals: (() => {
        let obj: any = {};
        requires.forEach(item => obj[item.key] = item.value);
        return obj;
    })(),
    optimization: {
        minimizer: [
            new EsbuildPlugin({
                target: 'es2016',
                include: new RegExp(`${base.userscript}.*\\.min\\.js`),
                banner: base.banner(base.userscript + '.s.min.js', requires.map(item => item.url)),
            })
        ],
    },
    plugins: [
        new BannerPlugin({
            raw: true,
            include: new RegExp(`(${base.userscript})(?!.*(\\.min\\.js))`),
            banner: base.banner(base.userscript + '.s.js', requires.map(item => item.url)),
        }),
    ]
}
let config = base.config();
objectUtil.copyProperties(s, config, 'force-append');
config.entry = s.entry
export default config;