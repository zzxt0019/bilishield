import 'arrive';
import * as Vue from 'vue';
import { BaiduMainPage } from './rules/baidu-main-page';
import { LivePage } from './rules/live-page';
import { MainPage } from './rules/main-page';
import { VideoPage } from './rules/video-page';
import App from "./views/Box.vue";

init()
function initBox() {
  let div = document.createElement("div");
  div.setAttribute("id", 'APP_ID');
  document.body.appendChild(div);
  Vue.createApp(App).mount('#APP_ID');
}
function initPages() {
  return [
    new BaiduMainPage().init(),
    new MainPage().init(),
    new VideoPage().init(),
    new LivePage().init(),
  ]
}
function init(): void {
  initBox()
  // 写更多的规则
  initPages().forEach(page => {
    if (page.url.test(location.href)) {
      for (const rule of page.rules()) {
        document.arrive(rule.mainSelector, {
          fireOnAttributesModification: true,
          onceOnly: false,
          existing: true
        }, (element: Element) => {
          rule.run(element)
        })
      }
    }
  })
}