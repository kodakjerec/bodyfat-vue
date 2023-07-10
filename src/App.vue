<template>
  <div class="bg-gray-100 flex flex-col grow h-screen overflow-x-hidden">
    <div id="app_header"></div>
    <!-- nowLoading -->
    <div v-if="nowLoading" class="absolute w-full h-screen bg-slate-100 opacity-90 z-10">
      <div class="inset-x-20 top-1/2 absolute font-black text-2xl">{{ loadingMessage }}</div>
    </div>
    <!-- Content -->
    <div id="app_content" class="calHeight w-full">
      <router-view v-if="nowPath === 'home'" name="home" @fromClick="(path) => nowPath = path" />
      <router-view v-if="nowPath === 'settings'" name="settings" @fromClick="(path) => nowPath = path" />
      <router-view v-if="nowPath === 'calendar'" name="calendar" @fromClick="(path) => nowPath = path" />
      <router-view v-if="nowPath === 'chart'" name="chart" @fromClick="(path) => nowPath = path" />
    </div>
    <div id="app_footer" class="sticky bottom-0 w-full flex">
      <div class="btn w-1/4 flex" @click="gotoPath('home')">
        <home theme="filled" size="24" fill="#000000"/><span>首頁</span>
      </div>
      <div class="btn w-1/4 flex" @click="gotoPath('calendar')">
        <calendarDot theme="filled" size="24" fill="#000000"/><span>日曆</span>
      </div>
      <div class="btn w-1/4 flex" @click="gotoPath('chart')">
        <chartHistogram theme="filled" size="24" fill="#000000"/><span>圖表</span>
      </div>
      <div class="btn w-1/4 flex" @click="gotoPath('settings')">
        <setting theme="filled" size="24" fill="#000000"/><span>設定</span></div>
    </div>
  </div>
</template>
<script lang="ts">
import { Home, CalendarDot, ChartHistogram, Setting } from "@icon-park/vue-next";
import { storeSettings, storeGoogleDrive } from '@/store/index';

export default {
  name: 'App',
  components: {
    Home, CalendarDot, ChartHistogram, Setting
  },
  data() {
    return {
      nowPath: 'home',
      nowLoading: false,
      loadingMessage: "",
      lastActiveTime: null
    }
  },
  async mounted() {
    storeSettings().getBodyFatDataList;
    const token = storeSettings().getGDriveToken;

    if (token) {
      this.nowLoading = true;
      this.loadingMessage = "Loading cloud data.";
      await storeGoogleDrive().cloundToLocalStorage();
      this.nowLoading = false;
      this.loadingMessage = "";
    }
    
    const lastPath = storeSettings().getLastPath;
    if (lastPath) {
      this.nowPath = lastPath;
    }
  },
  methods: {
    gotoPath(path: string) {
      this.nowPath = path;
      storeSettings().setLastPath(this.nowPath);
    }
  }
}
</script>
<style>
html,
body,
#app {
  height: 100%;
}

.calHeight {
    height: calc(100vh - 42px);
}
</style>
