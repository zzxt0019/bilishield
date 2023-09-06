import {createRoot, Root} from "react-dom/client";
import * as MainStatic from "@/main-static";
import {BoxView} from "@/view/box.view";
import React from "react";

/**
 * 创建div 添加react组件
 * @returns root
 */

export function createBox(root: { root?: Root } = {root: undefined}) {
    if (root.root) {
        root.root.unmount();
    }
    let div: Element
    if (!document.getElementById(MainStatic.AppId)) {
        div = document.createElement('div')
        div.setAttribute("id", MainStatic.AppId);
        document.body.appendChild(div);
    }
    root.root = createRoot(document.getElementById(MainStatic.AppId) as Element)
    root.root.render(React.createElement(BoxView))
    return () => {
        document.leave(`#${MainStatic.AppId}`, {
            fireOnAttributesModification: true,
            onceOnly: false,
            existing: false
        }, function () {
            createBox(root);
        })
    };
}