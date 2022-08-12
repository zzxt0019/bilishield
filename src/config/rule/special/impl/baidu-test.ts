import { SpecialRule } from "../special-rule";

export class BaiduTest extends SpecialRule {
    pageKey = 'baidu'
    spCheckers = [
        {
            mainSelector: 'a',
            bingo: async (node: Element) => {
                if(node.innerHTML.includes('abcde')) {
                    return true;
                } else {
                    return false;
                }
            }
        },
    ]
}