<template>
    <div class="relative h-5/6 overflow-hidden" ref="eChart-container">
    </div>
</template>

<script lang="ts">
import * as echarts from 'echarts'
import { markRaw } from 'vue'
import { storeSettings } from '@/store'

export default {
    name: "eChart1",
    props: {
        fromData: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            eChart: null,
            eChartSetting: null,
            option: {
                title: {
                },
                tooltip: {
                    trigger: 'axis',
                    renderMode: 'richText'
                },
                legend: {
                    selectedMode: true,
                    selected: {},
                    itemWidth: 40,
                    itemHeight: 20
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false
                },
                yAxis: {
                    type: 'value'
                },
                series: [],
            }
        }
    },
    watch: {
        fromData() {
            this.preLoading();
            this.eChart.setOption(this.option);
        }
    },
    mounted() {
        this.eChart = markRaw(echarts.init(this.$refs["eChart-container"]));
        this.eChart.on('legendselectchanged', this.legendselectchanged);
    },
    created() {
        window.addEventListener('resize', this.resizeHandler);
    },
    destroyed() {
        window.removeEventListener('resize', this.resizeHandler);
    },
    methods: {
        preLoading() {
            // reset
            this.option.series = [];

            const recordingTable: Array<any> = storeSettings().getRecordingTable;
            let originData = Array.from(this.fromData);
            // 曲線
            let contentList = {};
            recordingTable.map(row => {
                contentList[row.colName] = [];
            })

            originData = originData.sort((a: any, b: any) => {
                const date1 = new Date(a['日期']);
                const date2 = new Date(b['日期']);
                const dateDiff = date2.getTime() - date1.getTime();
                if (dateDiff > 0) return -1;
                else if (dateDiff < 0) return 1;
                else return 0;
            });

            originData.map((row: any) => {
                Object.entries(row).map(([key, value]) => {
                    if (contentList[key]) {
                        contentList[key].push(value);
                    }
                });
            });

            Object.entries(contentList).map(([key, value]) => {
                if (key === '日期') {
                    this.option.xAxis.data = contentList[key];
                } else {
                    this.option.series.push({
                        name: key,
                        type: 'line',
                        stack: 'Total',
                        data: value
                    })
                }
            });

            // loading echart settings
            this.eChartSetting = storeSettings().eChartSetting;
            if (this.eChartSetting.selected) {
                this.option.legend.selected = this.eChartSetting.selected;
            }
        },
        resizeHandler() {
            this.eChart.resize();
        },
        legendselectchanged(param) {
            this.eChartSetting.selected = param.selected;
            storeSettings().setEChartSetting(this.eChartSetting);
        }
    }
}
</script>

<style scoped>
#chart-container {
    position: relative;
    overflow: hidden;
}
</style>