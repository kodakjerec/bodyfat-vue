<template>
    <div class="">
        <!-- language -->
        <div class="flex flex-wrap rounded appSecondColor m-2" tabindex="8">
            <div class="model_header">
                <label class="text-gray-700 font-bold text-xl">{{ $t("_settings_block_language") }}</label>
                <div class="float-right">
                    <minus v-if="isShowTab(8)" theme="filled" size="24" fill="#000000" @click="delTab(8)" />
                    <plus v-else theme="filled" size="24" fill="#000000" @click="addTab(8)" />
                </div>
            </div>
            <div class="model_content" v-if="isShowTab(8)">
                <selectLanguage></selectLanguage>
            </div>
        </div>
        <!-- recordingTable -->
        <div class="flex flex-wrap rounded appSecondColor m-2" tabindex="9">
            <div class="model_header">
                <label class="text-gray-700 font-bold text-xl">{{ $t("_settings_block_recordingColumns") }}</label>
                <div class="float-right">
                    <minus v-if="isShowTab(9)" theme="filled" size="24" fill="#000000" @click="delTab(9)" />
                    <plus v-else theme="filled" size="24" fill="#000000" @click="addTab(9)" />
                </div>
            </div>
            <div class="model_content" v-if="isShowTab(9)">
                <div class="flex">
                    <span class="w-1/4 text-center"></span>
                    <span class="w-1/4 text-center">顯示名稱</span>
                    <span class="w-1/4 text-center">資料型態</span>
                    <div class="w-1/4 text-center">
                        <div @click="addNewRow()">
                            <add-item theme="filled" size="24" fill="#0000FF" />
                            <span class="text-blue-500">New</span>
                        </div>
                    </div>
                </div>
                <template v-for="item of recordingTable" :key="item.id">
                    <label :for="item.colName" class="text-gray-700 flex m-3 h-6">
                        <span class="w-1/6 text-center self-center">
                            <icon-number :fromId="item.id"></icon-number>
                        </span>
                        <span v-if="item.id < 8" class="w-1/3 text-center">{{ item.colName }}</span>
                        <input v-else class="input w-1/3 self-center" type="text" v-model="item.colName" @change="saveRecordingTable()">
                        <select class="w-1/3 select" v-model="item.colType" @change="saveRecordingTable()">
                            <option value="text">Text</option>
                            <option value="datetime-local">Date</option>
                            <option value="number">Number</option>
                        </select>
                        <div class="w-1/6 text-center">
                            <div class="items-center" v-if="item.id > 7" @click="delRow(item.id)">
                                <delete theme="filled" size="22" fill="#FF0000" />
                            </div>
                        </div>
                    </label>
                </template>
            </div>
        </div>
        <!-- Others -->
        <div class="flex flex-wrap rounded appSecondColor m-2" tabindex="10">
            <div class="model_header">
                <label class="text-gray-700 font-bold text-xl">{{ $t("_settings_block_others") }}</label>
                <div class="float-right">
                    <minus v-if="isShowTab(10)" theme="filled" size="24" fill="#000000" @click="delTab(10)" />
                    <plus v-else theme="filled" size="24" fill="#000000" @click="addTab(10)" />
                </div>
            </div>
            <div class="model_content" v-if="isShowTab(10)">
                <div class="flex justify-center">
                    <button class="inAppBtn m-2" @click="restAll">
                        <refresh theme="filled" size="24" fill="#000000" /><span>{{ $t('_reset') }}</span>
                    </button>
                </div>
            </div>
        </div>
        <a target="_blank" href="/privacy_chinese.md" aria-label="privacy">{{ $t('_privacy') }}</a>
        <a></a>
    </div>
</template>

<script lang="ts">
import { storageClear, storeSettings, type recordModule } from "@/store/index";
import { AddItem, Delete, Minus, Plus, Refresh } from "@icon-park/vue-next";
import { createToaster } from "@meforma/vue-toaster";
import iconNumber from "./components/iconNumber.vue";
import selectLanguage from "./components/selectLanguage.vue";

export default {
    name: "settings",
    components: {
        Minus, Plus, AddItem, Delete, Refresh,
        iconNumber, selectLanguage
    },
    data() {
        return {
            recordingTable: [] as Array<recordModule>,
            showTabs: [8, 9, 10] as Array<number>
        }
    },
    async mounted() {
        this.recordingTable = await storeSettings().getRecordingTable;
    },
    methods: {
        // 分頁操作
        isShowTab(fromIndex: number) {
            const findIndex = this.showTabs.findIndex(item => item === fromIndex);
            if (findIndex >= 0) return true;
            return false;
        },
        addTab(fromIndex: number) {
            const findIndex = this.showTabs.findIndex(item => item === fromIndex);
            if (findIndex >= 0) return;
            this.showTabs.push(fromIndex);
        },
        delTab(fromIndex: number) {
            const findIndex = this.showTabs.findIndex(item => item === fromIndex);
            if (findIndex >= 0) this.showTabs.splice(findIndex, 1);
        },
        // recording Table
        addNewRow() {
            let newObj: recordModule = {
                id: this.recordingTable.length,
                colName: "",
                colType: "text"
            };
            this.recordingTable.push(newObj);
            this.saveRecordingTable();
        },
        delRow(fromId: number) {
            const findIndex = this.recordingTable.findIndex(item => item.id === fromId);
            if (findIndex >= 0) this.recordingTable.splice(findIndex, 1);
            this.saveRecordingTable(this.$t("_delete_success"));
        },
        saveRecordingTable(msg: string = this.$t("_save_success")) {
            storeSettings().setRecordingTable(this.recordingTable);
            createToaster().success(msg, { position: "top" });
        },
        async restAll() {
            storageClear();
            this.recordingTable = await storeSettings().getRecordingTableDefault;
            this.saveRecordingTable(this.$t("_settings_resetAll"));
        }
    }
}
</script>