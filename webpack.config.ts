import * as fs from 'fs'
import * as path from 'path'
import {BannerPlugin, type Configuration} from 'webpack'
import {ESBuildMinifyPlugin} from 'esbuild-loader';
import CopyPlugin from 'copy-webpack-plugin';

const {date2string} = require('./src/utils/datetime-util.ts');

const userscript = 'userscript';

const banner = (fileName: string) => fs.readFileSync(path.resolve(__dirname, './src/userscript-info.js'), 'utf-8')
    .replace('${timestamp}', String(new Date().getTime()))
    .replaceAll('${userscriptName}', fileName)
    .replace('${date}', String(date2string(new Date(Date.now() + 8 * 60 * 60 * 1000 + new Date().getTimezoneOffset() * 60 * 1000))))
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
                include: userscript + '.min.js',
                banner: banner(userscript + '.min.js'),
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
            banner: banner(userscript + '.js'),
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
