import { checkCardLike } from "@/settings/cards";
import { registerRule } from "./base-rules";
/**
 * 视频页规则
 */
export function initVideoPage(): void {
    registerRule(
        ['.list-item',  // 主评论 
            '.sailing-img'],  // 卡片(card)
        node => checkCardLike(node.getAttribute('alt'))
    )
    registerRule(
        ['.list-item',  // 主评论
            'p.text img'],  // 评论中的图片(card)
        node => checkCardLike(node.getAttribute('alt'))
    )
    registerRule(
        ['.reply-item',  // 子评论
            'img'],  // 子评论中的图片(card)
        node => checkCardLike(node.getAttribute('alt'))
    )
    registerRule(
        ['a.ad-report',  // 广告
        ],
        'display'
    )
}