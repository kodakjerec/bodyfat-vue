<template>
    <calendar-three v-if="fromId === 0" theme="outline" size="20" fill="#000000"/>
    <chart-line v-else-if="fromId === 1" theme="outline" size="20" fill="#000000"/>
    <signal v-else-if="fromId === 2" theme="outline" size="20" fill="#000000"/>
    <analysis v-else-if="fromId === 3" theme="outline" size="20" fill="#000000"/>
    <muscle v-else-if="fromId === 4" theme="outline" size="20" fill="#000000"/>
    <abdominal v-else-if="fromId === 5" theme="outline" size="20" fill="#000000"/>
    <puzzle v-else-if="fromId === 6" theme="outline" size="20" fill="#000000"/>
    <endocrine v-else-if="fromId === 7" theme="outline" size="20" fill="#000000"/>
    <heartbeat v-else theme="outline" size="20" fill="#000000"/>
</template>

<script lang="ts">
import { CalendarThree, ChartLine, Signal, Analysis, Muscle, Abdominal, Puzzle, Endocrine, Heartbeat } from "@icon-park/vue-next";

export default {
    name: "iconNumbers",
    components: {
        CalendarThree, ChartLine, Signal, Analysis, Muscle, Abdominal, Puzzle, Endocrine, Heartbeat
    },
    props: {
        fromId: {
            type: Number,
            required: true
        }
    },
    data () {
        return {

        }
    }
}
</script>