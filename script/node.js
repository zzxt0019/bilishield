const fs = require('fs');
const path = require('path');
const highlight = require('highlight.js').default;
const marked = require('marked');
const _html = 'html'

function readFile(filePath, json, fileCallback) {
    if (filePath === _html || filePath === 'data.json') {
        return;
    }
    if (fs.lstatSync(path.resolve(__dirname, '../build') + `/${filePath}`).isDirectory()) {  // 是文件夹
        if (!fs.existsSync(path.resolve(__dirname, `../build/${_html}`) + `/${filePath}`)) {
            fs.mkdirSync(path.resolve(__dirname, `../build/${_html}`) + `/${filePath}`);
        }
        fs.readdirSync(path.resolve(__dirname, '../build') + `/${filePath}`)
            .forEach(file => {
                readFile((filePath ? filePath + '/' : '') + file, json, fileCallback)
            });
    } else if (fs.lstatSync(path.resolve(__dirname, '../build') + `/${filePath}`).isFile()) {
        fileCallback(filePath, json);
    }
}

/**
 * 生成文件json
 */
function json() {
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
        json[split[split.length - 1]] = (fs.readFileSync(path.resolve(__dirname, '../build') + '/' + filePath).length / 1024).toFixed(2) + 'KB';
        // html
        fs.writeFileSync(path.resolve(__dirname, `../build/${_html}`) + `/${filePath}.html`, createMarkdownHtml(fs.readFileSync(path.resolve(__dirname, '../build') + '/' + filePath), filePath));
    });
    fs.writeFileSync(path.resolve(__dirname, '../build') + '/data.json', JSON.stringify({
        data: json, timestamp: Date.now(),
    }));
    fs.copyFileSync(path.resolve(__dirname, '../node_modules') + '/highlight.js/styles/github.css', path.resolve(__dirname, `../build/${_html}/github.css`));
}

function createMarkdownHtml(text, filePath) {
    marked.setOptions({
        highlight: function (code) {
            return highlight.highlightAuto(code).value;
        }
    })
    let body;
    if (filePath.endsWith('png') || filePath.endsWith('img')) {
        body = `<img alt=[${filePath.substring(0, filePath.lastIndexOf('.'))}] src="${`../../${filePath}`}"/>`;
    } else if (filePath.includes('min')) {
        body = `<div>${text}</div>`;
    } else {
        body = marked.parse(`\`\`\`${filePath.substring(filePath.lastIndexOf('.') + 1)}\n${text}\n\`\`\``);
    }
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>bilishield</title>
    <link href="../github.css"  type="text/css" rel="stylesheet"></link>
</head>
<body>
${body}
</body>
</html>`
}

json();