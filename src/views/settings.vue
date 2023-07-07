<template>
    <div class="h-full">
        <!-- Accounts -->
        <div class="flex flex-wrap rounded bg-white m-2 p-2" tabindex="0">
            <div class="model_header">
                <label class="text-gray-700 font-bold text-xl">Accounts Link</label>
                <div class="float-right">
                    <minus v-if="isShowTab(0)" class="border" theme="filled" size="24" fill="#000000" @click="delTab(0)"/>
                    <plus v-else class="border" theme="filled" size="24" fill="#000000" @click="addTab(0)"/>
                </div>
            </div>
            <div class="model_content" v-if="isShowTab(0)">
                <button class="btn text-xs" v-if="!googleLogined" @click="showEvents()">Google LogIn</button>
                <button class="greenBtn" v-else @click="revokeToken()">Google LogOut</button>
            </div>
        </div>
        <!-- recordingTable -->
        <div class="flex flex-wrap rounded bg-white m-2 p-2" tabindex="1">
            <div class="model_header">
                <label class="text-gray-700 font-bold text-xl">Recording Columns</label>
                <div class="float-right">
                    <minus v-if="isShowTab(1)" class="border" theme="filled" size="24" fill="#000000" @click="delTab(1)"/>
                    <plus v-else class="border" theme="filled" size="24" fill="#000000" @click="addTab(1)"/>
                </div>
            </div>
            <div class="model_content" v-if="isShowTab(1)">
                <div class="flex">
                    <span class="w-1/4 text-center">序號</span>
                    <span class="w-1/4 text-center">顯示名稱</span>
                    <span class="w-1/4 text-center">資料型態</span>
                    <div class="w-1/4 text-center">
                        <div @click="addNewRow()">
                            <add-item theme="filled" size="24" fill="#0000FF"/>
                            <span class="text-blue-500">New</span>
                        </div>
                    </div>
                </div>
                <template v-for="item of recordingTable" :key="item.id">
                    <label :for="item.colName" class="text-gray-700 mb2 flex mt-6">
                        <span class="w-1/4 text-center">{{ item.id }}</span>
                        <span v-if="item.id<8" class="w-1/4">{{ item.colName }}</span>
                        <input v-else class="input w-1/4" type="text" v-model="item.colName">
                        <select class="w-1/4" v-model="item.colType">
                            <option value="text">Text</option>
                            <option value="datetime-local">Date</option>
                            <option value="number">Number</option>
                        </select>
                        <div class="w-1/4 text-center">
                            <div class="items-center my-4" v-if="item.id>7" @click="delRow(item.id)">
                                <delete theme="filled" size="24" fill="#FF0000"/>
                                <span class="text-red-500">Delete</span>
                            </div>
                        </div>
                    </label>
                </template>
                <button class="btn font-black w-full my-4 h-20 text-4xl text-center" @click="saveRecordingTable">
                    <save theme="filled" size="36" fill="#000000"/><span>SAVE</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Minus, Plus, Save, AddItem, Delete } from "@icon-park/vue-next";
import { storeSettings, storeGoogleDrive, type recordModule } from '@/store/index';
import { createToaster } from '@meforma/vue-toaster';
import { accessToken, revokeToken } from '@/libs/gDrive';

export default{
    name: "settings",
    components: {
        Minus, Plus, Save, AddItem, Delete
    },
    data() {
        return {
            recordingTable: [] as Array<recordModule> ,
            showTabs: [0,1] as Array<number>
        }
    },
    computed: {
        googleLogined() {
            if (storeSettings().getGDriveToken) {
                return true;
            }
            return false;
        }
    },
    mounted() {
        this.recordingTable = storeSettings().getRecordingTable;
    },
    methods: {
        // 分頁操作
        isShowTab(fromIndex:number) {
            const findIndex = this.showTabs.findIndex(item=> item===fromIndex);
            if (findIndex>=0) return true;
            return false;
        },
        addTab(fromIndex:number) {
            const findIndex = this.showTabs.findIndex(item=> item===fromIndex);
            if (findIndex>=0) return;
            this.showTabs.push(fromIndex);
        },
        delTab(fromIndex:number) {
            const findIndex = this.showTabs.findIndex(item=> item===fromIndex);
            if (findIndex>=0) this.showTabs.splice(findIndex,1);
        },
        // recording Table
        addNewRow() {
            let newObj:recordModule = {
                id: this.recordingTable.length,
                colName:"",
                colType:"text"
            };
            this.recordingTable.push(newObj);
        },
        delRow(fromId:number) {
            const findIndex = this.recordingTable.findIndex(item=>item.id===fromId);
            if (findIndex>=0) this.recordingTable.splice(findIndex,1);
        },
        saveRecordingTable() {
            storeSettings().setRecordingTable(this.recordingTable);
            createToaster().success(`儲存成功`, { position: "top", duration: 2000 });
        },
        // Google Login
        showEvents() {
            if (!storeSettings().getGDriveToken) {
                accessToken();
            } else {
                storeGoogleDrive().cloundToLocalStorage();
            }
        },
        revokeToken() {
            revokeToken();
            createToaster().success(`Log Out!`, { position: "top", duration: 2000 });
        }
    }
}
</script>

<style lang="postcss" scoped>
.model_header {
    @apply w-full text-center my-1;
}
.model_content {
    @apply w-full;
}
</style>