import { _cards } from './dataConfig/database';
// export function isMonkey(word: string): boolean;
// export function isMonkey(word: null): boolean;
export function inCard(text: string | null): boolean {
    if (text) {
        for (const card of _cards) {
            if (text.includes(card)) {
                return true;
            }
        }
    }
    return false;
}
export function inUids(uid: number | null): boolean {
    if (uid) {
        return (GM_getValue('uids', []) as number[]).includes(uid)
    }
    return false
}
export function inUsernames(text: string | null): boolean {
    if (text) {
        return (GM_getValue('uids', []) as number[]).map(fetchUid2Name).includes(text)
    }
    return false;
}
export function Log(...objs: any): void {
    console.log('userscript', ...objs)
}
export class Dog {
    constructor(public uid: number, public username: string, public expiretime: number) {
    }
}
export function fetchUid2Name(uid: number): string {
    let obj = GM_getValue('uid_' + uid)
    let dog: Dog = obj as Dog
    if (dog && new Date().getTime() < dog.expiretime) {
        return dog.username
    } else {
        let request = new XMLHttpRequest()
        request.open('GET', 'https://api.bilibili.com/x/space/acc/info?mid=' + uid, false)
        request.send(null)
        let username = JSON.parse(request.responseText).data.name
        dog = { uid, username, expiretime: new Date().getTime() + Math.random() * 24 * 60 * 60 * 1000 }
        GM_setValue('uid_' + uid, dog)
        return dog.username
    }
}