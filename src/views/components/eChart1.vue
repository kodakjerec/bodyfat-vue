<template>
    <div ref="eChart" :style="{width: '90vw', height: '80vh'}">
    </div>
</template>

<script lang="ts">
import * as echarts from 'echarts'

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
            option: {
                animation: false,
                legend: {
                    bottom: 10,
                    left: 'center',
                    data: ['Dow-Jones index', 'MA5', 'MA10', 'MA20', 'MA30']
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                    type: 'cross'
                    },
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    position: function (pos, params, el, elRect, size) {
                    var obj = { top: 10 };
                    obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                    return obj;
                    },
                    extraCssText: 'width: 170px'
                },
                axisPointer: {
                    link: { xAxisIndex: 'all' },
                    label: {
                    backgroundColor: '#777'
                    }
                },
                toolbox: {
                    feature: {
                    dataZoom: {
                        yAxisIndex: false
                    },
                    brush: {
                        type: ['lineX', 'clear']
                    }
                    }
                },
                brush: {
                    xAxisIndex: 'all',
                    brushLink: 'all',
                    outOfBrush: {
                    colorAlpha: 0.1
                    }
                },
                grid: [
                    {
                    left: '10%',
                    right: '8%',
                    height: '50%'
                    },
                    {
                    left: '10%',
                    right: '8%',
                    bottom: '20%',
                    height: '15%'
                    }
                ],
                xAxis: [
                    {
                    type: 'category',
                    data: ["1","2","3"],
                    scale: true,
                    boundaryGap: false,
                    axisLine: { onZero: false },
                    splitLine: { show: false },
                    splitNumber: 20,
                    min: 'dataMin',
                    max: 'dataMax',
                    axisPointer: {
                        z: 100
                    }
                    }
                ],
                yAxis: [
                    {
                    scale: true,
                    splitArea: {
                        show: true
                    }
                    },
                    {
                    scale: true,
                    gridIndex: 1,
                    splitNumber: 2,
                    axisLabel: { show: false },
                    axisLine: { show: false },
                    axisTick: { show: false },
                    splitLine: { show: false }
                    }
                ],
                dataZoom: [
                    {
                    type: 'inside',
                    xAxisIndex: [0, 1],
                    start: 98,
                    end: 100
                    },
                    {
                    show: true,
                    xAxisIndex: [0, 1],
                    type: 'slider',
                    top: '85%',
                    start: 98,
                    end: 100
                    }
                ],
                series: [
                    {
                    name: 'Dow-Jones index',
                    type: 'candlestick',
                    data: ["4","5","6"],
                    itemStyle: {
                        normal: {
                        color: '#06B800',
                        color0: '#FA0000',
                        borderColor: null,
                        borderColor0: null
                        }
                    },
                    },
                ]
            }
        }
    },
    async mounted() {
        console.log(this.$refs["eChart"])
        this.eChart = echarts.init(this.$refs["eChart"])
        await this.preLoading()

        this.eChart.setOption(this.option)
    },
    methods: {
        preLoading() {

        }
    }
}
</script>