import * as fs from 'fs'
import * as path from 'path'
import {BannerPlugin, type Configuration} from 'webpack'
import {ESBuildMinifyPlugin} from 'esbuild-loader';
import CopyPlugin from "copy-webpack-plugin";

const userscript = 'userscript';
const banner = fs.readFileSync(path.resolve(__dirname, './src/info.ts'), 'utf-8')
    .replace('${timestamp}', String(new Date().getTime()))
    .replace('${date}', String(new Date(Date.now() + 8 * 3600_000 + new Date().getTimezoneOffset() * 60_000).toLocaleString()))
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
    },
    output: {
        path: path.resolve(__dirname, 'build/script'),
        filename: '[name].js',
    },

    optimization: {
        minimize: true,
        minimizer: [
            new ESBuildMinifyPlugin({
                target: 'es2016',
                banner,
                include: /\.min/
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
