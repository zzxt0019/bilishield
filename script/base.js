const fs = require('fs');
const path = require('path');

const _html = 'iframes';

const ignores = [_html, 'data.json', 'index.js', 'index.html'];

/**
 * 递归读取文件
 */
function readFile(filePath, {fileCallback, dirCallback, checkIgnore}, ...params) {
    if (checkIgnore && checkIgnore(filePath, ...params)) {
        return;
    }
    if (fs.lstatSync(path.resolve(__dirname, filePath)).isDirectory()) {  // 是文件夹
        // 读取文件
        fs.readdirSync(path.resolve(__dirname, filePath))
            .forEach(file => {
                dirCallback && dirCallback(filePath, ...params);
                readFile(`${filePath}/${file}`, {fileCallback, dirCallback, checkIgnore}, ...params);
            });
    } else if (fs.lstatSync(path.resolve(__dirname, filePath)).isFile()) {  // 是文件
        // 处理
        fileCallback && fileCallback(filePath, ...params);
    }
}

/**
 * 忽略的文件
 *  data.json   目录文件
 *  index.js    gh-pages.js
 *  index.html  gh-pages.html
 */
function checkIgnore(filePath) {  // ../build/*
    for (const ignoreFile of ['data.json', 'index.js', 'index.html']) {
        if (filePath === `../build/${ignoreFile}`) {
            return true;
        }
    }
    return filePath.startsWith(`../build/${_html}/`);
}

/**
 * 生成所有文件的data.json 记录文件夹和文件
 * build通过../build生成
 * dev通过../public生成(dev只需要yaml, 如果测试gh-pages则运行build)
 */
function dataJson(dir = 'build') {
    let json = {};
    readFile('../' + dir, {
        fileCallback: (filePath, json) => {
            let split = filePath.split('/');
            // let i = 2; 从`../build`之后算起
            for (let i = 2; i < split.length - 1; i++) {
                if (split[i]) {
                    if (!json[split[i]]) {
                        json[split[i]] = {};
                    }
                    json = json[split[i]];
                }
            }
            json[split[split.length - 1]] = (fs.readFileSync(path.resolve(__dirname, filePath)).length / 1024).toFixed(2) + 'KB';
        }, checkIgnore
    }, json);
    return json;
}

module.exports = {_html, readFile, dataJson, checkIgnore}