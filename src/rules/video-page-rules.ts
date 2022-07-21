import { inCardLike } from "@/settings/cards";
import { BaseRule, baseRules } from "./base-rules";
/**
 * 视频页规则
 */
export function initVideoPage(): void {
    baseRules.push(new BaseRule(
        '.list-item',  // 主评论 
        '.sailing-img',  // 卡片(card)
        node => inCardLike(node.getAttribute('alt'))
    ))
    baseRules.push(new BaseRule(
        '.list-item',  // 主评论
        'p.text img',  // 评论中的图片(card)
        node => inCardLike(node.getAttribute('alt'))
    ))
    baseRules.push(new BaseRule(
        '.reply-item',
        'img',
        node => inCardLike(node.getAttribute('alt'))
    ))
}