import 'arrive';
import * as Vue from 'vue';
import { initRules } from './rules/base-rules';
import App from "./views/Box.vue";

init()
function initBox() {
  let div = document.createElement("div");
  div.setAttribute("id", 'APP_ID');
  document.body.appendChild(div);
  Vue.createApp(App).mount('#APP_ID');
}
function init(): void {
  initBox()
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