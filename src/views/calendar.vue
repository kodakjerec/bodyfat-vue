<template>
    <div class="h-full">
        <calendar-view :show-date="showDate" :time-format-options="{ hour: 'numeric', minute: '2-digit' }" :class="'theme-default'" :current-period-label="'icons'" :enable-date-selection="true" :date-classes="myDateClasses" @click-date="clickDate" @click-item="clickItem" class="calendarClass" :items="items" :locale="lang">
            <template #header="{ headerProps }">
                <calendar-view-header :header-props="headerProps" @input="setShowDate">
                </calendar-view-header>
            </template>
        </calendar-view>
        <calendar-dialog v-if="showDialog" :title="this.$t('_bodyFatRecorder')" :fromData="dialogItem" @close="closeDialog" @delete="deleteItemDialog" />
    </div>
</template>

<script lang="ts">
import { CalendarView, CalendarViewHeader } from "vue-simple-calendar"
import CalendarDialog from "./components/calendarDialog.vue"
import "@/../node_modules/vue-simple-calendar/dist/style.css"
import "@/../node_modules/vue-simple-calendar/dist/css/default.css"
import { storeSettings } from "@/store"
import dayjs from "dayjs"
import { createToaster } from "@meforma/vue-toaster";

export default {
    name: "calendar",
    components: {
        CalendarView, CalendarViewHeader,
        CalendarDialog
    },
    data() {
        return {
            showDate: new Date(),
            showDialog: false,
            dialogItem: {},
            oldDataList: [],
            items: [],
            dateCountList: [] as Array<any>,
            lang: storeSettings().getLang
        }
    },
    computed: {
        myDateClasses() {
            const o = {};

            this.dateCountList.map(row => {
                switch (row.counts) {
                    case 1:
                        o[row.startDate] = ["number1"]; break;
                    case 2:
                        o[row.startDate] = ["number2"]; break;
                    case 3:
                        o[row.startDate] = ["number3"]; break;
                    default:
                        o[row.startDate] = ["numberM"]; break;
                }
            })

            return o
        },
    },
    mounted() {
        this.bringData();
    },
    methods: {
        async bringData() {
            // reset
            this.items = [];
            this.dateCountList = [];

            // 讀取資料
            this.oldDataList = await storeSettings().getBodyFatDataList;
            this.oldDataList.map((row, index) => {
                // 日曆元件
                this.items.push({
                    id: row["id"],
                    startDate: new Date(row["0"]),
                    title: row["0"].slice(-5),
                    class: ["purple"]
                })

                // 統計一天幾次
                const dateString = dayjs(row["0"]).format("YYYY-MM-DD");
                let findObject = this.dateCountList.find(row => row.startDate === dateString);
                if (findObject) {
                    findObject.counts = parseInt(findObject.counts) + 1;
                } else {
                    this.dateCountList.push({
                        startDate: dateString,
                        counts: 1
                    });
                }
            })
        },
        // === vue-simple-calendar 必要 ===
        // 設定日期, 必要函數
        setShowDate(event) {
            this.showDate = event;
        },
        // === vue-simple-calendar end ===
        clickDate(event) {
            console.log(event);
        },
        clickItem(event) {
            const item = this.oldDataList.find(item => item.id === event.id);
            if (item) {
                this.showDialog = true;
                this.dialogItem = item;
            } else {
                createToaster().error(this.$t("_calendar_errorMsg1"), { position: "top" });
            }
        },
        closeDialog(event) {
            this.showDialog = false;
            this.dialogItem = null;
        },
        deleteItemDialog(event) {
            storeSettings().deleteBodyFatDatalist(this.dialogItem);
            this.showDialog = false;
            this.dialogItem = null;
            this.$nextTick(() => {
                this.bringData();
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.calHeight {
    height: calc(100vh - 42px);
}

.calendarClass :deep() {
    .cv-header-nav>button {
        @apply font-black border-none text-black text-lg;
    }

    .cv-header {
        @apply bg-orange-500 border border-black;
    }

    .cv-header-day {
        @apply bg-orange-400 border border-black;
    }

    .cv-day {
        @apply border border-black;
    }

    .past,
    .outsideOfMonth {
        @apply bg-orange-300
    }

    .cv-item {
        @apply bg-yellow-500 border-yellow-600;
    }
}

:deep() {
    .number1::after {
        content: "\0031\FE0F\20E3";
        @apply bg-yellow-200 h-4;
    }

    .number2::after {
        content: "\0032\FE0F\20E3";
        @apply bg-yellow-200 h-4;
    }

    .number3::after {
        content: "\0033\FE0F\20E3";
        @apply bg-yellow-200 h-4;
    }

    .numberM::after {
        content: "\0023\FE0F\20E3";
        @apply bg-yellow-200 h-4;
    }
}
</style>