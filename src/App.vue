<template>
  <div class="bg-gray-100 flex h-screen overflow-x-hidden">
    <!-- shadow -->
    <div v-if="sidebarActive" class="absolute w-full h-screen bg-slate-100 opacity-60 z-10"></div>
    <!-- nowLoading -->
    <div v-if="nowLoading" class="absolute w-full h-screen bg-slate-100 opacity-90 z-10">
      <div class="inset-x-20 top-1/2 absolute font-black text-2xl">{{ loadingMessage }}</div>
    </div>
    <!-- Content -->
    <div class="w-full">
      <router-view v-if="nowPath === 'home'" name="home" @fromClick="(path) => nowPath = path" />
      <router-view v-if="nowPath === 'settings'" name="settings" @fromClick="(path) => nowPath = path" />
      <router-view v-if="nowPath === 'calendar'" name="calendar" @fromClick="(path) => nowPath = path" />
    </div>
  </div>
  <div>
    <div id="footer" class="absolute bottom-0 w-full bg-white flex">
      <div class="btn w-1/4 flex" @click="gotoPath('home')">
        <home theme="filled" size="24" fill="#000000"/><span>首頁</span>
      </div>
      <div class="btn w-1/4 flex" @click="gotoPath('calendar')">
        <calendarDot theme="filled" size="24" fill="#000000"/><span>日曆</span>
      </div>
      <div class="btn w-1/4 flex">
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
      sidebarActive: false,
      nowLoading: false,
      loadingMessage: "",
      lastActiveTime: null
    }
  },
  async mounted() {
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
    },
    /**
     * click sidebar
     */
    toggleSidebar() {
      if (!this.sidebarActive) {
        if (this.$refs.sidebar)
          (this.$refs.sidebar as HTMLBodyElement).focus();
      }
      this.sidebarActive = !this.sidebarActive;
    },
    /**
     * close sidebar
     */
    closeSidebar() {
      this.sidebarActive = false;
    },
    /**
     * Refresh the screen after being idle for a long time
     */
    handlePageFocus() {
      const lastActiveTime: number = Number(this.lastActiveTime ?? new Date().getTime());
      const currentTime: number = new Date().getTime();
      const timeDiff: number = currentTime - lastActiveTime;
      this.lastActiveTime = currentTime;
      // 如果背景中放置的時間超過指定時間，就重新載入頁面
      if (timeDiff > 60 * 60 * 1000) { // 60 分鐘
        location.reload();
      }
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

/* Default sidebar styles */
.sidebar {
  width: 200px;
  height: 100%;
  position: fixed;
  top: 0;
  left: -200px;
  z-index: 999;
  transition: transform 0.3s ease-in-out;
}

/* Default sidebar hide */
.sidebar-toggle+.sidebar {
  transform: translateX(-200px);
}


/* sidebar active */
.sidebar.active {
  transform: translateX(200px);
}
</style>
