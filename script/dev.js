const {dataJson} = require('./base.js');
const fs = require("fs");
const path = require("path");

function dev() {
    if (!fs.existsSync(path.resolve(__dirname, '../build'))) {
        fs.mkdirSync(path.resolve(__dirname, '../build'), {recursive: true});
    }
    let json = dataJson();
    fs.writeFileSync(path.resolve(__dirname, '../build/data.json'), JSON.stringify(json));
    let text = String(fs.readFileSync(path.resolve(__dirname, '../src/info-local.ts')));
    let replace = '';
    replace += '// @require         file://' + path.resolve(__dirname, '../build/userscript.js') + '\n';
    replace += '// @resource        data.json file://' + path.resolve(__dirname, '../build/data.json') + '\n';
    Object.entries(json.yaml).forEach(([key, value]) => {
        Object.keys(value).forEach(fileName => {
            replace += '// @resource        ' + key + '-' + fileName + ' file://' + path.resolve(__dirname, '../public/yaml/' + key + '/' + fileName) + '\n';
        })
    })
    let info = text.replace('//${zzxt0019}', replace);
    fs.writeFileSync(path.resolve(__dirname, '../src/info-local-cp.ts'), info);
}

dev()