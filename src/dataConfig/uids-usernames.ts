import { fetchUid2Name } from '@/utils';
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