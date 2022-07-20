import 'arrive';
import { initCards } from './dataConfig/cards';
import { _uids } from './dataConfig/database';
import { initUids } from './dataConfig/uids-usernames';
import { RankUpRule } from './rules/main-page-rules';
import { fetchUid2Name } from './utils';

init()
function init(): void {
  initCards()
  initUids()


  let dogNames = []
  for (const dogId of _uids) {
    dogNames.push(fetchUid2Name(dogId))
  }
  // 写更多的规则
  for (const rule of [
    new RankUpRule(),
  ]) {
    document.arrive(rule.mainSelector, { fireOnAttributesModification: true, onceOnly: false, existing: true },
      (element: Element) => {
        if (rule.ifRemove(element)) {
          element.remove()
        }
      })
  }
}