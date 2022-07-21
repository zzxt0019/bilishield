/**
 * 首页规则
 */
import { inMatchLike } from "@/settings/matches"
import { inUsernameLike, inUsernames } from "@/settings/uids-usernames"
import { HasRule } from "./base-rules"

/**
 * 根据up屏蔽排行榜
 */
export class RankUpRule extends HasRule {
    mainSelector = '.rank-wrap'
    innerSelector = '.info .name'
    bingo(element: Element) {
        return inUsernames(element.innerHTML)
    }
}
/**
 * 右上角标题屏蔽
 */
export class RandomVideoTitleRule extends HasRule {
    mainSelector = '.video-card-reco'
    innerSelector = 'img'
    bingo(element: Element): boolean {
        return inMatchLike(element.getAttribute('alt'))
    }
}

/**
 * 左上角标题屏蔽
 */
export class SlideRule extends HasRule {
    mainSelector = '.van-slide .item';
    innerSelector = 'img'
    bingo(element: Element): boolean {
        return inMatchLike(element.getAttribute('alt'))
    }
}
/**
 * 左边的视频 标题屏蔽
 */
export class VideoCardTitleRule extends HasRule {
    mainSelector = '.video-card-common'
    innerSelector = 'a.title'
    bingo(element: Element): boolean {
        return inMatchLike(element.getAttribute('title'))
    }
}
/**
 * 左边的视频 up屏蔽
 */
export class VideoCardUpRule extends HasRule {
    mainSelector = '.video-card-common'
    innerSelector = 'a.up'
    bingo(element: Element): boolean {
        return inUsernameLike(element.innerHTML)
    }
}