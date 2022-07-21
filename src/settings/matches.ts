import { _matches } from './database';
export function initMatches(): void {
    // GM_deleteValue('matches')  // to test
    let matches = GM_getValue('matches')
    if (!matches) {
        GM_setValue('matches', _matches)
    }

    /**
     * 添加匹配
     */
    GM_registerMenuCommand('添加匹配', () => {
        let addMatches = prompt(
            `matches:
            ${GM_getValue('matches', []).join(',')}`
        );
        if (addMatches) {
            let matches = (GM_getValue('matches') as string[])
            matches.push(...addMatches.split(' '))
            GM_setValue('matches', matches)
        }
    })
    GM_registerMenuCommand('删除匹配', () => {
        let deleteMatches = prompt(
            `matches:
            ${GM_getValue('matches', []).join(',')}`
        );
        if (deleteMatches) {
            let deleteSet = new Set(deleteMatches.split(' '))
            GM_setValue('matches', (GM_getValue('matches') as string[]).filter(match => !deleteSet.has(match)))
        }
    })
    GM_registerMenuCommand('展示匹配', () => {
        alert(
            `matches:
            ${GM_getValue('matches', []).join(',')}`
        );
    })
}
export function checkMatchLike(text: string | null): boolean {
    if (text) {
        for (const match of GM_getValue('matches',[])) {
            if (text.includes(match)) {
                return true;
            }
        }
    }
    return false;
}