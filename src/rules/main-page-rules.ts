/**
 * 首页规则
 */
import { inUsernames } from "@/utils"
import { HasRule } from "./base-rules"

export class RankUpRule extends HasRule {
    mainSelector = '.rank-wrap'
    innerSelector = '.info .name'
    bingo(element: Element) {
        return inUsernames(element.innerHTML)
    }
}