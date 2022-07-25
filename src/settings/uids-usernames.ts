/**
 * 获取UP配置
 * @returns 卡片
 */
export function fetchUUs(): string[] {
    return GM_getValue('uids', []).map(uid => `${uid}(${fetchUid2Name(uid)})`)
}
/**
 * 添加UID
 * @param input UID输入(空格分割)
 */
export function addUids(input: string): void {
    if (input) {
        let uids = input.split(' ').map(Number)
        let _uids = (GM_getValue('uids') as number[])
        _uids.push(...uids)
        GM_setValue('uids', [...new Set(_uids)])

        // 添加时查询存储 <uid, username>
        for (const uid of uids) {
            setTimeout(() => fetchUid2Name(uid))
        }
    }
}
/**
 * 删除UID
 * @param input UID输入(空格分割)
 */
export function deleteUids(input: string): void {
    if (input) {
        let deleteSet: Set<number> = new Set(input.split(' ').map(Number))
        GM_setValue('uids', (GM_getValue('uids') as number[]).filter(uid => !deleteSet.has(uid)))

        // 删除时删除 <uid, username>
        for (const uid of deleteSet) {
            GM_deleteValue('uid_' + uid)
        }
    }
}
class BiliUp {
    constructor(public uid: number, public username: string, public expiretime: number) {
    }
}
export function fetchUid2Name(uid: number): string {
    let obj = GM_getValue('uid_' + uid)
    let biliUp: BiliUp = obj as BiliUp
    if (biliUp && new Date().getTime() < biliUp.expiretime) {
        return biliUp.username
    } else {
        try {
            let request = new XMLHttpRequest()
            request.open('GET', 'https://api.bilibili.com/x/space/acc/info?mid=' + uid, false)
            request.send(null)
            let username = JSON.parse(request.responseText).data.name
            biliUp = { uid, username, expiretime: new Date().getTime() + Math.random() * 24 * 60 * 60 * 1000 }
            GM_setValue('uid_' + uid, biliUp)
            return biliUp.username
        } catch (e){
            console.error(e);
            return ''
        }
    }
}
export function checkUid(uid: number | null): boolean {
    if (uid) {
        return (GM_getValue('uids', []) as number[]).includes(uid)
    }
    return false
}
export function checkUsername(text: string | null): boolean {
    if (text) {
        return (GM_getValue('uids', []) as number[]).map(fetchUid2Name).includes(text)
    }
    return false;
}
export function checkUsernameLike(text: string | null): boolean {
    if (text) {
        for (const card of GM_getValue('uids', []).map(fetchUid2Name)) {
            if (text.includes(card)) {
                return true;
            }
        }
    }
    return false;
}