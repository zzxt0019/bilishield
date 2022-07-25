/**
 * 获取匹配配置
 * @returns 卡片
 */
export function fetchMatches(): string[] {
    return GM_getValue('matches', []) as string[]
}
/**
 * 添加匹配
 * @param input 匹配输入(空格分割)
 */
export function addMatches(input: string): void {
    console.log('input', input)
    if (input) {
        let _matches = GM_getValue('matches', []) as string[]
        _matches.push(...input.split(' '))
        GM_setValue('matches', [...new Set(_matches)])
    }
}
/**
 * 删除匹配
 * @param input 匹配输入(空格分割)
 */
export function deleteMatches(input: string): void {
    if (input) {
        let deleteSet = new Set(input.split(' '))
        GM_setValue('matches', (GM_getValue('matches', []) as string[]).filter(match => !deleteSet.has(match)))
    }
}
export function checkMatchLike(text: string | null): boolean {
    if (text) {
        for (const match of GM_getValue('matches', [])) {
            if (text.includes(match)) {
                return true;
            }
        }
    }
    return false;
}