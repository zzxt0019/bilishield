import { checkMatchLike } from "@/settings/matches"
import { checkUsername, checkUsernameLike } from "@/settings/uids-usernames"
import { Page } from "./base/base-pages"
/**
 * 首页
 */
export class MainPage extends Page {
    url = /bilibili.com\/(?!video\/).*/  // 是 bilibili.com/* 但不是 bilibili.com/video/*
    init(): this {
        this.registerRule({
            mainSelector: '.rank-wrap',  // 排行榜
            innerSelector: '.info .name',  // UP(username)
            bingo: node => checkUsername(node.innerHTML)
        })
        this.registerRule({
            mainSelector: '.rank-wrap',  // 排行榜
            innerSelector: '.title',  // 标题
            bingo: node => checkMatchLike(node.getAttribute('title'))
        })
        this.registerRule({
            mainSelector: '.pgc-rank',  // 番剧/国创 排行榜
            innerSelector: '.title',  // 标题
            bingo: node => checkMatchLike(node.getAttribute('title'))
        })
        this.registerRule({
            mainSelector: '.manga-rank-item',  // 漫画排行榜
            innerSelector: '.title',  // 标题
            bingo: node => checkMatchLike(node.getAttribute('title'))
        })
        this.registerRule({
            mainSelector: '.video-card-reco',  // 右上角推荐
            innerSelector: 'img',  // 标题(matches)
            bingo: node => checkMatchLike(node.getAttribute('alt'))
        })
        this.registerRule({
            mainSelector: '.van-slide .item',  // 左上角滑动图片
            innerSelector: 'img',  // 图片名称(matches)
            bingo: node => checkMatchLike(node.getAttribute('alt'))
        })
        this.registerRule({
            mainSelector: '.van-slide .item',  // 左上角滑动图片
            innerSelector: 'i.bypb-icon',  // 广告
        })
        this.registerRule({
            mainSelector: '.video-card-common',  // 左边的视频块
            innerSelector: 'a.title',  // 标题(matches)
            bingo: node => checkMatchLike(node.getAttribute('title'))
        })
        this.registerRule({
            mainSelector: '.video-card-common',  // 左边的视频块
            innerSelector: 'a.up',  // UP(username)  // 有其他内容, 不是单一用户名
            bingo: node => checkUsernameLike(node.innerHTML)
        })
        this.registerRule({
            mainSelector: '.video-card-common',  // 左边的视频块
            innerSelector: '.gg-normal-icon',  // 广告
        })
        this.registerRule({
            mainSelector: '.article-card',  // 左边的专栏
            innerSelector: '.title',  // 标题
            bingo: node => checkMatchLike(node.getAttribute('title'))
        })
        this.registerRule({
            mainSelector: '.article-card',  // 左边的专栏
            innerSelector: 'a.up',  // UP(username)  // 有其他内容, 不是单一用户名
            bingo: node => checkUsernameLike(node.innerHTML)
        })
        this.registerRule({
            mainSelector: 'a.banner-card.b-wrap',  // 横条广告
            innerSelector: '.gg-icon',
        })
        return this
    }
}