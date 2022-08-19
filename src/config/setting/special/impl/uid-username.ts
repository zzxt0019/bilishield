import {DefaultSettings} from "../../default-setting";
import {SpecialSetting} from "../special-setting";
import {CheckType} from "@/config/rule/checker";


export class UidUsername extends SpecialSetting {
    get(key: 'uid' | 'username'): () => Promise<string[]> {
        return async () => {
            if (key === 'uid') {
                return GM_getValue('settings.uid', [])
            } else if (key === 'username') {
                let uids = await this.get('uid')()
                return Promise.all(uids.map(uid => this.uid2username(uid)))
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

    type(key: 'uid' | 'username'): () => CheckType {
        return () => {
            if (key === 'uid') {
                return 'equal'
            } else if (key === 'username') {
                return 'like'
            } else {
                return 'like'
            }
        }
    }

    async uid2username(_uid: string): Promise<string> {
        // 输入错误
        if (_uid === '') {
            return ''
        }
        // 缓存在有效期内, 取缓存
        let uid = Number(_uid)
        let obj = GM_getValue('uid_' + uid)
        let biliUp: BiliUp = obj as BiliUp
        if (biliUp && new Date().getTime() < biliUp.expiretime) {
            return biliUp.username
        }
        // 异步查询
        return new Promise<string>((res, rej) => {
            this.queryUsername(res, rej, uid, UidUsername.apiIndex, UidUsername.apiIndex)
        }).catch(() => Promise.resolve(''))
    }

    /**
     * 查询用户名
     * @param res
     * @param rej
     * @param uid
     * @param firstIndex 首次调用时的index
     * @param apiIndex 当前调用时的index
     */
    queryUsername(
        res: (value: string | PromiseLike<string>) => void,
        rej: (reason?: any) => void,
        uid: number, firstIndex: number, apiIndex: number
    ): void {
        let api = UidUsername.apis[apiIndex]
        GM_xmlhttpRequest({
            method: 'GET',
            url: api.url(uid),
            onload: (response) => {
                let json = JSON.parse(response.responseText)
                if (api.success(json)) {
                    // 成功, 记录并返回
                    UidUsername.apiIndex = apiIndex
                    let username = api.username(json)
                    // 保存至GM
                    let biliUp = {uid, username, expiretime: new Date().getTime() + Math.random() * 24 * 60 * 60 * 1000}
                    GM_setValue('uid_' + uid, biliUp)
                    res(username)
                } else if (api.change(json)) {
                    // 拦截请求, 尝试其他api
                    apiIndex = (apiIndex + 1) % UidUsername.apis.length
                    // 若firstIndex === apiIndex 说明循环一圈都被拦截, 不需要再查了, 直接错误
                    if (firstIndex !== apiIndex) {
                        this.queryUsername(res, rej, uid, firstIndex, apiIndex)
                    } else {
                        rej()
                    }
                } else {
                    // 其他 错误
                    rej()
                }
            }
        })
    }

    private static apiIndex = 0
    private static apis: {
        url: (uid: number) => string,  // 根据uid生成url的方法(拼接url参数)
        success: (json: any) => boolean,  // 根据响应json判断是否成功
        username: (json: any) => string,  // 根据响应json取到username
        change: (json: any) => boolean  // 根据响应json判断是否被拦截(被拦截则换其他api)
    }[] = [
        {
            url: (uid: number) => 'http://api.bilibili.com/x/web-interface/card?mid=' + uid,
            success: (json: any) => json.code === 0,
            username: (json: any) => json.data.card.name,
            change: (json: any) => json.code === -412,  // 请求被拦截
        },
        {
            url: (uid: number) => 'https://api.bilibili.com/x/space/acc/info?mid=' + uid,
            success: (json: any) => json.code === 0,
            username: (json: any) => json.data.name,
            change: (json: any) => json.code === -412,  // 请求被拦截
        },
    ]
}

class BiliUp {
    constructor(public uid: string, public username: string, public expiretime: number) {
    }
}