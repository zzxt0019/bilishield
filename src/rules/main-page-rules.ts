import { checkMatchLike } from "@/settings/matches"
import { checkUsername, checkUsernameLike } from "@/settings/uids-usernames"
import { registerRule } from "./base-rules"
/**
 * 首页规则
 */
export function initMainPage() {
    registerRule(
        '.rank-wrap',  // 排行榜
        '.info .name',  // UP(username)
        node => checkUsername(node.innerHTML)
    )
    registerRule(
        '.rank-wrap',  // 排行榜
        '.title',  // 标题
        node => checkMatchLike(node.getAttribute('title'))
    )
    registerRule(
        '.pgc-rank',  // 番剧/国创 排行榜
        '.title',  // 标题
        node => checkMatchLike(node.getAttribute('title'))
    )
    registerRule(
        '.manga-rank-item',  // 漫画排行榜
        '.title',  // 标题
        node => checkMatchLike(node.getAttribute('title'))
    )
    registerRule(
        '.video-card-reco',  // 右上角推荐
        'img',  // 标题(matches)
        node => checkMatchLike(node.getAttribute('alt'))
    )
    registerRule(
        '.van-slide .item',  // 左上角滑动图片
        'img',  // 图片名称(matches)
        node => checkMatchLike(node.getAttribute('alt'))
    )
    registerRule(
        '.van-slide .item',  // 左上角滑动图片
        'i.bypb-icon',  // 广告
        () => true
    )
    registerRule(
        '.video-card-common',  // 左边的视频块
        'a.title',  // 标题(matches)
        node => checkMatchLike(node.getAttribute('title'))
    )
    registerRule(
        '.video-card-common',  // 左边的视频块
        'a.up',  // UP(username)  // 有其他内容, 不是单一用户名
        node => checkUsernameLike(node.innerHTML)
    )
    registerRule(
        '.video-card-common',  // 左边的视频块
        '.gg-normal-icon',  // 广告
        () => true
    )
    registerRule(
        '.article-card',  // 左边的专栏
        '.title',  // 标题
        node => checkMatchLike(node.getAttribute('title'))
    )
    registerRule(
        '.article-card',  // 左边的专栏
        'a.up',  // UP(username)  // 有其他内容, 不是单一用户名
        node => checkUsernameLike(node.innerHTML)
    )
    registerRule(
        'a.banner-card.b-wrap',  // 横条广告
        '.gg-icon',
        () => true
    )
}