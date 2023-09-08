import * as MainStatic from "@/main-static";

/**
 * 创建hideStyle
 * 返回监听方法
 * @param type
 * @param document
 */
export function createStyle(type: 'hide' | 'debug', document: Document) {
    if (!document.getElementById(MainStatic.StyleId)) {
        let element = document.createElement('style')
        element.setAttribute('id', MainStatic.StyleId)
        element.setAttribute('type', 'text/css')
        element.setAttribute(MainStatic.DisplayStyleAttribute, type)
        element.innerHTML = MainStatic.CssInnerHtml[type]
        document.body.appendChild(element)
    }
    return () => {
        document.leave(`#${MainStatic.StyleId}`, {
            fireOnAttributesModification: true,
            onceOnly: false,
            existing: false
        }, function () {
            createStyle((this.getAttribute(MainStatic.DisplayStyleAttribute) ?? 'hide') as 'hide' | 'debug', document)
        })
    }
}