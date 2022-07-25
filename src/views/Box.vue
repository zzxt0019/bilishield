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
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import * as Cards from "@/settings/cards";
import * as Matches from "@/settings/matches";
import * as UUs from "@/settings/uids-usernames";
const mainIf = ref(false);
const cards = ref("");
const uids = ref("");
const matches = ref("");
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
  color: #fff;
  position: fixed;
  z-index: 99999;
}
</style>
