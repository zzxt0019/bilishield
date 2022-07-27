import { checkCardLike } from "@/settings/cards";
import { Page } from "./base/base-pages";
/**
 * 视频页
 */
export class VideoPage extends Page {
    url = /bilibili.com\/video\//
    init(): this {
        this.registerRule({
            mainSelector: '.list-item',  // 主评论 
            innerSelector: '.sailing-img',  // 卡片(card)
            bingo: node => checkCardLike(node.getAttribute('alt'))
        })
        this.registerRule({
            mainSelector: '.list-item',  // 主评论
            innerSelector: 'p.text img',  // 评论中的图片(card)
            bingo: node => checkCardLike(node.getAttribute('alt'))
        })
        this.registerRule({
            mainSelector: '.reply-item',  // 子评论
            innerSelector: 'img',  // 子评论中的图片(card)
            bingo: node => checkCardLike(node.getAttribute('alt'))
        })
        this.registerRule({
            mainSelector: 'a.ad-report',  // 广告
        })
        return this
    }

}