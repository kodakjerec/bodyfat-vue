<template>
    <!-- Language -->
    <div v-if="divIsIntro" class="absolute top-1/2 w-full flex items-center appBgColor" id="chooseLanguage">
        <button class="inAppBtn flex-1 m-2" @click="changeLang('zh-TW')">中文</button>
        <button class="inAppBtn flex-1 m-2" @click="changeLang('en-US')">English</button>
    </div>
    <div v-else class="flex w-full">
        <button class="inAppBtn flex-1 m-2" @click="changeLang('zh-TW')">中文</button>
        <button class="inAppBtn flex-1 m-2" @click="changeLang('en-US')">English</button>
    </div>
</template>

<script lang="ts">
import { storeSettings } from '@/store';
import { changeLanguage } from '@/libs/i18n';

export default {
    name: "selectLanguage",
    computed: {
        divIsIntro() {
        return storeSettings().getIsIntro;
        }
    },
    methods: {   
        changeLang(lang: string) {
            changeLanguage(lang);
            storeSettings().setLang(lang);
            this.$router.go(0)
        }
    }
}
</script>