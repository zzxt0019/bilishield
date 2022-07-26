import { checkCardLike } from "@/settings/cards";
import { registerRule } from "./base-rules";
/**
 * 视频页规则
 */
export function initVideoPage(): void {
    registerRule({
        mainSelector: '.list-item',  // 主评论 
        innerSelector: '.sailing-img',  // 卡片(card)
        bingo: node => checkCardLike(node.getAttribute('alt'))
    })
    registerRule({
        mainSelector: '.list-item',  // 主评论
        innerSelector: 'p.text img',  // 评论中的图片(card)
        bingo: node => checkCardLike(node.getAttribute('alt'))
    })
    registerRule({
        mainSelector: '.reply-item',  // 子评论
        innerSelector: 'img',  // 子评论中的图片(card)
        bingo: node => checkCardLike(node.getAttribute('alt'))
    })
    registerRule({
        mainSelector: 'a.ad-report',  // 广告
    })
}