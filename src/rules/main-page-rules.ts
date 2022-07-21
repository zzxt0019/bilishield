import { checkMatchLike } from "@/settings/matches"
import { checkUsernameLike, checkUsername } from "@/settings/uids-usernames"
import { registerRule } from "./base-rules"
/**
 * 首页规则
 */
export function initMainPage() {
    registerRule(
        '.result.c-container',
        'a',
        node => node.innerHTML.includes('公司来了个新同事')
    )
    registerRule(
        '.rank-wrap',  // 排行榜
        '.info .name',  // UP(username)
        node => checkUsername(node.innerHTML)
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
        '.video-card-common',  // 左边的视频块
        'a.title',  // 标题(matches)
        node => checkMatchLike(node.getAttribute('title'))
    )
    registerRule(
        '.video-card-common',  // 左边的视频块
        'a.up',  // UP(username)  // 有其他内容, 不是单一用户名
        node => checkUsernameLike(node.innerHTML)
    )
}