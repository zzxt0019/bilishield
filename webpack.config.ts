import {BannerPlugin, Configuration} from 'webpack';
import fs from "fs";
import path from "path";

const {date2string} = require('./src/utils/datetime-util.ts');

const banner = (requires?: string[]) =>
    fs.readFileSync(path.resolve(__dirname, '../info/userscript-info.js'), 'utf-8')
        .replaceAll('\r\n', '\n')
        .replaceAll('\n', '\r\n')
        .replaceAll('${timestamp}', String(new Date().getTime()))
        .replaceAll('${date}', String(date2string(new Date(Date.now() + 8 * 60 * 60 * 1000 + new Date().getTimezoneOffset() * 60 * 1000))))
        .replaceAll('// @require         ${require}', requires ? requires.map(url => `// @require         ${url}`).join('\r\n') : '')
        .replace(/(==\/UserScript==)[\s\S]+$/, '$1') + '\r\n';
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
        key: 'arrive',
        value: 'arrive',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js',
    },
    {
        key: 'antd',
        value: 'antd',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/antd/5.8.6/antd.min.js',
    },
    {
        key: '@ant-design/icons',
        value: 'icons',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/ant-design-icons/5.2.6/index.umd.min.js'
    }
]
const config: Configuration = {
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../src'),
        },
        extensions: ['.ts', '.js', '.tsx'],
    },
    entry: {
        userscript: './src/main.tsx',
    },
    output: {
        path: path.resolve(__dirname, '../build'),
        filename: '[name].js',
    },
    externals: (() => {
        let obj: any = {};
        requires.forEach(item => obj[item.key] = item.value);
        return obj;
    })(),
    optimization: {
        minimizer: [false]
    },
    module: {
        rules: [
            {
                test: /\.ts|\.tsx$/i,
                exclude: /node_modules/,
                use: ['babel-loader', 'ts-loader']
            },
        ],
    },
    plugins: [
        new BannerPlugin({
            raw: true,
            include: 'userscript',
            banner: banner(requires.map(item => item.url)),
        }),
    ]
}
export default config;