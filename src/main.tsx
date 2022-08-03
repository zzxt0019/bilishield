import "arrive";
// import React, { ReactElement } from "react";
// import ReactDOM from "react-dom";
// import { LivePage } from "./rules/live-page";
// import { MainPage } from "./rules/main-page";
// import { VideoPage } from "./rules/video-page";
// import { boxData } from "./views/box-data";

let pages = [
  // new BaiduMainPage().init(),
  // new MainPage().init(),
  // new VideoPage().init(),
  // new LivePage().init(),
];

init();
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
  // initReact();
  
  // 写更多的规则
  // boxData.window = window
  // pages.forEach(page => {
  //   if (page.url.test(location.href)) {
  //     page.startRule()
  //   }
  // })
}
// import content from './test.json!text';
import * as y from "yaml";
import { IPage } from "./pages/i-page";
import { IRule } from "./pages/i-rule";
import { ISetting } from "./pages/i-setting";
import pageText from "./pages/page.yaml";
import ruleText from "./pages/rule.yaml";
import settingText from "./pages/setting.yml";
// import * as fs from 'fs'
function initReact() {
  let pages = y.parse(pageText);
  let settings = y.parse(settingText);
  let rules = y.parse(ruleText);
  let pageMap: Map<string, IPage> = new Map();
  let settingMap: Map<string, ISetting> = new Map();
  let ruleMap: Map<string, IRule> = new Map();
  Object.keys(pages).forEach((key) => {
    let page = pages[key];
    page.key = key;
    pageMap.set(key, new IPage(page));
  });
  Object.keys(settings).forEach((key) => {
    let setting = settings[key];
    setting.key = key;
    setting.page = pageMap.get(setting.page);
    if (setting.page) {
      settingMap.set(key, new ISetting(setting));
    }
  });
  Object.keys(rules).forEach((key) => {
    let rule = rules[key];
    rule.key = key;
    rule.page = pageMap.get(rule.page);
    rule.setting = settingMap.get(rule.setting);
    if (rule.page) {
      ruleMap.set(key, new IRule(rule));
    }
  });
  console.log(pageMap);
  console.log(settingMap);
  console.log(ruleMap);
  for (let rule of ruleMap.values()) {
    if (rule.page.regexp?.test(location.href)) {
      document.arrive(
        rule.mainSelector,
        { fireOnAttributesModification: true, onceOnly: false, existing: true },
        (element: Element) => {
          let eles;
          if(rule.innerSelector){
            eles = element.querySelectorAll(rule.innerSelector);
          } else {
            eles = [element]
          }
          let removeFlag = false;
          out:
          for (let i = 0; i < eles.length; i++) {
            const ele = eles[i];
            if (rule.condition.innerHTML) {
              if (rule.setting) {
                for (let keyword of rule.setting.data) {
                  console.log(keyword, ele.innerHTML.includes(keyword))
                  if (ele.innerHTML.includes(keyword)) {
                    removeFlag = true;
                    break out;
                  }
                }
              } else {
                removeFlag = true;
                break out;
              }
            } else if (rule.condition.attribute) {
              if (ele.hasAttribute(rule.condition.attribute)) {
                if (rule.setting) {
                  let attrValue = ele.getAttribute(rule.condition.attribute);
                  for (let keyword of rule.setting.data) {
                    if (attrValue?.includes(keyword)) {
                      removeFlag = true;
                      break out;
                    }
                  }
                } else {
                  removeFlag = true;
                  break out;
                }
              }
            }
          }
          if (removeFlag) {
            (element as any).style.setProperty('display', 'none');
          }
        }
      );
    }
  }

  // console.log(new IPage(page));
  // let div = document.createElement("div");
  // div.setAttribute("id", 'APP_ID');
  // document.body.appendChild(div);
  // ReactDOM.render( <h1>1234</h1> as ReactElement ,document.getElementById('APP_ID'))
}
//
//页面regexp
//配置 页面
//规则 页面 基于配置
