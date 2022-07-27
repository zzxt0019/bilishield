<template>
  <div class="_main" v-if="mainIf">
    <div class="_box">
      <div>
        <div>卡片:</div>
        <span v-for="item in Cards.fetchCards()">{{ item }},</span>
        <br />
        <input type="text" v-model="input.cards" />|
        <button @click="Cards.addCards(input.cards); reload();">添加</button>|
        <button @click="Cards.deleteCards(input.cards); reload();">删除</button>
      </div>
      <div>
        <div>up:</div>
        <span v-for="item in UUs.fetchUUs()">{{ item }},</span>
        <br />
        <input type="text" v-model="input.uids" />|
        <button @click="UUs.addUids(input.uids); reload();">添加</button>|
        <button @click="UUs.deleteUids(input.uids); reload();">删除</button>
      </div>
      <div>
        <div>标题:</div>
        <span v-for="item in Matches.fetchMatches()">{{ item }},</span>
        <br>
        <input type="text" v-model="input.matches" />|
        <button @click="Matches.addMatches(input.matches); reload();">添加</button>|
        <button @click="Matches.deleteMatches(input.matches); reload();">删除</button>
      </div>
      <div>
        <input type="file" @change="fileChange($event)" :disabled="status.readingFile">
        <br>
        <textarea>{{ config }}</textarea>
        <br>
        <button @click="readFile()">读取文件</button>|
        <button @click="upload(true); reload();">覆盖上传</button>|
        <button @click="upload(false); reload();">追加上传</button>|
        <button @click="fetchConfig()">查看配置</button>|
        <button @click="download()">下载配置</button>
      </div>
      <div>
        <button @click="mainIf=false">取消</button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import * as Cards from "@/settings/cards";
import * as Matches from "@/settings/matches";
import * as UUs from "@/settings/uids-usernames";
import { ref } from "vue";
class Input {
  cards: string = ''
  uids: string = ''
  matches: string = ''
  file?: File
}
class Status {
  readingFile: boolean = false
}
const mainIf = ref(false);
const input = ref(new Input())
const status = ref(new Status())
const config = ref("");
// 文件变化
function fileChange(e: any) {
  input.value.file = e.target.files[0]
  readFile()
}
// 读取文件
function readFile() {
  if (input.value.file) {
    status.value.readingFile = true
    let reader = new FileReader()
    reader.onload = () => {
      config.value = reader.result as string
      status.value.readingFile = false
    }
    reader.readAsText(input.value.file, 'utf-8')
  }
}
// 查看配置
function fetchConfig() {
  config.value = JSON.stringify({
    uids: GM_getValue('uids', []),
    matches: GM_getValue('matches', []),
    cards: GM_getValue('cards', [])
  })
}
// 下载配置
function download() {
  const a = document.createElement('a');
  const file = new Blob([JSON.stringify(fetchConfig())], { type: 'text/plain' })
  a.href = URL.createObjectURL(file);
  a.download = 'bilishild_config';
  a.click();
  URL.revokeObjectURL(a.href);
}
// 重新载入
function reload() {
  input.value.cards = ''
  input.value.uids = ''
  input.value.matches = ''
  mainIf.value = false;
  mainIf.value = true;
}
// 上传
function upload(rewrite: boolean = false) {
  if (rewrite) {
    let json = JSON.parse(config.value) as any;
    UUs.deleteUids(UUs.fetchUUs().join(' '));
    GM_setValue('cards', json.cards);
    GM_setValue('uids', json.uids);
    GM_setValue('matches', json.matches);
  } else {
    let json = JSON.parse(config.value) as any
    Cards.addCards(json.cards.join(' '))
    UUs.addUids(json.uids.join(' '))
    Matches.addMatches(json.matches.join(' '))
  }
}
GM_registerMenuCommand("展示Vue", () => {
  mainIf.value = !mainIf.value;
});
</script>
<style scoped lang="less">
._main {
  bottom: 6vh;
  color: #777777;
  position: absolute;
  top: 10px;
  right: 350px;
  z-index: 99999;

  ._box {
    position: fixed;
    background-color: #000;
  }
}
</style>
