import 'arrive';
import React, { ReactElement } from 'react';
import ReactDOM from 'react-dom';
import { LivePage } from './rules/live-page';
import { MainPage } from './rules/main-page';
import { VideoPage } from './rules/video-page';
import { boxData } from './views/box-data';

let pages = [
  // new BaiduMainPage().init(),
  // new MainPage().init(),
  // new VideoPage().init(),
  // new LivePage().init(),
]

init()
// function initBox() {
//   let div = document.createElement("div");
//   div.setAttribute("id", 'APP_ID');
//   document.body.appendChild(div);
//   Vue.createApp(App).mount('#APP_ID');
//   // BoxData
//   boxData.window = window
//   pages.forEach(page => boxData.pages.push(page))
// }
function init(): void {
  // initBox()
  initReact()
  // 写更多的规则
  // boxData.window = window
  // pages.forEach(page => {
  //   if (page.url.test(location.href)) {
  //     page.startRule()
  //   }
  // })
}
function initReact() {
  let div = document.createElement("div");
  div.setAttribute("id", 'APP_ID');
  document.body.appendChild(div);
  ReactDOM.render( <h1>1234</h1> as ReactElement ,document.getElementById('APP_ID'))
}