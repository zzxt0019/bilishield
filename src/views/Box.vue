<template>
  <div class="main" v-if="mainIf">
    <div>
      <div>卡片:</div>
      <span v-for="item in Cards.fetchCards()">{{ item }},</span>
      <br />
      <input type="text" v-model="cards" />
      <button @click="Cards.addCards(cards);reload();">添加</button>
      <button @click="Cards.deleteCards(cards);reload();">删除</button>
    </div>
    <div>
      <div>up:</div>
      <span v-for="item in UUs.fetchUUs()">{{ item }},</span>
      <br />
      <input type="text" v-model="uids" />
      <button @click="UUs.addUids(uids);reload(uids);">添加</button>
      <button @click="UUs.deleteUids(uids);reload();">删除</button>
    </div>
    <div>
      <div>标题:</div>
      <span v-for="item in Matches.fetchMatches()">{{ item }},</span>
      <br>
      <input type="text" v-model="matches" />
      <button @click="Matches.addMatches(matches);reload();">添加</button>
      <button @click="Matches.deleteMatches(matches);reload();">删除</button>
    </div>
    <div>
      <input type="file" @change="fileChange">
      <button @click="db.upload();reload();">覆盖上传</button>
      <button @click="db.appendUpload();reload();">追加上传</button>
      <br>
      <textarea >{{config}}</textarea>
      <button @click="fetchConfig()">查看配置</button>
      <button @click="db.download()">配置下载</button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import * as Cards from "@/settings/cards";
import * as Matches from "@/settings/matches";
import * as UUs from "@/settings/uids-usernames";
import * as db from "../settings/database";
const mainIf = ref(false);
const cards = ref("");
const uids = ref("");
const matches = ref("");
const config = ref("");
function fileChange(e: any) {
  db.readFile(e.target.files[0])
}
function fetchConfig() {
  config.value = JSON.stringify(db.fetchConfig())
}
function reload() {
  cards.value = ''
  uids.value = ''
  matches.value = ''
  mainIf.value = false;
  mainIf.value = true;
}
GM_registerMenuCommand("展示Vue", () => {
  mainIf.value = !mainIf.value;
});
</script>
<style scoped lang="less">
.main {
  background-color: #000;
  bottom: 6vh;
  color: #777777;
  position: absolute;
  top:10px;
  right:10px;
  z-index: 99999;
}
</style>
