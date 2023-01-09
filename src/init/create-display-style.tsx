import * as MainStatic from "@/main-static";

/**
 * 创建hideStyle
 * 返回监听方法
 * @param type
 * @param document
 */
export function createDisplayStyle(type: 'hide' | 'debug', document: Document) {
    if (!document.getElementById(MainStatic.DISPLAY_STYLE_ID)) {
        let element = document.createElement('style')
        element.setAttribute('id', MainStatic.DISPLAY_STYLE_ID)
        element.setAttribute('type', 'text/css')
        element.setAttribute('displayType', type)
        element.innerHTML = MainStatic.CSS_INNER_HTML[type]
        document.body.appendChild(element)
    }
    return () => {
        document.leave(`#${MainStatic.DISPLAY_STYLE_ID}`, {
            fireOnAttributesModification: true,
            onceOnly: false,
            existing: false
        }, function () {
            createDisplayStyle((this.getAttribute('displayType') ?? 'hide') as 'hide' | 'debug', document)
        })
    }
}