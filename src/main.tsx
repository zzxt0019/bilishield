import "arrive";
import React from "react";
import {createRoot, Root} from "react-dom/client";
import {Box} from './view/box';
import * as STATIC from './main-static'
import {displayType} from './main-static'
import antdStyle from 'antd/dist/antd.css';
import boxStyle from './style/main.css';
import displayStyle from './style/display/display.css';
import debugStyle from './style/display/debug.css';
import {readFiles} from "@/test/read-system-file";
import {Page} from "@/config/page/page";

const postcssJs = require('postcss-js')
const postcss = require('postcss')

init()

async function init() {
    if (!(unsafeWindow as any).iframeDocuments) {
        (unsafeWindow as any).iframeDocuments = new Set();  // 初始化 iframeDocuments
    }
    let pageMap = readFiles();
    let root = createReact(pageMap);  // 创建box
    initAntdStyle().then(antdStyle => createStyle(STATIC.ANTD_STYLE_ID, antdStyle, window.document)())  // 读取antd css; 创建样式(监听防消失)
    initBoxStyle().then(boxStyle => createStyle(STATIC.BOX_STYLE_ID, boxStyle, window.document)())  // 读取box css; 创建样式(监听防消失)

    let displayPromise = initDisplay(window.document);  // 读取display css
    displayPromise.then(data => createDisplayStyle(data, 'display', window.document)());  // 创建样式(监听防消失)

    iframeArrive(displayPromise, pageMap);  // 监听新iframe加入
    iframeLeave(pageMap);  // 监听iframe离开


    // 监听APP_ID
    document.leave('#' + STATIC.APP_ID, {
        fireOnAttributesModification: true,
        onceOnly: false,
        existing: false
    }, function () {
        root.unmount()
        root = createReact(pageMap)
    })
    // 油猴菜单展示/隐藏配置
    GM_registerMenuCommand('配置', () => {
        let main = document.querySelector('.' + STATIC.MAIN_CLASS) as HTMLDivElement
        main.style.setProperty('display', main.style?.getPropertyValue('display') === 'none' ? '' : 'none')
    })
}

/**
 * 创建div 添加react组件
 * @returns root
 */

function createReact(pageMap: Map<string, Page>): Root {
    for (const page of pageMap.values()) {
        page.arrive(window.document);
    }
    let div: Element
    if (!document.getElementById(STATIC.APP_ID)) {
        div = document.createElement('div')
        div.setAttribute("id", STATIC.APP_ID);
        document.body.appendChild(div);
    }
    let root = createRoot(document.getElementById(STATIC.APP_ID) as Element)
    root.render(<Box mainClass={STATIC.MAIN_CLASS} boxClass={STATIC.BOX_CLASS} pageMap={pageMap}/>)
    return root;
}

function createStyle(id: string, style: string, document: Document) {
    if (!document.getElementById(id)) {
        let element = document.createElement('style')
        element.setAttribute('id', id)
        element.setAttribute('type', "text/css")
        element.innerHTML = style
        document.body.appendChild(element)
    }
    return () => {
        document.leave('#' + id, {
            fireOnAttributesModification: true,
            onceOnly: false,
            existing: false
        }, function () {
            createStyle(id, style, document)
        })
    }
}

async function initAntdStyle(): Promise<string> {
    return new Promise<string>((res) => {
        let oldObj = postcssJs.objectify(postcss.parse(antdStyle))
        let newObj: any = {}
        Object.keys(oldObj).forEach(key => {
            newObj['.' + STATIC.MAIN_CLASS + ' .' + STATIC.BOX_CLASS + ' ' + key] = oldObj[key]
        })
        postcss().process(newObj, {parser: postcssJs}).then((result: any) => {
            res(result.css)
        })
    })
}

async function initBoxStyle(): Promise<string> {
    return new Promise<string>((res) => {
        let oldObj = postcssJs.objectify(postcss.parse(boxStyle))
        let newObj: any = {}
        Object.keys(oldObj).forEach(key => {
            newObj[key.replace('_main', STATIC.MAIN_CLASS).replace('_box', STATIC.BOX_CLASS)] = oldObj[key]
        })
        postcss().process(newObj, {parser: postcssJs}).then((result: any) => {
            res(result.css)
        })
    })
}

async function initDisplay(document: Document): Promise<{ display: string, debug: string }> {
    let displayObj = postcssJs.objectify(postcss.parse(displayStyle));
    let newDisplayObj: any = {};
    Object.keys(displayObj).forEach(key => {
        newDisplayObj[key.replace('_display', STATIC.DISPLAY_CLASS)] = displayObj[key];
    })
    let debugObj = postcssJs.objectify(postcss.parse(debugStyle));
    let newDebugObj: any = {};
    Object.keys(debugObj).forEach(key => {
        newDebugObj[key.replace('_display', STATIC.DISPLAY_CLASS)] = debugObj[key];
    })
    return new Promise((res) => {
        Promise.all([
            postcss().process(newDisplayObj, {parser: postcssJs}),
            postcss().process(newDebugObj, {parser: postcssJs}),
        ]).then(result => {
            STATIC.CSS_INNER_HTML.display = result[0].css
            STATIC.CSS_INNER_HTML.debug = result[1].css
            res({display: result[0].css, debug: result[1].css})
        })
    })
}

function createDisplayStyle(data: { display: string, debug: string }, type: displayType, document: Document) {
    if (!document.getElementById(STATIC.DISPLAY_STYLE_ID)) {
        let element = document.createElement('style')
        element.setAttribute('id', STATIC.DISPLAY_STYLE_ID)
        element.setAttribute('type', 'text/css')
        element.setAttribute('displayType', type)
        element.innerHTML = data[type]
        document.body.appendChild(element)
    }
    return () => {
        document.leave('#' + STATIC.DISPLAY_STYLE_ID, {
            fireOnAttributesModification: true,
            onceOnly: false,
            existing: false
        }, function () {
            createDisplayStyle(data, (this.getAttribute('displayType') ?? 'display') as displayType, document)
        })
    }
}

function iframeArrive(displayPromise: Promise<{ display: string, debug: string }>, pageMap: Map<string, Page>) {
    // 监听iframe
    document.arrive('iframe', {
        fireOnAttributesModification: true,
        onceOnly: false,
        existing: true
    }, (element) => {
        try {
            let innerDocument = (element as any).contentDocument as Document;
            innerDocument.arrive = document.arrive;
            innerDocument.unbindArrive = document.unbindArrive;
            ((unsafeWindow as any).iframeDocuments).add(innerDocument);
            displayPromise.then(data => createDisplayStyle(data, 'display', innerDocument));
            for (const page of pageMap.values()) {
                page.arrive(innerDocument);
            }
        } catch (ignore) {
        }
    })
}

function iframeLeave(pageMap: Map<string, Page>) {
    document.leave('iframe', {
            fireOnAttributesModification: true,
            onceOnly: false,
            existing: false
        },
        function () {
            try {
                let document = (this as any).contentDocument as Document;
                for (const page of pageMap.values()) {
                    page.leave(document);
                }
            } catch (ignore) {
            }
        });
}
