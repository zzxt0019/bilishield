import 'arrive';
import { initCards } from './dataConfig/cards';
import { initUids } from './dataConfig/uids-usernames';
import { RankUpRule } from './rules/main-page-rules';
import { CommentCardRule, CommentImgRule, CommentReplyImgRule } from './rules/video-page-rules';

init()
function init(): void {
  initCards()
  initUids()
  // 写更多的规则
  for (const rule of [
    new RankUpRule(),
    new CommentCardRule(),
    new CommentImgRule(),
    new CommentReplyImgRule(),
  ]) {
    document.arrive(rule.mainSelector, { fireOnAttributesModification: true, onceOnly: false, existing: true },
      (element: Element) => {
        if (rule.ifRemove(element)) {
          element.remove()
        }
      })
  }
}