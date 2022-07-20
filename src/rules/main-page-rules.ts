/**
 * 首页规则
 */
import { inUsernames } from "@/dataConfig/uids-usernames"
import { HasRule } from "./base-rules"

/**
 * 根据up屏蔽排行榜
 */
export class RankUpRule extends HasRule {
    mainSelector = '.rank-wrap'
    innerSelector = '.info .name'
    bingo(element: Element) {
        return inUsernames(element.innerHTML)
    }
}