export const AppId: string = 'zzxt0019-bilishield-app'
export const DisplayClass: string = 'zzxt0019-bilishield-class'
export const DisplayStyleId: string = 'zzxt0019-bilishield-style'
export const DisplayStyleAttribute: string = 'zzxt0019-bilishield-display'
export const CssInnerHtml: { hide: string, debug: string } = {
    hide: `.${DisplayClass} { display: none !important; }`,
    debug: `.${DisplayClass} { background-color: yellow !important; border: 5px groove yellow; }`
}