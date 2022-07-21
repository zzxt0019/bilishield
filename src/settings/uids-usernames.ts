import { _uids } from './database';
export function initUids(): void {
    // GM_deleteValue('uids')  // to test
    let uids = GM_getValue('uids')
    if (!uids) {
        GM_setValue('uids', _uids)
    }

    GM_registerMenuCommand('添加up', () => {
        let showUids = GM_getValue('uids', []).map(uid => `${uid}(${fetchUid2Name(uid)})`).join(',')
        let addUids = prompt(
            `uid:
            ${showUids}`
        );
        if (addUids) {
            let uids = (GM_getValue('uids') as number[])
            uids.push(...addUids.split(' ').map(Number))
            GM_setValue('uids', uids)
        }
    })
    GM_registerMenuCommand('删除up', () => {
        let showUids = GM_getValue('uids', []).map(uid => `${uid}(${fetchUid2Name(uid)})`).join(',')
        let deleteuids = prompt(
            `uid:
            ${showUids}`
        );
        if (deleteuids) {
            let deleteSet: Set<number> = new Set(deleteuids.split(' ').map(Number))
            GM_setValue('uids', (GM_getValue('uids') as number[]).filter(uid => !deleteSet.has(uid)))
        }
    })
    GM_registerMenuCommand('展示up', () => {
        let showUids = GM_getValue('uids', []).map(uid => `${uid}(${fetchUid2Name(uid)})`).join(',')
        alert(
            `uid:
            ${showUids}`
        );
    })
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
        let request = new XMLHttpRequest()
        request.open('GET', 'https://api.bilibili.com/x/space/acc/info?mid=' + uid, false)
        request.send(null)
        let username = JSON.parse(request.responseText).data.name
        biliUp = { uid, username, expiretime: new Date().getTime() + Math.random() * 24 * 60 * 60 * 1000 }
        GM_setValue('uid_' + uid, biliUp)
        return biliUp.username
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