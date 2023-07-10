<template>
    <div class="h-full">
        <div class="flex justify-center items-center">
            <p class="text-2xl font-bold text-center mt-2">體脂紀錄</p>
            <weight theme="filled" size="24" fill="#000000" @click="randomValue"/>
        </div>
        <template v-for="item of recordingTable" :key="item.id">
            <label :for="item.colName" class="text-gray-700 flex mt-2">
                <span class="label-xl w-1/3">{{ item.colName }}</span>
                <input v-if="item.colType==='datetime-local'" :id="item.colName" class="input text-lg w-1/2" v-model="recorder[item.colName]" @focus="inputFocus($event)" :disabled="saving">
                <input v-else :type="item.colType" :id="item.colName" class="input w-1/2" v-model="recorder[item.colName]" @focus="inputFocus($event)" :disabled="saving">
            </label>
        </template>
        <button class="btn font-black w-full my-4 h-20 text-4xl text-center" @click="save" :disabled="saving">
            <save theme="filled" size="36" fill="#000000"/><span>SAVE</span>
        </button>
    </div>
</template>
<script lang="ts">
import { Save, Weight } from "@icon-park/vue-next";
import { storeSettings, type recordModule } from '@/store';
import { createToaster } from '@meforma/vue-toaster';
import dayjs from 'dayjs';

export default {
    name: 'home',
    components: {
        Save, Weight
    },
    data() {
        return {
            recordingTable: [] as Array<recordModule> ,
            recorder: {} as Object,
            saving: false
        }
    },
    mounted() {
        this.recordingTable = storeSettings().getRecordingTable;
        this.reset();
    },
    methods: {
        reset() {
            this.recordingTable.map((item)=>{
                switch(item.colType) {
                    case "text":
                        this.recorder[item.colName]="";break;
                    case "number":
                        this.recorder[item.colName]=0;break;
                    case "datetime-local":
                        this.recorder[item.colName]=dayjs().format("YYYY-MM-DDTHH:mm");break;
                }
            })
        },
        randomValue() {
            // randomText
            let result = '';
            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            for(let i=0; i<length; i++){
                result += letters.charAt(Math.floor(Math.random() * letters.length));
            }
            
            // randomDate
            const endDate = new Date();
            const startDate = new Date();

            // 設置startDate為前7天
            startDate.setDate(startDate.getDate() - 7);

            const randomDate= new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
            
            const year = randomDate.getFullYear();
            const month = randomDate.getMonth() + 1; // getMonth() 從 0 開始計數，所以要 + 1。
            const date = randomDate.getDate();
            const hour = randomDate.getHours();
            const minute = randomDate.getMinutes();
            const resultDate = `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

            this.recordingTable.map((item)=>{
                switch(item.colType) {
                    case "text":
                        this.recorder[item.colName]=result;break;
                    case "number":
                        this.recorder[item.colName]=Math.round(Math.random() * 200);break;
                    case "datetime-local":
                        this.recorder[item.colName]=dayjs(resultDate).format("YYYY-MM-DDTHH:mm");break;
                }
            })
        },
        save() {
            this.saving = true;
            let errorMsg = "";
            if (!this.recorder["日期"]) {
                errorMsg = "日期為必要輸入欄位";
            }

            if(errorMsg.length>0) {
                createToaster().error(errorMsg, { position: "top", duration: 2000 });
                return;
            }
            
            storeSettings().nowLoading = "Loading";
            storeSettings().insertBodyFatDatalist(this.recorder);
            createToaster().success(`儲存成功`, { position: "top", duration: 1000, onClose: () => {
                this.saving = false;
                this.reset();
                storeSettings().nowLoading = "";
            } });
        },
        inputFocus(event:any) {
            event.target.select();
        }
    }
}
</script>