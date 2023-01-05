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

/**
 * 生成文件json
 */
function json() {
    if (!fs.existsSync(path.resolve(__dirname, './build'))) {
        fs.mkdirSync(path.resolve(__dirname, './build'));
    }
    const read = (file: string, json: any) => {
        if (fs.lstatSync(path.resolve(__dirname, './public') + '/' + file).isDirectory()) {  // 是文件夹
            fs.readdirSync(path.resolve(__dirname, './public') + '/' + file)
                .forEach(_file => read(file + '/' + _file, json));
        } else {  // 是文件
            let split = file.split('/');
            for (let i = 0; i < split.length - 1; i++) {
                if (split[i]) {
                    if (!json[split[i]]) {
                        json[split[i]] = {};
                    }
                    json = json[split[i]];
                }
            }
            json[split[split.length - 1]] = split[split.length - 1].substring(split[split.length - 1].lastIndexOf('.') + 1)
        }
    };
    // 提前配置需要打包生成的userscript
    let json = {script: {[userscript + '.js']: 'js', [userscript + '.min.js']: 'js'}};
    read('', json);
    fs.writeFileSync(path.resolve(__dirname, './build') + '/data.json', JSON.stringify(json));
}

json()

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
