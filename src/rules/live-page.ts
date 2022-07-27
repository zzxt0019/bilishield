import { checkMatchLike } from '@/settings/matches';
import { checkUid } from '@/settings/uids-usernames';
import { Page } from './base/base-pages';
/**
 * 直播页
 */
export class LivePage extends Page {
    url = /bilibili.com\/live\//
    danmakuMap: Map<string, number> = new Map()
    init(): this {
        this.registerRule({
            mainSelector: '.chat-item.danmaku-item',  // 右侧弹幕 屏蔽matches发言
            bingo: node => checkMatchLike(node.getAttribute('data-danmaku'))
        })
        this.registerRule({
            mainSelector: '.bilibili-danmaku.mode-roll',  // 中央弹幕 屏蔽matches发言
            bingo: node => checkMatchLike(node.getAttribute('data-danmaku'))
        })
        this.registerRule({
            mainSelector: '.chat-item.danmaku-item',  // 右侧弹幕
            bingo: node => {
                /**
                 * 屏蔽带粉丝牌子的发言
                 */
                if (checkUid(Number(node.querySelector('[data-anchor-id]')?.getAttribute('data-anchor-id')))) {
                    try {
                        /**
                         * 记录发言存入map 计数 + 1
                         */
                        let text: string = String(node.getAttribute('data-danmaku'))  // 记录发言
                        let lastCount = this.danmakuMap.get(text)
                        this.danmakuMap.set(text, lastCount ? lastCount + 1 : 1)  // danmakuMap 对应发言的 count + 1
                        /**
                         * 清除中央弹幕
                         * 删除与发言相同内容,同时计数 - 1
                         */
                        let nodeList = document.querySelectorAll('.bilibili-danmaku.mode-roll')
                        for (let i = 0; i < nodeList.length; i++) {
                            const node = nodeList[i];
                            if (node.innerHTML === text) {
                                node.remove()
                                if (this.danmakuMap.get(text) as number === 1) {
                                    this.danmakuMap.delete(text)
                                } else {
                                    this.danmakuMap.set(text, this.danmakuMap.get(text) as number - 1)
                                }
                                break;
                            }
                        }
                    } catch (e) {
                        console.error(e)
                    } finally {
                        console.log(true, node)
                        // 无论如何都要删除这条
                        return true
                    }
                }
                return false;
            }
        })
        this.registerRule({
            mainSelector: '.bilibili-danmaku.mode-roll',  // 中央弹幕
            bingo: node => {
                let text = node.innerHTML
                let lastCount = this.danmakuMap.get(text)
                if (lastCount) {
                    this.danmakuMap.set(text, lastCount - 1)  // 计数 - 1
                    return true
                }
                return false
            }
        })
        return this
    }
}