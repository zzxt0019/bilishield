import * as fs from 'fs'
import * as path from 'path'
import {BannerPlugin, type Configuration} from 'webpack'
import {ESBuildMinifyPlugin} from 'esbuild-loader';
import CopyPlugin from "copy-webpack-plugin";

const userscript = 'userscript';

function dateFormat(date: Date, formatter: string = 'yyyy-MM-dd HH:mm:ss.SSS') {
    let year = String(date.getFullYear());
    let month = (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1);
    let day = (date.getDate() < 10 ? '0' : '') + date.getDate();
    let hour = (date.getHours() < 10 ? '0' : '') + date.getHours();
    let minute = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    let second = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
    let millisecond = (date.getMilliseconds() < 100 ? '0' : '') + (date.getMilliseconds() < 10 ? '0' : '') + date.getMilliseconds();
    return formatter
        .replaceAll('yyyy', year)
        .replaceAll('MM', month)
        .replaceAll('dd', day)
        .replaceAll('HH', hour)
        .replaceAll('mm', minute)
        .replaceAll('ss', second)
        .replaceAll('SSS', millisecond);
}

const banner = fs.readFileSync(path.resolve(__dirname, './src/userscript-info.js'), 'utf-8')
    .replace('${timestamp}', String(new Date().getTime()))
    .replace('${date}', String(dateFormat(new Date(Date.now() + 8 * 60 * 60 * 1000 + new Date().getTimezoneOffset() * 60 * 1000))))
    .replace(/(==\/UserScript==)[\s\S]+$/, '$1');

const config: Configuration = {
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
        extensions: ['.ts', '.js', '.tsx'],
    },
    entry: {
        [userscript]: './src/main.tsx',
        [userscript + '.min']: './src/main.tsx',
        index: './src/gh-pages/index.tsx',
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js',
    },

    optimization: {
        minimize: true,
        minimizer: [
            new ESBuildMinifyPlugin({
                target: 'es2016',
                banner,
                include: new RegExp(userscript + '\.min\.js'),
            })
        ]
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
            include: userscript + '.js',
            banner,
        }),
        new CopyPlugin({
            patterns: [{
                from: __dirname + '/public/',
                to: __dirname + '/build/',
            }],
        })
    ]
};

export default config
