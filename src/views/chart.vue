<template>
    <!-- search -->
    <div id="search_content" class="m-2">
        <div>
            <label class="text-gray-700 flex items-center">
                <span class="label-xl text-base w-1/6">日期區間</span>
                <input type="date" class="input text-base w-1/3" v-model="startDate" :max="today">
                <span>~</span>
                <input type="date" class="input text-base w-1/3" v-model="endDate" :max="today">
            </label>
        </div>
    </div>
    <!-- diagram -->
    <eChart1 class="h-5/6" :fromData="filteredList"></eChart1>
</template>

<script lang="ts">
import { storeSettings } from '@/store'
import dayjs from 'dayjs';
import eChart1 from './components/eChart1.vue'
export default {
    name: "chart",
    components: {
        eChart1
    },
    data() {
        return {
            startDate: "",
            endDate: "",
            today: ""
        }
    },
    computed: {
        filteredList() {
            const tempList = storeSettings().getBodyFatDataList;
            const startDateTime = new Date(this.startDate+"T00:00:00").getTime();
            const endDateTime = new Date(this.endDate+"T23:59:59").getTime();
            const result:Array<any> = tempList.filter(row=>{
                const rowDateTime = new Date(row['日期']).getTime();
                // compare date
                if (startDateTime<rowDateTime && rowDateTime<endDateTime)
                    return row;
            })

            return result;
        }
    },
    mounted() {
        this.startDate = dayjs((new Date()).setDate(-7)).format("YYYY-MM-DD");
        this.endDate = dayjs(new Date()).format("YYYY-MM-DD");
        this.today = this.endDate;
    }
}
</script>