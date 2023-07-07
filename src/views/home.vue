<template>
    <div class="h-full">
        <p class="text-2xl font-bold text-center mt-2">體脂紀錄</p>
        <template v-for="item of recordingTable" :key="item.id">
            <label :for="item.colName" class="text-gray-700 mb2 flex mt-2">
                <span class="label-xl w-1/3">{{ item.colName }}</span>
                <input v-if="item.colType==='datetime-local'" :id="item.colName" class="input text-lg w-1/2" v-model="recorder[item.colName]" @focus="$event.target?.select()">
                <input v-else :type="item.colType" :id="item.colName" class="input w-1/2" v-model="recorder[item.colName]" @focus="$event.target?.select()">
            </label>
        </template>
        <button class="btn font-black w-full my-4 h-20 text-4xl text-center" @click="save">
            <save theme="filled" size="36" fill="#000000"/><span>SAVE</span>
        </button>
    </div>
</template>
<script lang="ts">
import { Save } from "@icon-park/vue-next";
import { storeSettings, type recordModule } from '@/store';
import { createToaster } from '@meforma/vue-toaster';
import * as dayjs from 'dayjs'

export default {
    name: 'home',
    components: {
        Save
    },
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