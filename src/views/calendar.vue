<template>
    <div class="flex flex-col grow">
        <calendar-view
            :show-date="showDate"
            :time-format-options="{ hour: 'numeric', minute: '2-digit'}"
            :class="'theme-default'"
            :date-classes="myDateClasses"
            :current-period-label="'icons'"
            :enable-date-selection="true"
            @click-date="clickDate"
            @click-item="clickItem"
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

export default {
    name: "calendar",
    components: {
        CalendarView, CalendarViewHeader
    },
    data() {
        return {
            showDate: this.thisMonth(1),
            items: [{
                id: "e5",
                startDate: new Date(),
                title: "One Day",
                classes: ["orange"],
                tooltip: "This is one day"
            }]
        }
    },
    computed: {
        myDateClasses() {
			// This was added to demonstrate the dateClasses prop. Note in particular that the
			// keys of the object are `yyyy-mm-dd` ISO date strings (not dates), and the values
			// for those keys are strings or string arrays. Keep in mind that your CSS to style these
			// may need to be fairly specific to make it override your theme's styles. See the
			// CSS at the bottom of this component to see how these are styled.
			const o = {}
			const theFirst = this.thisMonth(1)
			const ides = [2, 4, 6, 9].includes(theFirst.getMonth()) ? 15 : 13
			const idesDate = this.thisMonth(ides)
			o[CalendarMath.isoYearMonthDay(idesDate)] = "ides"
			o[CalendarMath.isoYearMonthDay(this.thisMonth(21))] = ["do-you-remember", "the-21st"]
            console.log(o)
			return o
		},
    },
    mounted() {

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