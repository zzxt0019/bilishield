/**
 * 视频页规则
 */
import { inCardLike } from "@/settings/cards";
import { HasRule } from "./base-rules";

/**
 * 根据卡片屏蔽评论
 */
export class CommentCardRule extends HasRule {
    mainSelector = '.list-item'
    innerSelector = '.sailing-img'
    bingo(element: Element): boolean {
        return inCardLike(element.getAttribute('alt'))
    }
}
/**
 * 根据评论中的图片屏蔽评论
 */
export class CommentImgRule extends HasRule {
    mainSelector = '.list-item'
    innerSelector = 'p.text img'
    bingo(element: Element): boolean {
        return inCardLike(element.getAttribute('alt'))
    }
}
export class CommentReplyImgRule extends HasRule {
    mainSelector = '.reply-item'
    innerSelector = 'img'
    bingo(element: Element): boolean {
        return inCardLike(element.getAttribute('alt'))
    }
}