
<template>
    <div>
        <div class="fixed left-0 top-0 w-full h-full bg-slate-100 opacity-90" @click="clickWhiteSpace">
        </div>
        <div class="fixed top-10 w-full text-center px-6">
            <div class="p-2 bg-white rounded border border-black" :class="{ 'shockWindow': shockWindow }">
                <div id="model_header" class="relative justify-center">
                    <p class="text-2xl font-bold mt-2 text-center">{{ myTitle }}</p>
                    <close class="absolute top-0 right-0" theme="two-tone" size="24" :fill="['#fff' ,'#000']" @click="closeDialog('')" />
                </div>
                <div id="model_content">
                    <template v-for="item of recordingTable" :key="item.id">
                        <label :for="item.colName" class="text-gray-700 flex mt-2">
                            <span class="label-xl w-1/3">{{ item.colName }}</span>
                            <input v-if="item.colType === 'datetime-local'" :id="item.colName" class="input text-lg w-1/2" v-model="recorder[item.colName]" @focus="inputFocus($event)" disabled>
                            <input v-else :type="item.colType" :id="item.colName" class="input w-1/2" v-model="recorder[item.colName]" @focus="inputFocus($event)" disabled>
                        </label>
                    </template>
                </div>
                <div id="model_footer">
                    <div class="m-2" @click="deleteItem">
                        <delete theme="two-tone" size="24" fill="#FF0000" />
                        <span class="text-red-500">Delete</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Close, Delete } from "@icon-park/vue-next";
import { storeSettings, type recordModule } from '@/store'

export default {
    name: "calendarDialog",
    components: {
        Close, Delete
    },
    props: {
        title: {
            type: String,
            default: "體脂紀錄"
        },
        fromData: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            myTitle: this.title,
            recordingTable: [] as Array<recordModule>,
            recorder: {} as Object,
            shockWindow: false
        }
    },
    mounted() {
        this.recordingTable = storeSettings().getRecordingTable;
        this.recorder = this.fromData;
    },
    methods: {
        // 關閉視窗
        closeDialog(event) {
            this.$emit('close', event);
        },
        // 按到白色區域, 震動視窗
        // TODO 現在會順便關閉視窗
        clickWhiteSpace() {
            this.shockWindow = true;

            setTimeout(() => {
                this.shockWindow = false;
                this.myTitle = "一秒後關閉視窗";
            }, 50);

            setTimeout(() => {
                this.closeDialog("");
            }, 1000);
        },
        // 刪除資料
        async deleteItem() {
            const result = await this.$swal({
                title: '刪除此筆紀錄？',
                showCancelButton: true,
                confirmButtonText: 'Ok'
            });

            if (result.isConfirmed) {
                this.$emit('delete', this.fromData.id);
            }
        },
        inputFocus(event: any) {
            event.target.select();
        }
    }
}
</script>

<style lang="scss" scoped>
.shockWindow {
    @apply m-1;
}
</style>