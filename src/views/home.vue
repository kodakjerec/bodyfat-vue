<template>
    <div class="">
        <div class="flex justify-center items-center">
            <p class="text-2xl font-bold text-center mt-2">{{ $t("_bodyFatRecorder") }}</p>
            <weight theme="filled" size="24" fill="#000000" @click="randomValue" />
        </div>
        <template v-for="item of recordingTable" :key="item.id">
            <label :for="item.colName" class="text-gray-700 flex mt-1 items-center px-2">
                <span class="">
                    <icon-number :fromId="item.id"></icon-number>
                </span>
                <span class="label-xl w-1/3">{{ item.colName }}</span>
                <input v-if="item.colType === 'datetime-local'" :type="item.colType" :id="item.colName" class="input py-2 text-lg w-1/2" v-model="recorder[item.id]" @focus="inputFocus($event)" :disabled="saving">
                <input v-else :type="item.colType" :id="item.colName" class="input py-2 w-1/2" v-model="recorder[item.id]" @focus="inputFocus($event)" :disabled="saving">
            </label>
        </template>
        <div class="flex justify-center mt-2">
            <button class="inAppBtn" @click="save" :disabled="saving">
                <save theme="filled" size="24" fill="#000000" /><span>Save</span>
            </button>
        </div>
    </div>
</template>
<script lang="ts">
import { Save, Weight } from "@icon-park/vue-next";
import { storeSettings, type recordModule } from "@/store";
import { createToaster } from "@meforma/vue-toaster";
import iconNumber from "./components/iconNumber.vue";
import dayjs from "dayjs";

export default {
    name: "home",
    components: {
        Save, Weight,
        iconNumber
    },
    data() {
        return {
            recordingTable: [] as Array<recordModule>,
            recorder: {} as Object,
            saving: false
        }
    },
    async mounted() {
        this.recordingTable = await storeSettings().getRecordingTable;
        this.reset();
    },
    methods: {
        reset() {
            this.recordingTable.map((item) => {
                switch (item.colType) {
                    case "text":
                        this.recorder[item.id] = ""; break;
                    case "number":
                        this.recorder[item.id] = 0; break;
                    case "datetime-local":
                        this.recorder[item.id] = dayjs().format("YYYY-MM-DDTHH:mm"); break;
                }
            })
        },
        randomValue() {
            // randomText
            let result = "";
            const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            for (let i = 0; i < length; i++) {
                result += letters.charAt(Math.floor(Math.random() * letters.length));
            }

            // randomDate
            const endDate = new Date();
            const startDate = new Date();

            // 設置startDate為前7天
            startDate.setDate(startDate.getDate() - 7);

            const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));

            const year = randomDate.getFullYear();
            const month = randomDate.getMonth() + 1; // getMonth() 從 0 開始計數，所以要 + 1。
            const date = randomDate.getDate();
            const hour = randomDate.getHours();
            const minute = randomDate.getMinutes();
            const resultDate = `${year}-${month.toString().padStart(2, "0")}-${date.toString().padStart(2, "0")}T${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

            this.recordingTable.map((item) => {
                switch (item.colType) {
                    case "text":
                        this.recorder[item.id] = result; break;
                    case "number":
                        this.recorder[item.id] = Math.round(Math.random() * 200); break;
                    case "datetime-local":
                        this.recorder[item.id] = dayjs(resultDate).format("YYYY-MM-DDTHH:mm"); break;
                }
            })
        },
        save() {
            this.saving = true;
            let errorMsg = "";
            if (!this.recorder["0"]) {
                errorMsg = this.$t("_col_date_errorMsg1");
            }

            if (errorMsg.length > 0) {
                createToaster().error(errorMsg, { position: "top", duration: 2000 });
                return;
            }

            storeSettings().nowLoading = this.$t("_home_save");
            storeSettings().insertBodyFatDatalist(this.recorder);
        },
        inputFocus(event: any) {
            event.target.select();
        }
    }
}
</script>