<template>
    <div class="">
        <p class="text-2xl font-bold text-center mt-2">體脂紀錄</p>
        <template v-for="item of recordingTable" :key="item.id">
            <label :for="item.colName" class="text-gray-700 mb2 flex mt-6">
                <span class="label-2xl w-1/3">{{ item.colName }}</span>
                <input :type="item.colType" :id="item.colName" class="input w-1/2" v-model="recorder[item.colName]">
            </label>
        </template>
        <button class="btn font-black w-full my-10 h-20 text-4xl text-center" @click="save">
            <span>S&nbsp;A&nbsp;V&nbsp;E</span>
        </button>
    </div>
</template>
<script lang="ts">
import { storeSettings, type recordModule } from '@/store';
import { createToaster } from '@meforma/vue-toaster';
import * as dayjs from 'dayjs'

export default {
    name: 'home',
    data() {
        return {
            recordingTable: [] as Array<recordModule> ,
            recorder: {} as Object
        }
    },
    mounted() {
        this.recordingTable = storeSettings().getRecordingTable;
        this.recordingTable.map((item)=>{
            switch(item.colType) {
                case "text":
                    this.recorder[item.colName]="";break;
                case "number":
                    this.recorder[item.colName]=0;break;
                case "datetime-local":
                    this.recorder[item.colName]=dayjs().format().substring(0,16);break;
            }
        })
    },
    methods: {
        save() {
            let errorMsg = "";
            if (!this.recorder["日期"]) {
                errorMsg = "日期為必要輸入欄位";
            }

            if(errorMsg.length>0) {
                createToaster().error(errorMsg, { position: "top", duration: 2000 });
            }
            
            storeSettings().insertBodyFatDatalist(this.recorder);
            createToaster().success(`儲存成功`, { position: "top", duration: 2000 });
        }
    }
}
</script>