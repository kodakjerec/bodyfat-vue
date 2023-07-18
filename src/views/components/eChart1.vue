<template>
    <div class="" ref="eChart-container">
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
            // y軸種類, 此處放置欄位名稱
            let contentList = {};
            recordingTable.map(row => {
                contentList[row.colName] = [];
            })

            originData = originData.sort((a: any, b: any) => {
                const date1 = new Date(a["0"]);
                const date2 = new Date(b["0"]);
                const dateDiff = date2.getTime() - date1.getTime();
                if (dateDiff > 0) return -1;
                else if (dateDiff < 0) return 1;
                else return 0;
            });

            // 分堆: 由 id 找到 欄位名稱, 放入對應的y軸
            originData.map((row: any) => {
                Object.entries(row).map(([key, value]) => {
                    const findColName = recordingTable.find(row=>row.id===parseInt(key))?.colName;
                    if (findColName && contentList[findColName]) {
                        contentList[findColName].push(value);
                    }
                });
            });

            Object.entries(contentList).map(([key, value]) => {
                if (key === "0") {
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