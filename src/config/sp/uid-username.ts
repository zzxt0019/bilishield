import { DefaultSettings } from "../default-setting";
import { SP } from "./sp";

export class UidUsername extends SP {
    get(key: 'uid' | 'username'): () => string[] {
        return () => {
            if (key === 'uid') {
                return GM_getValue('settings.uid', [])
            } else if (key === 'username') {
                return this.get('uid')().map(this.uid2username)
            }
            return []
        }
    }
    set(key: 'uid'): (uid: string[]) => void {
        return (uid: string[]) => {
            DefaultSettings._setSettingValue('uid', uid)
        }
    }
    add(key: 'uid'): (uid: string | string[]) => void {
        return (uid: string | string[]) => {
            DefaultSettings._addSettingValue('uid', uid)
        }
    }
    del(key: 'uid'): (uid: string | string[]) => void {
        return (uid: string | string[]) => {
            DefaultSettings._delSettingValue('uid', uid)
        }
    }

    uid2username(uid: string): string {
        let obj = GM_getValue('uid_' + uid, {})
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
            } catch (e) {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: 'https://api.bilibili.com/x/space/acc/info?mid=' + uid,
                    onload(res) {
                        let username = JSON.parse(res.responseText).data.name
                        biliUp = { uid, username, expiretime: new Date().getTime() + Math.random() * 24 * 60 * 60 * 1000 }
                        GM_setValue('uid_' + uid, biliUp)
                    }
                })
                return ''
            }
        }
    }
}
class BiliUp {
    constructor(public uid: string, public username: string, public expiretime: number) {
    }
}