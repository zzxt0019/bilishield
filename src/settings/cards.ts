/**
 * 获取卡片配置
 * @returns 卡片
 */
export function fetchCards(): string[] {
    return GM_getValue('cards', []) as string[]
}
/**
 * 添加卡片
 * @param input 卡片输入(空格分割)
 */
export function addCards(input: string): void {
    if (input) {
        let _cards = GM_getValue('cards', []) as string[]
        _cards.push(...input.split(' '))
        GM_setValue('cards', [...new Set(_cards)])
    }
}
/**
 * 删除卡片
 * @param input 卡片输入(空格分割)
 */
export function deleteCards(input: string): void {
    if (input) {
        let deleteSet = new Set(input.split(' '))
        GM_setValue('cards', (GM_getValue('cards', []) as string[]).filter(card => !deleteSet.has(card)))
    }
}
export function checkCardLike(text: string | null): boolean {
    if (text) {
        for (const card of GM_getValue('cards', [])) {
            if (text.includes(card)) {
                return true;
            }
        }
    }
    return false;
}