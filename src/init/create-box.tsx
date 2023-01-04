import {Page} from "@/config/page/page";
import {createRoot, Root} from "react-dom/client";
import * as STATIC from "@/main-static";
import {BoxView} from "@/view/box.view";
import React from "react";

/**
 * 创建div 添加react组件
 * @returns root
 */

export function createBox(pageMap: Map<string, Page>, root: { root?: Root } = {root: undefined}) {
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
    root.root.render(<BoxView pageMap={pageMap}/>)
    return () => {
        document.leave('#' + STATIC.APP_ID, {
            fireOnAttributesModification: true,
            onceOnly: false,
            existing: false
        }, function () {
            createBox(pageMap, root);
        })
    };
}