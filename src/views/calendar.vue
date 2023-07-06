<template>
    <div class="flex flex-col grow h-3/4 bg-white">
        <calendar-view
            :show-date="showDate"
            :time-format-options="{ hour: 'numeric', minute: '2-digit'}"
            :class="'theme-default'"
            :current-period-label="'icons'"
            :enable-date-selection="true"
            @click-date="clickDate"
            @click-item="clickItem"
            class="calendarClass"
            :items="items">
            <template #header="{ headerProps }">
                <calendar-view-header :header-props="headerProps" @input="setShowDate" />
            </template>
        </calendar-view>
    </div>
</template>

<script lang="ts">
import { CalendarView, CalendarViewHeader, CalendarMath } from "vue-simple-calendar"
import "@/../node_modules/vue-simple-calendar/dist/style.css"
import "@/../node_modules/vue-simple-calendar/dist/css/default.css"
import { storeSettings } from '@/store'

export default {
    name: "calendar",
    components: {
        CalendarView, CalendarViewHeader
    },
    data() {
        return {
            showDate: this.thisMonth(1),
            items: []
        }
    },
    computed: {
    },
    mounted() {
        // 讀取資料
        const oldDataList = storeSettings().getBodyFatDataList;
        oldDataList.map((row, index)=>{
            this.items.push({
                id: index,
                startDate: new Date(row["日期"]),
                title: row["日期"].slice(-5),
                class: ["purple"]
            })
        })
    },
    methods: {
        thisMonth(d, h, m) {
            const t = new Date();
            return new Date(t.getFullYear(), t.getMonth(), d, h||0, m||0);
        },
        clickDate(event) {
            console.log(event);
        },
        clickItem(event) {
            console.log(event);
        },
        setShowDate(event) {
            console.log(event);
            this.showDate = event;
        },
    }
}
</script>

<style scoped>
.calendarClass :deep() button {
    color: black;
    font-weight: 900;
    border: none;
}
</style>