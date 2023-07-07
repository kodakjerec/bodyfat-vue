<template>
    <!-- search -->

    <!-- diagram -->
    <eChart1 :fromData="filteredList"></eChart1>
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
            selectableTabs: [],
            selectedTabs: []
        }
    },
    computed: {
        filteredList() {
            const tempList = storeSettings().getBodyFatDataList;
            const result:Array<any> = tempList.map(row=>{
                // compare date
                
                return row;
            })

            return result;
        }
    },
    mounted() {
        this.startDate = dayjs((new Date()).setDate(-7)).format().substring(0,16);
        this.endDate = dayjs(new Date()).format().substring(0,16);
        const recordingTable = storeSettings().getRecordingTable;
        this.selectableTabs = recordingTable.map(row=> { return row.colName});
    }
}
</script>