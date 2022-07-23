import { checkMatchLike } from '@/settings/matches';
import { checkUid } from '@/settings/uids-usernames';
import { registerRule } from "./base-rules";
let danmakuMap: Map<string, number> = new Map()
export function initLivePage(): void {
    registerRule(
        ['.chat-item.danmaku-item',  // 右侧弹幕 屏蔽matches发言
        ],
        (node) => checkMatchLike(node.getAttribute('data-danmaku'))
    )
    registerRule(
        ['.bilibili-danmaku.mode-roll',  // 中央弹幕 屏蔽matches发言
        ],
        (node) => checkMatchLike(node.getAttribute('data-danmaku'))
    )
    registerRule(
        ['.chat-item.danmaku-item',  // 右侧弹幕
        ],
        (node) => {
            /**
             * 屏蔽带粉丝牌子的发言
             */
            if (checkUid(Number(node.querySelector('[data-anchor-id]')?.getAttribute('data-anchor-id')))) {
                try {
                    /**
                     * 记录发言存入map 计数 + 1
                     */
                    let text: string = String(node.getAttribute('data-danmaku'))  // 记录发言
                    let lastCount = danmakuMap.get(text)
                    danmakuMap.set(text, lastCount ? lastCount + 1 : 1)  // danmakuMap 对应发言的 count + 1
                    /**
                     * 清除中央弹幕
                     * 删除与发言相同内容,同时计数 - 1
                     */
                    let nodeList = document.querySelectorAll('.bilibili-danmaku.mode-roll')
                    for (let i = 0; i < nodeList.length; i++) {
                        const node = nodeList[i];
                        if (node.innerHTML === text) {
                            node.remove()
                            if (danmakuMap.get(text) as number === 1) {
                                danmakuMap.delete(text)
                            } else {
                                danmakuMap.set(text, danmakuMap.get(text) as number - 1)
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
    )
    registerRule(
        ['.bilibili-danmaku.mode-roll',  // 中央弹幕
        ],
        node => {
            let text = node.innerHTML
            let lastCount = danmakuMap.get(text)
            if (lastCount) {
                danmakuMap.set(text, lastCount - 1)  // 计数 - 1
                return true
            }
            return false
        }
    )
}