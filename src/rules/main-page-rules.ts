import { inMatchLike } from "@/settings/matches"
import { inUsernameLike, inUsernames } from "@/settings/uids-usernames"
import { BaseRule, baseRules } from "./base-rules"
/**
 * 首页规则
 */
export function initMainPage() {
    baseRules.push(new BaseRule(
        '.result.c-container',
        'a',
        node => node.innerHTML.includes('公司来了个新同事')
    ))
    baseRules.push(new BaseRule(
        '.rank-wrap',  // 排行榜
        '.info .name',  // UP(username)
        node => inUsernames(node.innerHTML)
    ))
    baseRules.push(new BaseRule(
        '.video-card-reco',  // 右上角推荐
        'img',  // 标题(matches)
        node => inMatchLike(node.getAttribute('alt'))
    ))
    baseRules.push(new BaseRule(
        '.van-slide .item',  // 左上角滑动图片
        'img',  // 图片名称(matches)
        node => inMatchLike(node.getAttribute('alt'))
    ))
    baseRules.push(new BaseRule(
        '.video-card-common',  // 左边的视频块
        'a.title',  // 标题(matches)
        node => inMatchLike(node.getAttribute('title'))
    ))
    baseRules.push(new BaseRule(
        '.video-card-common',  // 左边的视频块
        'a.up',  // UP(username)  // 有其他内容, 不是单一用户名
        node => inUsernameLike(node.innerHTML)
    ))
}