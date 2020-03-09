<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { defineComponent, reactive, props, onMounted, onBeforeUnmount } from '@vue/composition-api';

export default defineComponent({
  props: {
    id: {
      type: String,
      default: 'PieChart'
    },
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  setup(props, { root }) {
    let chartObj = reactive({
      chart: null
    })
    const initChart = () =>  {
      chartObj.chart = echarts.init(document.getElementById(props.id), 'macarons')

      chartObj.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts']
        },
        series: [
          {
            name: 'WEEKLY WRITE ARTICLES',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: [
              { value: 320, name: 'Industries' },
              { value: 240, name: 'Technology' },
              { value: 149, name: 'Forex' },
              { value: 100, name: 'Gold' },
              { value: 59, name: 'Forecasts' }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })

    }
    onMounted(() => {
      root.$nextTick(() => {
        initChart()
      })
    }) 
    onBeforeUnmount(() => {
      if (!chartObj.chart) {
        return
      }
      chartObj.chart.dispose()
      chartObj.chart = null
    })
    resize(root,chartObj)
  }
})
</script>
