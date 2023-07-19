<template>
  <div class="appBgColor flex flex-col grow h-screen overflow-x-hidden">
    <div id="app_header"></div>
    <!-- nowLoading -->
    <div v-if="nowLoading" class="absolute w-full h-screen bg-slate-100 opacity-90 z-10">
      <div class="inset-x-20 top-1/2 absolute font-black text-2xl text-center">{{ nowLoading }}</div>
    </div>
    <!-- Content -->
    <div id="app_content" class="calHeight w-full overflow-y-scroll">
      <accounts v-show="nowPath === 'settings'"></accounts>
      <router-view v-if="nowPath === 'home'" name="home" />
      <router-view v-if="nowPath === 'calendar'" name="calendar" />
      <router-view v-if="nowPath === 'chart'" name="chart" />
      <router-view v-if="nowPath === 'settings'" name="settings" />
    </div>
    <div id="app_footer" class="sticky bottom-0 w-full flex">
      <div class="appFooterBtn w-1/4 flex" @click="gotoPath('home')" id="btn_home">
        <home theme="two-tone" size="24" :fill="['#fff' ,'#6D28D9']"/><span>{{ $t("_app_footer_home") }}</span>
      </div>
      <div class="appFooterBtn w-1/4 flex" @click="gotoPath('calendar')" id="btn_calendar">
        <calendarDot theme="two-tone" size="24" :fill="['#fff' ,'#6D28D9']"/><span>{{ $t("_app_footer_calendar") }}</span>
      </div>
      <div class="appFooterBtn w-1/4 flex" @click="gotoPath('chart')" id="btn_chart">
        <chartHistogram theme="two-tone" size="24" :fill="['#fff' ,'#6D28D9']"/><span>{{ $t("_app_footer_chart") }}</span>
      </div>
      <div class="appFooterBtn w-1/4 flex" @click="gotoPath('settings')" id="btn_settings">
        <setting theme="two-tone" size="24" :fill="['#fff' ,'#6D28D9']"/><span>{{ $t("_app_footer_settings") }}</span>
      </div>
    </div>
    <select-language v-if="divIsIntro" v-show="introStepNow===0"></select-language>
  </div>
</template>
<script lang="ts">
import { Home, CalendarDot, ChartHistogram, Setting } from "@icon-park/vue-next";
import { storageDebug, storeSettings } from "@/store/index";
import accounts from "./views/accounts.vue";
import selectLanguage from "./views/components/selectLanguage.vue";

export default {
  name: "App",
  components: {
    Home, CalendarDot, ChartHistogram, Setting,
    accounts, selectLanguage
  },
  data() {
    return {
      nowPath: "home",
      lastActiveTime: null,
      introOption: {
	    // 这里是更换成中文（默认英文）
	    prevLabel: this.$t("_prev"),
	    nextLabel: this.$t("_next"),
	    skipLabel: this.$t("_skip"),
	    doneLabel: this.$t("_done"),
	    /* 引导说明框相对高亮说明区域的位置 */
	    tooltipPosition: "top",
	    /* 引导说明文本框的样式 */
	    tooltipClass: "intro-tooltip",
	    /* 说明高亮区域的样式 */
	    highlightClass: "intro-highlight",
	    /* 是否使用键盘Esc退出 */
	    exitOnEsc: true,
	    /* 是否允许点击空白处退出 */
	    exitOnOverlayClick: false,
	    /* 提示边框的padding */
	    helperElementPadding: 2,
	    /* 是否显示说明的数据步骤 */
	    showStepNumbers: true,
	    /* 是否允许键盘来操作 */
	    keyboardNavigation: true,
	    /* 是否按键来操作 */
	    showButtons: true,
	    /* 是否使用点显示进度 */
	    showBullets: false,
	    /* 是否显示进度条 */
	    showProgress: false,
	    /* 是否滑动到高亮的区域 */
	    scrollToElement: true,
	    /* 遮罩层的透明度 */
	    overlayOpacity: 0.3,
	    /* 当位置选择自动的时候，位置排列的优先级 */
	    positionPrecedence: ["bottom", "top", "right", "left"],
	    /* 是否禁止与元素的相互关联 */
	    disableInteraction: false,
	    /* 是否在第一步隐藏上一步 */
	    // hidePrev: true,
	    /* 是否在最后一步隐藏下一步 */
	    // hideNext: true,
	    /* steps步骤，可以写个工具类保存起来 */
	    steps: [],
      }, // 参数对象
      introStepNow: 0
    }
  },
  computed: {
    nowLoading() {
      return storeSettings().nowLoading;
    },
    divIsIntro() {
      return storeSettings().isIntro;
    }
  },
  async mounted() {
    await storeSettings().getBodyFatDataList;
    await storeSettings().getLastPath;
    await storeSettings().getIsIntro;
    
    const lastPath = storeSettings().lastPath;
    this.nowPath = lastPath;
    
    const isIntro = storeSettings().isIntro;
    if (isIntro) {
      this.initGuide();
    }
  },
  inject: ["intro"],
  methods: {
    gotoPath(path: string) {
      this.nowPath = path;
      storeSettings().setLastPath(this.nowPath);
    },
    initGuide() {
      this.gotoPath("home");
      // 绑定标签元素的选择器数组
      this.introOption.steps = [
        {
          title: "Welcome",
          element: "#chooseLanguage",
          intro: "Select Your Preferred Language",
        },
        {
          element: "#btn_home",
          intro: this.$t("_intro_step1")+"💪",
        },
        {
          element: "#btn_calendar",
          intro: this.$t("_intro_step2")+"🧐",
        },
        {
          element: "#btn_chart",
          intro: this.$t("_intro_step3") +"😘",
        },
        {
          element: "#btn_settings",
          intro: this.$t("_intro_step4")+"☁️",
        },
      ]
      this.intro
          .setOptions(this.introOption)
          .onbeforechange((event)=>{
            switch(event.id) {
              case "chooseLanguage":
                this.introStepNow = 0;break;
              case "btn_home":
                this.introStepNow = 1;
                this.gotoPath("home");break;
              case "btn_calendar":
                this.introStepNow = 2;
                this.gotoPath("calendar");break;
              case "btn_chart":
                this.introStepNow = 3;
                this.gotoPath("chart");break;
              case "btn_settings":
                this.introStepNow = 4;
                this.gotoPath("settings");break;
            }
          })
          // 点击结束按钮后执行的事件
          .oncomplete(() => {
            storeSettings().setIsIntro(false);
            // console.log("点击结束按钮后执行的事件")
          })
          // 点击跳过按钮后执行的事件
          .onexit(() => {
            storeSettings().setIsIntro(false);
            // console.log("点击跳过按钮后执行的事件")
          })
          // 确认完毕之后执行的事件
          .onbeforeexit(() => {
            storeSettings().setIsIntro(false);
            // console.log("确认完毕之后执行的事件")
          })
          .start()
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
