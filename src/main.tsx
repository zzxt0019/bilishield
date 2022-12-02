import "arrive";
import React from "react";
import {createRoot, Root} from "react-dom/client";
import {Box} from './view/box';
import * as STATIC from './main-static'
import {readFiles} from "@/test/read-system-file";
import {Page} from '@/config/page/page';

async function init() {
    let pageMap = readFiles();
    createReact(pageMap)();  // 创建box
    createDisplayStyle('display', window.document)()
    iframes({displayStyle: STATIC.CSS_INNER_HTML.display, pageMap: pageMap})
    // 油猴菜单展示/隐藏配置
    GM_registerMenuCommand('配置', () => {
        let main = document.querySelector('#' + STATIC.APP_ID + ' div') as HTMLDivElement
        main.style.setProperty('display', main.style?.getPropertyValue('display') === 'none' ? '' : 'none')
    })
}

/**
 * 创建div 添加react组件
 * @returns root
 */

function createReact(pageMap: Map<string, Page>, root: { root?: Root } = {root: undefined}) {
    if (root.root) {
        root.root.unmount();
    }
    for (const page of pageMap.values()) {
        page.arrive(window);
    }
    let div: Element
    if (!document.getElementById(STATIC.APP_ID)) {
        div = document.createElement('div')
        div.setAttribute("id", STATIC.APP_ID);
        document.body.appendChild(div);
    }
    root.root = createRoot(document.getElementById(STATIC.APP_ID) as Element)
    root.root.render(<Box pageMap={pageMap}/>)
    return () => {
        document.leave('#' + STATIC.APP_ID, {
            fireOnAttributesModification: true,
            onceOnly: false,
            existing: false
        }, function () {
            createReact(pageMap, root);
        })
    };
}


/**
 * 创建displayStyle
 * 返回监听方法
 * @param type
 * @param document
 */
function createDisplayStyle(type: 'display' | 'debug', document: Document) {
    if (!document.getElementById(STATIC.DISPLAY_STYLE_ID)) {
        let element = document.createElement('style')
        element.setAttribute('id', STATIC.DISPLAY_STYLE_ID)
        element.setAttribute('type', 'text/css')
        element.setAttribute('displayType', type)
        element.innerHTML = STATIC.CSS_INNER_HTML[type]
        document.body.appendChild(element)
    }
    return () => {
        document.leave('#' + STATIC.DISPLAY_STYLE_ID, {
            fireOnAttributesModification: true,
            onceOnly: false,
            existing: false
        }, function () {
            createDisplayStyle((this.getAttribute('displayType') ?? 'display') as 'display' | 'debug', document)
        })
    }
}

function iframes(data: { displayStyle: string, pageMap: Map<string, Page> }) {
    interface FrameData {
        frame: Window,
        document?: Document,
    }

    let framesData: FrameData[] = [];
    setInterval(() => {
        for (let i = 0; i < window.frames.length; i++) {
            let frame = window.frames[i];
            // 第一次
            if (!framesData[i] || framesData[i].frame !== frame) {
                let frameData: Partial<FrameData> = {};
                framesData[i] = frameData as FrameData;
                frameData.frame = frame;
            }
            // 不跨域且dom改变了
            try {
                if (frame.document && framesData[i].document !== frame.document) {
                    framesData[i].document = frame.document;
                    createDisplayStyle('display', frame.document)
                    for (const page of data.pageMap.values()) {
                        page.stop()
                        page.start()
                    }
                }
            } catch (ignore) {
            }
        }
    }, 500);
}

init();