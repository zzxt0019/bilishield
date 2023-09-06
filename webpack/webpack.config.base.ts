import {Configuration} from "webpack";
import path from "path";
import fs from "fs";

const {date2string} = require('../src/utils/datetime-util.ts');

export const banner = (fileName: string, requires?: string[]) =>
    fs.readFileSync(path.resolve(__dirname, '../info/userscript-info.js'), 'utf-8')
        .replaceAll('\r\n', '\n')
        .replaceAll('\n', '\r\n')
        .replaceAll('${timestamp}', String(new Date().getTime()))
        .replaceAll('${date}', String(date2string(new Date(Date.now() + 8 * 60 * 60 * 1000 + new Date().getTimezoneOffset() * 60 * 1000))))
        .replaceAll('${userscriptName}', fileName)
        .replaceAll('// @require         ${require}', requires ? requires.map(url => `// @require         ${url}`).join('\r\n') : '')
        .replace(/(==\/UserScript==)[\s\S]+$/, '$1') + '\r\n';

export const userscript = 'userscript';

export function config(): Configuration {
    return {
        resolve: {
            alias: {
                '@': path.resolve(__dirname, '../src'),
            },
            extensions: ['.ts', '.js', '.tsx'],
        },
        output: {
            path: path.resolve(__dirname, '../build'),
            filename: '[name].js',
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
    }
}