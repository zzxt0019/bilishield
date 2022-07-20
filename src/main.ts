import 'arrive'
import { _uids } from './dataConfig/database';
import { initCards } from './dataConfig/cards';
import { initUids } from './dataConfig/uids-usernames';
import { rules } from './rules/base-rules';
import { fetchUid2Name, Log } from './utils';
init()
function init(): void {
  initCards()
  initUids()


  let dogNames = []
  for (const dogId of _uids) {
    dogNames.push(fetchUid2Name(dogId))
  }
  // 写更多的规则
  for (const rule of rules) {
    document.arrive(rule.mainSelector, { fireOnAttributesModification: true, onceOnly: false, existing: true },
      (element: Element) => {
        if (rule.ifRemove(element)) {
          element.remove()
        }
      })
  }
}