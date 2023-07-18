<template>
    <div class="">
        <!-- recordingTable -->
        <div class="flex flex-wrap rounded bg-white m-2 p-2" tabindex="1">
            <div class="model_header">
                <label class="text-gray-700 font-bold text-xl">Recording Columns</label>
                <div class="float-right">
                    <minus v-if="isShowTab(1)" theme="filled" size="24" fill="#000000" @click="delTab(1)" />
                    <plus v-else theme="filled" size="24" fill="#000000" @click="addTab(1)" />
                </div>
            </div>
            <div class="model_content" v-if="isShowTab(1)">
                <div class="flex">
                    <span class="w-1/4 text-center">序號</span>
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
                        <select class="w-1/3" v-model="item.colType" @change="saveRecordingTable()">
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
                <div class="flex justify-center">
                    <div class="btn w-12" @click="resetRecordingTable">預設</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Minus, Plus, AddItem, Delete } from "@icon-park/vue-next";
import { storeSettings, type recordModule } from '@/store/index';
import { createToaster } from '@meforma/vue-toaster';
import iconNumber from "./components/iconNumber.vue";

export default {
    name: "settings",
    components: {
        Minus, Plus, AddItem, Delete,
        iconNumber
    },
    data() {
        return {
            recordingTable: [] as Array<recordModule>,
            showTabs: [0, 1] as Array<number>
        }
    },
    mounted() {
        this.recordingTable = storeSettings().getRecordingTable;
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
            this.saveRecordingTable(`刪除成功`);
        },
        saveRecordingTable(msg: string = `儲存成功`) {
            storeSettings().setRecordingTable(this.recordingTable);
            createToaster().success(msg, { position: "top", duration: 1000 });
        },
        resetRecordingTable() {
            this.recordingTable = storeSettings().getRecordingTableDefault;
            this.saveRecordingTable(`還原預設`);
        }
    }
}
</script>