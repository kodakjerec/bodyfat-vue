<template>
    <div class="">
        <p class="text-2xl font-bold text-center">體脂紀錄</p>
        <div v-for="(value, index) of Object.entries(recordingTable)" :key="index">
            <label :for="value[0]" class="text-gray-700 mb2 flex mt-6">
                <span class="label w-1/3">{{ value[0] }}</span>
                <input type="number" :id="value[0]" class="input w-1/2" v-model="recordingTable[value[0]]">
            </label>
        </div>
        <button class="btn font-black w-3/4 m-10 h-20 text-4xl text-center" @click="save">
            <span>S&nbsp;A&nbsp;V&nbsp;E</span>
        </button>
    </div>
</template>
<script lang="ts">
import { storeSettings } from '@/store';
import { createToaster } from '@meforma/vue-toaster';

export default {
    name: 'home',
    data() {
        return {
            recordingTable: {}
        }
    },
    mounted() {
        this.recordingTable = storeSettings().getRecordingTable;
    },
    methods: {
        save() {
            let errorMsg = "";
            if (!this.recordingTable["日期"]) {
                errorMsg = "日期為必要輸入欄位";
            }

            if(errorMsg.length>0) {
                createToaster().error(errorMsg, { position: "top", duration: 2000 });
            }
        }
    }
}
</script>