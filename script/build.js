const fs = require('fs');
const path = require('path');
const marked = require("marked");
const {default: highlight} = require("highlight.js");
const _css = 'github.css';
const {readFile, _html, dataJson, yamlJson, checkIgnore} = require('./base.js');

function createMarked() {
    if (!fs.existsSync(path.resolve(__dirname, `../build/${_html}`))) {
        fs.mkdirSync(path.resolve(__dirname, `../build/${_html}`));
    }
    readFile('../build', {
        fileCallback: (filePath) => {
            let htmlDirPath = filePath.substring('../build/'.length, filePath.lastIndexOf('/'));  // /yaml/rule
            if (!fs.existsSync(path.resolve(__dirname, `../build/${_html}/${htmlDirPath}`))) {
                fs.mkdirSync(path.resolve(__dirname, `../build/${_html}/${htmlDirPath}`), {recursive: true});
            }
            let text = fs.readFileSync(path.resolve(__dirname, filePath));
            let fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
            fs.writeFileSync(path.resolve(__dirname, `../build/${_html}/${htmlDirPath}/${fileName}.html`), '');
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
            fs.writeFileSync(path.resolve(__dirname, `../build/${_html}/${htmlDirPath}/${fileName}.html`), `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>bilishield</title>
    <link href="${path.relative(path.dirname(path.resolve(__dirname, `../build/${_html}/${htmlDirPath}/${fileName}.html`)), path.resolve(__dirname, `../build/${_html}/${_css}`))}"  type="text/css" rel="stylesheet">
</head>
<body>
${body}
</body>
</html>`);

        }, checkIgnore
    })
}

function build() {
    fs.writeFileSync(path.resolve(__dirname, '../build/data.json'), JSON.stringify(dataJson()));
    createMarked();
    let yamlJsons = yamlJson();
    Object.entries(yamlJsons).forEach(([key, value]) => {
        fs.writeFileSync(path.resolve(__dirname, '../build/yaml/' + key + '/data.json'), JSON.stringify(value));
    });
    fs.copyFileSync(path.resolve(__dirname, '../node_modules/highlight.js/styles/' + _css), path.resolve(__dirname, `../build/${_html}/${_css}`));
}

build();