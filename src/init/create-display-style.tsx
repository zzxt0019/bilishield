import * as STATIC from "@/main-static";

/**
 * 创建hideStyle
 * 返回监听方法
 * @param type
 * @param document
 */
export function createDisplayStyle(type: 'hide' | 'debug', document: Document) {
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
            createDisplayStyle((this.getAttribute('displayType') ?? 'hide') as 'hide' | 'debug', document)
        })
    }
}