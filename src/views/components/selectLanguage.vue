<template>
    <!-- Language -->
    <div v-if="divIsIntro" class="absolute top-1/2 w-full flex items-center appBgColor" id="chooseLanguage">
        <button class="inAppBtn flex-1 m-2" @click="changeLang('zh-TW')">🌏中文</button>
        <button class="inAppBtn flex-1 m-2" @click="changeLang('en-US')">🌎English</button>
    </div>
    <div v-else class="flex w-full">
        <button class="inAppBtn flex-1 m-2" @click="changeLang('zh-TW')">🌏中文</button>
        <button class="inAppBtn flex-1 m-2" @click="changeLang('en-US')">🌎English</button>
    </div>
</template>

<script lang="ts">
import { storeSettings } from "@/store";
import i18n, { changeLanguage, getDictionary } from "@/libs/i18n";

export default {
    name: "selectLanguage",
    computed: {
        divIsIntro() {
        return storeSettings().isIntro;
        }
    },
    methods: {   
        changeLang(newLang: string) {
            let oldLang = i18n.global.locale;
            changeLanguage(newLang);
            storeSettings().setLang(newLang);
            // 欄位名稱還有中文, 要替換成當地語系, bind:recordingTable, bodyFatRecord
            let oldRecordingTable = storeSettings().getRecordingTable;
            const oldDicTable = getDictionary(oldLang);
            const newDicTable = getDictionary(newLang);
            Object.entries(oldDicTable).map(([key, value])=>{
                oldRecordingTable.map(row=>{
                    if (value === row['colName']) {
                        row['colName'] = newDicTable[key];
                    }
                })
            })
            // 儲存
            storeSettings().setRecordingTable(oldRecordingTable);

            // refresh
            this.$router.go(0);
        }
    }
}
</script>