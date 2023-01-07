const fs = require('fs');
const path = require('path');
const highlight = require('highlight.js').default;
const marked = require('marked');
const _html = 'iframes';
const _css = 'github.css';
const ignores = [_html, 'data.json', 'index.js', 'index.html'];

/**
 * 递归读取文件
 */
function readFile(filePath, json, fileCallback) {
    // 不读取的部分
    if (ignores.includes(filePath)) {
        return;
    }
    if (fs.lstatSync(path.resolve(__dirname, '../build') + `/${filePath}`).isDirectory()) {  // 是文件夹
        // 创建html文件夹内的对应的文件夹
        if (!fs.existsSync(path.resolve(__dirname, `../build/${_html}`) + `/${filePath}`)) {
            fs.mkdirSync(path.resolve(__dirname, `../build/${_html}`) + `/${filePath}`);
        }
        // 读取文件
        fs.readdirSync(path.resolve(__dirname, '../build') + `/${filePath}`)
            .forEach(file => {
                readFile((filePath ? filePath + '/' : '') + file, json, fileCallback)
            });
    } else if (fs.lstatSync(path.resolve(__dirname, '../build') + `/${filePath}`).isFile()) {  // 是文件
        // 处理
        fileCallback(filePath, json);
    }
}


function afterBuild() {
    // 预先创建html文件夹
    if (!fs.existsSync(path.resolve(__dirname, `../build/${_html}`))) {
        fs.mkdirSync(path.resolve(__dirname, `../build/${_html}`));
    }
    // 提前配置需要打包生成的userscript
    let json = {};
    readFile('', json, (filePath, json) => {
        let split = filePath.split('/');
        for (let i = 0; i < split.length - 1; i++) {
            if (split[i]) {
                if (!json[split[i]]) {
                    json[split[i]] = {};
                }
                json = json[split[i]];
            }
        }
        // size
        json[split[split.length - 1]] = (fs.readFileSync(path.resolve(__dirname, '../build') + `/${filePath}`).length / 1024).toFixed(2) + 'KB';
        // html
        fs.writeFileSync(path.resolve(__dirname, `../build/${_html}`) + `/${filePath}.html`, createMarkdownHtml(fs.readFileSync(path.resolve(__dirname, '../build') + `/${filePath}`), filePath));
    });
    // 写data.json
    fs.writeFileSync(path.resolve(__dirname, '../build') + '/data.json', JSON.stringify(json));
    // 复制highlight的css
    fs.copyFileSync(path.resolve(__dirname, '../node_modules') + `/highlight.js/styles/${_css}`, path.resolve(__dirname, `../build/${_html}/${_css}`));
}

function createMarkdownHtml(text, filePath) {
    // 创建空文件 计算css相对位置
    fs.writeFileSync(path.resolve(__dirname, `../build/${_html}`) + `/${filePath}.html`, '');
    marked.setOptions({
        highlight: function (code) {
            return highlight.highlightAuto(code).value;
        }, gfm: true, breaks: true
    })
    let body;
    if (filePath.endsWith('png') || filePath.endsWith('img')) {
        body = `<img alt=[${filePath.substring(0, filePath.lastIndexOf('.'))}] src="../../${filePath}"/>`;
    } else {
        body = marked.parse(`\`\`\`${filePath.substring(filePath.lastIndexOf('.') + 1)}\n${text}\n\`\`\``);
    }
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>bilishield</title>
    <link href="${path.relative(path.dirname(path.resolve(__dirname, './build') + `/${_html}/${filePath}.html`), path.resolve(__dirname, './build') + `/${_html}/${_css}`)}"  type="text/css" rel="stylesheet">
</head>
<body>
${body}
</body>
</html>`
}

afterBuild();