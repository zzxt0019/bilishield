import { checkMatchLike } from "@/settings/matches"
import { checkUsername, checkUsernameLike } from "@/settings/uids-usernames"
import { registerRule } from "./base-rules"
/**
 * 首页规则
 */
export function initMainPage() {
    registerRule({
        mainSelector: '.rank-wrap',  // 排行榜
        innerSelector: '.info .name',  // UP(username)
        bingo: node => checkUsername(node.innerHTML)
    })
    registerRule({
        mainSelector: '.rank-wrap',  // 排行榜
        innerSelector: '.title',  // 标题
        bingo: node => checkMatchLike(node.getAttribute('title'))
    })
    registerRule({
        mainSelector: '.pgc-rank',  // 番剧/国创 排行榜
        innerSelector: '.title',  // 标题
        bingo: node => checkMatchLike(node.getAttribute('title'))
    })
    registerRule({
        mainSelector: '.manga-rank-item',  // 漫画排行榜
        innerSelector: '.title',  // 标题
        bingo: node => checkMatchLike(node.getAttribute('title'))
    })
    registerRule({
        mainSelector: '.video-card-reco',  // 右上角推荐
        innerSelector: 'img',  // 标题(matches)
        bingo: node => checkMatchLike(node.getAttribute('alt'))
    })
    registerRule({
        mainSelector: '.van-slide .item',  // 左上角滑动图片
        innerSelector: 'img',  // 图片名称(matches)
        bingo: node => checkMatchLike(node.getAttribute('alt'))
    })
    registerRule({
        mainSelector: '.van-slide .item',  // 左上角滑动图片
        innerSelector: 'i.bypb-icon',  // 广告
    })
    registerRule({
        mainSelector: '.video-card-common',  // 左边的视频块
        innerSelector: 'a.title',  // 标题(matches)
        bingo: node => checkMatchLike(node.getAttribute('title'))
    })
    registerRule({
        mainSelector: '.video-card-common',  // 左边的视频块
        innerSelector: 'a.up',  // UP(username)  // 有其他内容, 不是单一用户名
        bingo: node => checkUsernameLike(node.innerHTML)
    })
    registerRule({
        mainSelector: '.video-card-common',  // 左边的视频块
        innerSelector: '.gg-normal-icon',  // 广告
    })
    registerRule({
        mainSelector: '.article-card',  // 左边的专栏
        innerSelector: '.title',  // 标题
        bingo: node => checkMatchLike(node.getAttribute('title'))
    })
    registerRule({
        mainSelector: '.article-card',  // 左边的专栏
        innerSelector: 'a.up',  // UP(username)  // 有其他内容, 不是单一用户名
        bingo: node => checkUsernameLike(node.innerHTML)
    })
    registerRule({
        mainSelector: 'a.banner-card.b-wrap',  // 横条广告
        innerSelector: '.gg-icon',
    })
}