import * as MainStatic from "@/main-static";

/**
 * 创建hideStyle
 * 返回监听方法
 * @param type
 * @param document
 */
export function createDisplayStyle(type: 'hide' | 'debug', document: Document) {
    if (!document.getElementById(MainStatic.DisplayStyleId)) {
        let element = document.createElement('style')
        element.setAttribute('id', MainStatic.DisplayStyleId)
        element.setAttribute('type', 'text/css')
        element.setAttribute(MainStatic.DisplayStyleAttribute, type)
        element.innerHTML = MainStatic.CssInnerHtml[type]
        document.body.appendChild(element)
    }
    return () => {
        document.leave(`#${MainStatic.DisplayStyleId}`, {
            fireOnAttributesModification: true,
            onceOnly: false,
            existing: false
        }, function () {
            createDisplayStyle((this.getAttribute(MainStatic.DisplayStyleAttribute) ?? 'hide') as 'hide' | 'debug', document)
        })
    }
}