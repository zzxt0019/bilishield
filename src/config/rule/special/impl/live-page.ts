import {Settings} from '@/config/setting/setting';
import {SpecialRule} from "../special-rule";
import * as MainStatic from '@/main-static'

export class LivePageRule extends SpecialRule {
    pageKey = 'bilibili_live'
    danmakuMap: Map<string, number> = new Map()
    spCheckers = [
        {
            mainSelector: '.chat-item.danmaku-item',  // 右侧弹幕
            bingo: async (node: Element) => {
                /**
                 * 屏蔽带粉丝牌子的发言
                 */
                if ((await Settings.selectSettingDataString('uid')).includes(node.querySelector('[data-anchor-id]')?.getAttribute('data-anchor-id') as string)) {
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
                                node.classList.add(MainStatic.DisplayClass);
                                if (this.danmakuMap.get(text) as number === 1) {
                                    this.danmakuMap.delete(text)
                                } else {
                                    this.danmakuMap.set(text, this.danmakuMap.get(text) as number - 1)
                                }
                                break;
                            }
                        }
                    } catch (e) {
                        console.error(e, node);
                    } finally {
                        console.log(true, node);
                    }
                    // 无论如何都要删除这条
                    return true
                }
                return false;
            }
        },
        {
            mainSelector: '.bilibili-danmaku.mode-roll',  // 中央弹幕
            bingo: async (element: Element) => {
                let text = element.innerHTML
                let lastCount = this.danmakuMap.get(text)
                if (lastCount) {
                    this.danmakuMap.set(text, lastCount - 1)  // 计数 - 1
                    return true
                }
                return false
            }
        }
    ]
    /*
    todo 直播页改动
      .bilibili-danmaku.mode-roll 滚动直播 innerHTML内容会突然删掉 应该先记录并
     */

}