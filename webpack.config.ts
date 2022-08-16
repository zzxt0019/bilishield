import * as fs from 'fs'
import * as path from 'path'
import {BannerPlugin, type Configuration} from 'webpack'
import {ESBuildMinifyPlugin} from "esbuild-loader";

const config: Configuration = {
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
        extensions: ['.ts', '.js', '.tsx'],
    },

    entry: {
        'userscript': './src/main.tsx',
        'userscript.min': './src/main.tsx',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },

    optimization: {
        minimize: true,
        minimizer: [
            new ESBuildMinifyPlugin({
                target: 'es2016',
                banner: fs.readFileSync(path.resolve(__dirname, './src/info.ts'), 'utf-8')
                    .replace("${timestamp}", String(new Date().getTime()))
                    .replace(/(==\/UserScript==)[\s\S]+$/, '$1'),
                include: /min/
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
            {
                test: /\.css$/,
                use: ["raw-loader"]
            },
            {
                test: /\.yml|\.yaml$/,
                use: ["raw-loader"]
            }
        ],
    },
    plugins: [
        new BannerPlugin({
            raw: true,
            include: /^((?!min).)*$/,
            banner: fs.readFileSync(path.resolve(__dirname, './src/info.ts'), 'utf-8')
                .replace("${timestamp}", String(new Date().getTime()))
                .replace(/(==\/UserScript==)[\s\S]+$/, '$1'),
        })
    ]
};

export default config
