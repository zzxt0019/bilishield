import 'arrive';
import { initRules } from './rules/base-rules';
import { initCards } from './settings/cards';
import { initMatches } from './settings/matches';
import { initUids } from './settings/uids-usernames';

init()
function init(): void {
  initCards()
  initUids()
  initMatches()
  // 写更多的规则
  for (const rule of initRules()) {
    document.arrive(rule.mainSelector, {
      fireOnAttributesModification: true,
      onceOnly: false,
      existing: true
    }, (element: Element) => {
      rule.run(element)
    })
  }
}