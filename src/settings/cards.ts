import { _cards } from './database';
export function initCards(): void {
    // GM_deleteValue('cards')  // to test
    let cards = GM_getValue('cards')
    if (!cards) {
        GM_setValue('cards', _cards)
    }

    /**
     * 添加卡片
     */
    GM_registerMenuCommand('添加卡片', () => {
        let addCards = prompt(
            `card:
            ${GM_getValue('cards', []).join(',')}`
        );
        if (addCards) {
            let cards = (GM_getValue('cards') as string[])
            cards.push(...addCards.split(' '))
            GM_setValue('cards', cards)
        }
    })
    GM_registerMenuCommand('删除卡片', () => {
        let deleteCards = prompt(
            `card:
            ${GM_getValue('cards', []).join(',')}`
        );
        if (deleteCards) {
            let deleteSet = new Set(deleteCards.split(' '))
            GM_setValue('cards', (GM_getValue('cards') as string[]).filter(card => !deleteSet.has(card)))
        }
    })
    GM_registerMenuCommand('展示卡片', () => {
        alert(
            `card:
            ${GM_getValue('cards', []).join(',')}`
        );
    })
}
export function checkCardLike(text: string | null): boolean {
    if (text) {
        for (const card of GM_getValue('cards',[])) {
            if (text.includes(card)) {
                return true;
            }
        }
    }
    return false;
}